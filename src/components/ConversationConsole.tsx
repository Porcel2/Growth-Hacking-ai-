import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  Square,
} from "lucide-react";
import { cvData } from "../data/cvData";
import { AssistantState } from "./VoiceVisualizer";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  audioBase64?: string;
  timestamp: Date;
}

interface ConversationConsoleProps {
  messages: ChatMessage[];
  assistantState: AssistantState;
  onSendMessage: (text: string) => void;
  onReplayAudio: (audioBase64: string) => void;
  onStopAudio: () => void;
  autoPlayVoice: boolean;
  onToggleAutoPlay: () => void;
  isListening: boolean;
  onToggleListening: () => void;
  speechSupported: boolean;
}

export const ConversationConsole: React.FC<ConversationConsoleProps> = ({
  messages,
  assistantState,
  onSendMessage,
  onReplayAudio,
  onStopAudio,
  autoPlayVoice,
  onToggleAutoPlay,
  isListening,
  onToggleListening,
  speechSupported,
}) => {
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, assistantState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || assistantState === "thinking") return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col">
      {/* Quick Prompts Carousel for Recruiters */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 px-1">
          <span className="font-mono uppercase tracking-wider text-[11px]">
            Inquire with Supermaan
          </span>
          <span className="text-neutral-400 text-[11px] hidden sm:inline">
            Tap any question or speak into your microphone
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {cvData.curatedQuestions.flatMap((cat) => cat.questions).map((q, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(q)}
              disabled={assistantState === "thinking"}
              className="shrink-0 text-left text-xs text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-md px-3 py-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Box */}
      <div className="border border-neutral-800/80 bg-neutral-950/60 rounded-xl p-4 sm:p-6 mb-4 min-h-[220px] max-h-[360px] overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="h-44 flex flex-col items-center justify-center text-center p-4 text-neutral-400">
            <Sparkles className="w-6 h-6 text-neutral-400 mb-2 stroke-[1.5]" />
            <p className="font-serif italic text-base text-neutral-300">
              "I'm Supermaan, here to present Maan Ronhaar's technical credentials."
            </p>
            <p className="text-xs text-neutral-400 mt-1 max-w-md font-sans">
              Ask about his Debian & Kali Linux systems, custom OS development, network penetration testing, or international European expansion.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-neutral-400">
              <span>{msg.role === "user" ? "You (Interviewer)" : "Supermaan"}</span>
              <span aria-hidden="true">·</span>
              <span>
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div
              className={`max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-neutral-800/90 text-white border border-neutral-700/80"
                  : "bg-neutral-900/90 text-neutral-200 border border-neutral-800/90 font-sans"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Controls for Supermaan's message */}
              {msg.role === "model" && (
                <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-neutral-800/80 text-xs text-neutral-400">
                  {msg.audioBase64 && (
                    <button
                      onClick={() => onReplayAudio(msg.audioBase64!)}
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                      title="Replay spoken audio"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                      <span>Listen Again</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                    title="Copy text response"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Thinking Indicator */}
        {assistantState === "thinking" && (
          <div className="flex flex-col items-start animate-in fade-in duration-200">
            <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-purple-400">
              <span>Supermaan</span>
              <span aria-hidden="true">·</span>
              <span>Synthesizing response...</span>
            </div>
            <div className="rounded-xl px-4 py-3 text-sm bg-neutral-900/90 border border-purple-900/30 text-neutral-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>Analyzing CV dossier and formulating technical response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Controls Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 focus-within:border-neutral-600 rounded-xl p-2 transition-colors">
          {/* Mic Button */}
          <button
            type="button"
            onClick={onToggleListening}
            className={`p-2.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
              isListening
                ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                : "bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
            }`}
            title={
              !speechSupported
                ? "Microphone transcription not supported in this browser"
                : isListening
                ? "Stop listening"
                : "Speak your question"
            }
          >
            {isListening ? (
              <MicOff className="w-4 h-4 text-red-400" />
            ) : (
              <Mic className="w-4 h-4 text-sky-400" />
            )}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? "Listening... speak now"
                : "Ask Supermaan anything about Maan's CV..."
            }
            disabled={assistantState === "thinking"}
            className="flex-1 bg-transparent px-3 py-1.5 text-sm text-white placeholder-neutral-400 focus:outline-none"
          />

          {/* Audio Stop button when speaking */}
          {assistantState === "speaking" && (
            <button
              type="button"
              onClick={onStopAudio}
              className="px-2.5 py-1.5 rounded text-xs font-mono text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 flex items-center gap-1.5 transition-colors"
              title="Stop voice playback"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || assistantState === "thinking"}
            className="p-2.5 rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Audio Feedback Toggle */}
        <div className="flex items-center justify-between text-xs text-neutral-400 mt-2 px-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleAutoPlay}
              className="inline-flex items-center gap-1.5 hover:text-neutral-300 transition-colors cursor-pointer"
            >
              {autoPlayVoice ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Voice Auto-playback Enabled</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Voice Muted (Text Only)</span>
                </>
              )}
            </button>
          </div>

          <div className="font-mono text-[11px] text-neutral-400">
            Model: gemini-3.8-flash-tts · Deep American Baritone
          </div>
        </div>
      </form>
    </div>
  );
};
