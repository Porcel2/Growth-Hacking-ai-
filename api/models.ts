import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAi } from "./_lib/gemini.js";

// Temporary diagnostic: lists text capable models available to the configured key.
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const pager = await getAi().models.list({ config: { pageSize: 100 } });
    const names: string[] = [];
    for await (const m of pager) {
      if ((m.supportedActions || []).includes("generateContent")) names.push(m.name || "");
    }
    return res.status(200).json({ models: names.filter((n) => /flash|pro|argon/.test(n)) });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "failed" });
  }
}
