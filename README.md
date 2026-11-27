# Heitech Mobile Repair Centre

## Prerequisites
- Node.js 20+ and npm
- MongoDB Atlas or local MongoDB for persistent data
- Optional: Windows PowerShell, macOS, or Linux

## Install
```powershell
npm install
npm run install:all
```

## Environment
Copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env`. Set a strong JWT secret and real admin credentials. Without a real `MONGODB_URI`, development uses an in-memory MongoDB server.

## Run
```powershell
npm run dev
```
- Frontend: http://localhost:5173
- API: http://localhost:5000
- Admin: http://localhost:5173/admin/login

## Seed
```powershell
npm run seed
```
The seed creates placeholder content and a development admin. Replace placeholder shop facts through the admin dashboard.

## Build
```powershell
npm run build
```

## Folder map
- `backend/` — Express API and uploads
- `frontend/` — React/Vite public and admin UI
- `database/` — seed data, schema, backup scripts
- `docs/` — project and owner documentation

## Images
The demo bundles sample electronics photos in `frontend/public/images/demo/` and placeholder SVGs in `frontend/public/images/placeholders/`. Photos are sourced from Unsplash (`photo-1581092921461-eab62e97a780`, `photo-1511707171634-5f897ff02aa9`, `photo-1518770660439-4636190af475`) and are for prototyping only; replace them with the shop's own images using the admin upload API. The `SmartImage` component falls back automatically for empty or broken image sources.
