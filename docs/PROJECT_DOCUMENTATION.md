# Project documentation

## Problem
Repair jobs, stock, and customer trust information are difficult to manage and track. Customers cannot see repair progress or public stock availability.

## Objectives
Provide public repair tracking, published stock, trust content, and a secure owner dashboard.

## Features
Public pages, public tracking, inventory filtering, contact form, and full admin CRUD for repairs, stock, content, and messages.

## Stack
React/Vite/Tailwind on the frontend; Express on Node.js for the API; MongoDB/Mongoose for data; JWT/bcrypt for authentication.

## Architecture
The React app calls the Express REST API. Express validates and authorizes requests, controllers and routes operate through Mongoose models, and uploads are served from `backend/uploads/`.

## Security
Passwords use bcrypt. JWT protects admin routes. Zod validates write bodies. Helmet and CORS are enabled. Login, tracking, contact, and API requests have rate limits. Uploads allow only JPG, PNG, and WebP up to 2 MB.

## Limitations
Development may use in-memory MongoDB; production needs `MONGODB_URI`. The map is a plain iframe and shop facts remain placeholders until edited.

## How to present this project
Start with the customer problem, explain public tracking and stock, demonstrate the admin dashboard, show the status derivation and private public tracking fields, then describe security and MongoDB architecture.

**5-minute script**
1. Introduce the problem and goals.
2. Demonstrate public services and stock.
3. Demonstrate tracking by code.
4. Log in and create/change a repair.
5. Explain inventory/status derivation and security.
6. Summarize seed placeholders and deployment.

**Likely questions**
1. Why MERN? JavaScript across the stack and flexible MongoDB data.
2. How is tracking private? The endpoint returns only device, brand, model, status, and expected date.
3. How is `isRepaired` derived? It becomes true for repaired or delivered status.
4. How are passwords stored? bcrypt password hashes.
5. How are admin routes protected? JWT bearer tokens and role middleware.
6. How does stock status work? Quantity 0 out, quantity <= threshold low, otherwise in stock.
7. How are uploads limited? 2 MB and image MIME/extension checks.
8. How is input validated? Zod schemas on write endpoints.
9. How is data separated? Public routes filter published inventory and private tracking fields.
10. How does 401 logout work? The Axios interceptor removes local credentials and redirects.
11. How are placeholder facts avoided? Seed and UI use `[EDIT ME: ...]` markers.
12. What is needed for production? Real MongoDB, environment values, HTTPS, and owner-entered content.
