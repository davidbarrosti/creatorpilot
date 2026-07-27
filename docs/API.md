# API.md — TikTok Shop Affiliate Creator API Integration

> Pesquisa direta no TikTok Shop Partner Center (conta DDNS Soluções). Detalhe completo do processo de descoberta: [melhorias.md](../melhorias.md) (MEL-001, MEL-002, MEL-005, MEL-006, MEL-007). Status do registro em [bugs.md](../bugs.md) (BUG-001, resolvido).

## Status do registro — ✅ App criado, scope principal pendente de aprovação

O app **CreatorPilot** existe no Partner Center (criado em 2026-07-27, ver bugs.md BUG-001). O que falta agora é o scope `creator.affiliate.info` sair do estado "Aguardando envio" — sem ele, nenhuma chamada real funciona ainda. Desenvolvimento segue 100% em modo mock (`NEXT_PUBLIC_USE_MOCK=true`) até isso resolver.

## Identidade correta do CreatorPilot no Partner Center

Confirmado na tabela "Which developer are you?" do Partner Center:

| Campo | Valor |
|---|---|
| Developer type | **Creator / affiliate integrator** |
| Build type | **Public App** |
| App Category (fluxo `/service/create`) | **Customer Engagement → Affiliate** — confirmado visualmente na tela de scopes do app criado |
| OAuth `user_type` | `1` (identidade Creator) |

Isso é diferente de "Partner (TAP) integrator" (`user_type=3`) e "App developer / ISV" (`user_type=0`, dados de seller) — não confundir na hora de registrar.

## As 3 famílias de Affiliate API

| API | Para quem | Uso no CreatorPilot |
|---|---|---|
| Affiliate Seller API | Seller gerencia collabs com criadores | Não usamos diretamente (mas ver nota sobre Open Collaborations abaixo) |
| **Affiliate Creator API** | Criador gerencia produtos/collabs/performance | **A nossa — todo o produto depende dela** |
| Affiliate Partner API | TAPs gerenciam Partner Campaigns | Só relevante se a Fase 3 (commission sharing) avançar |

## Fluxo de autorização OAuth (confirmado, viável)

Um app de terceiros **pode** pedir autorização diretamente de um criador (não só de sellers):

1. Redirecionar o criador para o link de autorização:
   ```
   https://shop.tiktok.com/alliance/creator/auth?app_key={app_key}&state={state}
   ```
2. Criador loga e aprova os scopes solicitados
3. TikTok redireciona de volta com um `code` na query string
4. Trocar o `code` por `access_token` + `refresh_token`:
   ```
   POST https://auth.tiktok-shops.com/api/v2/token/get
   ```
5. Usar o `access_token` nas chamadas da Affiliate Creator API. Access tokens expiram em 24h; refresh tokens duram 365 dias — implementar refresh automático em background (`src/lib/tiktok/auth.ts`).

**Correção ao PRD (seção 10):** o PRD menciona um "Test Access Token Generator" como ferramenta oficial do Partner Center. Não encontramos essa ferramenta na interface atual — só existe a **API Testing Tool** (`partner.tiktokshop.com/dev/api-testing-tool`), que testa endpoints mas não gera token sozinha. O caminho real pra obter um token de teste parece ser passar pelo fluxo OAuth de verdade (item acima) com uma conta de creator autorizada, ou pela seção "Shop Authorization" dentro da própria ferramenta de teste — ainda não confirmado.

## Scopes (confirmados em 2026-07-27 via Manage API)

Categoria **Affiliate**, 3 scopes com prefixo `creator.*`:

| Scope key | Scope ID | Status | Cobre |
|---|---|---|---|
| `creator.affiliate.info` | 434372 | **Aguardando envio** | Affiliate Information — o "guarda-chuva": perfil do criador, métricas de live room, produtos adicionados/vendidos, `Get Shop Products (legacy)`, `Check Anchor Content/Prerequisites` |
| `creator.affiliate.link.write` | 1873988 | Novo | Gerenciar links de rastreamento de afiliado (sharing links) |
| `creator.showcase.write` | 902596 | Novo | Gerenciar produtos em destaque (showcase) do criador |

`creator.affiliate.info` é o que sustenta o Radar e a Performance — **é o próximo bloqueador a resolver** (precisa ser submetido e aprovado, mesmo padrão do BUG-001).

Mapeamento por módulo do PRD:

| Módulo | Dado necessário | Scope |
|---|---|---|
| Radar | Produtos disponíveis para afiliação, comissão, tipo de collab | `creator.affiliate.info` (via `shop_products`) |
| Briefing | Link promocional pra colar no vídeo | `creator.affiliate.link.write` |
| Collabs | Status de Target Collaborations | `creator.affiliate.info` |
| Performance | Pedidos, conversão, comissão gerada | `creator.affiliate.info` (via `orders/search`) |

## Endpoints confirmados (via API Testing Tool, 2026-07-27)

Paths reais, mas **corpo de request/response ainda não confirmado** (a ferramenta não mostra isso sem um access token válido, e o scope principal ainda não está aprovado). `{version}` é literalmente como a ferramenta mostra — o valor real (provavelmente uma string tipo `202xxx`, como o resto da API do TikTok Shop) ainda não foi confirmado; hoje o código usa `202501` como placeholder configurável via `TIKTOK_SHOP_API_VERSION`.

| Uso | Método | Path |
|---|---|---|
| Buscar produtos disponíveis pra afiliação | `GET` | `/affiliate/{version}/shop_products` |
| Buscar Target Collaborations do criador | `POST` | `/affiliate_creator/{version}/target_collaborations/search` |
| Buscar pedidos/conversões do criador | `POST` | `/affiliate_creator/{version}/orders/search` |
| Rastrear pedidos (histórico) | `POST` | `/affiliate_creator/{version}/orders/trace/search` |
| Gerar links de afiliado (batch) | `POST` | `/affiliate_creator/{version}/affiliate_sharing_links/generate_batch` |
| Buscar produtos em destaque (showcase) | `GET` | `/affiliate_creator/{version}/showcases/products` |
| Adicionar produtos ao showcase | `POST` | `/affiliate_creator/{version}/showcases/products/add` |

**Gap identificado:** não achamos endpoint creator-side pra Open Collaborations já aceitas (só existe `/affiliate_seller/{version}/open_collaborations/search`, que é do lado do seller). Hipótese de trabalho: como `shop_products` já retorna `collaboration_type` (OPEN/TARGET), talvez não exista uma "lista de open collabs aceitas" separada — o criador simplesmente posta usando qualquer produto Open, sem uma etapa de aceite formal como no Target. Precisa confirmar com um token real.

Implementação: `src/lib/tiktok/affiliateCreator.ts` (chamadas cruas) → `src/lib/tiktok/api.ts` (adapter público, mapeia pros tipos internos em `src/types/index.ts`).

## Mercados suportados

| Região | Status |
|---|---|
| Estados Unidos (US) | ✅ Confirmado |
| Indonésia, Malásia, Filipinas, Singapura, Tailândia, Vietnã (SEA) | ✅ Confirmado |
| Reino Unido, União Europeia | ❌ Não suportado |
| Brasil | ⚠️ Ambíguo — não confirmado explicitamente para a Affiliate Creator API (ver melhorias.md MEL-006) |

**Região de registro da empresa** (Brasil, CNPJ D4M4) é um campo diferente de **mercado-alvo do app** (quem pode autorizar o app) — não confundir os dois. Recomendação atual: mercado-alvo inicial só Estados Unidos, adicionar Brasil depois de confirmado.

## TAP / Commission sharing (Fase 3 do PRD)

TAP é um tipo de Partner **separado** de Developer, orientado a agências que gerenciam campanhas manualmente entre seller e criadores (Partner Campaigns) — não é uma extensão automática do app CreatorPilot. Não bloqueia o MVP (Fases 1 e 2 do modelo de negócio não dependem disso). Ver melhorias.md MEL-001.

## Desenvolvimento sem API real

Enquanto `creator.affiliate.info` não é aprovado, todo o desenvolvimento usa o padrão adapter com dados mockados:

```typescript
// src/lib/tiktok/api.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function getProducts(filters?: ProductFilter) {
  if (USE_MOCK) return getMockProducts(filters);
  const accessToken = await getAccessTokenForCurrentUser();
  const raw = await fetchShopProducts(accessToken, filters);
  return raw.map(mapTikTokProduct);
}
```
