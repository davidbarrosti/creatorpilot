import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TRANSLATE_TOOL: Anthropic.Tool = {
  name: "submit_translations",
  description: "Submits Portuguese (Brazil) translations for a list of English product titles.",
  input_schema: {
    type: "object",
    properties: {
      translations: {
        type: "array",
        items: { type: "string" },
        description: "Translated titles, in the exact same order as the input list.",
      },
    },
    required: ["translations"],
  },
};

/**
 * Translates TikTok Shop product titles (English, from Apify) into Brazilian
 * Portuguese for display in the Radar. Batched into a single Claude call to
 * keep this cheap and fast — called once per cache sync, not per page view.
 */
export async function translateProductTitles(titles: string[]): Promise<string[]> {
  if (titles.length === 0) return [];

  const message = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 2048,
    tools: [TRANSLATE_TOOL],
    tool_choice: { type: "tool", name: "submit_translations" },
    messages: [
      {
        role: "user",
        content: `Traduza esses títulos de produtos de e-commerce (em inglês) para português do Brasil. Mantenha nomes de marca como estão (ex: "Qawtor", "Jisulife"). Encurte um pouco se o título for muito longo, mas preserve o sentido e as características principais do produto. Retorne exatamente ${titles.length} traduções, na mesma ordem.

${titles.map((t, i) => `${i + 1}. ${t}`).join("\n")}`,
      },
    ],
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );

  if (!toolUse) {
    throw new Error("Claude did not return translations (no tool_use block in response)");
  }

  const result = toolUse.input as { translations: string[] };

  if (result.translations.length !== titles.length) {
    throw new Error(
      `Expected ${titles.length} translations, got ${result.translations.length}`,
    );
  }

  return result.translations;
}
