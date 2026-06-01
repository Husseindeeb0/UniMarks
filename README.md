# UniMarks Setup Guide

## Clone the Repository

```bash
git clone https://github.com/Husseindeeb0/UniMarks.git
cd UniMarks
```

---

# Common Configuration

The following steps are required regardless of whether you run the application locally or using Docker.

## Environment Variables

### Backend

Create a `.env` file inside the `backend` folder using the provided `.env.example` file.

Configure the following environment variables:

```env
# Server
PORT=

# Database
DATABASE_URL=

# JWT
ACCESS_SECRET_TOKEN=
REFRESH_SECRET_TOKEN=

# Admin account that will be created by prisma/createAdmin.ts
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_NAME=
```

### Frontend

Create a `.env` file inside the `frontend` folder using the provided `.env.example` file.

Configure the frontend environment variables as needed.

---

# Option 1: Local Setup

## Prerequisites

Before running the project locally, make sure you have the following installed:

* Node.js
* PostgreSQL
* Git

## Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Database Setup

After configuring PostgreSQL and the `DATABASE_URL`, run:

```bash
cd backend
npx prisma migrate dev
```

This will create all required database tables.

## Create the Initial Admin Account

Run the admin creation script:

```bash
npx tsx prisma/createAdmin.ts
```

This will create the initial administrator account using the credentials provided in the `.env` file.

## Run the Backend

```bash
cd backend
npm run dev
```

## Run the Frontend

Open a second terminal and run:

```bash
cd frontend
npm run dev
```

## Access the Application

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3000
```

---

# Option 2: Docker Setup

## Prerequisites

Before running the project with Docker, make sure you have:

* Docker Desktop
* Git

## Build and Start the Containers

From the project root directory:

```bash
docker compose up -d --build
```

This will:

* Build the frontend container
* Build the backend container
* Start the PostgreSQL container
* Create the application network

## Apply Prisma Migrations

After the containers have started, run:

```bash
docker compose exec backend npx prisma migrate deploy
```

This will create all required database tables inside the Docker PostgreSQL database.

## Create the Initial Admin Account

Run:

```bash
docker compose exec backend npx tsx prisma/createAdmin.ts
```

This will create the initial administrator account using the credentials configured in the backend `.env` file.

## Access the Application

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3000
```
