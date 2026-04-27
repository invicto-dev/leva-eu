# 🤖 Instruções para Agentes de IA

> **Este arquivo é o seu ponto de entrada.** Ele garante que você entenda o projeto sem alucinações e com máxima eficiência de tokens.

## 🚀 Protocolo de Inicialização (OBRIGATÓRIO)

**Antes de qualquer ação, você DEVE ler os arquivos no diretório `.ai/` na seguinte ordem:**

1. [`.ai/MEMORY.md`](.ai/MEMORY.md) — **LEIA PRIMEIRO.** Estado atual e últimas decisões.
2. [`.ai/README.md`](.ai/README.md) — Protocolo de comportamento e gatilhos.
3. [`.ai/PROJECT.md`](.ai/PROJECT.md) — Stack técnica e setup.
4. [`.ai/ARCHITECTURE.md`](.ai/ARCHITECTURE.md) — Mapeamento de arquivos e modelos.
5. [`.ai/CONVENTIONS.md`](.ai/CONVENTIONS.md) — Regras de código e padrões.

---

## 💡 Contexto Rápido

- **Tipo:** Monorepo Turborepo (pnpm v10)
- **Tech:** NestJS 11 (API) + React 19 (Web) + Prisma 6 (DB)
- **Runtime:** Node.js v22 (`nvm use 22`)
- **Infra:** Docker Compose (PostgreSQL + Minio)

---

## 🛑 Regras Inegociáveis

1. **NÃO use `any` em TypeScript.**
2. **NÃO gere código superficial.** Tudo deve ser production-ready.
3. **SEMPRE tipar retornos e parâmetros.**
4. **SEMPRE usar Português-BR** para documentação, planos e tarefas.
5. **CÓDIGO EM INGLÊS.** (Variáveis, funções, tabelas).

---

## 🔄 Ao Finalizar uma Sessão

**Você DEVE atualizar a "Memória" do projeto:**
- Atualize [`.ai/MEMORY.md`](.ai/MEMORY.md) com o progresso atual e decisões tomadas.
- Atualize os arquivos técnicos (`ARCHITECTURE.md`, `CONVENTIONS.md`) se houver mudanças estruturais.

Isso garante que a próxima sessão de IA saiba exatamente onde paramos.
