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
- **SEMPRE** usar `forwardRef` em dependências circulares entre módulos da API.

## 💼 Regras de Negócio (Hard-coded)
- **Tolerância de Cancelamento**: Motoristas têm **2 minutos** para cancelar após o aceite sem penalidade.
- **Preço de Corrida**: Deve ser gerado no backend no momento da solicitação e exibido antes do aceite.

## 💻 Padrões de Código
| Contexto | Padrão |
| :--- | :--- |
| **Backend** | Injeção via construtor, DTOs obrigatórios. |
| **Frontend** | Hooks para lógica, Zod para forms. |
| **DB** | Plural `snake_case` (tabelas), `camelCase` (colunas). |

## 🛠️ Exceções Aceitas
1. Peer dependency warnings no React 19.
2. `--ignoreDeprecations` no TypeScript.
