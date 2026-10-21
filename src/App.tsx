/**
 * Supermaan — Voice Assistant & Interactive CV for Maan Ronhaar
 */

import React, { useState, useEffect, useRef } from "react";
import { TopBar } from "./components/TopBar";
import { VoiceVisualizer, AssistantState } from "./components/VoiceVisualizer";
import { ConversationConsole, ChatMessage } from "./components/ConversationConsole";
import { CvSections } from "./components/CvSections";
import { PdfModal } from "./components/PdfModal";
import { cvData } from "./data/cvData";
import { audioService } from "./utils/audioService";
import {
  Volume2,
  Mic,
  FileText,
  Mail,
  Phone,
  Terminal,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [assistantState, setAssistantState] = useState<AssistantState>("idle");
  const [autoPlayVoice, setAutoPlayVoice] = useState<boolean>(true);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [initialSpoken, setInitialSpoken] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition & Greeting Message
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setAssistantState("listening");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        setAssistantState("idle");
      };

      recognition.onend = () => {
        setIsListening(false);
        setAssistantState((prev) => (prev === "listening" ? "idle" : prev));
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    // Default introductory welcome message
    const introGreeting: ChatMessage = {
      id: "intro-0",
      role: "model",
      content:
        "Greetings. I am Supermaan, the voice representative for Maan Ronhaar. Maan is a 20-year-old systems and cybersecurity specialist with deep hands-on expertise in Debian and Kali Linux, network penetration testing, and custom operating system builds. He has lived across 7 countries and spearheaded operations expansion at Zimi Home. How may I walk you through his background today?",
      timestamp: new Date(),
    };
    setMessages([introGreeting]);
  }, []);

  // Handle Voice Recording toggle
  const toggleListening = () => {
    if (!speechSupported) {
      alert("Speech recognition is not supported in this browser. Please use the text input below.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setAssistantState("idle");
    } else {
      // Stop any playing audio before listening
      audioService.stop();
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.warn("Could not start recognition:", e);
      }
    }
  };

  // Central Message Handling
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Interrupt previous playback
    audioService.stop();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setAssistantState("thinking");

    try {
      // 1. Request Gemini Chat response
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!chatRes.ok) {
        throw new Error(`Chat request failed with status ${chatRes.status}`);
      }

      const chatData = await chatRes.json();
      const replyText = chatData.reply || "I am Supermaan, representing Maan Ronhaar. Please let me know how I can detail his qualifications.";

      let audioBase64: string | undefined;

      // 2. Request Gemini 3.8 Flash TTS audio if autoPlay is on
      if (autoPlayVoice) {
        try {
          const ttsRes = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: replyText,
              voice: "Fenrir",
            }),
          });

          if (ttsRes.ok) {
            const ttsData = await ttsRes.json();
            audioBase64 = ttsData.audioBase64;
          }
        } catch (ttsErr) {
          console.error("TTS generation error:", ttsErr);
        }
      }

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        content: replyText,
        audioBase64,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, modelMsg]);

      // 3. Play audio if available
      if (audioBase64) {
        setAssistantState("speaking");
        await audioService.playBase64Wav(audioBase64, () => {
          setAssistantState("idle");
        });
      } else {
        setAssistantState("idle");
      }
    } catch (err: any) {
      console.error("Failed to generate response:", err);
      setAssistantState("idle");
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        content:
          "I encountered a temporary communication hitch while consulting the neural system. Please ask your question again or explore the CV sections below.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  // Replay specific audio
  const handleReplayAudio = async (audioBase64: string) => {
    audioService.stop();
    setAssistantState("speaking");
    await audioService.playBase64Wav(audioBase64, () => {
      setAssistantState("idle");
    });
  };

  // Stop currently playing speech
  const handleStopAudio = () => {
    audioService.stop();
    setAssistantState("idle");
  };

  // Play introductory speech
  const handlePlayIntroSpeech = async () => {
    if (assistantState === "speaking") {
      handleStopAudio();
      return;
    }
    const introMsg = messages[0]?.content || cvData.summary;
    setAssistantState("thinking");
    try {
      const ttsRes = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: introMsg,
          voice: "Fenrir",
        }),
      });

      if (ttsRes.ok) {
        const ttsData = await ttsRes.json();
        const base64 = ttsData.audioBase64;
        setMessages((prev) => {
          if (prev[0]) {
            return [{ ...prev[0], audioBase64: base64 }, ...prev.slice(1)];
          }
          return prev;
        });
        setAssistantState("speaking");
        setInitialSpoken(true);
        await audioService.playBase64Wav(base64, () => {
          setAssistantState("idle");
        });
      } else {
        setAssistantState("idle");
      }
    } catch (err) {
      console.error("Intro speech error:", err);
      setAssistantState("idle");
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e4e4e7] flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      {/* Top Bar following 3-Zone Contract */}
      <TopBar
        onStartVoice={toggleListening}
        onOpenPdf={() => setIsPdfModalOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Main Content Stage */}
      <main className="flex-1 flex flex-col items-center">
        {/* HERO SECTION */}
        <section
          id="voice-stage"
          className="w-full max-w-5xl mx-auto pt-10 sm:pt-16 pb-6 px-4 sm:px-6 flex flex-col items-center text-center"
        >
          {/* Subtle Lead In */}
          <div className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3 tracking-widest uppercase">
            <span>Voice Representative</span>
            <span aria-hidden="true">·</span>
            <span>Debian Linux & Systems Architecture</span>
          </div>

          {/* Primary Serif Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight max-w-3xl leading-[1.1] mb-4 text-balance">
            Maan Ronhaar
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-xl font-sans leading-relaxed mb-6 text-balance">
            Spoken for by <strong className="text-neutral-200 font-serif font-normal italic text-lg">Supermaan</strong>. A self-taught systems specialist and cybersecurity practitioner raised across 7 countries.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <button
              onClick={handlePlayIntroSpeech}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-black" />
              <span>
                {assistantState === "speaking" ? "Pause Supermaan Voice" : "Listen to Introduction"}
              </span>
            </button>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs sm:text-sm font-medium transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-neutral-400" />
              <span>Inspect Original CV</span>
            </button>
          </div>

          {/* Interactive Voice Visualizer Orb */}
          <VoiceVisualizer
            state={assistantState}
            onOrbClick={() => {
              if (assistantState === "speaking") {
                handleStopAudio();
              } else {
                toggleListening();
              }
            }}
            subText={
              assistantState === "speaking"
                ? "Supermaan is speaking aloud in deep American tone"
                : assistantState === "listening"
                ? "Listening to microphone... speak clearly"
                : assistantState === "thinking"
                ? "Synthesizing CV data and formulation..."
                : "Touch the orb or mic to converse in English"
            }
          />

          {/* Interactive Conversation Console */}
          <div className="w-full mt-4">
            <ConversationConsole
              messages={messages}
              assistantState={assistantState}
              onSendMessage={handleSendMessage}
              onReplayAudio={handleReplayAudio}
              onStopAudio={handleStopAudio}
              autoPlayVoice={autoPlayVoice}
              onToggleAutoPlay={() => setAutoPlayVoice(!autoPlayVoice)}
              isListening={isListening}
              onToggleListening={toggleListening}
              speechSupported={speechSupported}
            />
          </div>
        </section>

        {/* CV SECTIONS (Experience, Systems, Global Story, Contact) */}
        <section id="experience" className="w-full">
          <CvSections
            onAskQuestion={(q) => {
              scrollToSection("voice-stage");
              handleSendMessage(q);
            }}
            onOpenPdfModal={() => setIsPdfModalOpen(true)}
          />
        </section>

        {/* TECHNICAL HIGHLIGHT STRIP */}
        <section id="skills" className="w-full max-w-4xl mx-auto px-4 sm:px-6 my-8">
          <div className="border border-neutral-800/80 bg-neutral-950/40 rounded-xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase">
                  <Shield className="w-4 h-4 text-sky-400" />
                  <span>Security & Audits</span>
                </div>
                <div className="text-base font-serif text-white">Kali Linux & Hardening</div>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Hands-on server stress testing, network penetration audits, firewall architecture, and AI camera system deployment.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase">
                  <Terminal className="w-4 h-4 text-sky-400" />
                  <span>Low-Level Systems</span>
                </div>
                <div className="text-base font-serif text-white">Custom Operating Systems</div>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Self-taught OS building, bootloader & kernel exploration, with fluent Python, Bash, and Assembly grounding.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>Scale & Expansion</span>
                </div>
                <div className="text-base font-serif text-white">Zimi Home European Rollout</div>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Spearheaded cross-border IT rollout from Norway & Serbia directly into Spain with international coordination.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-neutral-800/80 bg-[#050505] py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-sans">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-white text-sm tracking-tight">SUPERMAAN</span>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <span>Voice of Maan Ronhaar</span>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <span>Deep American Tone · Gemini 3.8 Flash</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <a
              href="mailto:maan.ronhaar7014@gmail.com"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              maan.ronhaar7014@gmail.com
            </a>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <a
              href="tel:+34683385253"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              +34 683 38 52 53
            </a>
          </div>
        </div>
      </footer>

      {/* CV PDF MODAL */}
      <PdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </div>
  );
}
