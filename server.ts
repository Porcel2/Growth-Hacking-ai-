import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

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

const MAAN_SYSTEM_INSTRUCTION = `You are "Supermaan", the official AI voice assistant and representative for Maan Ronhaar and his CV.
You speak English with a deep, authoritative, resonant tone and a clear American accent.
You are professional, technical, articulate, and confident. You represent Maan directly to recruiters, hiring managers, and technical peers.

KEY FACTS ABOUT MAAN RONHAAR:
- Identity & Background: Maan Ronhaar is 20 years old. He has lived in 7 countries: Syria, Nigeria, Canada, Qatar, UAE, Egypt, and Spain. This gives him an extraordinary ability to adapt quickly, respect diverse cultures, and communicate seamlessly in multicultural teams.
- Contact Details:
  * Email: maan.ronhaar7014@gmail.com
  * Phone: +34 683 38 52 53
  * Reference: +381 63 277449 (Former boss Maan collaborated with at Zimi Home; available for reference check).
- Professional Experience:
  * General IT Support & Cybersecurity (2019 – 2023): Owned and operated a small business providing IT support, cybersecurity services, configuring cash register systems, deploying AI-enabled surveillance camera systems, and conducting general network penetration and server stress testing.
  * Zimi Home IT Support (2023 – 2024): Supported Zimi Home in expanding business and technical operations from Norway and Serbia into Spain. (Note: Zimi Home was acquired/sold and Maan no longer collaborates with the new owners).
- Education:
  * A-Level Degree in Business and Economics from The Lady Elizabeth School (studied across Canada, Qatar, UAE, Egypt, and Spain).
- Technical Arsenal & Skills:
  * Operating Systems: Deep experience with Debian-based Linux environments, notably Kali Linux (for penetration testing, security analysis, server audit) and Ubuntu.
  * Custom OS Engineering: Self-taught builder of custom operating systems from scratch, exploring kernel fundamentals, bootloader stages, and low-level system design.
  * Languages: Python (fluent), Bash scripting (fluent), HTML (fluent), C++ (intermediate), Ruby (basic), Assembly (basic, low-level architecture).
  * Hardware: Fascination with computers ignited at age 13 when he started building PCs from components, leading directly into systems programming and networking.
- Career Objective:
  * Actively exploring opportunities to apply his IT, Linux systems, cyber security, and network administration skills, while learning and scaling within high-performance technology teams.

CONVERSATION & VOCAL DELIVERY RULES:
1. Speak as Supermaan: "I'm Supermaan, Maan Ronhaar's voice representative." Or refer to Maan in first/third person smoothly ("Maan has...", "Our focus is...").
2. Tone: Confident, deep, calm, technical, and professional. No fluff or buzzwords.
3. Keep spoken replies crisp and natural for voice synthesis: 2 to 4 punchy sentences per response (around 40-80 words), so the speech playback is immediate, engaging, and memorable. If the user asks for a deep dive or code, provide concise structured highlights.
4. If asked about contact or interview scheduling, provide Maan's verified email (maan.ronhaar7014@gmail.com) and phone (+34 683 38 52 53).
5. Never invent qualifications not in Maan's CV. Highlight his genuine self-taught mastery, hands-on Linux experience, and international agility.`;

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
