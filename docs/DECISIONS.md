# Decisions

- Unknown shop facts in Section 0 are represented as clearly marked `[EDIT ME: ...]` placeholders.
- The backend will use local MongoDB by default and Atlas through `MONGODB_URI`.
- Vite runs on port 5173 and the API on port 5000.
- Express 5 is used with the fixed Node/Express stack.
- When `MONGODB_URI` is unset outside production, development uses `mongodb-memory-server`; this is test/development infrastructure, not persistent production storage.
