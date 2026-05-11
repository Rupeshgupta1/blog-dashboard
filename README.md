cat > /Users/apple/blog-dashboard/README.md << 'ENDOFFILE'
# Blog Dashboard

A production-grade Full Stack Blog Management Dashboard built with the MERN stack.

🔗 **Live Demo:** Coming soon

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, Tailwind CSS |
| State Management | Zustand |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT |
| Charts | Recharts |

## Features Implemented

### Core Features
- ✅ JWT Authentication (Signup / Login / Protected Routes)
- ✅ Blog CRUD (Create, Read, Update, Delete)
- ✅ Pagination (6 blogs per page)
- ✅ Real-time Search by title
- ✅ Tag-based filtering
- ✅ MongoDB Aggregation Pipelines (4 pipelines)
- ✅ Analytics Dashboard (Bar, Pie, Line charts)
- ✅ Responsive UI (Mobile, Tablet, Desktop)
- ✅ Toast Notifications

### Bonus Features
- ✅ Debounced Search Input (500ms)
- ✅ Collapsible Mobile Sidebar
- ✅ Active Navigation Highlighting
- ✅ Topbar with User Info

## Project Structure
blog-dashboard/
├── client/                 # Next.js Frontend
│   ├── app/
│   │   ├── (auth)/        # Login, Signup pages
│   │   └── (dashboard)/   # Blogs, Analytics pages
│   ├── store/             # Zustand state management
│   ├── hooks/             # Custom hooks (useDebounce)
│   └── lib/               # Axios API helper
└── server/                # Express Backend
├── controllers/       # Business logic
├── models/            # Mongoose schemas
├── routes/            # API routes
├── middleware/        # JWT auth, error handler
└── config/            # DB connection
## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/blogs | Fetch all blogs (search + filter) |
| POST | /api/blogs | Create blog post |
| PUT | /api/blogs/:id | Update blog post |
| DELETE | /api/blogs/:id | Delete blog post |
| GET | /api/analytics/per-author | Blogs per author (aggregation) |
| GET | /api/analytics/top-tags | Most used tags (aggregation) |
| GET | /api/analytics/recent | Last 7 days activity (aggregation) |
| GET | /api/analytics/summary | Total stats (aggregation) |

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### Environment Variables

Create `server/.env`:
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
### Installation

```bash
# Clone the repo
git clone https://github.com/Rupeshgupta1/blog-dashboard.git
cd blog-dashboard

# Backend setup
cd server
npm install
npm run dev

# Frontend setup (new terminal)
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`
Backend runs on `http://localhost:50n00`

## Screenshots

> Screenshots coming soon — app running at localhost:3000

## MongoDB Aggregation Pipelines

Four aggregation pipelines implemented:

1. **Blogs per Author** — `$group` by authorName, `$sort` by count
2. **Most Popular Tags** — `$unwind` tags array, `$group`, `$sort`, `$limit: 10`
3. **Last 7 Days Activity** — `$match` by date range, `$group` by date
4. **Summary Stats** — Total blogs, authors, recent count
ENDOFFILE