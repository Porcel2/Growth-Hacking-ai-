import React, { useEffect } from "react";
import { X, Download, ExternalLink, FileText } from "lucide-react";
import { cvData } from "../data/cvData";

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfModal: React.FC<PdfModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-4xl h-[88vh] bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-neutral-400" />
            <div>
              <span className="text-sm font-serif text-white font-medium">
                Maan Ronhaar — Original Curriculum Vitae
              </span>
              <span className="text-[11px] font-mono text-neutral-400 block">
                Circulam_Vita_9d8f641b.pdf
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={cvData.pdfUrl}
              download="Maan_Ronhaar_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
            <a
              href={cvData.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Open in new window"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close PDF Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded Document */}
        <div className="flex-1 w-full bg-neutral-950 relative">
          <iframe
            src={`${cvData.pdfUrl}#toolbar=0`}
            title="Curriculum Vitae"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
};
