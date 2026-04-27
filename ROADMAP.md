# Roadmap de Desenvolvimento: Leva Eu

Para garantir uma entrega modular e livre de bugs, o projeto será dividido em 6 etapas principais.

## 📍 Fase 1: Infraestrutura e Base de Dados (CONCLUÍDO)
- [x] Configuração do Monorepo (Turbo + pnpm)
- [x] Modelagem de dados (User, Driver, Customer, Ride, ConversationState)
- [x] Sincronização do Banco de Dados (Prisma)
- [x] Script de bootstrapping do projeto

## 📍 Fase 2: WhatsApp Messaging Engine (PRÓXIMO PASSO)
- [ ] Implementar autenticação persistente do WhatsApp (Session Management)
- [ ] Refinar a State Machine de conversação:
    - Fluxo completo: Saudação -> Origem -> Destino -> Confirmação -> Criação de Ride.
- [ ] Implementar sistema de logs de mensagens para auditoria.
- [ ] **Critério de Aceite:** Enviar "Quero uma corrida" e ver a `Ride` criada no banco com os dados corretos.

## 📍 Fase 3: App do Motorista (Mobile/PWA)
- [ ] Implementar UI de Login (via telefone/senha)
- [ ] Tela de "Corridas Pendentes":
    - Listagem em tempo real de solicitações do WhatsApp.
    - Botão "Aceitar Corrida".
- [ ] Tela de "Corrida em Andamento":
    - Dados do passageiro e botão para finalizar.
- [ ] Integração com Push Notifications (via Capacitor).

## 📍 Fase 4: Painel Administrativo (Web Dashboard)
- [ ] Gestão de Motoristas (Aprovação/Bloqueio).
- [ ] Visualização de todas as corridas em tempo real.
- [ ] Relatórios básicos de faturamento e volume de corridas.

## 📍 Fase 5: Comunicação em Tempo Real (Real-time Sync)
- [ ] Implementar WebSockets (Socket.io) para notificar o App do Motorista instantaneamente.
- [ ] Atualizar status no WhatsApp quando o motorista aceitar (Mensagem de retorno automática).

## 📍 Fase 6: Polimento e Produção
- [ ] Testes de carga (múltiplas conversas simultâneas).
- [ ] Configuração de CI/CD (Github Actions).
- [ ] Dockerização completa para produção.

---

## 🛡 Modularidade e Qualidade
1.  **Código**: Seguir os princípios SOLID e Clean Architecture no NestJS.
2.  **Tipagem**: Uso obrigatório de TypeScript sem `any`.
3.  **Testes**: Cada módulo deve ter testes de integração para os serviços principais.
