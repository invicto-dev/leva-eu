# 🧠 Memória do Projeto

## 🎯 Objetivo Atual
- Fase 4: Ciclo de Vida da Corrida (CONCLUÍDA).
- Sincronização de fluxo entre WhatsApp, Backend e App do Motorista.

## 🛠️ Últimas Decisões e Ações
1. **Bootstrap Leva Eu:** Projeto inicializado usando a Project Machine.
2. **Modelagem DB:** Implementados modelos `Driver`, `Customer`, `Ride` (com price, acceptedAt, finishedAt).
3. **Preço Dinâmico:** Implementada geração de preço simulado (R$ 15-45) na criação da corrida.
4. **Notificações Proativas:** API agora envia mensagens de WhatsApp ao cliente em mudanças de status (Aceite, Chegada, Finalização).
5. **Segurança de Concorrência:** Implementado aceite de corrida via transação Prisma com verificação de status PENDING.
6. **Mobile Driver App:** Criada `ActiveRidePage` com fluxo de Cheguei/Finalizar e regra de cancelamento de 2 minutos.

## 📝 Próximos Passos Imediatos
- [ ] Implementar Painel Admin para gestão de faturamento e motoristas.
- [ ] Refatorar sistema de autenticação para usar Cookies em vez de LocalStorage (Segurança).
- [ ] Implementar suporte a múltiplos municípios/tarifários.

## ⚠️ Débitos Técnicos e Riscos
- O Puppeteer no backend pode enfrentar bloqueios do Chrome em ambientes sem interface gráfica (resolvido com `--no-sandbox`).
- Dependência circular entre `RidesModule` e `WhatsappModule` resolvida com `forwardRef`.
