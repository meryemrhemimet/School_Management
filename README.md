# School Management

Simple full-stack JavaScript project for managing students and courses.

- Backend: Node.js + Express
- Frontend: HTML + CSS + JavaScript + Bootstrap
- Data: in-memory array, no database required

## Run The Project

Install dependencies:

```bash
npm run install:all
```

Create environment files:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

Start backend and frontend:

```bash
npm run dev
```

Open:

```txt
http://localhost:5173
```

API:

```txt
http://localhost:5000/api
```

## Folder Structure

```txt
backend/
  src/
    server.js              # Starts Express and connects everything
    data/                  # Fake database for students and courses
    routes/                # API URLs
    controllers/           # Request and response logic
    services/              # Business logic
    middlewares/           # Logger, API key, validation, errors

frontend/
  index.html               # Bootstrap layout
  src/
    app.js                 # API calls and DOM logic
    styles.css             # Custom CSS
```

## Main API Routes

```txt
GET    /api/students
GET    /api/students?field=Computer Science
GET    /api/students/:id
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
GET    /api/students/export
GET    /api/stats/average
GET    /api/courses
GET    /api/courses?field=Computer Science
GET    /api/courses/:id
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id
```

Admin routes need this header:

```txt
x-api-key: school-secret-key
```

## What The Project Shows

- CRUD for students
- CRUD for courses
- Soft delete using `isDeleted: true`
- Query params for filtering by field
- Path params for getting a student by ID
- Custom logger middleware
- JSON validation middleware
- API key protection
- Rate limiting on student creation
- Global error handling
- CSV export
- Average grade calculation service
