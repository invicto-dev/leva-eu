# Guia de Contribuição: Core Base

Bem-vindo ao Core Base! Este documento orienta como manter a qualidade e os padrões do projeto.

## 🚀 Fluxo de Trabalho

1.  **Branching:** Use nomes semânticos (ex: `feat/minha-feature`, `fix/erro-x`).
2.  **Commits:** Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/).
    -   `feat:` para novas funcionalidades.
    -   `fix:` para correções de bugs.
    -   `chore:` para tarefas de manutenção.
3.  **Qualidade:** O Husky executará o linting e validará sua mensagem de commit automaticamente.

## 🏗️ Padrões de Código

### Backend (NestJS)
- **DTOs:** Obrigatórios para toda entrada de dados.
- **Filters/Interceptors:** Use os globais já configurados para manter as respostas padronizadas.
- **Swagger:** Use os decorators `@ApiTags`, `@ApiOperation`, etc., para documentar novos endpoints.

### Frontend (React)
- **Features:** Organize novos módulos em `src/features`.
- **Hooks:** Extraia a lógica dos componentes para hooks customizados.
- **UI:** Utilize os componentes de `packages/ui` sempre que possível.

## 🧪 Testes
- Execute `pnpm test` para rodar todos os testes.
- Mantenha uma cobertura mínima de 80% para novas funcionalidades.

## 📖 Documentação
- Atualize os arquivos no diretório `.ai/` se houver mudanças arquiteturais significativas ou novas decisões técnicas.
