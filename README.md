# Supabase GDPR Admin Panel

* Live frontend: [https://supabase-gdpr-admin.vercel.app/](https://supabase-gdpr-admin.vercel.app/)
* Live backend (Swagger): [https://supabase-gdpr-admin.onrender.com/docs](https://supabase-gdpr-admin.onrender.com/docs)
* YouTube demo: [https://youtu.be/2cebUz1n4c4](https://youtu.be/2cebUz1n4c4)
* GitHub: [https://github.com/taasbaba/supabase-gdpr-admin](https://github.com/taasbaba/supabase-gdpr-admin)

---

## Highlights

* Role-based login with dynamic dashboard content per role
* Leave request and approval workflow, with approval escalation
* Team-scoped attendance and clock-in/clock-out tracking
* Real-time profile and request update display
* Fully deployed backend and frontend with working authentication

---

## Overview

This is a role-based HR dashboard demo designed for async backend hiring scenarios.

The system implements secure JWT authentication, role-level access control, leave approval workflow, and team-based attendance visibility. All flows are fully functional and deployed for demo access.

Built with:

* React + TailwindCSS (Frontend)
* NestJS + Prisma (Backend)
* Supabase (Auth + PostgreSQL)
* Deployed on Vercel (frontend) and Render (backend)

---

## Role-Based Access Control (RBAC)

| Role    | Permissions                                             |
| ------- | ------------------------------------------------------- |
| manager | View all users in their team (including other managers) |
| leader  | View users in their team **excluding** managers         |
| member  | View only own profile, leave requests, and clock-in     |

Access controls apply consistently across backend API endpoints and frontend components.

---

## Features

* **Clock In/Out** — Track attendance with timestamps
* **Leave Requests** — Submit leave with message and date range
* **Inbox** — Leaders/managers approve leave requests for users under them
* **Admin View** — View team members based on role; scoped securely

---


## Backend Endpoints

* `/auth/me/profile` — Get or update logged-in user's profile
* `/auth/me/team` — Get list of team members based on role
* `/leave/apply` — Submit new leave request
* `/leave/my` — List leave requests by requester
* `/leave/inbox` — List leave requests to be approved by user
* `/leave/approve/:id` — Approve a pending leave request

---

## Notes

This system uses real auth via Supabase JWTs (HS256), verified inside NestJS middleware. Prisma handles DB access via Supabase PostgreSQL. Swagger docs are auto-generated and support live token testing.

The project is fully open-source and serves as a working demonstration of production-aligned RBAC and workflow design for small to medium HR tooling.
