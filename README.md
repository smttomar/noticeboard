# Notice Board

A full-stack Notice Board application built with **Next.js (Pages Router)**, **Prisma**, and a **hosted MySQL/Postgres database**, deployed on **Vercel**.

## Live Demo

🔗 https://noticeboard-puce.vercel.app/

---

## Features

- 📋 **List all notices** as responsive cards (mobile + desktop)
- ➕ **Create** new notices via a validated form
- ✏️ **Edit** existing notices (form pre-filled with current data)
- 🗑 **Delete** notices with a confirmation step
- ⚠️ **Urgent notices** sorted to the top (via Prisma `orderBy`) with a red badge
- 👨‍💼 **Admin** login and logout
- 🖼 **Optional image** support (bonus feature)
- ✅ **Server-side validation** in every API route

---

## Tech Stack

| Concern      | Technology                               |
| ------------ | ---------------------------------------- |
| Framework    | Next.js 14, Pages Router                 |
| Database ORM | Prisma                                   |
| Database     | TiDB Cloud (MySQL-compatible, free tier) |
| Hosting      | Vercel (Hobby tier)                      |
| Styling      | Tailwind CSS                             |

---

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/noticeboard.git
cd noticeboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Create a free database on one of:

- **[TiDB Cloud](https://tidbcloud.com)** (recommended — MySQL-compatible, free)
- **[Neon](https://neon.tech)** (Postgres, free)
- **[Supabase](https://supabase.com)** (Postgres, free)

Copy the `.env.example` to `.env` and paste your connection string:

```bash
cp .env.example .env
# then edit .env with your DATABASE_URL
```

### 4. Push the Prisma schema to your database

```bash
npx prisma db push
```

This creates the `Notice` table and the `Category` / `Priority` enums.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Admin Access

1. Go to `/login`
2. Enter an email that belongs to an admin user
3. Enter the password from `ADMIN_LOGIN_PASSWORD`
4. Once logged in, the app will allow access to admin-only pages and actions.

---

## Deploying to Vercel

1. Push the repository to GitHub (make it **public**).
2. Import the repo on [vercel.com](https://vercel.com).
3. Add the environment variables in the Vercel project settings:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SITE_URL=https://noticeboard-puce.vercel.app`
4. Deploy. Vercel automatically runs `prisma generate` via the `postinstall` script.

`NEXT_PUBLIC_SITE_URL` is used for absolute Open Graph and Twitter image URLs.

> **Note:** Do not use a local SQLite file — Vercel's filesystem is ephemeral. Always use a hosted database.

---

## API Routes

| Method   | Route               | Description                                   |
| -------- | ------------------- | --------------------------------------------- |
| `GET`    | `/api/notices`      | List all notices (Urgent first, then by date) |
| `POST`   | `/api/notices`      | Create a new notice                           |
| `GET`    | `/api/notices/[id]` | Get a single notice                           |
| `PUT`    | `/api/notices/[id]` | Update a notice                               |
| `DELETE` | `/api/notices/[id]` | Delete a notice                               |

All mutation routes validate on the server and return `422` with field-level error messages for invalid input.

---

## Project Structure

```
noticeboard/
├── components/
│   ├── NoticeCard.jsx      # Card with edit/delete + confirm dialog
│   └── NoticeForm.jsx      # Shared create/edit form
├── lib/
│   └── prisma.js           # Prisma client singleton
├── pages/
│   ├── api/notices/
│   │   ├── index.js        # GET (list) + POST (create)
│   │   └── [id].js         # GET + PUT (update) + DELETE
│   ├── notices/
│   │   ├── new.js          # Create page
│   │   └── [id]/edit.js    # Edit page
│   ├── _app.js
│   └── index.js            # Home / list page
├── prisma/
│   └── schema.prisma
├── styles/
│   └── globals.css
└── README.md
```

---
