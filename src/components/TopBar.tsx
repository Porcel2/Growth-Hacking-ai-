import React from "react";
import { Mic, FileDown } from "lucide-react";
import { cvData } from "../data/cvData";

interface TopBarProps {
  onStartVoice: () => void;
  onOpenPdf: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onStartVoice,
  onOpenPdf,
  onScrollToSection,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#050505]/90 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            className="text-lg sm:text-xl font-serif font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-neutral-200 transition-colors"
          >
            SUPERMAAN
          </a>
          <span className="hidden sm:inline-block text-xs font-serif italic text-neutral-400">
            · Voice of Maan Ronhaar
          </span>
        </div>

        {/* Zone 2: 4-5 Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-neutral-400">
          <button
            onClick={() => onScrollToSection("voice-stage")}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Assistant
          </button>
          <button
            onClick={() => onScrollToSection("experience")}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Experience
          </button>
          <button
            onClick={() => onScrollToSection("skills")}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Systems
          </button>
          <button
            onClick={() => onScrollToSection("global")}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Background
          </button>
          <button
            onClick={onOpenPdf}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            CV Document
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onStartVoice}
            className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-medium text-white bg-neutral-900 border border-neutral-700 hover:border-neutral-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm hover:bg-neutral-800"
          >
            <Mic className="w-3.5 h-3.5 text-sky-400" />
            <span>Voice Interview</span>
          </button>
        </div>
      </div>
    </header>
  );
};
