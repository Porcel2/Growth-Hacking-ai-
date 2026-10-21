import React, { useState } from "react";
import { cvData, ExperienceItem, SkillCategory } from "../data/cvData";
import {
  ShieldCheck,
  Cpu,
  Globe2,
  FileText,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ExternalLink,
  Phone,
  Mail,
  UserCheck,
  Terminal,
} from "lucide-react";

interface CvSectionsProps {
  onAskQuestion: (question: string) => void;
  onOpenPdfModal: () => void;
}

export const CvSections: React.FC<CvSectionsProps> = ({
  onAskQuestion,
  onOpenPdfModal,
}) => {
  const [activeTab, setActiveTab] = useState<"experience" | "skills" | "global" | "contact">("experience");
  const [expandedExp, setExpandedExp] = useState<string>("exp-1");

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-800 pb-4 mb-8 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            Curriculum Vitae Dossier
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white mt-1 tracking-tight">
            Maan Ronhaar — Verified Record
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPdfModal}
            className="flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-white px-3 py-1.5 rounded border border-neutral-800 hover:border-neutral-600 bg-neutral-900/60 transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-400" />
            <span>View Original CV (PDF)</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation (Segmented Minimalist Bar) */}
      <div className="flex items-center gap-1 border-b border-neutral-800/80 mb-6 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("experience")}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "experience"
              ? "border-white text-white font-semibold"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-neutral-400" />
          <span>Work Experience</span>
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "skills"
              ? "border-white text-white font-semibold"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Cpu className="w-4 h-4 text-neutral-400" />
          <span>Systems & Skills</span>
        </button>
        <button
          onClick={() => setActiveTab("global")}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "global"
              ? "border-white text-white font-semibold"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Globe2 className="w-4 h-4 text-neutral-400" />
          <span>Global Background & Education</span>
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "contact"
              ? "border-white text-white font-semibold"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <UserCheck className="w-4 h-4 text-neutral-400" />
          <span>Contact & Reference</span>
        </button>
      </div>

      {/* TAB 1: Work Experience */}
      {activeTab === "experience" && (
        <div className="space-y-6">
          {cvData.experiences.map((exp: ExperienceItem) => {
            const isExpanded = expandedExp === exp.id;
            return (
              <div
                key={exp.id}
                className="border border-neutral-800/80 bg-neutral-900/40 rounded-lg p-5 sm:p-6 transition-all hover:border-neutral-700/80"
              >
                <div
                  className="flex items-start justify-between cursor-pointer gap-4"
                  onClick={() => setExpandedExp(isExpanded ? "" : exp.id)}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400 font-mono">
                      <span>{exp.period}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-300 font-sans font-medium">{exp.company}</span>
                      {exp.status && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-neutral-400 italic font-sans">{exp.status}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-serif text-white tracking-tight">
                      {exp.role}
                    </h3>
                  </div>

                  <button
                    className="p-1 text-neutral-400 hover:text-white"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
                  {exp.description}
                </p>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-neutral-800/80 space-y-3">
                    <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                      Key Technical Contributions
                    </div>
                    <ul className="space-y-2 text-sm text-neutral-300">
                      {exp.keyHighlights.map((hl, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-neutral-500 font-mono text-xs mt-1">0{idx + 1}.</span>
                          <span className="leading-relaxed">{hl}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-3 flex items-center justify-end">
                      <button
                        onClick={() =>
                          onAskQuestion(
                            `Tell me more about Maan's experience with ${exp.role} at ${exp.company}.`
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Ask Supermaan about this role</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Systems & Skills */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          <div className="border border-neutral-800/80 bg-neutral-900/40 rounded-lg p-5 sm:p-6 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              <span>Foundation & Origin</span>
            </div>
            <p className="text-sm text-neutral-200 leading-relaxed font-sans">
              Maan developed an early fascination with computing hardware and architecture, beginning to construct custom PCs at age 13. This hands-on foundation directly spurred self-directed mastery of Debian-based Linux kernels, custom OS prototyping, penetration testing routines, and low-level code comprehension.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cvData.skills.map((cat: SkillCategory, idx: number) => (
              <div
                key={idx}
                className="border border-neutral-800/80 bg-neutral-900/40 rounded-lg p-5 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-serif font-medium text-white pb-3 border-b border-neutral-800/80 mb-4 tracking-wide">
                    {cat.category}
                  </h4>
                  <div className="space-y-3">
                    {cat.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-neutral-200 font-medium">
                            {item.name}
                          </span>
                          <span className="text-neutral-400 font-sans">
                            {item.level}
                          </span>
                        </div>
                        {item.note && (
                          <div className="text-neutral-400 text-[11px] mt-0.5 leading-tight">
                            {item.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-800/80">
                  <button
                    onClick={() =>
                      onAskQuestion(
                        `How does Maan apply his knowledge of ${cat.category} in practical technical scenarios?`
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inquire with Supermaan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Global Background & Education */}
      {activeTab === "global" && (
        <div className="space-y-6">
          <div className="border border-neutral-800/80 bg-neutral-900/40 rounded-lg p-6">
            <h3 className="text-xl font-serif text-white mb-2">
              International Agility across 7 Nations
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed mb-5">
              Having lived across multiple continents during his formative years, Maan possesses an innate intercultural fluency, calm adaptability under shifting operational environments, and natural rapport with globally distributed teams.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {cvData.countriesLived.map((country, idx) => (
                <div
                  key={idx}
                  className="border border-neutral-800 bg-neutral-950/60 rounded p-3 text-center"
                >
                  <span className="text-xs font-mono text-neutral-400 block mb-0.5">
                    Territory 0{idx + 1}
                  </span>
                  <span className="text-sm font-serif text-white font-medium">
                    {country}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-neutral-800/80 bg-neutral-900/40 rounded-lg p-6">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Formal Education
            </div>
            <h3 className="text-xl font-serif text-white">
              {cvData.education.degree}
            </h3>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mt-1 mb-3">
              <span>{cvData.education.institution}</span>
              <span aria-hidden="true">·</span>
              <span>Studied in Canada, Qatar, UAE, Egypt & Spain</span>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {cvData.education.description}
            </p>

            <div className="mt-4 pt-4 border-t border-neutral-800/80 flex justify-end">
              <button
                onClick={() =>
                  onAskQuestion(
                    "How does Maan's international background and economics education complement his technical skills?"
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Supermaan about global adaptability</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Contact & Reference */}
      {activeTab === "contact" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-neutral-800/80 bg-neutral-900/40 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-serif text-white mb-1">
              Direct Contact Channels
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Open to technical consultations, full-time systems roles, and specialized cybersecurity engagements.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <Mail className="w-4 h-4 text-neutral-400" />
                <a
                  href={`mailto:${cvData.email}`}
                  className="font-mono text-sky-400 hover:underline hover:text-sky-300 text-xs sm:text-sm"
                >
                  {cvData.email}
                </a>
              </div>

              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <Phone className="w-4 h-4 text-neutral-400" />
                <a
                  href={`tel:${cvData.phone.replace(/\s+/g, "")}`}
                  className="font-mono text-neutral-300 hover:text-white text-xs sm:text-sm"
                >
                  {cvData.phone}
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800/80">
              <button
                onClick={() =>
                  onAskQuestion(
                    "How can I set up an interview with Maan Ronhaar, and what is his availability?"
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Supermaan to arrange an introduction</span>
              </button>
            </div>
          </div>

          <div className="border border-neutral-800/80 bg-neutral-900/40 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-serif text-white mb-1">
              Verified Professional Reference
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Direct managerial verification from Zimi Home European operations.
            </p>

            <div className="bg-neutral-950/80 border border-neutral-800 rounded p-4 space-y-2">
              <div className="text-xs font-mono text-neutral-400">
                Former Boss & Collaboration Lead (Zimi Home):
              </div>
              <div className="font-mono text-sm text-sky-400 font-semibold">
                {cvData.reference.contact}
              </div>
              <div className="text-xs text-neutral-400">
                {cvData.reference.details}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenPdfModal}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Examine Original Curriculum Vitae (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
