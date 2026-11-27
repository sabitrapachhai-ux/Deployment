# API reference

All endpoints use base `/api`. Successful responses use `{ "success": true, "data": ..., "message": "..." }`.

## Auth
- `POST /auth/login` public: body `{ email, password }`
- `GET /auth/me` admin bearer token

## Repairs
- `GET /repairs?status=&deviceType=&search=&page=&limit=` admin
- `GET /repairs/:id` admin
- `POST /repairs` admin
- `PUT /repairs/:id` admin
- `PATCH /repairs/:id/status` body `{ repairStatus }`
- `DELETE /repairs/:id` admin
- `GET /repairs/track/:trackingCode` public; verified data shape includes only `device`, `brand`, `model`, `status`, `expectedDate`

## Inventory
- `GET /inventory?category=&stockStatus=&search=&page=&limit=` public/admin-aware
- `GET /inventory/:id` public
- `POST /inventory` admin
- `PUT /inventory/:id` admin
- `PATCH /inventory/:id/stock` body `{ quantity }`
- `DELETE /inventory/:id` admin

## Content
- `GET/POST /services`, `GET/POST /certificates`, `GET/POST /experience`, `GET/POST /appreciations`
- `PUT/DELETE /services/:id`, `/certificates/:id`, `/experience/:id`, `/appreciations/:id`

## Messages
- `POST /messages` public
- `GET /messages` admin
- `PATCH /messages/:id/read` admin
- `DELETE /messages/:id` admin

## Upload/stats
- `POST /upload` multipart image field `image`, admin
- `GET /stats` admin

Verified examples:
- `GET /api/health` returned HTTP 200 with `{ "success": true, "data": { "status": "ok" }, "message": "API is healthy" }`
- `GET /api/repairs` without a token returned HTTP 401.
- `POST /api/auth/login` with the seed credentials returned HTTP 200 and a JWT.
