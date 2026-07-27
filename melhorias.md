# CreatorPilot — Melhorias e Descobertas

Arquivo vivo para registrar melhorias, ideias e riscos identificados durante a criação do projeto — coisas que não estavam no PRD original ou que precisam de validação antes de virar decisão travada.

## Como preencher

- **Tipo:** Melhoria | Risco/Validação pendente | Decisão a tomar
- **Prioridade:** Alta | Média | Baixa
- **Status:** Aberto | Em análise | Aplicado | Descartado (com motivo)

---

## Template (copiar para nova entrada)

```
### MEL-XXX — [título curto]

- **Data:** AAAA-MM-DD
- **Tipo:** Melhoria | Risco/Validação pendente | Decisão a tomar
- **Módulo:** Radar | Briefing | Collabs | Performance | Calendário | Stack | Negócio
- **Prioridade:** Alta | Média | Baixa
- **Status:** Aberto

**Contexto/Descrição:**


**Por que importa:**


**Ação sugerida:**

```

---

## Itens já identificados (pesquisa inicial — 2026-07-20)

### MEL-007 — Scope `creator.affiliate.info` pendente de aprovação (próximo bloqueador real)

- **Data:** 2026-07-27
- **Tipo:** Risco/Validação pendente
- **Módulo:** Radar / Collabs / Performance
- **Prioridade:** Alta
- **Status:** ⏳ Aguardando o TikTok (nada a fazer do nosso lado agora)

**Atualização:** confirmado que não existe formulário de justificativa pra esse scope — diferente de outros (ex: "Content Posting") que têm botão "Aplicar" com formulário. Pra "Affiliate Information" é só um toggle, que já está ativado. Tooltip do próprio console: "Este pacote de API será filtrado durante o processo de autorização, a menos que a avaliação do registro seja aprovada" — ou seja, a solicitação já foi feita automaticamente ao ligar o toggle, só falta a avaliação interna do TikTok. Sem prazo visível.

**Contexto/Descrição:**
Com o app CreatorPilot já criado (BUG-001 resolvido), fomos em Manage API confirmar os scopes da categoria Affiliate. Existem 3: `creator.affiliate.info` (produtos, perfil, métricas — o que sustenta Radar e Performance), `creator.affiliate.link.write` (links de afiliado) e `creator.showcase.write` (produtos em destaque). Os dois últimos já aparecem como "Novo" (disponíveis), mas **`creator.affiliate.info` está "Aguardando envio"** — precisa ser submetido e aprovado antes de qualquer chamada real funcionar.

Endpoints reais também já foram mapeados via API Testing Tool (`partner.tiktokshop.com/dev/api-testing-tool`) — ver docs/API.md pra lista completa. Corpo de request/response ainda não confirmado (a ferramenta não revela sem token válido).

**Por que importa:**
É o próximo (e provavelmente último) bloqueador externo antes do Radar poder sair do modo mock. Sem `creator.affiliate.info` aprovado, não tem token real pra testar nada.

**Ação sugerida:**
Submeter `creator.affiliate.info` em Manage API. Enquanto isso, também vale confirmar: (1) se existe endpoint creator-side pra Open Collaborations aceitas (só achamos o lado seller, `/affiliate_seller/.../open_collaborations/search`), e (2) o valor real de `{version}` nos paths — hoje é placeholder configurável (`TIKTOK_SHOP_API_VERSION`, default `202501`).

---

### MEL-001 — TAP (Fase 3 do PRD) é um tipo de Partner diferente de "Developer" — exige registro/identidade separada

- **Data:** 2026-07-20 (atualizado 2026-07-20)
- **Tipo:** Decisão a tomar
- **Módulo:** Negócio (Fase 3 do modelo de monetização)
- **Prioridade:** Média
- **Status:** Em análise

**Atualização (leitura da página oficial "US TikTok Shop Affiliate Partner (TAP)"):**
TAP **existe para US**, mas é um modelo de negócio de **agência**, não de app/software:
- TAP usa "Partner Campaigns" pra conectar sellers com criadores — cria campanhas, seleciona criadores, negocia e reparte comissão manualmente (ex: seller oferece 30%, TAP fica com 15%, criador recebe 15%)
- A documentação assume "agências" gerenciando criadores selecionados — **não está claro se um developer solo/pequena empresa de software (caso da D4M4) se qualifica como TAP**
- É um Partner type **separado** de "Developer" (o tipo que o CreatorPilot usa pra existir como app). Ou seja: **CreatorPilot como app e CreatorPilot/D4M4 como TAP seriam dois registros/identidades diferentes no Partner Center**, não uma extensão automática um do outro.

**Por que importa:**
A Fase 3 do PRD ("CreatorPilot ganha % sobre comissões geradas por criadores que usam a plataforma, zero custo pro criador") pressupõe que basta registrar como TAP. Na prática, TAP parece ser um modelo de agência que gerencia campanhas manualmente pro lado do seller — bem diferente de "app que o criador usa todo dia". Pode não ser a mesma coisa que a Affiliate Partner API (usada por TAPs) permite hoje.

**Ação sugerida:**
Não bloquear o desenvolvimento por causa disso — Fases 1 (freemium) e 2 (B2B reverso/produto em destaque) não dependem de TAP e já sustentam o MVP. Tratar a Fase 3 como algo a validar mais pra frente (possivelmente pedindo diretamente ao suporte do Partner Center se um app "Creator / affiliate integrator" pode também operar como TAP, ou se são mutuamente exclusivos).

---

### MEL-002 — Confirmar se a Affiliate Creator API permite app de terceiros acessar dados de criador via OAuth

- **Data:** 2026-07-20 (resolvido 2026-07-20)
- **Tipo:** Risco/Validação pendente
- **Módulo:** Radar / Collabs / Performance (dependem todos da API)
- **Prioridade:** Alta
- **Status:** ✅ Confirmado viável

**Resolução (exploração direta no console pela extensão do navegador):**
**Sim, um app de terceiros pode pedir autorização OAuth diretamente de um criador** (não só de sellers). Fluxo confirmado:
1. Link de autorização: `https://shop.tiktok.com/alliance/creator/auth?app_key={app_key}&state={state}` (com `user_type=1` = identidade Creator)
2. Criador loga e aprova os scopes solicitados
3. Callback retorna `code`
4. Trocar `code` por `access_token` + `refresh_token` em `https://auth.tiktok-shops.com/api/v2/token/get`
5. Usar o token nas chamadas da Affiliate Creator API

Scopes de criador ficam sob o prefixo `creator.*` (ex: `creator.order:read`) e são habilitados em **App & Service → Manage API** dentro do console — não em nenhuma tela de "categoria". Não há indicação de que a Affiliate Creator API esteja em beta/allowlist fechado hoje, mas alguns scopes específicos podem exigir aprovação individual.

**Identidade correta do CreatorPilot** — a tabela "Which developer are you?" do Partner Center tem 4 tipos; o CreatorPilot é:

| Tipo | Escopo | Build | user_type no OAuth |
|---|---|---|---|
| **Creator / affiliate integrator** ← **CreatorPilot** | Creator-side affiliate data | Public App | Creator (`user_type=1`) |
| Partner (TAP) integrator | Partner business data | Public App | Partner (`user_type=3`) |
| Seller (in-house) developer | Own shop data | Custom App | Seller (`user_type=0`) |
| App developer / ISV | Authorized sellers' data | Public App | Seller (`user_type=0`) |

Confirmado também: existem **3 famílias de Affiliate API** — Affiliate Seller API (seller gerencia collabs), **Affiliate Creator API** (a nossa — listar produtos afiliáveis, gerenciar Open/Target collabs, gerar links promocionais, buscar conversão/comissão) e Affiliate Partner API (pra TAPs, ver MEL-001). Bate exatamente com a seção 10 do PRD.

**Por que importava:** todo o produto depende disso. Está desbloqueado — pode seguir com a arquitetura do PRD como está.

**Próximo passo:** abrir Manage API e listar todos os scopes `creator.*` disponíveis, pra casar 1:1 com cada módulo do PRD (Radar → produtos/comissão; Collabs → status/pedidos; Performance → conversões/GMV).

---

### MEL-006 — Mercados suportados pela Affiliate Creator API: US + SEA confirmados, Brasil ambíguo

- **Data:** 2026-07-20 (atualizado 2026-07-20)
- **Tipo:** Risco/Validação pendente
- **Módulo:** Negócio / Radar / Collabs / Performance
- **Prioridade:** Alta
- **Status:** Em análise

**Atualização — mercados confirmados:**

| Região | Status |
|---|---|
| Estados Unidos (US) | ✅ Confirmado |
| Indonésia, Malásia, Filipinas, Singapura, Tailândia, Vietnã (SEA) | ✅ Confirmado |
| Reino Unido (UK) | ❌ Não suportado |
| União Europeia (EU) | ❌ Não suportado |
| Brasil (BR) | ⚠️ Ambíguo — aparece na lista geral de "Supported regions" e em "Affiliate Partner (TAP)", mas **não aparece explicitamente na doc da Affiliate Creator API** especificamente |

**Por que importa:**
Você planeja começar com criadores beta brasileiros. Se a Affiliate Creator API não cobrir Brasil de fato, esses criadores não conseguem autorizar o app via OAuth — mesmo que o app exista e funcione tecnicamente.

**Ação sugerida:**
Separar dois campos que não são a mesma coisa (ver decisão abaixo): **região de registro da empresa** (deve ser Brasil, é onde a D4M4 existe legalmente — não é negociável) vs. **mercado-alvo do app** (define quem pode autorizar — aqui sim cabe decisão). Recomendo registrar o mercado-alvo inicial só como **Estados Unidos** (100% confirmado) e pedir a inclusão de Brasil depois, uma vez confirmado via suporte/Sandbox — em vez de arriscar a aprovação do app numa região não confirmada.

---

### MEL-005 — Esclarecido: existe categoria certa — "Customer Engagement → Affiliate" (não as 4 vistas inicialmente)

- **Data:** 2026-07-20 (atualizado 2026-07-20)
- **Tipo:** Decisão a tomar → Resolvida
- **Módulo:** Infra / Registro
- **Prioridade:** Alta
- **Status:** ✅ Aplicado

**Contexto/Descrição:**
As 4 qualificações vistas inicialmente (Catálogo/Anúncio de produtos, Gerenciamento de eCommerce/Conectores, Gerenciamento multicanal, Impressão sob demanda) são **service categories para Partner types TSP/CAP/TAP** (agências/parceiros de serviço), não para "Developer". Confirmado que existem 5 Partner types no console: Developer, TSP, CAP, Non-US TAP, US TAP — nenhum chamado "Affiliate Partner" separado.

**Correção:** ao criar o app como Developer (fluxo "Criar Serviço" → "Serviço público"), **existe sim um seletor de App Category** — só não é nenhuma das 4 vistas antes. A categoria certa é **"Customer Engagement" → "Affiliate"**. Combinação final confirmada para o CreatorPilot:
- Build type: **Public App**
- Developer type: **Creator / affiliate integrator** (`user_type=1`)
- App Category: **Customer Engagement → Affiliate**

**O caminho correto para o CreatorPilot é: Partner type = Developer, app público ("Public app"), sem selecionar nenhuma dessas 4 categorias.** Depois de criar o app, os scopes de acesso (incluindo os `creator.*`) são habilitados via **Manage API**, não por categoria.

**Ação sugerida:**
Ignorar/não submeter as 4 qualificações "Rascunho - Aguardando envio" vistas anteriormente — não são o caminho certo. Prosseguir direto para "Create your App" como Developer.

**Confirmação final (2026-07-27):** app CreatorPilot criado com sucesso. A tela de scopes do app mostra as categorias reais disponíveis: Shops, Catalog, Orders, Returns, Promotions, Customer Service, Accounting & Finance e **Affiliate** — confirmando visualmente, direto no console, que a categoria existe como previsto. Ver bugs.md BUG-001 (resolvido) para o resto do histórico.

---

### MEL-003 — Verificar exigência de entidade/verificação de negócio para registro no Partner Center

- **Data:** 2026-07-20
- **Tipo:** Decisão a tomar
- **Módulo:** Negócio / Infra
- **Prioridade:** Média
- **Status:** Aberto

**Contexto/Descrição:**
O PRD já prevê usar o CNPJ da D4M4 Soluções Ltda para o registro. Não foi possível confirmar publicamente se o Partner Center aceita empresa brasileira normalmente ou se, para region "US", exige entidade constituída nos EUA (EIN) ou documento adicional.

**Por que importa:**
Impacta o Sprint 0 diretamente — se travar no registro por causa de entidade, o cronograma de 12 semanas desliza logo no início.

**Ação sugerida:**
Iniciar o registro no Partner Center o quanto antes (é o item 1 do roadmap) justamente para descobrir isso cedo. Ter CNPJ e, como plano B, avaliar se vale abrir estrutura US (ex: LLC) caso seja bloqueante.

---

### MEL-004 — Confirmar taxa zero de listagem no TikTok Shop App Store

- **Data:** 2026-07-20 (resolvido 2026-07-20)
- **Tipo:** Risco/Validação pendente
- **Módulo:** Negócio
- **Prioridade:** Baixa
- **Status:** ✅ Aplicado / Confirmado

**Contexto/Descrição:**
PRD afirma "TikTok Shop App Store tem zero listing fees para desenvolvedores". Confirmado via blog oficial de desenvolvedores do TikTok: "zero listing fees on the TikTok Shop App Store". Claim do PRD está correto — pode manter em material de pitch/investidor.

---
