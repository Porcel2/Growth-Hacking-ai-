# Supermaan — Voice Assistant & Interactive CV for Maan Ronhaar

A minimalist, sophisticated voice assistant named **Supermaan** that represents **Maan Ronhaar** and his technical CV. Supermaan speaks with a resonant, deep-toned American accent via Gemini 3.8 Flash TTS, addressing recruiter and interviewer inquiries with technical confidence, cybersecurity depth, and systems expertise. The interface is set against a stark, pitch-black canvas with authentic serif typography, dynamic audio visualization, and expandable CV dossiers.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following design and functional choices were confirmed during Phase 1 interactive clarification:
> - **Interaction Mode**: Two-way voice interaction with microphone recording, real-time speech transcription, and automated audio speech playback (accompanied by text transcript fallback and quick interview questions).
> - **Persona & Tone**: Technical, confident, and articulate—highlighting Linux systems, penetration testing, custom OS development, and multicultural problem solving.
> - **CV Presentation**: Minimalist dark stage with a central voice visualizer orb, accompanied by clean, expandable CV sections and an embedded PDF viewer/download for Maan's original CV.

---

### 1. Overview & Core Concept

- **What It Does**: Supermaan acts as Maan Ronhaar's official voice representative. Recruiters, hiring managers, and collaborators can speak directly to Supermaan through their microphone or type questions. Supermaan synthesizes answers grounded in Maan's verified CV, achievements, technical depth (Kali Linux, Debian, Python, C++, Assembly, custom OS builds, network penetration testing), and global background (lived in 7 countries). The answer is rendered in text and vocalized aloud using `gemini-3.8-flash-tts` in a deep, authoritative American tone.
- **Target Audience**: Tech recruiters, engineering hiring managers, cyber security team leads, and prospective IT collaborators.
- **Key Value**: Replaces passive CV reading with a high-impact, personal, and technologically authentic conversational interview showcase.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Initial Arrival & Introduction**:
   - The user arrives at a clean, stark jet-black stage (`#050505`).
   - The headline in an elegant, authentic serif typeface introduces *Maan Ronhaar — Systems & Security*.
   - A central interactive audio orb pulses gently. A "Start Voice Interview" or "Listen to Introduction" button allows the user to immediately hear Supermaan introduce himself and Maan.
2. **Speaking & Conversing**:
   - The user clicks the microphone button or chooses one of the curated interview prompt chips (e.g., *"Walk me through your cybersecurity penetration testing experience"*, *"Tell me about building custom operating systems"*, *"What did you accomplish at Zimi Home?"*).
   - While recording, a voice wave responds to user speech.
   - Upon completing the question, the query is processed by the server-side Gemini 3.8 Flash model with Maan's full background context.
   - The response text streams in, while `gemini-3.8-flash-tts` returns 24kHz studio WAV audio with a deep, confident American voice profile.
   - The visualizer orb animates with fluid frequency bars or resonant orbital rings while Supermaan speaks.
3. **Exploring the CV Dossier**:
   - Below or alongside the visualizer, users can expand structured CV tabs:
     - **Experience**: General IT Support (2019–2023, cyber security & penetration testing) and Zimi Home IT Support (2023–2024, international expansion across Norway, Serbia, Spain).
     - **Technical Arsenal**: Debian/Ubuntu, Kali Linux, Python, C++, Bash, Assembly, custom OS architecture, PC hardware engineering.
     - **Education & Global Perspective**: Business & Economics A-Levels (The Lady Elizabeth School); lived in Syria, Nigeria, Canada, Qatar, UAE, Egypt, and Spain.
     - **Direct Contact & Verification**: Email, phone (+34 683 38 52 53), verified reference (+381 63 277449), and direct link to view/download the original PDF (`/assets/aistudio/Circulam_Vita_9d8f641b.pdf`).

#### Visual Identity & Theme
- **Color Palette (60-30-10 Rule)**:
  - **60% Canvas**: Pitch black (`#050505` and `#0a0a0a`) creating a nocturnal, focused environment.
  - **30% Structural Surfaces**: Muted graphite cards (`#121214`), hairline borders (`rgba(255, 255, 255, 0.08)`), and soft off-white secondary text (`#a1a1aa`).
  - **10% Accent**: Electric cyan/silver highlight (`#38bdf8` / `#e2e8f0`) reserved for the active voice visualizer, playing states, and primary action buttons.
- **Typography**:
  - **Display / Headings**: High-contrast, editorial serif (`Cormorant Garamond` / `Playfair Display`) for a sophisticated, bespoke aesthetic.
  - **Body / Prose**: Geometric sans (`Plus Jakarta Sans` / `DM Sans`) for crisp readability.
  - **Systems / Code**: Monospace (`JetBrains Mono` with `tabular-nums`) for technical skills, terminal commands, and system metadata.
- **Anti-Slop Discipline**:
  - No candy-colored pill tags or floating badges.
  - No fake AI innovation scores or ungrounded telemetry tickers.
  - Fluid, hardware-accelerated animations using `motion` and HTML5 Canvas audio analysis.

---

### 3. Key Product Decisions & Trade-Offs

- **Server-Side Full-Stack Architecture (`server.ts` with Express)**:
  - *Chosen Approach*: Implement an Express server with Vite middleware integration in `server.ts`. Endpoints `/api/chat` and `/api/tts` handle Gemini 3.8 Flash intelligence and `gemini-3.8-flash-tts` speech generation server-side.
  - *Why*: In strict adherence to Gemini SDK guidelines, `@google/genai` is kept exclusively on the server, ensuring zero API key exposure to the browser.
- **Voice Synthesis with `gemini-3.8-flash-tts`**:
  - *Chosen Approach*: Use `gemini-3.8-flash-tts` with the `Fenrir` or `Charon` deep voice configuration, coupled with speech style metadata and system instructions to produce a resonant, deep American baritone.
  - *Why*: Guarantees high-fidelity vocal delivery matching the user's specific request for a deep American accent.
- **AudioContext & Dual Input (Speech + Text)**:
  - *Chosen Approach*: Native Web Speech API / MediaRecorder for real-time microphone capture with instant transcription, paired with typed input and one-click quick question chips.
  - *Why*: Accommodates interviewers who prefer speaking aloud, as well as those in quiet office environments who prefer typing or clicking sample interview questions.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                       Client (Browser)                          │
│                                                                 │
│  ┌───────────────────────┐          ┌────────────────────────┐  │
│  │ Voice Visualizer Orb  │          │   CV Dossier View      │  │
│  │ (Canvas Audio Waves)  │          │ (Experience, Skills,   │  │
│  └───────────┬───────────┘          │  Global Story, PDF)    │  │
│              │                      └────────────────────────┘  │
│  ┌───────────▼───────────┐          ┌────────────────────────┐  │
│  │ Mic Input / SpeechRec │          │ Quick Interview Chips  │  │
│  └───────────┬───────────┘          └───────────┬────────────┘  │
└──────────────┼──────────────────────────────────┼───────────────┘
               │ POST /api/chat & /api/tts        │
               ▼                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express Backend (server.ts)                  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Route: /api/chat                                          │  │
│  │ Model: gemini-3.8-flash                                   │  │
│  │ Context: Maan Ronhaar's Verified CV, Skills, Milestones   │  │
│  │ Persona: Supermaan (Technical, Confident, Deep Tone)      │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │                                  │
│  ┌───────────────────────────▼───────────────────────────────┐  │
│  │ Route: /api/tts                                           │  │
│  │ Model: gemini-3.8-flash-tts                               │  │
│  │ Config: Deep baritone, American tone, 24kHz WAV stream    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

#### API Contracts & Endpoints
1. `POST /api/chat`:
   - Input: `{ message: string, history: Array<{role: string, content: string}> }`
   - Logic: Calls `ai.models.generateContent` with `gemini-3.8-flash`. System instructions embody Supermaan: confident, technically sharp representative of Maan Ronhaar with deep knowledge of his Linux systems, networking, penetration testing, custom OS builds, Zimi Home expansion, and multicultural adaptability.
   - Output: `{ reply: string }`
2. `POST /api/tts`:
   - Input: `{ text: string }`
   - Logic: Calls `ai.models.generateContent` with `gemini-3.8-flash-tts` and `responseModalities: ["AUDIO"]` with prebuilt voice config (e.g. `Fenrir` / `Charon` deep American tone) and speech style metadata.
   - Output: `{ audioBase64: string, mimeType: "audio/wav" }`
3. Static & CV Asset Serving:
   - Direct access to `/assets/aistudio/Circulam_Vita_9d8f641b.pdf` for downloading and modal viewing.
