# Notice Board — Reno Platforms Internship Assignment

A full-stack Notice Board application built with **Next.js (Pages Router)**, **Prisma**, and a **hosted MySQL/Postgres database**, deployed on **Vercel**.

## Live Demo

🔗 https://noticeboard-gpomf7msb-smttomars-projects.vercel.app/

---

## Features

- 📋 **List all notices** as responsive cards (mobile + desktop)
- ➕ **Create** new notices via a validated form
- ✏️ **Edit** existing notices (form pre-filled with current data)
- 🗑 **Delete** notices with a confirmation step
- ⚠️ **Urgent notices** sorted to the top (via Prisma `orderBy`) with a red badge
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

## Deploying to Vercel

1. Push the repository to GitHub (make it **public**).
2. Import the repo on [vercel.com](https://vercel.com).
3. Add the environment variable `DATABASE_URL` in the Vercel project settings.
4. Deploy. Vercel automatically runs `prisma generate` via the `postinstall` script.

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

## What I Would Improve With More Time

**Image uploads instead of URLs.** Currently the image field accepts an external URL. With more time I'd integrate [Cloudinary](https://cloudinary.com) or [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) so users can upload images directly from their device. This would require a dedicated upload API route, a file-size/type validation step on the server, and a preview in the form.

---

## AI Usage

AI (Claude) was used to:

- **Scaffold the initial project structure** — generating the file layout, `package.json`, Prisma schema, and Next.js config boilerplate to avoid repetitive setup.
- **Draft component code** — the `NoticeCard` and `NoticeForm` components were drafted with AI assistance and then reviewed and refined for correctness and style.
- **Write this README** — the structure and content were generated with AI and edited to accurately describe the project.

All code was read, understood, and verified manually. The architecture decisions (Pages Router, API route design, server-side validation approach, Prisma `orderBy` for Urgent sorting) were made independently.
