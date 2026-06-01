# UniMarks Setup Guide

## Prerequisites

Before running the project, make sure you have the following installed:

* Node.js
* PostgreSQL
* Git

---

## Clone the Repository

```bash
git clone https://github.com/Husseindeeb0/UniMarks.git
cd UniMarks
```

---

## Environment Variables

### Backend

Create a `.env` file inside the `backend` folder using the provided `.env.example` file.

Example:

```bash
cp .env.example .env
```

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

Example:

```bash
cp .env.example .env
```

Configure the frontend environment variables as needed.

---

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

---

## Database Setup

Run Prisma migrations to create the database tables:

```bash
npx prisma migrate dev
```

---

## Create the Initial Admin Account

Before creating the administrator account, make sure the following variables are configured in the backend `.env` file:

```env
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_NAME=
```

Run the admin creation script:

```bash
npx tsx prisma/createAdmin.ts
```

This will create the initial administrator account using the credentials provided in the environment variables.

---

## Run the Backend

```bash
cd backend
npm run dev
```

---

## Run the Frontend

Open a second terminal and run:

```bash
cd frontend
npm run dev
```

---

## Access the Application

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3000
```
