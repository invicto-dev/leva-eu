# 🧠 Memória do Projeto

## 🎯 Objetivo Atual
- Desenvolvimento do projeto "Leva Eu" (Corridas via WhatsApp).

## 🛠️ Últimas Decisões e Ações
1. **Bootstrap Leva Eu:** Projeto inicializado usando a Project Machine (`leva-eu`, `@leva-eu`).
2. **Modelagem DB:** Implementados modelos `Driver`, `Customer`, `Ride` e `ConversationState` no Prisma.
3. **WhatsApp API:** Integrado `whatsapp-web.js` com uma State Machine funcional para o fluxo de solicitação de corridas.
4. **Mobile App:** Criado `apps/driver-app` com Vite + Capacitor para Android.

## 📝 Próximos Passos Imediatos
- [ ] Implementar UI de Login e Listagem de Corridas no `driver-app`.
- [ ] Criar Painel Admin para gestão de motoristas.

## ⚠️ Débitos Técnicos e Riscos
- Necessário instalar dependências de desenvolvimento para Husky/Commitlint.
- Reestruturação de pastas no Frontend pode quebrar imports temporariamente.
