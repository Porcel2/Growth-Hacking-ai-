export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  status?: string;
  description: string;
  keyHighlights: string[];
}

export interface SkillCategory {
  category: string;
  items: { name: string; level: string; note?: string }[];
}

export interface CvData {
  name: string;
  assistantName: string;
  tagline: string;
  summary: string;
  age: number;
  email: string;
  phone: string;
  countriesLived: string[];
  reference: {
    contact: string;
    details: string;
  };
  objective: string;
  experiences: ExperienceItem[];
  skills: SkillCategory[];
  education: {
    degree: string;
    institution: string;
    countriesStudied: string[];
    description: string;
  };
  pdfUrl: string;
  curatedQuestions: {
    category: string;
    questions: string[];
  }[];
}

export const cvData: CvData = {
  name: "Maan Ronhaar",
  assistantName: "Supermaan",
  tagline: "Systems Engineer · Linux & Cybersecurity Specialist",
  summary:
    "20-year-old self-taught systems specialist with deep hands-on expertise in Debian-based Linux environments, network penetration testing, and custom operating system engineering. Raised across 7 countries, bringing acute adaptability, calm discipline, and low-level computational understanding to modern infrastructure.",
  age: 20,
  email: "maan.ronhaar7014@gmail.com",
  phone: "+34 683 38 52 53",
  countriesLived: [
    "Syria",
    "Nigeria",
    "Canada",
    "Qatar",
    "United Arab Emirates",
    "Egypt",
    "Spain",
  ],
  reference: {
    contact: "+381 63 277449",
    details: "Former boss collaborated with at Zimi Home on international expansion.",
  },
  objective:
    "To explore systems engineering, cybersecurity, and IT infrastructure opportunities where I can apply low-level Linux expertise, solve non-trivial computing challenges, and continuously advance technical capability.",
  experiences: [
    {
      id: "exp-1",
      role: "Founder & IT Security Specialist",
      company: "Independent IT Support & Cybersecurity Business",
      period: "2019 — 2023",
      description:
        "Founded and operated an independent IT support and cybersecurity practice delivering technical infrastructure, point-of-sale systems, and defensive security hardening for commercial clients.",
      keyHighlights: [
        "Server stress testing and network penetration assessments to identify security vulnerabilities.",
        "Deployment and network integration of AI-assisted security surveillance camera systems.",
        "Configuration and maintenance of retail cash registers and POS payment terminal networks.",
        "Debian and Ubuntu server provisioning, firewall management, and ongoing uptime maintenance.",
      ],
    },
    {
      id: "exp-2",
      role: "IT Support & International Operations Lead",
      company: "Zimi Home",
      period: "2023 — 2024",
      status: "Company sold — collaboration concluded",
      description:
        "Aided Zimi Home in expanding technical and business operations internationally from Norway and Serbia directly into Spain.",
      keyHighlights: [
        "Coordinated multi-region technical rollout across Norway, Serbia, and Spanish territories.",
        "Troubleshot network communications, localized systems setup, and vendor technical integrations.",
        "Collaborated directly with corporate leadership and former manager (+381 63 277449).",
      ],
    },
  ],
  skills: [
    {
      category: "Operating Systems & Kernels",
      items: [
        { name: "Debian Linux", level: "Advanced", note: "Server provisioning, packaging, administration" },
        { name: "Kali Linux", level: "Fluent", note: "Penetration testing, network audits, exploit validation" },
        { name: "Ubuntu Server", level: "Fluent", note: "Production hosting, daemon management, systemd" },
        { name: "Custom OS Building", level: "Intermediate", note: "Self-taught kernel & bootloader architectures" },
      ],
    },
    {
      category: "Programming & Scripting",
      items: [
        { name: "Python", level: "Fluent", note: "Automation, security tooling, scripting" },
        { name: "Bash", level: "Fluent", note: "Shell scripting, system administration, pipe pipelines" },
        { name: "HTML / Web", level: "Fluent", note: "Semantic structure, web services, interfaces" },
        { name: "C++", level: "Intermediate", note: "Systems programming, performance-critical code" },
        { name: "Assembly", level: "Basic", note: "x86/low-level register understanding" },
        { name: "Ruby", level: "Basic", note: "Scripting and utility maintenance" },
      ],
    },
    {
      category: "Infrastructure & Hardware",
      items: [
        { name: "PC Hardware Engineering", level: "Mastery", note: "Building custom PCs from bare components since age 13" },
        { name: "Network Penetration", level: "Proficient", note: "Stress testing, port audits, network analysis" },
        { name: "AI Vision Systems", level: "Proficient", note: "Integrating edge cameras with AI detection software" },
      ],
    },
  ],
  education: {
    degree: "A-Level Degree in Business and Economics",
    institution: "The Lady Elizabeth School",
    countriesStudied: ["Canada", "Qatar", "UAE", "Egypt", "Spain"],
    description:
      "Comprehensive British curriculum A-Level studies focused on Economics and Business principles, complemented by an international academic progression across North America, the Middle East, and Europe.",
  },
  pdfUrl: "/assets/aistudio/Circulam_Vita_9d8f641b.pdf",
  curatedQuestions: [
    {
      category: "Technical Capabilities",
      questions: [
        "Tell me about your experience with Kali Linux and network penetration testing.",
        "How do you build custom operating systems from scratch?",
        "What programming languages are you most proficient in?",
      ],
    },
    {
      category: "Experience & Background",
      questions: [
        "What did you build and manage at Zimi Home during their European expansion?",
        "How does living in 7 countries influence your engineering and communication style?",
        "What kind of IT systems or cybersecurity role are you looking for next?",
      ],
    },
  ],
};
