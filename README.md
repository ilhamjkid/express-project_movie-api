# Movie & Watchlist Management API

A robust, type-safe RESTful API built with **Express.js**, **TypeScript**, **Prisma ORM**, and **Neon PostgreSQL**. The application features JWT-based authentication, Role-Based Access Control (RBAC), PostgreSQL Full-Text Search (FTS), and Watchlist tracking.

## 🚀 Features

- **Authentication & Authorization**: Secure JWT implementation (Access & Refresh Tokens stored with database rotation).
- **Role-Based Access Control (RBAC)**: Role permissions distinguishing `ADMIN` (movie management) and `USER` privileges.
- **Movie Management**:
  - Full CRUD operations for movies.
  - Advanced filtering (release year, genres) and pagination.
  - PostgreSQL Full-Text Search (FTS) with token sanitization on titles and overviews.
- **Watchlist Management**:
  - Personal watchlist tracking (`PLANNED`, `WATCHING`, `COMPLETED`, `DROPPED`).
  - Rating system and custom notes for user entries.
- **Type Safety & Validation**: Strict request payload validation using **Zod** schema preprocessors.

## 🛠️ Tech Stack

- **Runtime & Language**: Node.js, TypeScript
- **Framework**: Express.js
- **Database & ORM**: Neon PostgreSQL (Serverless), Prisma ORM
- **Validation & Auth**: Zod, JSON Web Tokens (jsonwebtoken), Bcrypt
- **Package Manager**: pnpm

## 📋 Prerequisites

Ensure you have the following installed or configured:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (`npm i -g pnpm`)
- A [Neon PostgreSQL](https://neon.tech/) database instance

## ⚙️ Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/ilhamjkid/express-project_movie-api.git
cd express-project_movie-api
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Fill in your Neon connection strings and JWT secrets in `.env`:

```env
NODE_ENV=development

PORT=3001

# Pooled connection for your application
DATABASE_URL=""

# Direct connection for Prisma CLI
DIRECT_URL=""

ACCESS_TOKEN_SECRET=""
ACCESS_TOKEN_EXPIRES_IN=5m

REFRESH_TOKEN_SECRET=""
REFRESH_TOKEN_EXPIRES_IN=7d
```

### 3. Database Migration & Prisma Setup

Run database migrations and generate the Prisma Client:

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

### 4. Run Development Server

Start the development server with live-reloading:

```bash
pnpm dev
```

The server will run on `http://localhost:3001` (or your configured `PORT`).

## 🧪 API Testing

An `api.http` file is provided at the root of the project. You can use the **REST Client** extension in VS Code to test all available endpoints directly:

1. Register an `ADMIN` and a `USER` account.
2. Obtain the `accessToken` via the Login endpoint.
3. Set `@accessToken` variable in `api.http` to test authenticated routes.

---
