# 🏗️ Mapeamento Técnico

## 🗄️ Dados (Prisma)
- **Local:** `packages/db/prisma/schema.prisma`
- **Principais:** `User` (RBAC), `SystemSetting` (Branding).

## 🛠️ Backend (NestJS)
- **Global Prefix:** `/api/v1`
- **Módulos:** `AuthModule`, `UsersModule`, `PrismaModule`.
- **Dutos:** DTOs (`class-validator`), Guards (`RolesGuard`).

## 🎨 Frontend (React)
- **Arquitetura:** Feature-Based (`src/features/*`).
- **Estado:** React Query (Server), Context (Global).
- **API:** Axios instanciado em `apps/web/src/lib/api.ts`.

## 📁 Localização Chave
| Recurso | Caminho |
| :--- | :--- |
| UI Primitives | `packages/ui/src/components/*` |
| Web Services | `apps/web/src/features/*/services/*` |
| API DTOs | `apps/api/src/*/dto/*` |
| DB Client | `packages/db/index.ts` |
