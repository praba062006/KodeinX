import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Users,
  FolderKanban,
  Shield,
  ShieldCheck,
  Lock,
  UserPlus,
  Edit3,
  LogOut,
  ExternalLink,
  Trash2,
  FolderPlus,
} from "lucide-react";

// Inline SVG icons for LinkedIn and GitHub (lucide-react doesn't export these)
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);


import {
  fetchMembers,
  saveMember,
  deleteMember,
  fetchProjects,
  saveProject,
  deleteProject,
  saveContactMessage,
  saveDirectMessage,
  updatePresence,
} from "./firebaseApi";

export interface CertificateItem {
  title: string;
  issuer: string;
  url: string;
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: string;
  linkedin: string;
  github?: string;
  photo: string;
  bio?: string;
  skills?: string[];
  certificates?: CertificateItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: "IoT" | "AI" | "Website" | string;
  description: string;
  techStack: string[];
  demoUrl: string;
  githubUrl: string;
  image: string;
}

export interface AuthSession {
  type: "admin" | "member";
  memberId?: string;
  name: string;
  email: string;
  avatar: string;
  role?: string;
}

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: "mem-1",
    email: "arun.kodeinx@gmail.com",
    name: "Arun Prakash",
    role: "Lead AI & Embedded IoT Architect",
    linkedin: "https://linkedin.com/in/arunprakash",
    github: "https://github.com",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=350&auto=format&fit=crop&q=80",
    bio: "Designing edge AI pipelines for IoT microcontrollers, neural inferencing, and cloud telemetry.",
    skills: ["ESP32 IoT", "Python", "PyTorch", "C++", "MQTT"],
    certificates: [{ title: "NVIDIA Certified Edge AI Specialist", issuer: "NVIDIA", url: "https://nvidia.com" }],
  },
  {
    id: "mem-2",
    email: "pooja.kodeinx@gmail.com",
    name: "Pooja Sharma",
    role: "UI/UX & Web Systems Designer",
    linkedin: "https://linkedin.com/in/poojasharma",
    github: "https://github.com",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=350&auto=format&fit=crop&q=80",
    bio: "Specializing in IoT device monitoring dashboards, modern design systems, and responsive websites.",
    skills: ["Figma", "React", "Tailwind CSS", "Design Systems"],
    certificates: [{ title: "Google UX Design Professional", issuer: "Google", url: "https://coursera.org" }],
  },
  {
    id: "mem-3",
    email: "karthik.kodeinx@gmail.com",
    name: "Karthik Raja",
    role: "Full-Stack Web & Real-Time IoT Cloud Engineer",
    linkedin: "https://linkedin.com/in/karthikraja",
    github: "https://github.com",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=350&auto=format&fit=crop&q=80",
    bio: "Engineering WebSockets telemetry, Next.js web applications, and high-performance cloud APIs.",
    skills: ["Next.js", "Node.js", "WebSockets", "TimescaleDB", "Docker"],
    certificates: [{ title: "AWS Certified Cloud Developer", issuer: "Amazon Web Services", url: "https://aws.amazon.com" }],
  },
];

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    title: "SmartSensor IoT Telemetry Grid",
    category: "IoT",
    description: "Industrial IoT platform collecting sensor metrics from remote microcontrollers over MQTT with real-time anomaly alerts.",
    techStack: ["ESP32", "MQTT", "Node.js", "TimescaleDB", "React"],
    demoUrl: "https://demo.kodeinx.dev/iot-grid",
    githubUrl: "https://github.com/kodeinx/iot-grid",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "proj-2",
    title: "KodeinVision Neural AI Scanner",
    category: "AI",
    description: "Computer vision and deep learning model analyzing video feeds in real-time for automated defect detection and classification.",
    techStack: ["PyTorch", "OpenCV", "FastAPI", "Next.js", "CUDA"],
    demoUrl: "https://demo.kodeinx.dev/vision-ai",
    githubUrl: "https://github.com/kodeinx/vision-ai",
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "proj-3",
    title: "NextGen Enterprise Cloud Website",
    category: "Website",
    description: "High-performance marketing & client portal with 100/100 Lighthouse performance, headless CMS, and customer analytics.",
    techStack: ["Next.js 15", "Tailwind CSS", "TypeScript", "Vercel"],
    demoUrl: "https://demo.kodeinx.dev/cloud-web",
    githubUrl: "https://github.com/kodeinx/cloud-web",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80",
  },
];

export const TeamProfileApp: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"home" | "team" | "projects" | "achievements" | "contact" | "admin_dashboard">("home");
  const [projectFilter, setProjectFilter] = useState("All");

  const [session, setSession] = useState<AuthSession | null>(() => {
    const saved = localStorage.getItem("kodeinx_session");
    return saved ? JSON.parse(saved) : null;
  });

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showMemberSignInModal, setShowMemberSignInModal] = useState(false);
  const [showMyProfileModal, setShowMyProfileModal] = useState(false);
  const [adminInputPassword, setAdminInputPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const [adminMemberForm, setAdminMemberForm] = useState({ name: "", email: "", role: "Software Engineer" });
  const [adminProjectForm, setAdminProjectForm] = useState({
    title: "", category: "IoT", description: "", techStack: "", demoUrl: "", githubUrl: "", image: "",
  });
  const [memberProfileForm, setMemberProfileForm] = useState({
    name: "", role: "", linkedin: "", github: "", photo: "", bio: "", skillsString: "",
    certTitle: "", certIssuer: "", certUrl: "",
  });

  // ── Load from Firebase on mount ──────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [fbMembers, fbProjects] = await Promise.all([fetchMembers(), fetchProjects()]);
        setMembers(fbMembers.length > 0 ? fbMembers : INITIAL_MEMBERS);
        setProjects(fbProjects.length > 0 ? fbProjects : INITIAL_PROJECTS);
      } catch (e) {
        console.warn("Firebase load failed, using defaults:", e);
        setMembers(INITIAL_MEMBERS);
        setProjects(INITIAL_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (session) localStorage.setItem("kodeinx_session", JSON.stringify(session));
    else localStorage.removeItem("kodeinx_session");
  }, [session]);

  const isAdmin = session?.type === "admin";
  const isMember = session?.type === "member";

  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    if (adminInputPassword === "Praba@06200620") {
      setSession({ type: "admin", name: "KodeinX Administrator", email: "admin@kodeinx.com", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin" });
      setShowAdminModal(false);
      setAdminInputPassword("");
      setCurrentView("admin_dashboard");
    } else {
      setAdminError("Invalid Admin Password!");
    }
  };

  const verifyAndLoginMember = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const matched = members.find((m) => m.email.toLowerCase() === cleanEmail);
    if (!matched) {
      alert(`Access Restricted:\nYour account (${cleanEmail}) is not in the KodeinX roster.\n\nOnly the Admin can add new members in the Admin Dashboard!`);
      return;
    }
    const newSession: AuthSession = {
      type: "member", memberId: matched.id, email: cleanEmail,
      name: matched.name, avatar: matched.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(matched.name)}`,
      role: matched.role,
    };
    setSession(newSession);
    setShowMemberSignInModal(false);
    loadMemberDataForEdit(matched);
  };

  const loadMemberDataForEdit = (m: TeamMember) => {
    setMemberProfileForm({
      name: m.name, role: m.role || "Software Engineer", linkedin: m.linkedin || "",
      github: m.github || "", photo: m.photo || "", bio: m.bio || "",
      skillsString: m.skills ? m.skills.join(", ") : "",
      certTitle: "", certIssuer: "", certUrl: "",
    });
  };

  const handleSaveMyProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMember || !session?.memberId) return;
    const skillsArr = memberProfileForm.skillsString
      ? memberProfileForm.skillsString.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const currentMember = members.find((m) => m.id === session.memberId);
    if (!currentMember) return;
    let updatedCerts = currentMember.certificates || [];
    if (memberProfileForm.certTitle.trim()) {
      updatedCerts = [...updatedCerts, { title: memberProfileForm.certTitle.trim(), issuer: memberProfileForm.certIssuer.trim() || "Certified Authority", url: memberProfileForm.certUrl.trim() || "#" }];
    }
    const updatedMember: TeamMember = {
      ...currentMember,
      name: memberProfileForm.name.trim() || currentMember.name,
      role: memberProfileForm.role.trim() || currentMember.role,
      linkedin: memberProfileForm.linkedin.trim() || "https://linkedin.com",
      github: memberProfileForm.github.trim() || "https://github.com",
      photo: memberProfileForm.photo || currentMember.photo,
      bio: memberProfileForm.bio.trim() || currentMember.bio,
      skills: skillsArr.length > 0 ? skillsArr : currentMember.skills,
      certificates: updatedCerts,
    };
    await saveMember(updatedMember);
    setMembers((prev) => prev.map((m) => m.id === updatedMember.id ? updatedMember : m));
    setSession((prev) => prev ? { ...prev, name: updatedMember.name, avatar: updatedMember.photo, role: updatedMember.role } : null);
    setShowMyProfileModal(false);
    alert("Profile updated & saved to Firebase!");
  };

  const handleAdminAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!adminMemberForm.name.trim() || !adminMemberForm.email.trim()) {
      alert("Please provide Member Name and Google Email!");
      return;
    }
    const newMember: TeamMember = {
      id: "mem-" + Date.now(),
      name: adminMemberForm.name.trim(),
      email: adminMemberForm.email.trim().toLowerCase(),
      role: adminMemberForm.role.trim() || "Software Engineer",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      photo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(adminMemberForm.name)}`,
      bio: "Core contributor at KodeinX.",
      skills: ["IoT", "AI", "Web"],
      certificates: [],
    };
    await saveMember(newMember);
    setMembers((prev) => [newMember, ...prev]);
    setAdminMemberForm({ name: "", email: "", role: "Software Engineer" });
    alert(`Member ${newMember.name} added & saved to Firebase!`);
  };

  const handleAdminAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    const newProject: ProjectItem = {
      id: "proj-" + Date.now(),
      title: adminProjectForm.title.trim(),
      category: adminProjectForm.category,
      description: adminProjectForm.description.trim(),
      techStack: adminProjectForm.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      demoUrl: adminProjectForm.demoUrl.trim() || "#",
      githubUrl: adminProjectForm.githubUrl.trim() || "#",
      image: adminProjectForm.image.trim() || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80",
    };
    await saveProject(newProject);
    setProjects((prev) => [newProject, ...prev]);
    setAdminProjectForm({ title: "", category: "IoT", description: "", techStack: "", demoUrl: "", githubUrl: "", image: "" });
    alert(`Project "${newProject.title}" added & saved to Firebase!`);
  };

  const handleDeleteMember = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this member?")) return;
    await deleteMember(id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleDeleteProject = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this project?")) return;
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const myMemberData = isMember ? members.find((m) => m.id === session?.memberId) : null;
  const filteredProjects = projects.filter((p) => projectFilter === "All" || p.category.toLowerCase().includes(projectFilter.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070913]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Loading KodeinX Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070913] text-slate-100 font-sans antialiased">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#070913]/90 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div onClick={() => setCurrentView("home")} className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition">
              <span className="font-mono font-bold text-white text-base">&lt;/&gt;</span>
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-white tracking-tight leading-tight">
                Kodein<span className="text-indigo-400">X</span>
              </h1>
              <p className="text-[11px] text-indigo-300/80 font-medium">IoT • AI • Web Hub</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center bg-[#0e122b]/90 border border-slate-800/90 rounded-full p-1 shadow-inner">
            {(["home", "team", "projects", "achievements", "contact"] as const).map((tab) => (
              <button key={tab} onClick={() => setCurrentView(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${currentView === tab ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}>
                {tab}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            {isMember ? (
              <div className="flex items-center space-x-2">
                <button onClick={() => { if (myMemberData) loadMemberDataForEdit(myMemberData); setShowMyProfileModal(true); }}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold shadow-lg transition flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" /><span>Develop Profile</span>
                </button>
                <button onClick={() => { setSession(null); setCurrentView("home"); }} className="p-2 text-slate-400 hover:text-rose-400 transition" title="Sign Out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowMemberSignInModal(true)}
                className="px-5 py-2 rounded-full bg-[#5b51ef] hover:bg-[#4f43ec] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02]">
                Member Sign In
              </button>
            )}
            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <button onClick={() => setCurrentView("admin_dashboard")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${currentView === "admin_dashboard" ? "bg-amber-500 text-slate-950 border-amber-400" : "bg-slate-900 text-amber-400 border-amber-500/30"}`}>
                  👑 Admin Dashboard
                </button>
                <button onClick={() => { setSession(null); setCurrentView("home"); }} className="p-1.5 text-slate-400 hover:text-rose-400 transition">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => { setAdminError(""); setShowAdminModal(true); }}
                className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white px-2 py-1.5 transition">
                <Shield className="w-4 h-4 text-indigo-400" /><span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HOME VIEW */}
      {currentView === "home" && (
        <main className="flex-1 pb-24 text-center">
          <section className="relative pt-16 pb-20 overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11142e] border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>KodeinX Technology Innovation Hub •</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
                Building Ideas.<br />
                <span className="bg-gradient-to-r from-[#6b62ff] via-[#8c5af7] to-[#e476fb] bg-clip-text text-transparent">
                  Creating Measurable Impact.
                </span>
              </h1>
              <p className="mt-6 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                We are a technology team dedicated to building <strong>Embedded IoT systems</strong>, <strong>Artificial Intelligence (AI) models</strong>, and <strong>High-Performance Websites</strong>.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <button onClick={() => setCurrentView("team")}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center gap-2">
                  <Users className="w-4 h-4" /><span>Explore Our Team</span><span>→</span>
                </button>
                <button onClick={() => setCurrentView("projects")}
                  className="px-6 py-3.5 rounded-2xl bg-[#0f132e] hover:bg-[#161c42] text-slate-200 border border-slate-800 font-bold text-sm transition flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-indigo-400" /><span>View IoT, AI & Web Projects</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* TEAM VIEW */}
      {currentView === "team" && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white">Our Team</h2>
            <p className="text-slate-400 text-sm mt-1">Meet the innovators behind KodeinX.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member.id} className="bg-[#0c102a] border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-indigo-500/40 transition">
                <div className="flex items-center gap-4 mb-4">
                  <img src={member.photo} alt={member.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/30" />
                  <div>
                    <h3 className="font-bold text-white text-sm">{member.name}</h3>
                    <p className="text-indigo-300 text-xs">{member.role}</p>
                  </div>
                </div>
                {member.bio && <p className="text-slate-400 text-xs mb-4 leading-relaxed">{member.bio}</p>}
                {member.skills && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {member.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] rounded-full">{skill}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0077b5] text-white text-[10px] font-bold">
                    <LinkedinIcon className="w-3 h-3" /> LinkedIn
                  </a>
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-[10px] font-bold">
                      <GithubIcon className="w-3 h-3" /> GitHub
                    </a>
                  )}
                  {isAdmin && (
                    <button onClick={() => handleDeleteMember(member.id)} className="ml-auto text-rose-400 hover:text-rose-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* PROJECTS VIEW */}
      {currentView === "projects" && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-white">Our Projects</h2>
              <p className="text-slate-400 text-sm mt-1">IoT, AI & Web innovations by KodeinX.</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "IoT", "AI", "Website"].map((f) => (
                <button key={f} onClick={() => setProjectFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition border ${projectFilter === f ? "bg-indigo-600 text-white border-indigo-500" : "border-slate-700 text-slate-400 hover:text-white"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-[#0c102a] border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-indigo-500/40 transition">
                <img src={project.image} alt={project.title} className="w-full h-40 object-cover" />
                <div className="p-5">
                  <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] rounded-full">{project.category}</span>
                  <h3 className="font-bold text-white text-sm mt-2 mb-1">{project.title}</h3>
                  <p className="text-slate-400 text-xs mb-3 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.techStack.slice(0, 4).map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded-full">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-bold">
                      <ExternalLink className="w-3 h-3" /> Demo
                    </a>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-[10px] font-bold">
                      <GithubIcon className="w-3 h-3" /> GitHub
                    </a>
                    {isAdmin && (
                      <button onClick={() => handleDeleteProject(project.id)} className="ml-auto text-rose-400 hover:text-rose-300 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ADMIN DASHBOARD */}
      {currentView === "admin_dashboard" && isAdmin && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /><span>Admin Central Control Room</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">KodeinX Admin Dashboard</h2>
              <p className="text-xs text-slate-400 mt-1">Add Team Members and manage IoT, AI & Website projects exclusively here.</p>
            </div>
            <button onClick={() => setCurrentView("home")}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition">
              Return to Public View
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Add Member Form */}
            <div className="bg-[#0c102a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <UserPlus className="w-5 h-5 text-indigo-400" /> Add Team Member
              </h3>
              <form onSubmit={handleAdminAddMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name *</label>
                  <input type="text" required placeholder="e.g. Anand Kumar" value={adminMemberForm.name}
                    onChange={(e) => setAdminMemberForm({ ...adminMemberForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Google Email *</label>
                  <input type="email" required placeholder="e.g. anand@gmail.com" value={adminMemberForm.email}
                    onChange={(e) => setAdminMemberForm({ ...adminMemberForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition">
                  Add & Register Member → Firebase
                </button>
              </form>
            </div>
            {/* Add Project Form */}
            <div className="bg-[#0c102a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <FolderPlus className="w-5 h-5 text-indigo-400" /> Add Project
              </h3>
              <form onSubmit={handleAdminAddProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Project Title *</label>
                  <input type="text" required value={adminProjectForm.title}
                    onChange={(e) => setAdminProjectForm({ ...adminProjectForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
                  <select value={adminProjectForm.category}
                    onChange={(e) => setAdminProjectForm({ ...adminProjectForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500">
                    <option>IoT</option><option>AI</option><option>Website</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description *</label>
                  <textarea required rows={3} value={adminProjectForm.description}
                    onChange={(e) => setAdminProjectForm({ ...adminProjectForm, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Tech Stack (comma separated)</label>
                  <input type="text" placeholder="React, Node.js, Firebase" value={adminProjectForm.techStack}
                    onChange={(e) => setAdminProjectForm({ ...adminProjectForm, techStack: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition">
                  Add Project → Firebase
                </button>
              </form>
            </div>
          </div>
        </main>
      )}

      {/* ADMIN SIGN IN MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0c102a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative text-center">
            <button onClick={() => setShowAdminModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">✕</button>
            <Lock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h3 className="text-xl font-black text-white">KodeinX Admin</h3>
            {adminError && <p className="text-xs text-rose-400 mt-2">{adminError}</p>}
            <form onSubmit={handleAdminSignIn} className="space-y-3 mt-4">
              <input type="password" required placeholder="Enter Admin Password" value={adminInputPassword}
                onChange={(e) => setAdminInputPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition">
                Open Admin Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MEMBER SIGN IN MODAL */}
      {showMemberSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0c102a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center">
            <button onClick={() => setShowMemberSignInModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">✕</button>
            <h3 className="text-2xl font-black text-white">Member Sign In</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">Enter your invited Google email to develop your profile:</p>
            <form onSubmit={(e: any) => { e.preventDefault(); verifyAndLoginMember(e.target.elements.memberEmail.value); }}>
              <input name="memberEmail" type="email" required placeholder="e.g. arun.kodeinx@gmail.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 mb-2" />
              <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition">
                Verify & Open Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MEMBER PROFILE EDIT MODAL */}
      {showMyProfileModal && isMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0c102a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button onClick={() => setShowMyProfileModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">✕</button>
            <h3 className="text-xl font-bold text-white mb-4">Develop Your Profile</h3>
            <form onSubmit={handleSaveMyProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Your Role *</label>
                <input type="text" required value={memberProfileForm.role}
                  onChange={(e) => setMemberProfileForm({ ...memberProfileForm, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">LinkedIn URL *</label>
                <input type="url" required value={memberProfileForm.linkedin}
                  onChange={(e) => setMemberProfileForm({ ...memberProfileForm, linkedin: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Special Skills (comma separated)</label>
                <input type="text" value={memberProfileForm.skillsString}
                  onChange={(e) => setMemberProfileForm({ ...memberProfileForm, skillsString: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Bio</label>
                <textarea rows={3} value={memberProfileForm.bio}
                  onChange={(e) => setMemberProfileForm({ ...memberProfileForm, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition">
                Save & Update Live Profile → Firebase
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamProfileApp;
