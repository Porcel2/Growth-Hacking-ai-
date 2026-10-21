import React, { useEffect, useRef } from "react";
import { audioService } from "../utils/audioService";
import { Mic, Volume2, Sparkles, Square } from "lucide-react";

export type AssistantState = "idle" | "listening" | "thinking" | "speaking";

interface VoiceVisualizerProps {
  state: AssistantState;
  onOrbClick?: () => void;
  subText?: string;
  isMuted?: boolean;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  state,
  onOrbClick,
  subText,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      // High-DPI support
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.28;

      angle += 0.02;

      // Fetch real audio frequency data if speaking
      const freqData = audioService.getFrequencyData();
      let avgFreq = 0;
      for (let i = 0; i < 32; i++) {
        avgFreq += freqData[i] || 0;
      }
      avgFreq = avgFreq / 32; // 0 to 255

      // Ambient radial gradient background
      const ambientGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        baseRadius * 0.2,
        centerX,
        centerY,
        baseRadius * 2
      );
      if (state === "speaking") {
        ambientGrad.addColorStop(0, "rgba(56, 189, 248, 0.12)");
        ambientGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.03)");
        ambientGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else if (state === "listening") {
        ambientGrad.addColorStop(0, "rgba(239, 68, 68, 0.15)");
        ambientGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.04)");
        ambientGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else if (state === "thinking") {
        ambientGrad.addColorStop(0, "rgba(168, 85, 247, 0.14)");
        ambientGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.03)");
        ambientGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        ambientGrad.addColorStop(0, "rgba(255, 255, 255, 0.05)");
        ambientGrad.addColorStop(0.6, "rgba(255, 255, 255, 0.01)");
        ambientGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
      ctx.fillStyle = ambientGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Outer Acoustic Ripple Rings
      const ringCount = 3;
      for (let r = 0; r < ringCount; r++) {
        const ringShift = (angle * 0.7 + (r * Math.PI) / 1.5) % (Math.PI * 2);
        const breath = Math.sin(ringShift);
        const pulse = state === "speaking" ? (avgFreq / 255) * 28 : state === "listening" ? 12 : 3;
        const currentRadius = baseRadius + (r + 1) * 16 + breath * 4 + pulse * (r + 1) * 0.4;

        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(10, currentRadius), 0, Math.PI * 2);
        ctx.lineWidth = 1;
        if (state === "speaking") {
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.35 - r * 0.09})`;
        } else if (state === "listening") {
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 - r * 0.1})`;
        } else if (state === "thinking") {
          ctx.strokeStyle = `rgba(192, 132, 252, ${0.3 - r * 0.08})`;
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 - r * 0.03})`;
        }
        ctx.stroke();
      }

      // Orbital Harmonic Nodes
      const nodeCount = state === "speaking" ? 48 : 36;
      for (let i = 0; i < nodeCount; i++) {
        const theta = (i / nodeCount) * Math.PI * 2 + angle * (state === "thinking" ? 1.5 : 0.4);
        let amplitude = 0;
        if (state === "speaking") {
          const sample = freqData[i % 32] || 0;
          amplitude = (sample / 255) * 36;
        } else if (state === "listening") {
          amplitude = Math.sin(angle * 4 + i) * 12 + 6;
        } else if (state === "thinking") {
          amplitude = Math.sin(angle * 3 + i * 2) * 8;
        } else {
          amplitude = Math.sin(angle + i) * 2.5;
        }

        const r = baseRadius + amplitude;
        const x = centerX + Math.cos(theta) * r;
        const y = centerY + Math.sin(theta) * r;

        ctx.beginPath();
        ctx.arc(x, y, state === "speaking" ? 1.6 : 1.2, 0, Math.PI * 2);
        if (state === "speaking") {
          ctx.fillStyle = i % 2 === 0 ? "rgba(56, 189, 248, 0.9)" : "rgba(224, 242, 254, 0.7)";
        } else if (state === "listening") {
          ctx.fillStyle = "rgba(248, 113, 113, 0.85)";
        } else if (state === "thinking") {
          ctx.fillStyle = "rgba(192, 132, 252, 0.8)";
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        }
        ctx.fill();
      }

      // Core Monolith Disc
      const coreGrad = ctx.createRadialGradient(
        centerX - baseRadius * 0.2,
        centerY - baseRadius * 0.2,
        baseRadius * 0.1,
        centerX,
        centerY,
        baseRadius
      );
      coreGrad.addColorStop(0, "#18181b");
      coreGrad.addColorStop(0.7, "#09090b");
      coreGrad.addColorStop(1, "#040405");

      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Core border hairline
      ctx.lineWidth = 1.2;
      if (state === "speaking") {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
      } else if (state === "listening") {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
      } else if (state === "thinking") {
        ctx.strokeStyle = "rgba(192, 132, 252, 0.5)";
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      }
      ctx.stroke();

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state]);

  return (
    <div className="relative flex flex-col items-center justify-center my-4 group select-none">
      <div
        onClick={onOrbClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onOrbClick?.();
          }
        }}
        className="relative w-64 h-64 sm:w-72 sm:h-72 cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-full transition-transform active:scale-95"
        title={
          state === "speaking"
            ? "Click to interrupt speech"
            : state === "listening"
            ? "Listening to your microphone..."
            : "Click to interact with Supermaan"
        }
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Center Icon and Status Marker */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center pointer-events-none transition-opacity duration-300">
          {state === "speaking" && (
            <div className="flex flex-col items-center gap-1.5 text-sky-400">
              <Volume2 className="w-8 h-8 animate-pulse stroke-[1.5]" />
              <span className="text-[11px] tracking-widest font-mono uppercase text-sky-300/90 font-medium">
                Speaking
              </span>
            </div>
          )}
          {state === "listening" && (
            <div className="flex flex-col items-center gap-1.5 text-red-400">
              <Mic className="w-8 h-8 animate-pulse stroke-[1.5]" />
              <span className="text-[11px] tracking-widest font-mono uppercase text-red-300 font-medium">
                Listening
              </span>
            </div>
          )}
          {state === "thinking" && (
            <div className="flex flex-col items-center gap-1.5 text-purple-300">
              <Sparkles className="w-8 h-8 animate-spin stroke-[1.5]" />
              <span className="text-[11px] tracking-widest font-mono uppercase text-purple-300 font-medium">
                Synthesizing
              </span>
            </div>
          )}
          {state === "idle" && (
            <div className="flex flex-col items-center gap-2 text-neutral-300 group-hover:text-white transition-colors">
              <div className="w-10 h-10 rounded-full border border-neutral-700/80 bg-neutral-900/90 flex items-center justify-center shadow-inner group-hover:border-neutral-500 transition-colors">
                <Mic className="w-4 h-4 text-neutral-300 group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-serif italic text-neutral-400 group-hover:text-neutral-200 transition-colors tracking-wide">
                Touch to Speak
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sub-label under visualizer */}
      <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400 font-sans tracking-wide">
        <span className="font-serif italic text-neutral-300 text-sm">Supermaan</span>
        <span aria-hidden="true" className="text-neutral-700">·</span>
        <span>{subText || "Deep Tone American Accent · Powered by Gemini 3.8 Flash TTS"}</span>
      </div>
    </div>
  );
};
