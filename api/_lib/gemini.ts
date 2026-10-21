import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

// Created on first use so a missing key returns a readable error instead of crashing the function at load time.
export function getAi(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the Vercel environment variables.");
  }
  if (!client) {
    client = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { "User-Agent": "aistudio-build" },
        timeout: 25000,
        retryOptions: { attempts: 1 },
      },
    });
  }
  return client;
}
