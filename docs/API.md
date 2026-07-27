# API.md — TikTok Shop Affiliate Creator API Integration

> Baseado em pesquisa direta no TikTok Shop Partner Center (conta DDNS Soluções) em 2026-07-20. Detalhe completo do processo de descoberta: [melhorias.md](../melhorias.md) (MEL-001, MEL-002, MEL-005, MEL-006). Status do registro em [bugs.md](../bugs.md) (BUG-001).

## Status do registro — ⚠️ Bloqueado

O app CreatorPilot **ainda não existe** no Partner Center. O formulário de criação de serviço (`/service/create`) trava porque a conta não tem nenhuma qualificação de "Desenvolvedor de apps" ativa (as 4 pré-notificadas estão em rascunho e não são relacionadas a Affiliate/Creator). Ver bugs.md BUG-001 pro estado exato e as opções de desbloqueio em avaliação.

## Identidade correta do CreatorPilot no Partner Center

Confirmado na tabela "Which developer are you?" do Partner Center:

| Campo | Valor |
|---|---|
| Developer type | **Creator / affiliate integrator** |
| Build type | **Public App** |
| App Category (fluxo `/service/create`) | **Customer Engagement → Affiliate** |
| OAuth `user_type` | `1` (identidade Creator) |

Isso é diferente de "Partner (TAP) integrator" (`user_type=3`) e "App developer / ISV" (`user_type=0`, dados de seller) — não confundir na hora de registrar.

## As 3 famílias de Affiliate API

| API | Para quem | Uso no CreatorPilot |
|---|---|---|
| Affiliate Seller API | Seller gerencia collabs com criadores | Não usamos diretamente |
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

## Scopes

Scopes de criador usam o prefixo `creator.*` (ex: `creator.order:read`) e são habilitados em **App & Service → Manage API** — não numa tela de categoria. Lista completa dos scopes disponíveis ainda não foi enumerada (próximo passo assim que o app existir).

Mapeamento esperado por módulo do PRD:

| Módulo | Dado necessário | Scope esperado |
|---|---|---|
| Radar | Produtos disponíveis para afiliação, comissão, tipo de collab | `creator.product:read` (nome exato a confirmar) |
| Collabs | Status de Open/Target collaborations, amostras | `creator.collaboration:read/write` (a confirmar) |
| Performance | Pedidos, conversão, comissão gerada | `creator.order:read` (confirmado no console) |

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

Enquanto o registro está bloqueado, todo o desenvolvimento usa o padrão adapter com dados mockados:

```typescript
// src/lib/tiktok/api.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function getProducts(filters: ProductFilters) {
  if (USE_MOCK) return getMockProducts(filters);
  return fetchTikTokProducts(filters);
}
```
