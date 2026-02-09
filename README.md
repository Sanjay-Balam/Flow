# EduFlow - Course Management Platform

A full-stack course management platform built with Next.js 16, TypeScript, Tailwind CSS, and PostgreSQL. Educators can create and manage courses with AI-powered descriptions, while students can browse, enroll, and track their learning progress.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **Backend**: Next.js API Routes, Server-Side Rendering
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (JWT + Credentials)
- **AI**: Vercel AI SDK + Groq (Llama 3.3 70B)
- **Validation**: Zod v4

## Features

- **Role-based Auth**: Admin, Educator, and Student roles with JWT authentication
- **Course CRUD**: Full create, read, update, delete for courses with category filtering
- **Lesson Management**: Ordered lessons within courses with rich content
- **Enrollment System**: Students can enroll/unenroll from published courses
- **AI Description Generator**: Generate course descriptions using Groq LLM
- **Server-Side Rendering**: Courses page uses SSR with search, filter, and pagination
- **Responsive Design**: Mobile-first with responsive navbar and layouts
- **Dashboard**: Role-specific views for educators (my courses) and students (enrollments)
- **Profile Management**: View and update user profile

## Prerequisites

- Node.js 18+
- PostgreSQL database
- (Optional) Groq API key for AI features

## Getting Started

1. **Clone and install dependencies**:
   ```bash
   cd eduflow
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/eduflow"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   GROQ_API_KEY="your-groq-api-key"  # Optional, for AI features
   ```

3. **Set up the database**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Seed Data Credentials

After running the seed, you can log in with these accounts:

| Role      | Email                    | Password      |
|-----------|--------------------------|---------------|
| Admin     | admin@eduflow.com        | Password123   |
| Educator  | educator1@eduflow.com    | Password123   |
| Educator  | educator2@eduflow.com    | Password123   |
| Student   | student1@eduflow.com     | Password123   |
| Student   | student2@eduflow.com     | Password123   |
| Student   | student3@eduflow.com     | Password123   |

## Project Structure

```
src/
  app/
    (auth)/        # Login and Register pages
    api/           # REST API routes
      ai/          # AI description generator
      auth/        # NextAuth + register
      courses/     # Course & lesson CRUD
      enrollments/ # Enrollment management
      users/       # Profile API
    courses/       # Course browse, detail, create, edit pages
    dashboard/     # Role-based dashboard
    profile/       # User profile page
  components/
    auth/          # Login and register forms
    courses/       # Course card, filters, enroll button, lesson editor
    ui/            # shadcn/ui components
  lib/
    validations/   # Zod schemas
    auth.ts        # NextAuth configuration
    auth-utils.ts  # Server-side auth helpers
    db.ts          # Prisma client singleton
    utils.ts       # Utility functions
  middleware.ts    # Route protection
prisma/
  schema.prisma    # Database schema
  seed.ts          # Database seeder
```

## API Endpoints

| Method | Endpoint                                  | Description              | Auth     |
|--------|-------------------------------------------|--------------------------|----------|
| POST   | /api/auth/register                        | Register new user        | Public   |
| GET    | /api/courses                              | List courses (paginated) | Public   |
| POST   | /api/courses                              | Create course            | Educator |
| GET    | /api/courses/:id                          | Get course details       | Public   |
| PUT    | /api/courses/:id                          | Update course            | Owner    |
| DELETE | /api/courses/:id                          | Delete course            | Owner    |
| GET    | /api/courses/:id/lessons                  | List lessons             | Public   |
| POST   | /api/courses/:id/lessons                  | Create lesson            | Owner    |
| PUT    | /api/courses/:id/lessons/:lessonId        | Update lesson            | Owner    |
| DELETE | /api/courses/:id/lessons/:lessonId        | Delete lesson            | Owner    |
| GET    | /api/enrollments                          | My enrollments           | Auth     |
| POST   | /api/enrollments                          | Enroll in course         | Student  |
| PUT    | /api/enrollments/:id                      | Update progress          | Auth     |
| DELETE | /api/enrollments/:id                      | Unenroll                 | Auth     |
| POST   | /api/ai/generate-description              | AI generate description  | Auth     |
| GET    | /api/users/profile                        | Get profile              | Auth     |
| PUT    | /api/users/profile                        | Update profile           | Auth     |

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Connect the repo on [vercel.com](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Add a PostgreSQL database (e.g., Vercel Postgres, Neon, Supabase)
5. Run `npx prisma migrate deploy` via build command

## Built By

**Sanjay Balam** - [GitHub](https://github.com/sanjay-balam) | [LinkedIn](https://linkedin.com/in/sanjay-balam)
