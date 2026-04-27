# Leva Eu - Corridas via WhatsApp 🚗💨

O **Leva Eu** é uma plataforma de mobilidade urbana simplificada que permite aos usuários solicitar corridas diretamente pelo WhatsApp, sem a necessidade de baixar novos aplicativos. A plataforma conta com uma gestão robusta para administradores e um aplicativo dedicado para motoristas.

## 🏗 Arquitetura do Projeto

Este é um monorepo escalável utilizando **Turborepo** e **pnpm**:

- **`apps/api`**: Backend NestJS responsável pela inteligência das corridas, integração com WhatsApp Web API e gestão de estado das conversas.
- **`apps/driver-app`**: Aplicativo móvel para motoristas construído com **React + Capacitor** (Android/iOS).
- **`apps/web`**: Painel Administrativo para controle de frotas, usuários e monitoramento de corridas.
- **`packages/db`**: Camada de persistência com **Prisma ORM** e PostgreSQL.
- **`packages/ui`**: Sistema de design compartilhado para interfaces consistentes.

## 🚀 Tecnologias Principais

- **Backend**: NestJS, Prisma, WhatsApp-Web.js, WebSockets.
- **Frontend**: React 19, Vite, Tailwind CSS v4, shadcn/ui.
- **Mobile**: Capacitor (Cross-platform runtime).
- **Infra**: Docker Compose (Postgres, Minio).

## 🛠 Como Iniciar

### 1. Requisitos
- Node.js v22
- pnpm v10+
- Docker & Docker Compose

### 2. Setup Inicial
```bash
# Instalar dependências
pnpm install

# Subir infraestrutura (DB, Storage)
docker compose up -d

# Sincronizar Banco de Dados
pnpm run db:generate
pnpm run db:push

# Rodar em desenvolvimento
pnpm run dev
```

### 📱 Escaneando o WhatsApp
Ao iniciar a API (`apps/api`), um QR Code será gerado no terminal. Escaneie com seu celular para ativar o bot de atendimento.

---

## 🗺 Roadmap de Desenvolvimento

O projeto está sendo construído em módulos para garantir estabilidade e qualidade:

1.  **Módulo 1: Core & DB** (Concluído) - Estrutura monorepo e modelos Prisma.
2.  **Módulo 2: WhatsApp Engine** (Em progresso) - Fluxo de conversação e parser de pedidos.
3.  **Módulo 3: App do Motorista** - Autenticação e recebimento de corridas.
4.  **Módulo 4: Painel Admin** - Gestão e monitoramento.
5.  **Módulo 5: Real-time** - WebSockets para sincronização instantânea.

## 📄 Licença

Privado / Proprietário - Leva Eu.
