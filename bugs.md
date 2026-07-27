# CreatorPilot — Registro de Bugs

Arquivo vivo para registrar erros encontrados durante o desenvolvimento. Um bug por seção, mais recente no topo.

## Como preencher

- **ID:** sequencial (BUG-001, BUG-002...)
- **Severidade:** 🔴 Crítica (quebra fluxo/dados) | 🟠 Alta (funcionalidade importante afetada) | 🟡 Média (funciona com contorno) | 🟢 Baixa (cosmético)
- **Status:** Aberto | Em investigação | Corrigido | Não reproduz | Adiado

---

## Template (copiar para novo bug)

```
### BUG-XXX — [título curto]

- **Data:** AAAA-MM-DD
- **Módulo:** Radar | Briefing | Collabs | Performance | Calendário | Auth | Infra
- **Severidade:** 🔴 / 🟠 / 🟡 / 🟢
- **Status:** Aberto
- **Ambiente:** local | sandbox TikTok | produção

**Descrição:**


**Passos para reproduzir:**
1.
2.
3.

**Esperado vs Real:**
- Esperado:
- Real:

**Causa raiz (quando descoberta):**


**Correção aplicada:**

```

---

## Bugs registrados

### BUG-001 — Formulário de criação de serviço no TikTok Shop Partner Center não avança

- **Data:** 2026-07-20 (resolvido 2026-07-27)
- **Módulo:** Infra (registro externo, não é código nosso)
- **Severidade:** 🟠 Alta (bloqueava o Sprint 0/2 — não dava pra criar o app)
- **Status:** ✅ Resolvido
- **Ambiente:** TikTok Shop Partner Center (produção, console deles)

**Descrição:**
Ao criar o app CreatorPilot no Partner Center (fluxo `/service/create`), o formulário não avança depois de selecionar "Serviço público".

**Passos para reproduzir:**
1. Partner Center → App & Service → Criar Serviço
2. Selecionar "Serviço público"
3. Formulário não progride pra próxima etapa

**Esperado vs Real:**
- Esperado: avançar para preencher nome do app, categoria (Customer Engagement → Affiliate), região, mercado-alvo
- Real: formulário trava/não avança

**Causa raiz (identificada 2026-07-20):**
Não é um bug de UX — é uma trava proposital. A conta DDNS Soluções tem 4 qualificações de "Desenvolvedor de apps" pré-notificadas (Catálogo/Anúncio de produtos, Conectores, Multicanal, Impressão sob demanda), mas **todas em estado "Rascunho - Aguardando envio"** — nenhuma ativa/aprovada. O botão "Criar" em `/service/create` exige pelo menos uma qualificação de Desenvolvedor de apps **ativa** (submetida e aprovada) antes de permitir a criação de um novo app/serviço.

**Correção aplicada:**
Em 2026-07-27, a TikTok Shop Partner Center aprovou a qualificação **"Analytics & Reporting - Brazil"** pra conta DDNS Soluções, o que já bastou pra destravar `/service/create`. App **CreatorPilot** criado com sucesso como serviço público. Confirmado na própria tela de scopes do console: a categoria **"Affiliate (AFFS & A...)"** existe de fato, ao lado de Shops, Catalog, Orders, Returns, Promotions, Customer Service, Accounting & Finance — bate exatamente com o que o MEL-005/docs/API.md previa.

App Key e App Secret gerados e salvos em `.env.local` (nunca commitados — ver `.gitignore`). Secret leva até 10 min pra ativar segundo o próprio console.

**Próximo passo:** ir em Manage API do app criado e habilitar os scopes da categoria Affiliate (prefixo `creator.*`), depois testar uma chamada real.
