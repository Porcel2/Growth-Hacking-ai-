import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ThinkingLevel } from "@google/genai";
import { getAi } from "./_lib/gemini.js";
import { MAAN_SYSTEM_INSTRUCTION } from "./_lib/maan.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { message, history } = req.body ?? {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing required parameter 'message'." });
    }

    const contents: any[] = [];

    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-8)) {
        if (item.content && (item.role === "user" || item.role === "model")) {
          contents.push({
            role: item.role,
            parts: [{ text: item.content }],
          });
        }
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await getAi().models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: MAAN_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const reply =
      response.text ||
      "I am Supermaan, here representing Maan Ronhaar. How can I assist you with his background?";
    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({ error: error.message || "Failed to generate chat response." });
  }
}
