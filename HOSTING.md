# Web Application Hosting Guide
### Mobile Repair Shop — AWS EC2 + CloudFormation + Nginx + PM2 + GitHub Actions CI/CD

This document explains exactly how this project is hosted on AWS, what every file does, and how anyone can redeploy it from scratch.

---

## Architecture Overview

```
[ USER / BROWSER ]
        │
        │  HTTP Request (Port 80)
        ▼
┌──────────────────────────────────────┐
│          AWS EC2 INSTANCE            │
│         (Ubuntu 24.04 LTS)           │
│                                      │
│   ┌──────────────────────────────┐   │
│   │   NGINX (Port 80 - Public)   │   │
│   └────────────┬─────────────────┘   │
│                │                     │
│    ┌───────────┴───────────┐         │
│    │                       │         │
│    ▼                       ▼         │
│  /frontend/dist          /api/*      │
│  (React Static Files)  (Port 5000)   │
│                        PM2 → Node.js │
└────────────────────────────┬─────────┘
                             │
                             ▼
                   [ MongoDB Atlas ]
                   (Cloud DB, 24/7)
```

**How traffic flows:**
1. User visits `http://<EC2-IP>` → Nginx receives the request on Port 80
2. If the path is `/api/*` → Nginx proxies it to Express.js running on Port 5000
3. If the path is `/uploads/*` → Nginx proxies it to Express.js (which serves static uploaded files)
4. Everything else → Nginx serves the compiled React `index.html` (SPA routing)
5. Express connects to MongoDB Atlas cloud database for all data

---

## Infrastructure Files

### 1. `infra/ec2-instance.yaml` — CloudFormation Template

This is the **Infrastructure-as-Code** file. Instead of manually clicking through the AWS Console to create servers, this YAML file tells AWS exactly what to build.

**What it creates:**
- **EC2 KeyPair** — SSH key to access the server. The private key is automatically saved to AWS Systems Manager (SSM) Parameter Store. No `.pem` file needs to be downloaded or stored manually.
- **Security Group** — Firewall rules: opens Port 22 (SSH) and Port 80 (HTTP) to the internet.
- **EC2 Instance** — Ubuntu 24.04 LTS `t2.micro` virtual machine. On first boot, the `UserData` bootstrap script runs automatically to install Node.js 22, Git, Nginx, PM2, and clone this repository.

**Key outputs:**
| Output | Description |
|---|---|
| `PublicIP` | The server's public IP address (changes if instance is restarted) |
| `PublicURL` | The live website URL |
| `SSMKeyPath` | Path in AWS SSM where the SSH private key is stored |

> The SSH key is never stored in GitHub or locally — GitHub Actions fetches it from SSM during every deployment.

---

### 2. `infra/nginx.conf` — Web Server Configuration

Nginx is the **public-facing web server**. It runs on Port 80 and handles all incoming traffic.

**Four rules configured:**

| Rule | Path | What it does |
|---|---|---|
| **Frontend** | `/*` | Serves `/var/www/app/frontend/dist` — the compiled React app. Uses `try_files` for SPA routing (no 404 on page refresh). |
| **Backend API** | `/api/*` | Reverse-proxies to `http://127.0.0.1:5000/api/` — the internal Node.js Express server |
| **Uploads** | `/uploads/*` | Reverse-proxies to Express which serves uploaded images. Uses `^~` priority modifier so the static regex rule below doesn't intercept it. |
| **Static Cache** | `*.js, *.css, *.png, ...` | Tells browsers to cache static assets for 30 days — speeds up page loads |

> **Why `^~` on uploads?** Without it, the regex rule `~* \.(jpg|png)` would match uploaded image URLs before the `/uploads/` rule, causing 404 errors on uploaded images.

---

### 3. `backend/ecosystem.config.cjs` — PM2 Process Manager Config

PM2 keeps the Node.js backend **always running** in the background.

```
PM2 starts → backend/src/server.js → runs on Port 5000
If it crashes → PM2 auto-restarts it
If EC2 reboots → PM2 auto-starts on boot (via systemd)
```

**Key settings:**

| Setting | Value | Why |
|---|---|---|
| `exec_mode` | `fork` | Must be `fork` (not `cluster`) on single-core `t2.micro` — cluster mode causes crashes |
| `instances` | `1` | One process per single CPU core |
| `autorestart` | `true` | Auto-recovers from crashes |
| `max_memory_restart` | `300M` | Restarts if memory leak occurs |

---

### 4. `.github/workflows/deploy.yml` — CI/CD Pipeline

This is the **automated deployment pipeline**. Every time code is pushed to `main`, GitHub runs this workflow automatically — no manual SSH needed.

**Two jobs:**

#### Job 1: `build` — Compile the Frontend
```
Checkout code
→ Install Node.js 22
→ cd frontend && npm ci
→ npm run build (with VITE_API_URL=/api)
→ Produces frontend/dist/ folder
```

> `VITE_API_URL=/api` is critical — it tells the React app to call `/api/...` (a relative path) instead of `http://localhost:5000/api`. In production, Nginx intercepts `/api/` and proxies it to Express.

#### Job 2: `deploy` — Deploy to EC2
```
1. Configure AWS credentials from GitHub Secrets
2. Run CloudFormation (creates EC2 if new, updates if existing)
3. Get EC2 Public IP from CloudFormation output
4. Fetch SSH private key from AWS SSM Parameter Store
5. Wait for SSH port 22 to open (up to 6 minutes for new instances)
6. SSH into EC2 and run 6 steps:
   [1] Wait for cloud-init to finish
   [2] Pull latest code (git reset --hard)
   [3] npm ci in backend (install dependencies)
   [4] Write .env file from GitHub Secrets
   [5] npm run build in frontend
   [6] Restart PM2 + reload Nginx
```

> GitHub Secrets are injected as environment variables — secrets never appear in logs or code.

---

## Step-by-Step Setup (From Scratch)

### Step 1: Set Up MongoDB Atlas (Cloud Database)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign up free
2. Create a free **M0 cluster**
3. Under **Database Access** → Add a database user (username + password)
4. Under **Network Access** → Click **Add IP Address** → Select **Allow Access from Anywhere (`0.0.0.0/0`)**
   > This is essential! EC2's IP changes on restart — whitelisting all IPs ensures the server can always connect.
5. Under **Database → Connect → Drivers** → Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/repair_shop?retryWrites=true&w=majority
   ```

---

### Step 2: Get AWS Credentials

1. Open your AWS Learner Lab → Click **Start Lab** → Wait for green circle
2. Click **AWS Details → Show**
3. Copy these 3 values from the `[default]` section:
   - `aws_access_key_id`
   - `aws_secret_access_key`
   - `aws_session_token` (a very long string)

---

### Step 3: Configure GitHub Secrets

Go to your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

| Secret Name | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | From Step 2 |
| `AWS_SECRET_ACCESS_KEY` | From Step 2 |
| `AWS_SESSION_TOKEN` | From Step 2 (long string) |
| `MONGODB_URI` | Full Atlas connection string from Step 1 |
| `JWT_SECRET` | Any long random string (e.g. `MyRepairShop_JWT_2024_XyZ!`) |
| `ADMIN_NAME` | `Sabitra Pachhai` |
| `ADMIN_EMAIL` | `sabitra@gmail.com` |
| `ADMIN_PASSWORD` | Your admin login password |

---

### Step 4: Push to `main` and Watch Deploy

```bash
git add .
git commit -m "feat(hosting): add AWS CloudFormation and GitHub Actions CI/CD"
git push origin main
```

Then go to GitHub → **Actions tab** → Watch the workflow run.

- **First run:** Takes 6–8 minutes (EC2 is being created from scratch)
- **Subsequent runs:** Takes 2–3 minutes (EC2 already exists, just updates code)

---

### Step 5: Get Your Live URL

Once the workflow has a green checkmark ✅:
1. Click the last step: **Print Live Website URL**
2. The URL will look like: `http://54.x.x.x`
3. Open it in your browser — your website is live!

---

## AWS Lab Expiry & Recovery

AWS Learner Labs expire after **4 hours**. When the lab times out, the EC2 instance stops.

**How to bring it back in under 2 minutes:**
1. Click **Start Lab** → Wait for green circle
2. Click **AWS Details → Show** → Copy the 3 new credentials
3. Update `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` in GitHub Secrets
4. Go to **GitHub → Actions** → Click **Re-run all jobs**
5. Website is back online!

> MongoDB Atlas is completely separate from AWS — your database and all data are always safe, even when the lab expires.

---

## Common Issues & Fixes

| Problem | Cause | Fix |
|---|---|---|
| `502 Bad Gateway` | Express crashed or not running | SSH into EC2 → `pm2 logs --lines 50` |
| `ERR_CONNECTION_REFUSED` on port 5000 | Frontend calling `localhost:5000` directly | `VITE_API_URL=/api` must be set during build |
| Uploaded images return 404 | Nginx static regex intercepting `/uploads/` | Ensure `^~` is on the `/uploads/` location block |
| Page refresh returns 404 | Nginx not falling back to `index.html` | Ensure `try_files $uri $uri/ /index.html` is in nginx.conf |
| PM2 crashes repeatedly | Running cluster mode on t2.micro | Set `exec_mode: 'fork'` in ecosystem.config.cjs |
| CloudFormation deploy fails | Expired AWS credentials | Update the 3 AWS secrets in GitHub and re-run |

---

## Useful Server Commands

After SSH-ing into EC2 (via EC2 Instance Connect in AWS Console):

```bash
# Check if backend is running
pm2 status

# View backend logs (errors and console output)
pm2 logs --lines 50

# Restart backend with updated environment variables
pm2 restart all --update-env

# View incoming HTTP requests in real-time
sudo tail -f /var/log/nginx/access.log

# View Nginx errors
sudo tail -f /var/log/nginx/error.log

# Test and reload Nginx config
sudo nginx -t && sudo systemctl reload nginx

# Check cloud-init bootstrap log (first boot only)
sudo cat /var/log/userdata.log
```

---

## File Summary

| File | Purpose |
|---|---|
| `infra/ec2-instance.yaml` | CloudFormation: creates EC2, Security Group, SSH KeyPair |
| `infra/nginx.conf` | Nginx: serves frontend, proxies API and uploads |
| `backend/ecosystem.config.cjs` | PM2: keeps backend running continuously |
| `.github/workflows/deploy.yml` | GitHub Actions: automated build + deploy on every push |
| `HOSTING.md` | This file — explains the entire hosting setup |
