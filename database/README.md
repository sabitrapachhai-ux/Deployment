# Database

The Mongoose models are in `backend/src/models/`. `schema.md` is the human-readable schema reference.

For persistent data, set `MONGODB_URI` in `backend/.env`. Run `npm run seed` to reset all seeded collections with placeholder data and a development admin.

The shell scripts in `scripts/` use `mongodump` and `mongorestore`.
