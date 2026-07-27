import Anthropic from "@anthropic-ai/sdk";
import type { BriefGenerationInput, BriefGenerationResult } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BRIEF_TOOL: Anthropic.Tool = {
  name: "submit_content_brief",
  description: "Submits a structured content brief for a TikTok Shop affiliate product.",
  input_schema: {
    type: "object",
    properties: {
      hooks: {
        type: "array",
        items: { type: "string" },
        minItems: 3,
        maxItems: 3,
        description: "3 distinct opening lines (first 3 seconds of the video) to hook viewers.",
      },
      talkingPoints: {
        type: "array",
        items: { type: "string" },
        minItems: 5,
        maxItems: 5,
        description: "5 concrete points the creator should cover about the product.",
      },
      cta: {
        type: "string",
        description: "A single recommended call-to-action for the end of the video.",
      },
      claimsToAvoid: {
        type: "array",
        items: { type: "string" },
        description:
          "Compliance warnings: claims that would violate TikTok Shop policy for this product's category (e.g. medical claims, guaranteed results).",
      },
    },
    required: ["hooks", "talkingPoints", "cta", "claimsToAvoid"],
  },
};

/**
 * Generates an AI content brief for a product — Módulo 2 (Briefing
 * Inteligente) do PRD. Uses forced tool-use so the model returns a
 * validated JSON shape instead of free text to parse.
 */
export async function generateBrief(
  input: BriefGenerationInput,
): Promise<BriefGenerationResult> {
  const priceFormatted = (input.priceCents / 100).toFixed(2);

  const message = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1024,
    tools: [BRIEF_TOOL],
    tool_choice: { type: "tool", name: "submit_content_brief" },
    messages: [
      {
        role: "user",
        content: `Você é um estrategista de conteúdo para criadores afiliados do TikTok Shop. Gere um brief de conteúdo para o produto abaixo.

Título: ${input.productTitle}
Descrição: ${input.productDescription}
Categoria: ${input.category}
Preço: ${priceFormatted} ${input.currency}
Comissão: ${input.commissionRate}%
${input.sellerBrief ? `Brief do seller (Target Collaboration): ${input.sellerBrief}` : ""}

Gere hooks curtos e específicos do produto (não genéricos), talking points acionáveis, um CTA direto, e avisos de compliance realistas para a categoria "${input.category}" nas políticas do TikTok Shop (ex: claims médicos, resultados garantidos, comparações não comprovadas).`,
      },
    ],
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );

  if (!toolUse) {
    throw new Error("Claude did not return a structured brief (no tool_use block in response)");
  }

  const result = toolUse.input as {
    hooks: string[];
    talkingPoints: string[];
    cta: string;
    claimsToAvoid: string[];
  };

  if (result.hooks.length !== 3) {
    throw new Error(`Expected exactly 3 hooks from Claude, got ${result.hooks.length}`);
  }

  return {
    hooks: [result.hooks[0]!, result.hooks[1]!, result.hooks[2]!],
    talkingPoints: result.talkingPoints,
    cta: result.cta,
    claimsToAvoid: result.claimsToAvoid,
  };
}
