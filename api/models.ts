import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAi } from "./_lib/gemini.js";

// Temporary diagnostic: times a tiny request against several candidate chat models.
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const candidates = ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash", "gemini-flash-lite-latest"];
  const out = await Promise.all(
    candidates.map(async (model) => {
      const t0 = Date.now();
      try {
        const r = await getAi().models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: "Reply with one short sentence about Linux." }] }],
        });
        return { model, ok: true, ms: Date.now() - t0, text: (r.text || "").slice(0, 60) };
      } catch (e: any) {
        return { model, ok: false, ms: Date.now() - t0, error: String(e.message || e).slice(0, 120) };
      }
    }),
  );
  return res.status(200).json(out);
}
