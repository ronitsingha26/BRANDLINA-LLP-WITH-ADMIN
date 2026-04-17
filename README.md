# Brandlina LLP Dynamic

This repository is now split into two top-level apps:

- `frontend/` - React + Vite website
- `backend/` - Node.js + Express CMS API

## Install Dependencies

From project root:

```bash
npm --prefix frontend install
npm --prefix backend install
```

Or install inside each folder separately.

## Run Frontend

```bash
cd frontend
npm run dev
```

Default frontend URL: `http://localhost:5173`

## Run Backend

```bash
cd backend
npm run dev
```

Default backend URL: `http://localhost:5001`

## Run Both In Separate Terminals

Terminal 1:

```bash
cd frontend
npm run dev
```

Terminal 2:

```bash
cd backend
npm run dev
```

## Production Mode

Frontend build:

```bash
cd frontend
npm run build
npm run preview
```

Backend start:

```bash
cd backend
npm start
```
