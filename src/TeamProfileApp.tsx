import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Users,
  FolderKanban,
  Award,
  Sun,
  Shield,
  ShieldCheck,
  Lock,
  PlusCircle,
  UserPlus,
  Edit3,
  LogOut,
  Linkedin,
  Github,
  ExternalLink,
  Trash2,
  FolderPlus,
  Zap,
  Cpu,
  Globe,
} from "lucide-react";

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
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=350&auto=format&fit=crop&q=80",
    bio: "Designing edge AI pipelines for IoT microcontrollers, neural inferencing, and cloud telemetry.",
    skills: ["ESP32 IoT", "Python", "PyTorch", "C++", "MQTT"],
    certificates: [
      {
        title: "NVIDIA Certified Edge AI Specialist",
        issuer: "NVIDIA",
        url: "https://nvidia.com",
      },
    ],
  },
  {
    id: "mem-2",
    email: "pooja.kodeinx@gmail.com",
    name: "Pooja Sharma",
    role: "UI/UX & Web Systems Designer",
    linkedin: "https://linkedin.com/in/poojasharma",
    github: "https://github.com",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=350&auto=format&fit=crop&q=80",
    bio: "Specializing in IoT device monitoring dashboards, modern design systems, and responsive websites.",
    skills: ["Figma", "React", "Tailwind CSS", "Design Systems"],
    certificates: [
      {
        title: "Google UX Design Professional",
        issuer: "Google",
        url: "https://coursera.org",
      },
    ],
  },
  {
    id: "mem-3",
    email: "karthik.kodeinx@gmail.com",
    name: "Karthik Raja",
    role: "Full-Stack Web & Real-Time IoT Cloud Engineer",
    linkedin: "https://linkedin.com/in/karthikraja",
    github: "https://github.com",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=350&auto=format&fit=crop&q=80",
    bio: "Engineering WebSockets telemetry, Next.js web applications, and high-performance cloud APIs.",
    skills: ["Next.js", "Node.js", "WebSockets", "TimescaleDB", "Docker"],
    certificates: [
      {
        title: "AWS Certified Cloud Developer",
        issuer: "Amazon Web Services",
        url: "https://aws.amazon.com",
      },
    ],
  },
];

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    title: "SmartSensor IoT Telemetry Grid",
    category: "IoT",
    description:
      "Industrial IoT platform collecting sensor metrics from remote microcontrollers over MQTT with real-time anomaly alerts.",
    techStack: ["ESP32", "MQTT", "Node.js", "TimescaleDB", "React"],
    demoUrl: "https://demo.kodeinx.dev/iot-grid",
    githubUrl: "https://github.com/kodeinx/iot-grid",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "proj-2",
    title: "KodeinVision Neural AI Scanner",
    category: "AI",
    description:
      "Computer vision and deep learning model analyzing video feeds in real-time for automated defect detection and classification.",
    techStack: ["PyTorch", "OpenCV", "FastAPI", "Next.js", "CUDA"],
    demoUrl: "https://demo.kodeinx.dev/vision-ai",
    githubUrl: "https://github.com/kodeinx/vision-ai",
    image:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "proj-3",
    title: "NextGen Enterprise Cloud Website",
    category: "Website",
    description:
      "High-performance marketing & client portal with 100/100 Lighthouse performance, headless CMS, and customer analytics.",
    techStack: ["Next.js 15", "Tailwind CSS", "TypeScript", "Vercel"],
    demoUrl: "https://demo.kodeinx.dev/cloud-web",
    githubUrl: "https://github.com/kodeinx/cloud-web",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80",
  },
];

export const TeamProfileApp: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem("kodeinx_members");
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem("kodeinx_projects");
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [currentView, setCurrentView] = useState<
    "home" | "team" | "projects" | "achievements" | "contact" | "admin_dashboard"
  >("home");
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

  const [adminMemberForm, setAdminMemberForm] = useState({
    name: "",
    email: "",
    role: "Software Engineer",
  });

  const [adminProjectForm, setAdminProjectForm] = useState({
    title: "",
    category: "IoT",
    description: "",
    techStack: "",
    demoUrl: "",
    githubUrl: "",
    image: "",
  });

  const [memberProfileForm, setMemberProfileForm] = useState({
    name: "",
    role: "",
    linkedin: "",
    github: "",
    photo: "",
    bio: "",
    skillsString: "",
    certTitle: "",
    certIssuer: "",
    certUrl: "",
  });

  useEffect(() => {
    localStorage.setItem("kodeinx_members", JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem("kodeinx_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (session) {
      localStorage.setItem("kodeinx_session", JSON.stringify(session));
    } else {
      localStorage.removeItem("kodeinx_session");
    }
  }, [session]);

  const isAdmin = session?.type === "admin";
  const isMember = session?.type === "member";

  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    if (adminInputPassword === "Praba@06200620") {
      setSession({
        type: "admin",
        name: "KodeinX Administrator",
        email: "admin@kodeinx.com",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin",
      });
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
      alert(
        `Access Restricted:\nYour account (${cleanEmail}) is not in the KodeinX roster.\n\nOnly the Admin can add new members in the Admin Dashboard!`
      );
      return;
    }

    const newSession: AuthSession = {
      type: "member",
      memberId: matched.id,
      email: cleanEmail,
      name: matched.name,
      avatar:
        matched.photo ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          matched.name
        )}`,
      role: matched.role,
    };

    setSession(newSession);
    setShowMemberSignInModal(false);
    loadMemberDataForEdit(matched);
  };

  const loadMemberDataForEdit = (m: TeamMember) => {
    setMemberProfileForm({
      name: m.name,
      role: m.role || "Software Engineer",
      linkedin: m.linkedin || "",
      github: m.github || "",
      photo: m.photo || "",
      bio: m.bio || "",
      skillsString: m.skills ? m.skills.join(", ") : "",
      certTitle: "",
      certIssuer: "",
      certUrl: "",
    });
  };

  const handleSaveMyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMember || !session?.memberId) return;

    const skillsArr = memberProfileForm.skillsString
      ? memberProfileForm.skillsString.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === session.memberId) {
          let updatedCerts = m.certificates || [];
          if (memberProfileForm.certTitle.trim()) {
            updatedCerts = [
              ...updatedCerts,
              {
                title: memberProfileForm.certTitle.trim(),
                issuer: memberProfileForm.certIssuer.trim() || "Certified Authority",
                url: memberProfileForm.certUrl.trim() || "#",
              },
            ];
          }

          return {
            ...m,
            name: memberProfileForm.name.trim() || m.name,
            role: memberProfileForm.role.trim() || m.role,
            linkedin: memberProfileForm.linkedin.trim() || "https://linkedin.com",
            github: memberProfileForm.github.trim() || "https://github.com",
            photo: memberProfileForm.photo || m.photo,
            bio: memberProfileForm.bio.trim() || m.bio,
            skills: skillsArr.length > 0 ? skillsArr : m.skills,
            certificates: updatedCerts,
          };
        }
        return m;
      })
    );

    setSession((prev) =>
      prev
        ? {
            ...prev,
            name: memberProfileForm.name.trim() || prev.name,
            avatar: memberProfileForm.photo || prev.avatar,
            role: memberProfileForm.role.trim() || prev.role,
          }
        : null
    );

    setShowMyProfileModal(false);
    alert("Profile updated successfully!");
  };

  const handleAdminAddMember = (e: React.FormEvent) => {
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
      photo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        adminMemberForm.name
      )}`,
      bio: "Core contributor at KodeinX.",
      skills: ["IoT", "AI", "Web"],
      certificates: [],
    };

    setMembers((prev) => [newMember, ...prev]);
    setAdminMemberForm({ name: "", email: "", role: "Software Engineer" });
    alert(`Member ${newMember.name} added! They can now sign in with their Google email.`);
  };

  const myMemberData = isMember ? members.find((m) => m.id === session?.memberId) : null;

  const filteredProjects = projects.filter((p) => {
    if (projectFilter === "All") return true;
    return p.category.toLowerCase().includes(projectFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#070913] text-slate-100 font-sans antialiased">
      {/* Navbar: No Add Member in Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#070913]/90 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            onClick={() => setCurrentView("home")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
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
              <button
                key={tab}
                onClick={() => setCurrentView(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                  currentView === tab
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <button className="text-amber-400/90 hover:text-amber-300 p-1.5 transition">
              <Sun className="w-5 h-5" />
            </button>

            {isMember ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (myMemberData) loadMemberDataForEdit(myMemberData);
                    setShowMyProfileModal(true);
                  }}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold shadow-lg transition flex items-center gap-1.5 animate-pulse"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Develop Profile</span>
                </button>
                <button
                  onClick={() => {
                    setSession(null);
                    setCurrentView("home");
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowMemberSignInModal(true)}
                className="px-5 py-2 rounded-full bg-[#5b51ef] hover:bg-[#4f43ec] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02]"
              >
                Member Sign In
              </button>
            )}

            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentView("admin_dashboard")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    currentView === "admin_dashboard"
                      ? "bg-amber-500 text-slate-950 border-amber-400"
                      : "bg-slate-900 text-amber-400 border-amber-500/30"
                  }`}
                >
                  👑 Admin Dashboard
                </button>
                <button
                  onClick={() => {
                    setSession(null);
                    setCurrentView("home");
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAdminError("");
                  setShowAdminModal(true);
                }}
                className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white px-2 py-1.5 transition"
              >
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Views */}
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
                <button
                  onClick={() => setCurrentView("team")}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Explore Our Team</span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => setCurrentView("projects")}
                  className="px-6 py-3.5 rounded-2xl bg-[#0f132e] hover:bg-[#161c42] text-slate-200 border border-slate-800 font-bold text-sm transition flex items-center gap-2"
                >
                  <FolderKanban className="w-4 h-4 text-indigo-400" />
                  <span>View IoT, AI & Web Projects</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Admin Dashboard */}
      {currentView === "admin_dashboard" && isAdmin && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Central Control Room</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">KodeinX Admin Dashboard</h2>
              <p className="text-xs text-slate-400 mt-1">
                Add Team Members and manage IoT, AI & Website projects exclusively here.
              </p>
            </div>

            <button
              onClick={() => setCurrentView("home")}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition"
            >
              Return to Public View
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Add Member form */}
            <div className="bg-[#0c102a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                Add Team Member (Admin Only)
              </h3>
              <form onSubmit={handleAdminAddMember} className="space-y-4 mt-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar"
                    value={adminMemberForm.name}
                    onChange={(e) => setAdminMemberForm({ ...adminMemberForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Member's Google Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. anand@gmail.com"
                    value={adminMemberForm.email}
                    onChange={(e) => setAdminMemberForm({ ...adminMemberForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition"
                >
                  Add & Register Member
                </button>
              </form>
            </div>
          </div>
        </main>
      )}

      {/* Admin Sign In Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0c102a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative text-center">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <Lock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h3 className="text-xl font-black text-white">KodeinX Admin</h3>
            {adminError && <p className="text-xs text-rose-400 mt-2">{adminError}</p>}
            <form onSubmit={handleAdminSignIn} className="space-y-3 mt-4">
              <input
                type="password"
                required
                placeholder="Enter Admin Password"
                value={adminInputPassword}
                onChange={(e) => setAdminInputPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition"
              >
                Open Admin Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Member Sign In Modal */}
      {showMemberSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0c102a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center">
            <button
              onClick={() => setShowMemberSignInModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-2xl font-black text-white">Member Sign In</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              Enter your invited Google email to develop your profile:
            </p>
            <form
              onSubmit={(e: any) => {
                e.preventDefault();
                verifyAndLoginMember(e.target.elements.memberEmail.value);
              }}
            >
              <input
                name="memberEmail"
                type="email"
                required
                placeholder="e.g. arun.kodeinx@gmail.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 mb-2"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
              >
                Verify & Open Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Member Profile Modal */}
      {showMyProfileModal && isMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0c102a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowMyProfileModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white mb-4">Develop Your Profile</h3>
            <form onSubmit={handleSaveMyProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Your Role at KodeinX (Set Your Own Role) *
                </label>
                <input
                  type="text"
                  required
                  value={memberProfileForm.role}
                  onChange={(e) =>
                    setMemberProfileForm({ ...memberProfileForm, role: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  LinkedIn URL *
                </label>
                <input
                  type="url"
                  required
                  value={memberProfileForm.linkedin}
                  onChange={(e) =>
                    setMemberProfileForm({ ...memberProfileForm, linkedin: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Special Skills
                </label>
                <input
                  type="text"
                  value={memberProfileForm.skillsString}
                  onChange={(e) =>
                    setMemberProfileForm({
                      ...memberProfileForm,
                      skillsString: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition"
              >
                Save & Update Live Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamProfileApp;
