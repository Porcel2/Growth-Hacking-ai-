import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAi } from "./_lib/gemini.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { text, voice } = req.body ?? {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing required parameter 'text'." });
    }

    // Sanitize text for optimal speech synthesis: remove markdown links/asterisks
    const cleanSpeechText = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/`{1,3}[^`\n]*`{1,3}/g, "")
      .replace(/#{1,6}\s+/g, "")
      .trim();

    const response = await getAi().models.generateContent({
      model: "gemini-3.8-flash-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: cleanSpeechText,
              speechMetadata: {
                speaker: "Supermaan",
                style:
                  "Deep resonant tone, authoritative American baritone, calm articulate pace, technical confidence",
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            // 'Fenrir' delivers a deep, resonant masculine tone with American inflection
            prebuiltVoiceConfig: { voiceName: voice || "Fenrir" },
          },
        },
      },
    } as any);

    const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioBase64) {
      throw new Error("No audio was returned from Gemini TTS model.");
    }

    return res.status(200).json({ audioBase64, mimeType: "audio/wav" });
  } catch (error: any) {
    console.error("Error in /api/tts:", error);
    return res.status(500).json({ error: error.message || "Failed to generate speech." });
  }
}
