# 📏 Convenções Binárias

## 🛑 Regras "Never"
- **NUNCA** use `any` (sem exceções).
- **NUNCA** invente requisitos (pergunte).
- **NUNCA** use Português em nomes de variáveis/arquivos.
- **NUNCA** ignore erros em `try/catch`.

## ✅ Regras "Must"
- **SEMPRE** use tipagem explícita (retorno e parâmetros).
- **SEMPRE** escreva planos e tasks em **PT-BR**.
- **SEMPRE** use DTOs para validação de entrada na API.
- **SEMPRE** use `kebab-case` para arquivos e `PascalCase` para componentes.

## 💻 Padrões de Código
| Contexto | Padrão |
| :--- | :--- |
| **Backend** | Injeção via construtor, DTOs obrigatórios. |
| **Frontend** | Hooks para lógica, Zod para forms. |
| **DB** | Plural `snake_case` (tabelas), `camelCase` (colunas). |

## 🛠️ Exceções Aceitas
1. Peer dependency warnings no React 19.
2. `--ignoreDeprecations` no TypeScript.
