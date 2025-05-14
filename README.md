# Supabase GDPR Admin Panel

* Live frontend: [https://supabase-gdpr-admin.vercel.app/](https://supabase-gdpr-admin.vercel.app/)
* Live backend (Swagger): [https://supabase-gdpr-admin.onrender.com/docs](https://supabase-gdpr-admin.onrender.com/docs)
* GitHub: [https://github.com/taasbaba/supabase-gdpr-admin](https://github.com/taasbaba/supabase-gdpr-admin)

---
## Highlights

* Strong separation of concerns between authentication, identity, and team-scoped access
* Roles and team IDs are not stored in the JWT but resolved dynamically at runtime
* Uses PostgreSQL-level foreign key constraints and role integrity via Prisma
* Built-in Swagger for self-documenting and testable API access
* Full frontend+backend working demo deployed on Vercel and Render

---

## Overview

This project demonstrates a fully functional role-based admin panel with secure JWT authentication, team-scoped user access, and GDPR-compliant user profile management.

It is built with:

* React + Bootstrap (Frontend)
* NestJS + Prisma (Backend)
* Supabase (Auth + PostgreSQL)

The system implements strict access control logic across three defined user roles: **manager**, **leader**, and **member**. Users are scoped to teams, and all access to other users’ data is governed by role and team boundaries.

---

## Role-Based Access Control (RBAC)

The application enforces clearly separated privileges for each role. Behavior is consistent across both frontend views and backend API endpoints.

### Role Definitions

| Role    | Permissions                                             |
| ------- | ------------------------------------------------------- |
| manager | View all users in their team (including other managers) |
| leader  | View users in their team **excluding** managers         |
| member  | Can view and edit only their own profile                |

---

## Demo Accounts

| Role    | Email                                                 | Password |
| ------- | ----------------------------------------------------- | -------- |
| manager | [it.manager@jack.com](mailto:it.manager@jack.com)     | 12345678 |
| leader  | [it.leader@example.com](mailto:it.leader@example.com) | 12345678 |
| member  | [it.b@example.com](mailto:it.b@example.com)           | 12345678 |

---

## System Architecture

### Frontend (React + Bootstrap)

* AuthGuard protects all routes by verifying Supabase session
* Token is retrieved via `supabase.auth.getSession()` and passed to backend via Bearer header
* Tab-based dashboard interface (Profile / Admin / Token)

  * Profile tab shows current user profile and allows updating full name
  * Admin tab (if permitted) fetches and displays users in the same team
  * Token tab shows full JWT claims for debug
* Admin tab is hidden for members and dynamically rendered based on the user's role

### Backend (NestJS + Supabase Auth + Prisma)

* SupabaseAuthService verifies JWTs using HS256 with runtime issuer/secret validation
* Middleware extracts `sub` (user UUID) and uses it to fetch profile from `user_profiles`
* `/me/profile`: returns or upserts current user's profile
* `/admin/getall`: returns all team members visible to the requester, based on role
* `/admin/:uuid`: returns detailed profile for specified UUID, if permitted by role
* Prisma connects directly to Supabase PostgreSQL, ensuring full ORM capabilities
* Swagger docs are live at `/docs` with full auth and schema support

---

This project demonstrates how to build a real-world, production-aligned role-based access control system with Supabase and modern frameworks, supporting both internal admin needs and future SaaS extensibility.
