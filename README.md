# 🧠 Second Brain

A modern full-stack MERN personal knowledge management platform inspired by Notion and Obsidian.

## ✨ Features

- **Authentication** — JWT-based register/login with bcrypt password hashing
- **Notes** — Create, edit, delete, pin, tag, search with grid/list view
- **Documents** — Drag-and-drop upload (PDF, DOCX, TXT, PPT) via Cloudinary
- **Saved Pages** — Save URLs with metadata, folder organization, tags
- **Global Search** — Instant search across all content types
- **Dark Mode** — Persistent dark/light mode toggle
- **Responsive** — Mobile-first with collapsible sidebar

## 🛠 Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Tailwind CSS 3, React Router 6 |
| State      | Zustand (with persistence)              |
| HTTP       | Axios with JWT interceptor              |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB, Mongoose                       |
| Auth       | JWT, bcryptjs                           |
| Files      | Multer, Cloudinary                      |
| Icons      | Lucide React                            |

## 📁 Project Structure

```
second-brain/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route-level pages
│       ├── store/           # Zustand stores
│       └── utils/           # API client, helpers
└── server/                  # Express backend
    ├── controllers/         # Route handlers
    ├── middleware/          # Auth middleware
    ├── models/              # Mongoose schemas
    ├── routes/              # Express routers
    └── utils/               # JWT, Cloudinary config
```

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd second-brain
npm install          # installs concurrently
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment Variables

**Server** — copy `server/.env.example` to `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/second-brain
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Client** — copy `client/.env.example` to `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

```bash
# From root — runs both server and client concurrently
npm run dev

# Or separately:
npm run start:server   # http://localhost:5000
npm run start:client   # http://localhost:3000
```

## ☁️ Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy Cloud Name, API Key, API Secret
3. Paste into `server/.env`

## 🗄️ MongoDB Setup

**Local:**
```bash
# Install MongoDB Community Edition, then:
mongod --dbpath /data/db
```

**Cloud (MongoDB Atlas):**
1. Create cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Get connection string → set as `MONGO_URI`

## 📡 API Endpoints

| Method | Endpoint                  | Description           |
|--------|---------------------------|-----------------------|
| POST   | /api/auth/register        | Register user         |
| POST   | /api/auth/login           | Login user            |
| GET    | /api/auth/profile         | Get profile           |
| PUT    | /api/auth/profile         | Update profile        |
| GET    | /api/notes                | Get all notes         |
| POST   | /api/notes                | Create note           |
| PUT    | /api/notes/:id            | Update note           |
| DELETE | /api/notes/:id            | Delete note           |
| PATCH  | /api/notes/:id/pin        | Toggle pin            |
| GET    | /api/documents            | Get all documents     |
| POST   | /api/documents            | Upload document       |
| GET    | /api/documents/:id        | Get document          |
| PUT    | /api/documents/:id        | Update document       |
| DELETE | /api/documents/:id        | Delete document       |
| GET    | /api/saved-pages          | Get saved pages       |
| POST   | /api/saved-pages          | Save new page         |
| PUT    | /api/saved-pages/:id      | Update saved page     |
| DELETE | /api/saved-pages/:id      | Delete saved page     |
| GET    | /api/saved-pages/folders  | Get all folders       |
| GET    | /api/search?q=query       | Global search         |
| GET    | /api/tags                 | Get all user tags     |
