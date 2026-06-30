# TaskBridge — Client (Frontend)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![Better Auth](https://img.shields.io/badge/Auth-Better%20Auth-1a56db)

TaskBridge is a freelance micro-task marketplace connecting **clients** who need short, well-defined tasks completed with **freelancers** who complete them — with a full **admin** layer for platform moderation. This repository contains the Next.js frontend; the API layer lives in a companion Express + MongoDB backend.

---

🔗 **[Live Demo](https://task-bridge-beta.vercel.app)** ·

🖥️ **[Backend Repository](https://github.com/SinghRohan333/server-taskbridge)**

---

## Overview

TaskBridge supports three distinct roles, each with its own dashboard and permissions:

| Role           | Can do                                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Client**     | Post tasks, review proposals, pay freelancers via Stripe, track task progress, rate freelancers                                                        |
| **Freelancer** | Browse and apply to tasks, manage active projects, submit deliverables, track earnings, bookmark tasks, get notified on proposal updates, rate clients |
| **Admin**      | Monitor platform-wide stats, manage and moderate users, manage and remove tasks, review all transactions                                               |

---

## Features

### For Clients

- Email/password and Google OAuth registration & login
- Post, edit, and delete tasks (title, category, description, budget, deadline)
- Review incoming proposals per task, grouped and sorted
- Accept a proposal via Stripe Checkout — payment automatically marks the task in-progress and auto-rejects competing proposals
- Reject proposals individually
- Full payment history
- Rate freelancers after task completion

### For Freelancers

- Browse open tasks with search, category filtering, and pagination
- Submit proposals with a proposed budget, timeline, and cover note
- Track proposal status (pending / accepted / rejected)
- Manage active projects and submit deliverable links to mark tasks complete
- Earnings dashboard with full payment history and totals
- Bookmark tasks to revisit later, with a dedicated Bookmarked Tasks page
- In-app notification bell (polled every 30s) for proposal status changes
- Editable public profile (bio, skills, hourly rate, avatar)
- Public profile page showing average rating, completed job count, and client reviews
- Verified badge, granted by an admin

### For Admins

- Overview dashboard: total users, total tasks, total revenue, active tasks
- Manage Users: block/unblock any non-admin account, verify freelancers
- Manage Tasks: view and delete any task on the platform
- Transactions: read-only view of every successful payment platform-wide
- Own profile page

### Platform-wide

- Role-based dashboard routing and route protection (see [Authentication & Authorization](#authentication--authorization))
- Fully responsive layouts — data tables collapse into stacked cards on mobile
- Two-way review system: clients rate freelancers, freelancers rate clients, one review per task per reviewer
- Toast notifications themed to the brand palette

---

## Tech Stack

| Category          | Technology                                                                             |
| ----------------- | -------------------------------------------------------------------------------------- |
| Framework         | [Next.js 16](https://nextjs.org/) (App Router)                                         |
| UI Library        | React 19                                                                               |
| Styling           | Tailwind CSS v4                                                                        |
| Component Library | HeroUI v3                                                                              |
| Icons             | Gravity UI Icons                                                                       |
| Animation         | Framer Motion / Motion                                                                 |
| Authentication    | [Better Auth](https://www.better-auth.com/) — email/password, Google OAuth, JWT plugin |
| Database          | MongoDB (via Better Auth's MongoDB adapter)                                            |
| Toasts            | React Toastify                                                                         |
| Backend API       | Express.js + MongoDB + Stripe (separate repository)                                    |
| Payments          | Stripe Checkout                                                                        |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/[...all]/route.js     # Better Auth handler + JWT cookie bridge
│   ├── browse-freelancers/
│   ├── browse-tasks/
│   │   └── [id]/
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── payments/
│   │   │   ├── profile/
│   │   │   ├── tasks/
│   │   │   └── users/
│   │   ├── client/
│   │   │   ├── my-tasks/
│   │   │   ├── payments/
│   │   │   ├── post-task/
│   │   │   ├── profile/
│   │   │   └── proposals/
│   │   └── freelancer/
│   │       ├── bookmarks/
│   │       ├── earnings/
│   │       ├── profile/
│   │       ├── projects/
│   │       └── proposals/
│   ├── freelancers/[id]/
│   ├── login/ · register/
│   ├── payment/success/
│   ├── error.jsx · not-found.jsx
│   ├── globals.css
│   ├── layout.js
│   └── page.js                        # Home page
├── components/
│   ├── auth/                          # Login, Register forms
│   ├── browse-freelancers/
│   ├── browse-tasks/
│   ├── dashboard/
│   │   ├── admin/                     # Stats, users/tasks/transactions tables
│   │   ├── client/                    # Task posting, editing, proposals
│   │   ├── DashboardLayout.jsx        # Shared shell for all dashboards
│   │   └── DashboardSidebar.jsx       # Role-aware navigation
│   ├── freelancers/                   # Profile, earnings, active projects, reviews
│   ├── home/                          # Landing page sections
│   ├── payment/
│   ├── ui/                            # Reusable primitives (EmptyState, StarRating, etc.)
│   ├── Navbar.jsx · Footer.jsx
│   └── NotificationBell.jsx
├── context/
│   └── BookmarksContext.jsx           # Global bookmark state for freelancers
├── hooks/
│   └── useDebounce.js
├── lib/
│   ├── api.js                         # Fetch wrapper for the Express backend
│   ├── auth.js                        # Better Auth server config (JWT plugin, hooks)
│   ├── auth-client.js                 # Better Auth React client
│   ├── auth-token.js
│   ├── utils.js                       # Formatters, shared style maps
│   └── validators.js
├── styles/
│   └── components.css                 # Navbar, drawer, footer, toast theming
└── proxy.js                           # Role-based route guarding (Next.js middleware)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (Atlas or local)
- Google OAuth credentials (Client ID & Secret)
- The companion Express backend running and reachable

### Installation

```bash
git clone <repository-url>
cd taskbridge-client
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_API_URL=http://localhost:8000
```

| Variable                                    | Description                                          |
| ------------------------------------------- | ---------------------------------------------------- |
| `MONGODB_URI`                               | Shared database connection string (`taskbridge-db`)  |
| `BETTER_AUTH_URL`                           | Base URL of this Next.js app                         |
| `BETTER_AUTH_SECRET`                        | Secret used by Better Auth to sign sessions and JWTs |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials                             |
| `NEXT_PUBLIC_API_URL`                       | Base URL of the Express backend                      |

### Seed the Admin Account

The admin account must exist as a real Better Auth user (with a hashed password), not just a database document. Run this once:

```bash
node scripts/seed-admin.mjs
```

### Run the Dev Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Demo Credentials

For grading and review purposes, the following admin account is pre-seeded:

```
Email:    admin1@taskhive.com
Password: admin1@taskhive.com
```

Logging in with these credentials redirects directly to the Admin dashboard. Rotate or remove this account before any public deployment.

---

## Authentication & Authorization

- **Login**: Better Auth handles email/password and Google OAuth, issuing both its own session cookie and a short-lived signed JWT (via the Better Auth JWT plugin), delivered as a separate `httpOnly`, `SameSite=Strict` cookie.
- **API calls**: every request to the Express backend (`src/lib/api.js`) sends credentials automatically; the backend verifies the JWT on each protected route and re-checks the user's current status in MongoDB (so a block action takes effect immediately, not just after the token expires).
- **Route protection**: `src/proxy.js` guards all `/dashboard/*` routes — unauthenticated users are redirected to `/login`, blocked users are signed out, and each role is confined to its own dashboard (e.g. a client visiting `/dashboard/admin` is redirected to `/dashboard/client`).

---

## Design System

| Token          | Hex       | Usage                    |
| -------------- | --------- | ------------------------ |
| Brand Blue     | `#1a56db` | Primary actions, links   |
| Blue Dark      | `#1e429f` | Hover states             |
| Blue Tint      | `#ebf5fb` | Backgrounds, badges      |
| Success Green  | `#0e9f6e` | Earnings, success states |
| Warning        | `#f59e0b` | In-progress states       |
| Danger         | `#ef4444` | Destructive actions      |
| Admin Purple   | `#8b5cf6` | Admin-specific UI        |
| Text Primary   | `#1f2937` | Body text                |
| Text Secondary | `#6b7280` | Muted text               |

**Typography**: [Inter](https://fonts.google.com/specimen/Inter), weights 400–700.

---

## API Integration

All backend calls go through the `apiFetch` wrapper in `src/lib/api.js`, which targets `NEXT_PUBLIC_API_URL` and includes credentials on every request. See the backend repository for full endpoint documentation.

---

## Deployment Notes

The JWT cookie is configured with `SameSite=Strict`, which works correctly when frontend and backend share a registrable domain (including different localhost ports during development). If frontend and backend are deployed to **separate domains** in production, `SameSite=Strict` will block the cookie from reaching the API — switch to `SameSite=None; Secure` or proxy API calls through a Next.js route handler in that scenario.

---

## Author

Built by **Rohan Singh** as part of the TaskBridge assignment project.
