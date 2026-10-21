import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { MAAN_SYSTEM_INSTRUCTION } from "./api/_lib/maan.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";

app.use(express.json({ limit: "15mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API: Conversational Chat with Gemini 3.8 Flash
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
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

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: MAAN_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I am Supermaan, here representing Maan Ronhaar. How can I assist you with his background?";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({ error: error.message || "Failed to generate chat response." });
  }
});

// API: High-Fidelity Text-to-Speech using gemini-3.8-flash-tts
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice } = req.body;
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

    // Use gemini-3.8-flash-tts
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: cleanSpeechText,
              speechMetadata: {
                speaker: "Supermaan",
                style: "Deep resonant tone, authoritative American baritone, calm articulate pace, technical confidence",
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
    });

    const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioBase64) {
      throw new Error("No audio was returned from Gemini TTS model.");
    }

    return res.json({
      audioBase64,
      mimeType: "audio/wav",
    });
  } catch (error: any) {
    console.error("Error in /api/tts:", error);
    return res.status(500).json({ error: error.message || "Failed to generate speech." });
  }
});

// Serve static assets from public directory
app.use(express.static(path.resolve(__dirname, "public")));

// Vite Middleware integration for development
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Supermaan Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
