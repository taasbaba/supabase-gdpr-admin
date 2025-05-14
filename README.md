## How to Initialize Prisma Locally (NestJS + Supabase)

### 1. Install Prisma and client (if not yet)

```bash
npm install prisma @prisma/client
```

---

### 2. Enable multi-schema introspection

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  directUrl  = env("DIRECT_URL")
  schemas    = ["public", "auth"]
}
```

---

### 3. Run introspection to pull schema from Supabase

```bash
npx prisma db pull
```

---

### 4. Generate Prisma client

```bash
npx prisma generate
```

> Prisma Client will be generated to `.prisma/client`
> You can import it using:
>
> ```ts
> import { PrismaClient } from '@prisma/client';
> ```

---

### 5. Configure `.env` with Supabase DB credentials
![Supabase Connection Example](/docs/images/supabase-prisma-connect.png)

To get your connection string:

1. Go to your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Click **Connect** at the top-left corner.
3. Select the **"ORM"** tab.
4. Copy the connection string shown.
```env
# Connect to Supabase via connection pooling
DATABASE_URL=postgresql://postgres.[project_id]:[db_password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
# Direct connection to the database. Used for migrations
DIRECT_URL=postgresql://postgres.[project_id]:[db_password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

---

## Backend API Notes

- Default server port: `http://localhost:5678`
- Swagger UI: `http://localhost:5678/docs`
