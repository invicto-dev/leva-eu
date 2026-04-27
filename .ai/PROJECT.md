# 🚀 Projeto: Core-Base

## 📦 Stack Técnica
| Item | Tecnologia | Observação |
| :--- | :--- | :--- |
| **Runtime** | Node v22 (nvm) | pnpm v10+ |
| **Backend** | NestJS v11 | REST API |
| **Frontend** | React v19 | Vite 6 |
| **DB** | PostgreSQL v15 | Prisma 6 |
| **Auth** | Passport JWT | bcrypt (10) |
| **UI** | shadcn/ui | Tailwind v4 |

## 🏗️ Monorepo (Turbo)
- `apps/api`: Backend (:3000)
- `apps/web`: Frontend (:5173)
- `packages/db`: Prisma & Migrations
- `packages/ui`: Design System

## 🛠️ Dev Quickstart
```bash
docker compose up -d
pnpm run db:generate && pnpm run db:push
pnpm run dev
```

## 🔐 Env (Dev)
- **Admin:** `admin@core.dev` / `admin123`
- **DB:** `postgresql://admin:admin_password@localhost:5432/core_db`
