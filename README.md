# TaskMaster - Full-Stack Task Management System

A comprehensive task management system with a FastAPI backend and Next.js frontend.

## Features

- User authentication with JWT
- Task creation, editing, and deletion
- Task filtering and search
- Dashboard with task statistics
- Responsive UI with dark mode support

## Tech Stack

### Frontend
- Next.js 13+ (App Router)
- React
- TypeScript
- Tailwind CSS
- Lucide React for icons

### Backend
- FastAPI
- SQLAlchemy (Async)
- PostgreSQL
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.8+
- PostgreSQL

### Backend Setup

1. Install Python dependencies:

```bash
pip install fastapi uvicorn sqlalchemy asyncpg python-jose[cryptography] passlib[bcrypt] python-multipart
```

2. Set up PostgreSQL database:

```bash
# Create a new database
createdb taskmaster
```

3. Update the database connection string in `src/backend/database.py`:

```python
DATABASE_URL = "postgresql+asyncpg://username:password@localhost/taskmaster"
```

4. Run the backend server:

```bash
cd src/backend
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

### Frontend Setup

1. Install dependencies:

```bash
bun install
```

2. Run the development server:

```bash
bun run dev
```

The frontend will be available at http://localhost:3000

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Tasks
- `GET /tasks/` - Get all tasks
- `POST /tasks/` - Create a new task
- `GET /tasks/{id}` - Get a specific task
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task
- `GET /tasks/search/` - Search tasks with filters

## Project Structure

```
src/
├── app/                # Next.js pages and layouts
├── backend/            # FastAPI backend
│   ├── main.py         # Main API entry point
│   ├── database.py     # Database connection
│   ├── models.py       # SQLAlchemy models
│   └── schemas.py      # Pydantic schemas
├── components/         # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API client
└── styles/             # Global styles
```
