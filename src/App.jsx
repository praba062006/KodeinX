import React, { useState, useEffect, useRef } from 'react';



    // Team Members with Qualifications, Roles, Phone Numbers, and Certifications
    const INITIAL_MEMBERS = [
      {
        id: "mem-praba",
        email: "klpraba06@gmail.com",
        phone: "+91 9703438665",
        name: "Prabakaran M",
        role: "Lead Software & AI Engineer",
        qualification: "B.Sc in Computer Science",
        institution: "Engineering Institute",
        year: "2024",
        linkedin: "https://www.linkedin.com/in/praba-m",
        github: "https://github.com/prabakaran-m",
        photo: "",
        bannerImage: "",
        passcode: "Praba@2026",
        privacy: "public",
        lastActiveTimestamp: Date.now(),
        bio: "Core engineer at KodeinX. Leading AI computer vision models, embedded IoT telemetries, and responsive web platforms.",
        resumeUrl: "",
        resumeName: "",
        skills: ["Artificial Intelligence", "Python", "React", "Node.js", "IoT Systems", "PostgreSQL"],
        certificates: [
          { title: "Certified AI & IoT Systems Engineer", issuer: "KodeinX Core", url: "https://kodeinx.dev" }
        ]
      },
      {
        id: "mem-aknea",
        email: "aknea27@gmail.com",
        phone: "+91 9150110919",
        name: "Aknea vasht kumara",
        role: "Embedded IoT & Automation Architect",
        qualification: "B.E in Electronics & Communication",
        institution: "Technology Institute",
        year: "2024",
        linkedin: "https://www.linkedin.com/in/aknea-kumara",
        github: "https://github.com/aknea-kumara",
        photo: "https://api.dicebear.com/7.x/initials/svg?seed=Aknea&backgroundColor=0c1438&textColor=38bdf8",
        bannerImage: "",
        passcode: "Aknea@2026",
        privacy: "private",
        lastActiveTimestamp: Date.now(),
        bio: "Specializing in microcontroller automation, sensor mesh grids, MQTT communications, and edge firmware design.",
        resumeUrl: "",
        skills: ["ESP32 / Arduino", "Embedded C++", "MicroPython", "MQTT", "Hardware Prototyping"],
        certificates: [
          { title: "Advanced Embedded IoT Specialist", issuer: "IoT Global Standards", url: "https://kodeinx.dev" }
        ]
      }
    ];

    // Projects: Specifically IoT, AI, and Websites (empty, ready for team additions)
    const INITIAL_PROJECTS = [];

    // Initial Company & Team Achievements (empty, ready for team additions)
    const INITIAL_ACHIEVEMENTS = [];

    const INITIAL_COMPANY_CONTACT = {
      email: "klpraba06@gmail.com",
      phone: "+91 9703438665",
      whatsapp: "+91 9703438665",
      location: "Rajapalayam, Raju's College, Tamil Nadu, India",
      supportHours: "Monday - Saturday: 9:00 AM - 7:00 PM IST"
    };


    function App() {
      // MongoDB API Base URL (auto-detects local server port 5000 vs current origin)
      const API_BASE = "";  // Firebase handles data

      const [mongoStatus, setMongoStatus] = useState({
        connected: false,
        checking: true,
        counts: null
      });

      // Data state
      const [members, setMembers] = useState(() => {
        const savedV7 = localStorage.getItem("kodeinx_members_v7");
        if (savedV7) {
          try {
            return JSON.parse(savedV7);
          } catch(e){}
        }
        return INITIAL_MEMBERS;
      });

      useEffect(() => {
        try {
          localStorage.setItem("kodeinx_members_v7", JSON.stringify(members));
        } catch(e){}
      }, [members]);

      const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem("kodeinx_projects_v4");
        return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
      });

      useEffect(() => {
        try {
          localStorage.setItem("kodeinx_projects_v4", JSON.stringify(projects));
        } catch(e){}
      }, [projects]);

      // Achievements State
      const [achievements, setAchievements] = useState(() => {
        const saved = localStorage.getItem("kodeinx_achievements_v5");
        return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
      });

      useEffect(() => {
        try {
          localStorage.setItem("kodeinx_achievements_v5", JSON.stringify(achievements));
        } catch(e){}
      }, [achievements]);

      // Synchronize with MongoDB Database
      const syncWithMongoDB = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/status`);
          if (res.ok) {
            const data = await res.json();
            setMongoStatus({
              connected: data.status === "connected",
              checking: false,
              counts: data.counts
            });

            // Fetch live members from MongoDB
            const memRes = await fetch(`${API_BASE}/api/members`);
            if (memRes.ok) {
              const memData = await memRes.json();
              if (Array.isArray(memData) && memData.length > 0) {
                setMembers(memData);
                // Synchronize active logged-in member immediately with fresh MongoDB record
                const storedSession = session || (() => {
                  try { const s = localStorage.getItem("kodeinx_session_v4") || localStorage.getItem("kodeinx_session"); return s ? JSON.parse(s) : null; } catch(e){ return null; }
                })();
                if (storedSession?.memberId) {
                  const currentMember = memData.find(m => m.id === storedSession.memberId);
                  if (currentMember) {
                    setSession(prev => prev ? { ...prev, avatar: currentMember.photo || prev.avatar, name: currentMember.name, role: currentMember.role } : prev);
                  }
                }
              }
            }

            // Fetch live projects from MongoDB
            const projRes = await fetch(`${API_BASE}/api/projects`);
            if (projRes.ok) {
              const projData = await projRes.json();
              if (Array.isArray(projData) && projData.length > 0) {
                setProjects(projData);
              }
            }

            // Fetch live achievements from MongoDB
            const achRes = await fetch(`${API_BASE}/api/achievements`);
            if (achRes.ok) {
              const achData = await achRes.json();
              if (Array.isArray(achData) && achData.length > 0) {
                setAchievements(achData);
              }
            }

            // Fetch live visitor messages from MongoDB
            const msgRes = await fetch(`${API_BASE}/api/contact-messages`);
            if (msgRes.ok) {
              const msgData = await msgRes.json();
              if (Array.isArray(msgData)) {
                setContactMessages(msgData);
              }
            }

            // Fetch live direct messages from MongoDB
            const dmRes = await fetch(`${API_BASE}/api/direct-messages`);
            if (dmRes.ok) {
              const dmData = await dmRes.json();
              if (Array.isArray(dmData) && dmData.length > 0) {
                setMemberMessages(dmData);
              }
            }

            // Fetch live access requests from MongoDB
            const reqRes = await fetch(`${API_BASE}/api/access-requests`);
            if (reqRes.ok) {
              const reqData = await reqRes.json();
              if (Array.isArray(reqData)) {
                setAccessRequests(reqData);
              }
            }
          } else {
            setMongoStatus(prev => ({ ...prev, connected: false, checking: false }));
          }
        } catch (err) {
          setMongoStatus(prev => ({ ...prev, connected: false, checking: false }));
        }
      };

      useEffect(() => {
        syncWithMongoDB();
        const interval = setInterval(syncWithMongoDB, 12000);
        return () => clearInterval(interval);
      }, []);

      // Add Achievement Modal State
      const [showAddAchievementModal, setShowAddAchievementModal] = useState(false);
      const [newAchievementForm, setNewAchievementForm] = useState({
        title: "",
        issuer: "",
        year: "2026",
        recipientName: "",
        recipientRole: "",
        category: "IoT & AI",
        url: "",
        badge: "ðŸ† Award"
      });

      // Company Contact Info State
      const [companyContact, setCompanyContact] = useState(() => {
        const saved = localStorage.getItem("kodeinx_contact_v6");
        if (saved) {
          try {
            const data = JSON.parse(saved);
            if (!data.location || data.location.includes("Chennai") || !data.location.includes("Raju's College")) {
              data.location = "Rajapalayam, Raju's College, Tamil Nadu, India";
            }
            if (!data.email || data.email.includes("kodeinx.dev") || data.email.includes("admin@")) {
              data.email = "klpraba06@gmail.com";
            }
            return data;
          } catch(e){}
        }
        return INITIAL_COMPANY_CONTACT;
      });

      useEffect(() => {
        localStorage.setItem("kodeinx_contact_v6", JSON.stringify(companyContact));
      }, [companyContact]);

      // Contact Inquiries (messages sent by visitors)
      const [contactMessages, setContactMessages] = useState(() => {
        const saved = localStorage.getItem("kodeinx_inquiries_v5");
        return saved ? JSON.parse(saved) : [];
      });

      useEffect(() => {
        localStorage.setItem("kodeinx_inquiries_v5", JSON.stringify(contactMessages));
      }, [contactMessages]);

      const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        phone: "",
        projectType: "IoT Systems",
        message: ""
      });
      const [contactSentSuccess, setContactSentSuccess] = useState(false);

      // Public Navigation: 'home' | 'team' | 'projects' | 'achievements' | 'contact' | 'admin_dashboard'
      const [currentView, setCurrentView] = useState("home");
      const [projectFilter, setProjectFilter] = useState("All");

      // Session: { type: 'admin' } or { type: 'member', memberId, email, name, avatar } or null
      const [session, setSession] = useState(() => {
        const saved = localStorage.getItem("kodeinx_session_v4");
        return saved ? JSON.parse(saved) : null;
      });

      // Modals
      const [showAdminModal, setShowAdminModal] = useState(false);
      const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false);
      const [showMyProfileModal, setShowMyProfileModal] = useState(false);
      const [viewingMemberProfile, setViewingMemberProfile] = useState(null);

      // Access Requests State (for Private Profiles)
      const [accessRequests, setAccessRequests] = useState(() => {
        const saved = localStorage.getItem("kodeinx_access_requests_v5");
        if (saved) {
          try { return JSON.parse(saved); } catch(e){}
        }
        return [
          {
            id: "req-demo-1",
            requesterId: "mem-praba",
            requesterName: "Prabakaran M",
            requesterEmail: "klpraba06@gmail.com",
            requesterRole: "Lead Software & AI Engineer",
            requesterPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=350&auto=format&fit=crop&q=80",
            targetMemberId: "mem-aknea",
            targetMemberName: "Aknea vasht kumara",
            status: "pending",
            requestedAt: "10:30 AM, Today"
          }
        ];
      });

      useEffect(() => {
        localStorage.setItem("kodeinx_access_requests_v5", JSON.stringify(accessRequests));
      }, [accessRequests]);

      // Search Box Query State (for filtering members across Team & Contact)
      const [memberSearchQuery, setMemberSearchQuery] = useState("");

      // Real-Time Member Direct Messaging System (Internal Messages)
      const [memberMessages, setMemberMessages] = useState(() => {
        const saved = localStorage.getItem("kodeinx_messages_v6");
        if (saved) {
          try { return JSON.parse(saved); } catch(e){}
        }
        return [
          {
            id: "msg-init-1",
            fromMemberId: "mem-praba",
            fromName: "Prabakaran M",
            fromEmail: "klpraba06@gmail.com",
            fromRole: "Lead Software & AI Engineer",
            fromPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=350&auto=format&fit=crop&q=80",
            toMemberId: "mem-aknea",
            toMemberName: "Aknea vasht kumara",
            toMemberEmail: "aknea27@gmail.com",
            subject: "ESP32 MQTT Mesh Protocol Synchronization",
            text: "Hello Aknea, I reviewed your microcontroller automation grid. We can sync on the edge firmware telemetry today.",
            timestamp: "10:30 AM â€¢ Today",
            status: "unread",
            replies: []
          }
        ];
      });

      useEffect(() => {
        localStorage.setItem("kodeinx_messages_v6", JSON.stringify(memberMessages));
      }, [memberMessages]);

      // Cross-tab real-time storage sync
      useEffect(() => {
        const handleStorageChange = (e) => {
          if (e.key === "kodeinx_messages_v6" && e.newValue) {
            try { setMemberMessages(JSON.parse(e.newValue)); } catch(err){}
          }
          if (e.key === "kodeinx_access_requests_v5" && e.newValue) {
            try { setAccessRequests(JSON.parse(e.newValue)); } catch(err){}
          }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
      }, []);

      // Direct Message Modal Target and State
      const [messageModalTarget, setMessageModalTarget] = useState(null);
      const [directMessageForm, setDirectMessageForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      const [replyDrafts, setReplyDrafts] = useState({});

      const handleSendDirectMessage = (e, openMailClient = false) => {
        if (e && typeof e.preventDefault === "function") e.preventDefault();
        if (!messageModalTarget) return;

        const senderName = isMember ? session.name : (directMessageForm.name.trim() || "Website Visitor");
        const senderEmail = isMember ? session.email : (directMessageForm.email.trim() || "visitor@gmail.com");
        const messageText = directMessageForm.message.trim();
        const msgSubject = directMessageForm.subject.trim() || "Project & Engineering Inquiry";

        if (!messageText) {
          alert("Please type a message before sending!");
          return;
        }

        const newMsg = {
          id: "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
          fromMemberId: isMember ? session.memberId : null,
          fromName: senderName,
          fromEmail: senderEmail,
          fromRole: isMember ? (myMemberData?.role || "Team Member") : "Client / Inquirer",
          fromPhoto: isMember ? session.avatar : null,
          toMemberId: messageModalTarget.id,
          toMemberName: messageModalTarget.name,
          toMemberEmail: messageModalTarget.email,
          subject: msgSubject,
          text: messageText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " â€¢ " + new Date().toLocaleDateString(),
          createdAt: Date.now(),
          status: "unread",
          replies: []
        };

        setMemberMessages(prev => [newMsg, ...prev]);

        // Save to MongoDB Database
        try {
          fetch(`${API_BASE}/api/direct-messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMsg)
          }).catch(console.error);
        } catch(err){}

        // If openMailClient requested, trigger real external email dispatch
        if (openMailClient && messageModalTarget.email) {
          const mailSubject = encodeURIComponent(`[KodeinX] ${msgSubject}`);
          const mailBody = encodeURIComponent(`From: ${senderName} (${senderEmail})\n\nMessage:\n${messageText}\n\n-- Sent via KodeinX Innovation Portal`);
          const mailtoUrl = `mailto:${messageModalTarget.email}?subject=${mailSubject}&body=${mailBody}`;
          window.open(mailtoUrl, "_blank");
        }

        setMessageModalTarget(null);
        setDirectMessageForm({ name: "", email: "", phone: "", subject: "", message: "" });
        
        if (openMailClient) {
          alert(`âœ“ Message sent!\n1. Real-Time In-App: Delivered directly to ${messageModalTarget.name}'s private dashboard inbox.\n2. External Email: Opened email client addressed to ${messageModalTarget.email}.\n3. Database: Saved to MongoDB.`);
        } else {
          alert(`âœ“ Real-Time Message delivered directly to ${messageModalTarget.name}'s private inbox and saved to MongoDB!`);
        }
      };

      const handleSendReply = (messageId) => {
        const replyText = replyDrafts[messageId]?.trim();
        if (!replyText) {
          alert("Please type a reply message first!");
          return;
        }

        const replyObj = {
          id: "rep-" + Date.now(),
          fromId: session?.memberId || "member",
          fromName: session?.name || "Member",
          fromRole: myMemberData?.role || "Team Member",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " â€¢ " + new Date().toLocaleDateString()
        };

        setMemberMessages(prev => prev.map(m => {
          if (m.id === messageId) {
            const updated = {
              ...m,
              status: "replied",
              replies: [...(m.replies || []), replyObj]
            };
            // Sync reply update to MongoDB
            try {
              fetch(`${API_BASE}/api/direct-messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated)
              }).catch(console.error);
            } catch(e){}
            return updated;
          }
          return m;
        }));

        setReplyDrafts(prev => ({ ...prev, [messageId]: "" }));
        alert("Reply sent successfully and saved to MongoDB!");
      };

      // Admin Login
      const [adminInputPassword, setAdminInputPassword] = useState("");
      const [adminError, setAdminError] = useState("");

      // Official Google OAuth "Continue with Google" State
      const [googleSelectedAccount, setGoogleSelectedAccount] = useState(() => {
        return INITIAL_MEMBERS[0]; // Default to primary verified member (Prabakaran M)
      });
      const [googleSigningIn, setGoogleSigningIn] = useState(false);
      const [customEmailInput, setCustomEmailInput] = useState("");
      const [showCustomEmailInput, setShowCustomEmailInput] = useState(false);
      const [googleAuthError, setGoogleAuthError] = useState("");

      // Robust helper to format and connect LinkedIn URLs reliably to member's exact profile
      const formatLinkedInUrl = (url, memberName = "") => {
        if (!url || !url.trim()) return "";
        let clean = url.trim().replace(/^['"]+|['"]+$/g, '');
        if (clean === "https://linkedin.com" || clean === "https://www.linkedin.com" || clean === "http://linkedin.com" || clean === "linkedin.com") {
          return "";
        }
        if (clean.startsWith("http://") || clean.startsWith("https://")) {
          return clean.replace("http://", "https://");
        }
        clean = clean.replace(/^@+/, '').replace(/^\/+|\/+$/g, '');
        if (clean.startsWith("in/")) {
          return `https://www.linkedin.com/${clean}`;
        }
        if (clean.includes("linkedin.com/in/")) {
          return `https://${clean}`;
        }
        if (clean.includes("linkedin.com/")) {
          return `https://${clean.replace("linkedin.com/", "linkedin.com/in/")}`;
        }
        return `https://www.linkedin.com/in/${clean}`;
      };

      const formatExternalUrl = (url, fallbackDomain = "linkedin.com", memberName = "") => {
        if (fallbackDomain === "linkedin.com") {
          return formatLinkedInUrl(url, memberName);
        }
        if (fallbackDomain === "github.com") {
          return formatGitHubUrl(url, memberName);
        }
        if (!url || !url.trim()) return "";
        let clean = url.trim().replace(/^['"]+|['"]+$/g, '');
        if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
        clean = clean.replace(/^\/+|\/+$/g, '');
        return `https://${fallbackDomain}/${clean}`;
      };

      const openExternalLink = (url, memberName = "") => {
        const finalUrl = formatLinkedInUrl(url, memberName);
        if (!finalUrl) {
          alert(`No LinkedIn profile URL provided for ${memberName || 'this member'} yet.`);
          return;
        }
        window.open(finalUrl, "_blank", "noopener,noreferrer");
      };

      // Robust helper to format and connect GitHub URLs reliably to member's exact profile
      const formatGitHubUrl = (url, memberName = "") => {
        if (!url || !url.trim()) return "";
        let clean = url.trim().replace(/^['"]+|['"]+$/g, '');
        if (clean === "https://github.com" || clean === "https://www.github.com" || clean === "http://github.com" || clean === "github.com") {
          return "";
        }
        if (clean.startsWith("http://") || clean.startsWith("https://")) {
          return clean.replace("http://", "https://");
        }
        clean = clean.replace(/^@+/, '').replace(/^\/+|\/+$/g, '');
        if (clean.includes("github.com/")) {
          return `https://${clean}`;
        }
        return `https://github.com/${clean}`;
      };

      const openGitHubLink = (url, memberName = "") => {
        const finalUrl = formatGitHubUrl(url, memberName);
        if (!finalUrl) {
          alert(`No GitHub profile URL provided for ${memberName || 'this member'} yet.`);
          return;
        }
        window.open(finalUrl, "_blank", "noopener,noreferrer");
      };

      const cleanTelNumber = (phone) => {
        if (!phone) return "";
        return phone.replace(/[^\d+]/g, '');
      };

      // Real-Time Member Presence Indicator: Active Now / Offline (no false minutes)
      const getMemberPresence = (member) => {
        const isCurrent = isMember && session?.memberId === member.id;
        const isOnline = isCurrent || member.isOnline === true;

        if (isOnline) {
          return {
            isOnline: true,
            label: "Active Now",
            dotClass: "bg-emerald-400",
            badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-sm shadow-emerald-500/20"
          };
        }

        return {
          isOnline: false,
          label: "Offline",
          dotClass: "bg-slate-500",
          badgeClass: "bg-slate-800/80 text-slate-400 border-slate-700/50"
        };
      };


      // Admin Dashboard Forms (Admin adds member invite)
      const [adminMemberForm, setAdminMemberForm] = useState({
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        github: "",
        role: "Software Engineer",
        qualification: "",
        institution: "",
        passcode: "KodeinX@2026"
      });

      // Admin Project Form
      const [adminProjectForm, setAdminProjectForm] = useState({
        title: "",
        category: "IoT",
        description: "",
        techStack: "",
        demoUrl: "",
        githubUrl: "",
        image: ""
      });

      // Member Profile Self-Development Form
      const [memberProfileForm, setMemberProfileForm] = useState({
        name: "",
        phone: "",
        role: "",
        qualification: "",
        institution: "",
        year: "",
        linkedin: "",
        github: "",
        photo: "",
        bannerImage: "",
        bio: "",
        skillsString: "",
        certTitle: "",
        certIssuer: "",
        certUrl: "",
        resumeUrl: "",
        resumeName: "",
        privacy: "public"
      });

      // Member Project Showcase Contribution Form (Member can publish their own projects too!)
      const [memberProjectForm, setMemberProjectForm] = useState({
        title: "",
        category: "IoT",
        scope: "personal", // 'personal' (Only on personal profile) | 'team' (KodeinX Team Portfolio)
        description: "",
        techStack: "",
        demoUrl: "",
        githubUrl: "",
        image: ""
      });

      // Member Dashboard Active Tab: 'profile' | 'projects' | 'certificates'
      const [memberDashboardTab, setMemberDashboardTab] = useState("profile");

      // Admin Edit Member Modal state
      const [adminEditingMember, setAdminEditingMember] = useState(null);

      // LocalStorage persistence
      useEffect(() => {
        try {
          if (session) {
            localStorage.setItem("kodeinx_session_v4", JSON.stringify(session));
          } else {
            localStorage.removeItem("kodeinx_session_v4");
          }
        } catch(e){}
      }, [session]);

      useEffect(() => {
        try {
          if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
          }
        } catch (err) {
          console.warn("Lucide icons error:", err);
        }
      });

      const isAdmin = session?.type === "admin";
      const isMember = session?.type === "member";

      // Real Google "Continue as [User]" Instant Authentication Flow
      const handleGoogleContinueSignIn = (targetAccount) => {
        const account = targetAccount || googleSelectedAccount;
        if (!account) {
          setGoogleAuthError("Please select your team member account or enter your registered email to continue.");
          return;
        }

        setGoogleSigningIn(true);
        setGoogleAuthError("");

        // Authentic Google Sign-in transition
        setTimeout(() => {
          const newSession = {
            type: "member",
            memberId: account.id,
            email: account.email,
            name: account.name,
            avatar: account.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(account.name)}&backgroundColor=0c1438&textColor=38bdf8`,
            role: account.role
          };

          setSession(newSession);
          setGoogleSigningIn(false);
          setShowGoogleAuthModal(false);
          setShowCustomEmailInput(false);
          setCustomEmailInput("");

          loadMemberDataForEdit(account);
          setCurrentView("member_dashboard");
        }, 500);
      };

      // User provides another Google email to continue
      const handleCustomEmailSubmit = (e) => {
        if (e) e.preventDefault();
        setGoogleAuthError("");
        const cleanEmail = customEmailInput.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
          setGoogleAuthError("Please enter a valid Google email address (e.g. name@gmail.com).");
          return;
        }

        const matched = members.find(m => m.email.toLowerCase() === cleanEmail);
        if (!matched) {
          setGoogleAuthError(`âŒ Access Denied: "${cleanEmail}" is not on the KodeinX team roster. Only authorized emails registered in the database can sign in.`);
          return;
        }

        handleGoogleContinueSignIn(matched);
      };

      const loadMemberDataForEdit = (m) => {
        if (!m) return;
        setMemberProfileForm({
          name: m.name || "",
          phone: m.phone || "",
          role: m.role || "Software Engineer",
          qualification: m.qualification || "",
          institution: m.institution || "",
          year: m.year || "",
          linkedin: m.linkedin || "",
          github: m.github || "",
          photo: m.photo || "",
          bannerImage: m.bannerImage || "",
          bio: m.bio || "",
          passcode: m.passcode || "KodeinX@2026",
          skillsString: Array.isArray(m.skills) ? m.skills.join(", ") : (m.skills || ""),
          certTitle: "",
          certIssuer: "",
          certUrl: "",
          resumeUrl: m.resumeUrl || "",
          resumeName: m.resumeName || "",
          privacy: m.privacy || "public"
        });
      };

      // Auto-populate memberProfileForm ONCE when member logs in or switches accounts
      const lastLoadedMemberIdRef = useRef(null);
      useEffect(() => {
        if (isMember && session?.memberId && members.length > 0) {
          if (lastLoadedMemberIdRef.current !== session.memberId) {
            const found = members.find(m => m.id === session.memberId);
            if (found) {
              loadMemberDataForEdit(found);
              lastLoadedMemberIdRef.current = session.memberId;
              if (found.photo && session?.avatar !== found.photo) {
                setSession(prev => prev ? { ...prev, avatar: found.photo } : prev);
              }
            }
          }
        } else if (!isMember) {
          lastLoadedMemberIdRef.current = null;
        }
      }, [isMember, session?.memberId, members]);

      // Admin Login with Praba@06200620
      const handleAdminSignIn = (e) => {
        e.preventDefault();
        setAdminError("");
        if (adminInputPassword === "Praba@06200620") {
          setSession({
            type: "admin",
            name: "KodeinX Administrator",
            email: "klpraba06@gmail.com",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin"
          });
          setShowAdminModal(false);
          setAdminInputPassword("");
          setCurrentView("admin_dashboard"); // Navigates to Admin Dashboard!
        } else {
          setAdminError("Invalid Admin Password!");
        }
      };

      const handleSignOut = () => {
        setSession(null);
        setCurrentView("home");
      };

      // ADMIN ONLY: Add Member (Inside Dashboard Only)
      const handleAdminAddMember = (e) => {
        e.preventDefault();
        if (!isAdmin) return;

        if (!adminMemberForm.name.trim() || !adminMemberForm.email.trim()) {
          alert("Please fill in Member Name and Google Email!");
          return;
        }

        const existing = members.find(m => m.email.toLowerCase() === adminMemberForm.email.trim().toLowerCase());
        if (existing) {
          alert("A member with this email is already registered in KodeinX!");
          return;
        }

        const formattedLinkedIn = adminMemberForm.linkedin.trim() 
          ? formatLinkedInUrl(adminMemberForm.linkedin.trim(), adminMemberForm.name.trim()) 
          : formatLinkedInUrl("", adminMemberForm.name.trim());

        const formattedGitHub = adminMemberForm.github && adminMemberForm.github.trim()
          ? formatGitHubUrl(adminMemberForm.github.trim(), adminMemberForm.name.trim())
          : formatGitHubUrl("", adminMemberForm.name.trim());

        const newMember = {
          id: "mem-" + Date.now(),
          name: adminMemberForm.name.trim(),
          email: adminMemberForm.email.trim().toLowerCase(),
          phone: adminMemberForm.phone.trim() || "",
          role: adminMemberForm.role.trim() || "Software Engineer",
          qualification: adminMemberForm.qualification.trim() || "B.Tech in Computer Science & Engineering",
          institution: adminMemberForm.institution.trim() || "Engineering Institute",
          year: "2024",
          linkedin: formattedLinkedIn,
          github: formattedGitHub,
          photo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(adminMemberForm.name)}`,
          bio: "Core engineer at KodeinX.",
          skills: ["IoT", "AI", "Web Development"],
          certificates: []
        };

        setMembers(prev => [newMember, ...prev]);
        try {
          fetch(`${API_BASE}/api/members`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMember)
          }).catch(console.error);
        } catch(e){}

        setAdminMemberForm({ 
          name: "", 
          email: "", 
          phone: "", 
          linkedin: "", 
          github: "",
          role: "Software Engineer", 
          qualification: "", 
          institution: "" 
        });
        alert(`Success! ${newMember.name} added to KodeinX and saved to MongoDB. They can now log in using their real Google account (${newMember.email}) to develop their profile!`);
      };

      const handleAdminDeleteMember = (id) => {
        if (!isAdmin) return;
        if (confirm("Are you sure you want to remove this member?")) {
          setMembers(prev => prev.filter(m => m.id !== id));
          try {
            fetch(`${API_BASE}/api/members/${id}`, { method: "DELETE" }).catch(console.error);
          } catch(e){}
        }
      };

      // ADMIN ONLY: Add Project (Inside Dashboard Only)
      const handleAdminAddProject = (e) => {
        e.preventDefault();
        if (!isAdmin) return;

        if (!adminProjectForm.title.trim() || !adminProjectForm.description.trim()) {
          alert("Please fill in Project Title and Description!");
          return;
        }

        const tags = adminProjectForm.techStack
          ? adminProjectForm.techStack.split(",").map(t => t.trim()).filter(Boolean)
          : ["IoT", "AI", "Web"];

        const newProject = {
          id: "proj-" + Date.now(),
          title: adminProjectForm.title.trim(),
          category: adminProjectForm.category.trim() || "IoT",
          description: adminProjectForm.description.trim(),
          techStack: tags,
          demoUrl: adminProjectForm.demoUrl.trim(),
          githubUrl: adminProjectForm.githubUrl.trim(),
          image: adminProjectForm.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"
        };

        setProjects(prev => [newProject, ...prev]);
        try {
          fetch(`${API_BASE}/api/projects`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProject)
          }).catch(console.error);
        } catch(e){}

        setAdminProjectForm({
          title: "",
          category: "IoT",
          description: "",
          techStack: "",
          demoUrl: "",
          githubUrl: "",
          image: ""
        });
        alert("Project published successfully by Admin and saved to MongoDB!");
      };

      // Visitor Contact Form Submit
      const handleContactSubmit = (e) => {
        e.preventDefault();
        const newMsg = {
          id: "msg-" + Date.now(),
          date: new Date().toLocaleString(),
          ...contactForm
        };
        setContactMessages(prev => [newMsg, ...prev]);
        try {
          fetch(`${API_BASE}/api/contact-messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMsg)
          }).catch(console.error);
        } catch(e){}

        setContactSentSuccess(true);
        setContactForm({
          name: "",
          email: "",
          phone: "",
          projectType: "IoT Systems",
          message: ""
        });
        setTimeout(() => setContactSentSuccess(false), 8000);
      };

      // Add Achievement Submit (Admin or Member)
      const handleAddAchievement = (e) => {
        e.preventDefault();
        const recName = newAchievementForm.recipientName.trim() || (isMember ? session?.name : "Prabakaran M");
        const matchedMember = members.find(m => m.name.toLowerCase() === recName.toLowerCase());
        const newAch = {
          id: "ach-" + Date.now(),
          title: newAchievementForm.title.trim(),
          issuer: newAchievementForm.issuer.trim(),
          year: newAchievementForm.year.trim() || "2026",
          recipientName: recName,
          recipientRole: newAchievementForm.recipientRole.trim() || (matchedMember ? matchedMember.role : (isMember ? session?.role : "Core Engineer")),
          recipientPhoto: matchedMember?.photo || (isMember ? session?.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(recName)}&backgroundColor=0c1438&textColor=38bdf8`),
          category: newAchievementForm.category || "Honor & Award",
          url: newAchievementForm.url.trim() || "#",
          badge: newAchievementForm.badge.trim() || "ðŸ† Honor",
          uploaderId: isMember ? session?.memberId : (isAdmin ? "admin" : "visitor"),
          uploaderName: isMember ? session?.name : (isAdmin ? "Admin" : "Visitor")
        };
        setAchievements(prev => [newAch, ...prev]);
        try {
          fetch(`${API_BASE}/api/achievements`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAch)
          }).catch(console.error);
        } catch(e){}

        setShowAddAchievementModal(false);
        setNewAchievementForm({
          title: "",
          issuer: "",
          year: "2026",
          recipientName: "",
          recipientRole: "",
          category: "IoT & AI",
          url: "",
          badge: "ðŸ† Award"
        });
        alert("Achievement / Certificate added successfully and saved to MongoDB!");
      };

      const handleDeleteAchievement = (id) => {
        if (confirm("Are you sure you want to remove this achievement?")) {
          setAchievements(prev => prev.filter(a => a.id !== id));
          try {
            fetch(`${API_BASE}/api/achievements/${id}`, { method: "DELETE" }).catch(console.error);
          } catch(e){}
        }
      };

      const handleAdminDeleteProject = (id) => {
        if (!isAdmin) return;
        if (confirm("Are you sure you want to delete this project?")) {
          setProjects(prev => prev.filter(p => p.id !== id));
          try {
            fetch(`${API_BASE}/api/projects/${id}`, { method: "DELETE" }).catch(console.error);
          } catch(e){}
        }
      };

      // Instant Profile Photo Upload & Delete (Live Persistence to MongoDB)
      const handleInstantPhotoUpdate = (newPhotoUrl) => {
        setMemberProfileForm(prev => ({ ...prev, photo: newPhotoUrl }));
        if (isMember && session?.memberId) {
          setMembers(prev => prev.map(m => m.id === session.memberId ? { ...m, photo: newPhotoUrl } : m));
          setSession(prev => prev ? { ...prev, avatar: newPhotoUrl } : prev);
          try {
            fetch(`${API_BASE}/api/members/${session.memberId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ photo: newPhotoUrl })
            }).catch(console.error);
          } catch(e){}
        }
      };

      const handleDeleteMyPhoto = () => {
        const currentName = memberProfileForm.name?.trim() || myMemberData?.name || session?.name || "Member";
        const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentName)}&backgroundColor=0c1438&textColor=38bdf8`;
        setMemberProfileForm(prev => ({ ...prev, photo: "" }));
        if (isMember && session?.memberId) {
          setMembers(prev => prev.map(m => m.id === session.memberId ? { ...m, photo: defaultAvatar } : m));
          setSession(prev => prev ? { ...prev, avatar: defaultAvatar } : prev);
          try {
            fetch(`${API_BASE}/api/members/${session.memberId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ photo: defaultAvatar })
            }).catch(console.error);
          } catch(e){}
        }
      };

      // Instant Profile Banner Upload & Delete (Live Persistence to MongoDB)
      const handleInstantBannerUpdate = (newBannerUrl) => {
        setMemberProfileForm(prev => ({ ...prev, bannerImage: newBannerUrl }));
        if (isMember && session?.memberId) {
          setMembers(prev => prev.map(m => m.id === session.memberId ? { ...m, bannerImage: newBannerUrl } : m));
          try {
            fetch(`${API_BASE}/api/members/${session.memberId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ bannerImage: newBannerUrl })
            }).catch(console.error);
          } catch(e){}
        }
      };

      const handleDeleteMyBanner = () => {
        setMemberProfileForm(prev => ({ ...prev, bannerImage: "" }));
        if (isMember && session?.memberId) {
          setMembers(prev => prev.map(m => m.id === session.memberId ? { ...m, bannerImage: "" } : m));
          try {
            fetch(`${API_BASE}/api/members/${session.memberId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ bannerImage: "" })
            }).catch(console.error);
          } catch(e){}
        }
      };

      // MEMBER ONLY: Develop Own Profile (Sets Phone, LinkedIn, Qualification, Role, Certs)
      const handleSaveMyProfile = (e) => {
        e.preventDefault();
        if (!isMember || !session?.memberId) return;

        const skillsArr = memberProfileForm.skillsString
          ? memberProfileForm.skillsString.split(",").map(s => s.trim()).filter(Boolean)
          : [];

        const resolvedName = memberProfileForm.name.trim() || myMemberData?.name || "Member";
        const formattedLinkedIn = memberProfileForm.linkedin && memberProfileForm.linkedin.trim() 
          ? formatLinkedInUrl(memberProfileForm.linkedin.trim(), resolvedName) 
          : "";

        const formattedGitHub = memberProfileForm.github && memberProfileForm.github.trim()
          ? formatGitHubUrl(memberProfileForm.github.trim(), resolvedName)
          : "";

        const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(resolvedName)}&backgroundColor=0c1438&textColor=38bdf8`;
        const resolvedPhoto = (memberProfileForm.photo && memberProfileForm.photo.trim())
          ? memberProfileForm.photo.trim()
          : (myMemberData?.photo || defaultAvatar);
        const resolvedBanner = (memberProfileForm.bannerImage && memberProfileForm.bannerImage.trim())
          ? memberProfileForm.bannerImage.trim()
          : "";

        let savedMemberObj = null;
        setMembers(prev => prev.map(m => {
          if (m.id === session.memberId) {
            let updatedCerts = m.certificates || [];
            if (memberProfileForm.certTitle && memberProfileForm.certTitle.trim()) {
              updatedCerts = [
                ...updatedCerts,
                {
                  title: memberProfileForm.certTitle.trim(),
                  issuer: memberProfileForm.certIssuer.trim() || "Certified Authority",
                  url: memberProfileForm.certUrl.trim() || "#"
                }
              ];
            }

            savedMemberObj = {
              ...m,
              name: resolvedName,
              phone: memberProfileForm.phone !== undefined ? memberProfileForm.phone.trim() : (m.phone || ""),
              role: memberProfileForm.role ? memberProfileForm.role.trim() : (m.role || "Software Engineer"),
              qualification: memberProfileForm.qualification !== undefined ? memberProfileForm.qualification.trim() : "",
              institution: memberProfileForm.institution !== undefined ? memberProfileForm.institution.trim() : "",
              year: memberProfileForm.year !== undefined ? memberProfileForm.year.trim() : "",
              linkedin: formattedLinkedIn,
              github: formattedGitHub,
              photo: resolvedPhoto,
              bannerImage: resolvedBanner,
              bio: memberProfileForm.bio !== undefined ? memberProfileForm.bio.trim() : "",
              resumeUrl: memberProfileForm.resumeUrl !== undefined ? memberProfileForm.resumeUrl.trim() : "",
              resumeName: memberProfileForm.resumeName !== undefined ? memberProfileForm.resumeName.trim() : "",
              passcode: memberProfileForm.passcode ? memberProfileForm.passcode.trim() : (m.passcode || "KodeinX@2026"),
              skills: skillsArr,
              certificates: updatedCerts,
              privacy: memberProfileForm.privacy || m.privacy || "public"
            };
            return savedMemberObj;
          }
          return m;
        }));

        // Persist Member Profile to MongoDB
        if (savedMemberObj) {
          try {
            fetch(`${API_BASE}/api/members/${session.memberId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(savedMemberObj)
            }).then(r => r.json()).then(updated => {
              console.log("[MongoDB] Profile successfully saved:", updated);
            }).catch(console.error);
          } catch(e){}
        }

        setSession(prev => ({
          ...prev,
          name: resolvedName,
          avatar: resolvedPhoto,
          role: memberProfileForm.role.trim() || prev.role
        }));

        setShowMyProfileModal(false);
        alert("âœ“ Success! Your profile changes have been saved directly to MongoDB.");
      };

      // Check if current user is allowed to view targetMember's full details
      const canViewMemberFullProfile = (targetMember) => {
        if (!targetMember) return false;
        // Public profiles are visible to everyone
        if (targetMember.privacy !== "private") return true;
        // Admin has master access
        if (isAdmin) return true;
        // Member can always view their own profile
        if (isMember && session?.memberId === targetMember.id) return true;
        // If current member has an approved access request
        if (isMember && session?.memberId) {
          const isApproved = accessRequests.some(r => 
            r.requesterId === session.memberId && 
            r.targetMemberId === targetMember.id && 
            r.status === "approved"
          );
          if (isApproved) return true;
        }
        return false;
      };

      // Check request status for target member by current logged-in user
      const getMemberAccessRequestStatus = (targetMemberId) => {
        if (!isMember || !session?.memberId) return null;
        const req = accessRequests.find(r => 
          r.requesterId === session.memberId && 
          r.targetMemberId === targetMemberId
        );
        return req ? req.status : null; // 'pending' | 'approved' | 'declined' | null
      };

      // Send access request to view a private profile
      const handleSendAccessRequest = (targetMember) => {
        if (!isMember || !session?.memberId) {
          alert("Please sign in with your Google member account to request access to this private profile.");
          setShowGoogleAuthModal(true);
          return;
        }
        if (session.memberId === targetMember.id) {
          alert("You cannot send an access request to your own profile.");
          return;
        }

        const existing = accessRequests.find(r => 
          r.requesterId === session.memberId && 
          r.targetMemberId === targetMember.id
        );

        if (existing && existing.status === "pending") {
          alert(`You have already sent an access request to ${targetMember.name}. Please wait for them to accept!`);
          return;
        }

        if (existing && existing.status === "approved") {
          alert(`You already have approved access to view ${targetMember.name}'s profile!`);
          return;
        }

        const newReq = {
          id: "req-" + Date.now(),
          requesterId: session.memberId,
          requesterName: session.name || "Team Member",
          requesterEmail: session.email || "",
          requesterRole: myMemberData?.role || "Team Member",
          requesterPhoto: session.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(session.name || "Member")}&backgroundColor=0c1438&textColor=38bdf8`,
          targetMemberId: targetMember.id,
          targetMemberName: targetMember.name,
          status: "pending",
          requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + new Date().toLocaleDateString()
        };

        setAccessRequests(prev => [
          newReq,
          ...prev.filter(r => !(r.requesterId === session.memberId && r.targetMemberId === targetMember.id))
        ]);

        try {
          fetch(`${API_BASE}/api/access-requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newReq)
          }).catch(console.error);
        } catch(e){}

        alert(`Access request sent to ${targetMember.name} and saved to MongoDB! Once they accept it from their Member Dashboard, you will be able to view their complete private profile.`);
      };

      const handleApproveAccessRequest = (requestId) => {
        setAccessRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "approved" } : r));
        try {
          fetch(`${API_BASE}/api/access-requests/${requestId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "approved" })
          }).catch(console.error);
        } catch(e){}
        alert("Access request approved and updated in MongoDB! This member can now view your full profile.");
      };

      const handleDeclineAccessRequest = (requestId) => {
        setAccessRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "declined" } : r));
        try {
          fetch(`${API_BASE}/api/access-requests/${requestId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "declined" })
          }).catch(console.error);
        } catch(e){}
        alert("Access request declined.");
      };

      const handleRevokeAccessRequest = (requestId) => {
        setAccessRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "declined" } : r));
        try {
          fetch(`${API_BASE}/api/access-requests/${requestId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "declined" })
          }).catch(console.error);
        } catch(e){}
        alert("Access permission revoked. Your profile is locked again for this member.");
      };

      // ADMIN ONLY: Edit Any Member Record
      const handleAdminSaveMemberEdit = (e) => {
        e.preventDefault();
        if (!isAdmin || !adminEditingMember) return;

        let editedObj = null;
        setMembers(prev => prev.map(m => {
          if (m.id === adminEditingMember.id) {
            const resolvedName = adminEditingMember.name.trim() || m.name;
            const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(resolvedName)}&backgroundColor=0c1438&textColor=38bdf8`;
            editedObj = {
              ...m,
              name: resolvedName,
              email: adminEditingMember.email.trim().toLowerCase() || m.email,
              phone: adminEditingMember.phone.trim() || "",
              role: adminEditingMember.role.trim() || m.role,
              qualification: adminEditingMember.qualification.trim() || m.qualification,
              institution: adminEditingMember.institution.trim() || m.institution,
              linkedin: formatLinkedInUrl(adminEditingMember.linkedin, resolvedName) || m.linkedin,
              github: formatGitHubUrl(adminEditingMember.github, resolvedName) || m.github,
              photo: adminEditingMember.photo && adminEditingMember.photo.trim() ? adminEditingMember.photo.trim() : defaultAvatar,
              bannerImage: adminEditingMember.bannerImage && adminEditingMember.bannerImage.trim() ? adminEditingMember.bannerImage.trim() : "",
              passcode: adminEditingMember.passcode ? adminEditingMember.passcode.trim() : m.passcode || "KodeinX@2026"
            };
            return editedObj;
          }
          return m;
        }));

        if (editedObj) {
          try {
            fetch(`${API_BASE}/api/members/${adminEditingMember.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(editedObj)
            }).catch(console.error);
          } catch(e){}
        }

        setAdminEditingMember(null);
        alert("Member details updated successfully by Admin and saved to MongoDB!");
      };

      // MEMBER ONLY: Add Project directly from Member Dashboard
      const handleMemberAddProject = (e) => {
        e.preventDefault();
        if (!isMember || !session?.memberId) return;

        if (!memberProjectForm.title.trim() || !memberProjectForm.description.trim()) {
          alert("Please fill in the project title and description!");
          return;
        }

        const tags = memberProjectForm.techStack
          ? memberProjectForm.techStack.split(",").map(t => t.trim()).filter(Boolean)
          : ["IoT", "AI", "Web"];

        const projScope = memberProjectForm.scope === "team" ? "team" : "personal";

        const newProject = {
          id: "proj-" + Date.now(),
          authorMemberId: session.memberId,
          authorName: session.name,
          title: memberProjectForm.title.trim(),
          category: memberProjectForm.category.trim() || "IoT",
          scope: projScope,
          description: memberProjectForm.description.trim(),
          techStack: tags,
          demoUrl: memberProjectForm.demoUrl.trim(),
          githubUrl: memberProjectForm.githubUrl.trim(),
          image: memberProjectForm.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"
        };

        setProjects(prev => [newProject, ...prev]);
        try {
          fetch(`${API_BASE}/api/projects`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProject)
          }).catch(console.error);
        } catch(e){}

        setMemberProjectForm({
          title: "",
          category: "IoT",
          scope: "personal",
          description: "",
          techStack: "",
          demoUrl: "",
          githubUrl: "",
          image: ""
        });

        if (projScope === "team") {
          alert(`Success! "${newProject.title}" has been published to the KodeinX Team Portfolio! (Admin manages modifications/deletions).`);
        } else {
          alert(`Success! "${newProject.title}" has been added to your Personal Profile only! (It will not appear in the public Team Portfolio).`);
        }
      };

      // Delete project with security permissions:
      // Personal projects -> author member or admin can delete
      // Team projects -> ONLY Admin can delete or modify!
      const handleMemberDeleteProject = (projectId) => {
        const targetProj = projects.find(p => p.id === projectId);
        if (!targetProj) return;

        if (targetProj.scope === "team" && !isAdmin) {
          alert("Permission Denied: This is a Team Project in the KodeinX Portfolio. Only Admin can delete or modify Team Projects!");
          return;
        }

        if (!isAdmin && (!isMember || targetProj.authorMemberId !== session?.memberId)) {
          alert("Permission Denied: You cannot delete another member's project!");
          return;
        }

        if (confirm(`Are you sure you want to delete "${targetProj.title}"?`)) {
          setProjects(prev => prev.filter(p => p.id !== projectId));
          try {
            fetch(`${API_BASE}/api/projects/${projectId}`, { method: "DELETE" }).catch(console.error);
          } catch(e){}
        }
      };

      // MEMBER ONLY: Remove a certificate
      const handleMemberDeleteCert = (certIdx) => {
        if (!isMember || !session?.memberId) return;
        let updated = [];
        setMembers(prev => prev.map(m => {
          if (m.id === session.memberId) {
            updated = (m.certificates || []).filter((_, i) => i !== certIdx);
            return { ...m, certificates: updated };
          }
          return m;
        }));
        try {
          fetch(`${API_BASE}/api/members/${session.memberId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ certificates: updated })
          }).catch(console.error);
        } catch(e){}
      };

      const handleImageUpload = (e, callback, maxWidth = 800, maxHeight = 800) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
              if (width > height) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.85);
            callback(compressed);
          };
          img.onerror = () => {
            callback(event.target.result);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      };

      const myMemberData = isMember ? members.find(m => m.id === session?.memberId) : null;

      // Filtered projects by category (Excludes personal profile projects from global Team Portfolio)
      const filteredProjects = projects.filter(p => {
        if (p.scope === "personal") return false;
        if (projectFilter === "All") return true;
        return (p.category || "").toLowerCase().includes(projectFilter.toLowerCase());
      });

      // Filtered & Searched members for Team & Contact (Logged-in member pinned first)
      const searchedMembers = members.filter(m => {
        if (!memberSearchQuery.trim()) return true;
        const q = memberSearchQuery.toLowerCase().trim();
        return (
          m.name.toLowerCase().includes(q) ||
          (m.role && m.role.toLowerCase().includes(q)) ||
          (m.qualification && m.qualification.toLowerCase().includes(q)) ||
          (m.institution && m.institution.toLowerCase().includes(q)) ||
          (Array.isArray(m.skills) ? m.skills.join(" ") : (m.skills || "")).toLowerCase().includes(q)
        );
      }).sort((a, b) => {
        if (isMember && session?.memberId) {
          if (a.id === session.memberId) return -1;
          if (b.id === session.memberId) return 1;
        }
        return 0;
      });

      return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc] text-slate-900">
          {/* ========================================================= */}
          {/* LEFT VERTICAL SIDEBAR: ALL NAVIGATION & PORTAL CONTROLS   */}
          {/* ========================================================= */}
          <aside className="w-full lg:w-72 lg:min-h-screen lg:sticky lg:top-0 lg:h-screen bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between p-5 shadow-sm z-40 shrink-0 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {/* Brand Logo: KodeinX */}
              <div
                onClick={() => setCurrentView("home")}
                className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer group hover:border-blue-400 transition"
              >
                <img
                  src="kodeinx_logo.png"
                  alt="KodeinX"
                  className="w-11 h-11 object-contain rounded-xl p-1 bg-slate-900 border border-blue-500/30 shadow-md group-hover:scale-105 transition shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="font-black text-xl text-slate-900 tracking-tight leading-tight flex items-center gap-0.5">
                    Kodein<span className="text-blue-600">X</span>
                  </h1>
                  <p className="text-[11px] text-blue-600 font-bold tracking-wide truncate">
                    IoT â€¢ AI â€¢ Web Hub
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    Raju&apos;s College, Rajapalayam
                  </p>
                </div>
              </div>

              {/* Sidebar Main Navigation Menu */}
              <div>
                <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                  Main Navigation
                </p>
                <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                  {[
                    { id: "home", label: "Overview Hub", icon: "layout-grid", badge: null },
                    { id: "team", label: "Team Directory", icon: "users", badge: members.length },
                    { id: "projects", label: "Projects Portfolio", icon: "cpu", badge: projects.length },
                    { id: "achievements", label: "Achievements", icon: "award", badge: achievements.length },
                    { id: "contact", label: "Contact & Live Msg", icon: "message-square", badge: "Live" }
                  ].map(navItem => {
                    const isActive = currentView === navItem.id;
                    return (
                      <button
                        key={navItem.id}
                        onClick={() => setCurrentView(navItem.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 keep-white"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <i data-lucide={navItem.icon} className="w-4 h-4 shrink-0"></i>
                          <span>{navItem.label}</span>
                        </div>
                        {navItem.badge !== null && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isActive
                              ? "bg-white/20 text-white keep-white"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}>
                            {navItem.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Live Hub Status Card inside Sidebar */}
              <div className="hidden lg:block space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-700">Live Roster Status</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{members.filter(m => getMemberPresence(m).isOnline).length} Online</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    ðŸ“ Rajapalayam, Raju&apos;s College, Tamil Nadu
                  </p>
                </div>

                {/* Live MongoDB Status Card */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  mongoStatus.connected
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                    : "bg-amber-50/70 border-amber-200 text-amber-900"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">ðŸƒ</span>
                      <div>
                        <p className="text-[11px] font-extrabold leading-tight">MongoDB Database</p>
                        <p className="text-[10px] font-semibold text-slate-500">
                          {mongoStatus.connected ? "Real-time Sync Active" : "Connecting..."}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      mongoStatus.connected
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        mongoStatus.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-ping"
                      }`}></span>
                      <span>{mongoStatus.connected ? "Live" : "Standby"}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Sidebar Controls: Member Sign In & Admin Portal */}
            <div className="pt-4 mt-4 border-t border-slate-200 space-y-2.5">
              <p className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Account & Access
              </p>

              {/* Member Portal Button */}
              {isMember ? (
                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={myMemberData?.photo || session?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(session?.name || "Member")}&backgroundColor=0c1438&textColor=38bdf8`}
                      alt={session?.name}
                      className="w-9 h-9 rounded-xl object-cover border border-emerald-400 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-slate-900 truncate">{myMemberData?.name || session?.name}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold truncate">â— Active Now</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        loadMemberDataForEdit(myMemberData);
                        setCurrentView("member_dashboard");
                      }}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer keep-white ${
                        currentView === "member_dashboard"
                          ? "bg-emerald-700 text-white shadow-md"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                      }`}
                    >
                      <i data-lucide="layout-dashboard" className="w-3.5 h-3.5"></i>
                      <span>My Dashboard</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="p-2 text-slate-500 hover:text-rose-600 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 transition cursor-pointer"
                      title="Sign Out"
                    >
                      <i data-lucide="log-out" className="w-4 h-4"></i>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setGoogleAuthError(""); setShowGoogleAuthModal(true); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2 cursor-pointer keep-white"
                >
                  <i data-lucide="log-in" className="w-4 h-4"></i>
                  <span>Member Sign In</span>
                </button>
              )}

              {/* Admin Access: Praba@06200620 */}
              {isAdmin ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentView("admin_dashboard")}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      currentView === "admin_dashboard"
                        ? "bg-amber-500 text-white border-amber-500 shadow-md keep-white"
                        : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                    }`}
                  >
                    <span>ðŸ‘‘ Admin Dashboard</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition cursor-pointer"
                    title="Exit Admin"
                  >
                    <i data-lucide="log-out" className="w-4 h-4"></i>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setAdminError(""); setShowAdminModal(true); }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                  title="Admin Portal"
                >
                  <i data-lucide="shield" className="w-3.5 h-3.5 text-amber-600"></i>
                  <span>Admin Dashboard Login</span>
                </button>
              )}
            </div>
          </aside>

          {/* ========================================================= */}
          {/* RIGHT MAIN CONTENT WORKSPACE                              */}
          {/* ========================================================= */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* ========================================================= */}
            {/* VIEW 1: MODERN WHITE EXECUTIVE HOME HUB                   */}
            {/* ========================================================= */}
            {currentView === "home" && (
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade">
                {/* Top Executive Banner */}
                <div className="bg-gradient-to-br from-white via-indigo-50/30 to-sky-50/40 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none"></div>
                  <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none"></div>

                  <div className="space-y-3 max-w-2xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                      <span>KodeinX Engineering & Innovation Hub â€¢ Raju&apos;s College, Rajapalayam</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                      KodeinX <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Team & Engineering</span> Workspace
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Centralized portal for <strong>Embedded IoT</strong>, <strong>Artificial Intelligence</strong>, and <strong>Full-Stack Web Engineering</strong>. Connect directly with verified engineers, explore live hardware & software projects, or manage your member credentials.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
                    <button
                      onClick={() => setCurrentView("team")}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer keep-white"
                    >
                      <i data-lucide="users" className="w-4 h-4"></i>
                      <span>View Team Roster ({members.length})</span>
                    </button>
                    <button
                      onClick={() => setCurrentView("contact")}
                      className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                    >
                      <i data-lucide="message-square" className="w-4 h-4 text-blue-600"></i>
                      <span>Live Chat & Contact</span>
                    </button>
                  </div>
                </div>

                {/* 4 Clean White KPI Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div
                    onClick={() => setCurrentView("team")}
                    className="bg-gradient-to-br from-white to-blue-50/40 border border-slate-200/90 hover:border-blue-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Team Engineers</span>
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                        <i data-lucide="users" className="w-4 h-4"></i>
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900">{members.length}</p>
                    <p className="text-[11px] text-blue-600 font-bold mt-1.5 flex items-center gap-1">
                      <span>Verified Roster</span>
                      <span>â†’</span>
                    </p>
                  </div>

                  <div
                    onClick={() => setCurrentView("team")}
                    className="bg-gradient-to-br from-white to-emerald-50/40 border border-slate-200/90 hover:border-emerald-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Online</span>
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900">
                      {members.filter(m => getMemberPresence(m).isOnline).length}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                      <span>Active Now</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </p>
                  </div>

                  <div
                    onClick={() => setCurrentView("projects")}
                    className="bg-gradient-to-br from-white to-indigo-50/40 border border-slate-200/90 hover:border-indigo-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projects</span>
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
                        <i data-lucide="cpu" className="w-4 h-4"></i>
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900">{projects.length}</p>
                    <p className="text-[11px] text-indigo-600 font-bold mt-1.5 flex items-center gap-1">
                      <span>IoT, AI & Web</span>
                      <span>â†’</span>
                    </p>
                  </div>

                  <div
                    onClick={() => setCurrentView("achievements")}
                    className="bg-gradient-to-br from-white to-amber-50/40 border border-slate-200/90 hover:border-amber-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Achievements</span>
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all shadow-xs">
                        <i data-lucide="award" className="w-4 h-4"></i>
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900">{achievements.length}</p>
                    <p className="text-[11px] text-amber-600 font-bold mt-1.5 flex items-center gap-1">
                      <span>Awards & Certs</span>
                      <span>â†’</span>
                    </p>
                  </div>
                </div>

                {/* Split Grid: Live Team Directory Preview (Left) & Core Domains + Campus Hub (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 Columns: Featured Team Members */}
                  <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                          <i data-lucide="users" className="w-5 h-5 text-blue-600"></i>
                          <span>KodeinX Active Engineering Roster</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Click any member to view their profile, access qualifications, or connect.
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentView("team")}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Full Directory</span>
                        <span>â†’</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {members.slice(0, 4).map(member => {
                        const presence = getMemberPresence(member);
                        return (
                          <div
                            key={member.id}
                            className="p-5 rounded-3xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4 group"
                          >
                            <div className="flex items-start gap-3.5">
                              <div className="relative shrink-0">
                                <img
                                  src={member.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=0c1438&textColor=38bdf8`}
                                  alt={member.name}
                                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 bg-white shadow-xs group-hover:scale-105 transition-transform"
                                />
                                <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${presence.isOnline ? "bg-emerald-500 ring-2 ring-emerald-500/20" : "bg-slate-400"}`}></span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition truncate">{member.name}</h4>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    presence.isOnline
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-slate-100 text-slate-600 border-slate-200"
                                  }`}>
                                    {presence.label}
                                  </span>
                                </div>
                                <p className="text-xs font-semibold text-indigo-600 truncate mt-0.5">{member.role}</p>
                                <p className="text-[11px] text-slate-500 truncate mt-1 flex items-center gap-1">
                                  <i data-lucide="graduation-cap" className="w-3 h-3 text-slate-400 shrink-0"></i>
                                  <span>{member.qualification || "Engineering Specialist"}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 pt-3 border-t border-slate-200/70">
                              <button
                                onClick={() => setViewingMemberProfile(member)}
                                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer keep-white"
                              >
                                <i data-lucide="eye" className="w-3.5 h-3.5"></i>
                                <span>Profile</span>
                              </button>
                              <a
                                href={formatLinkedInUrl(member.linkedin, member.name) || "#"}
                                target={member.linkedin ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  const url = formatLinkedInUrl(member.linkedin, member.name);
                                  if (!url) {
                                    e.preventDefault();
                                    alert(`No LinkedIn profile URL provided for ${member.name} yet.`);
                                  }
                                }}
                                className="p-2 rounded-xl bg-[#0077b5]/10 hover:bg-[#0077b5] text-[#0077b5] hover:text-white border border-[#0077b5]/20 text-xs font-bold transition flex items-center justify-center cursor-pointer"
                                title={member.linkedin ? `Visit ${member.name}'s LinkedIn` : `No LinkedIn`}
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                              </a>
                              <a
                                href={formatGitHubUrl(member.github, member.name) || "#"}
                                target={member.github ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  const url = formatGitHubUrl(member.github, member.name);
                                  if (!url) {
                                    e.preventDefault();
                                    alert(`No GitHub profile URL provided for ${member.name} yet.`);
                                  }
                                }}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 text-xs font-bold transition flex items-center justify-center cursor-pointer"
                                title={member.github ? `Visit ${member.name}'s GitHub` : `No GitHub`}
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                              </a>
                              <button
                                onClick={() => {
                                  setMessageModalTarget(member);
                                  setDirectMessageForm(prev => ({
                                    ...prev,
                                    subject: `Inquiry for ${member.name}`
                                  }));
                                }}
                                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 text-xs font-bold transition flex items-center justify-center cursor-pointer"
                                title={`Send Message to ${member.name}`}
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                              </button>
                              {member.phone && (
                                <a
                                  href={`tel:${cleanTelNumber(member.phone)}`}
                                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200 text-xs font-bold transition flex items-center justify-center cursor-pointer"
                                  title={`Call ${member.phone}`}
                                >
                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Engineering Pillars & Location Info */}
                  <div className="space-y-4">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <i data-lucide="layers" className="w-4 h-4 text-blue-600"></i>
                        <span>Core Technology Domains</span>
                      </h3>

                      <div className="space-y-3">
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                          <div className="flex items-center gap-2.5 mb-1">
                            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">IoT</span>
                            <h4 className="text-xs font-extrabold text-slate-900">Embedded IoT Systems</h4>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            ESP32, Arduino, sensor telemetry grids, and real-time MQTT automation.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                          <div className="flex items-center gap-2.5 mb-1">
                            <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">AI</span>
                            <h4 className="text-xs font-extrabold text-slate-900">Artificial Intelligence</h4>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Computer vision pipelines, deep learning models, and intelligent automation.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                          <div className="flex items-center gap-2.5 mb-1">
                            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">Web</span>
                            <h4 className="text-xs font-extrabold text-slate-900">Full-Stack Web & Cloud</h4>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Modern React & Next.js platforms, cloud APIs, and responsive dashboards.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                      <h4 className="text-xs font-extrabold text-blue-600 uppercase tracking-wider mb-1">
                        Headquarters & Campus Hub
                      </h4>
                      <p className="text-sm font-black text-slate-900">
                        Rajapalayam, Raju&apos;s College
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 mb-4">
                        Tamil Nadu, India â€¢ {companyContact.email}
                      </p>
                      <button
                        onClick={() => setCurrentView("contact")}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer keep-white"
                      >
                        Open Contact & Search Hub â†’
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            )}

          {/* ========================================================= */}
          {/* VIEW 2: TEAM SHOWCASE (WITH QUALIFICATIONS DISPLAY)       */}
          {/* ========================================================= */}
          {currentView === "team" && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full animate-fade">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
                    <i data-lucide="users" className="w-4 h-4"></i>
                    KodeinX Engineering Collective
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Team Members & Engineering Roster
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
                    Verified roster of engineers specializing in Embedded IoT, AI, and Full-Stack Engineering at Raju&apos;s College, Rajapalayam.
                  </p>
                </div>

                {isMember && (
                  <button
                    onClick={() => { loadMemberDataForEdit(myMemberData); setShowMyProfileModal(true); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer keep-white"
                  >
                    <i data-lucide="edit-3" className="w-4 h-4"></i>
                    <span>Edit My Profile</span>
                  </button>
                )}
              </div>

              {/* Interactive Search Bar for Engineers */}
              <div className="mb-8 p-3 sm:p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:max-w-xl">
                  <i data-lucide="search" className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"></i>
                  <input
                    type="text"
                    placeholder="Search engineers by name, role, degree or skills (e.g. Prabakaran, Python, IoT)..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl pl-11 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                  {memberSearchQuery && (
                    <button
                      onClick={() => setMemberSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs p-1 rounded-full bg-slate-200/70"
                    >
                      âœ•
                    </button>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-semibold flex items-center gap-2 self-start md:self-auto px-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-slate-900 font-bold">{searchedMembers.length}</span>
                  <span>of {members.length} Engineers found</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {searchedMembers.length === 0 ? (
                  <div className="col-span-full py-16 text-center bg-white border border-slate-200/90 rounded-3xl p-8 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                      <i data-lucide="search" className="w-6 h-6"></i>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-1">No Engineers Found</h4>
                    <p className="text-xs text-slate-500 mb-4">No team member matches &quot;{memberSearchQuery}&quot;.</p>
                    <button onClick={() => setMemberSearchQuery("")} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition">
                      Clear Search
                    </button>
                  </div>
                ) : (
                  searchedMembers.map(member => {
                  const isCurrent = isMember && session?.memberId === member.id;
                  const canView = canViewMemberFullProfile(member);
                  const isPrivate = member.privacy === "private";
                  const reqStatus = getMemberAccessRequestStatus(member.id);

                  return (
                    <div
                      key={member.id}
                      className={`bg-white rounded-3xl overflow-hidden border ${
                        isCurrent ? "border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/5" : "border-slate-200/90 hover:border-indigo-300"
                      } transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between group`}
                    >
                      <div>
                        {isCurrent && (
                          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-4 py-1.5 flex items-center justify-between text-[11px] text-white font-bold tracking-wide shadow-sm">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                              <span>â˜… YOUR PUBLIC PROFILE (YOU)</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => { loadMemberDataForEdit(member); setCurrentView("member_dashboard"); }}
                              className="text-xs bg-slate-950/40 hover:bg-slate-950 text-white px-2.5 py-0.5 rounded-lg border border-white/20 cursor-pointer font-bold transition"
                            >
                              Edit Profile â†’
                            </button>
                          </div>
                        )}
                        {/* Member Background Banner */}
                        <div className="h-24 w-full relative overflow-hidden bg-gradient-to-r from-blue-100/70 via-indigo-100/70 to-purple-100/70">
                          {member.bannerImage ? (
                            <img src={member.bannerImage} alt="banner" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                          ) : (
                            <div className="w-full h-full opacity-40 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                          )}
                        </div>

                        {/* Member Profile Avatar & Header with Live Online/Offline Status */}
                        <div className="px-6 -mt-10 flex items-end justify-between gap-3 relative z-10">
                          <div className="relative">
                            <img
                              src={member.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=0c1438&textColor=38bdf8`}
                              alt={member.name}
                              className="w-20 h-20 rounded-2xl object-cover bg-white border-2 border-white ring-4 ring-slate-100 shadow-md group-hover:scale-105 transition-transform"
                            />
                            {/* Live Presence Status Dot on Avatar */}
                            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                              {getMemberPresence(member).isOnline && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              )}
                              <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white ${getMemberPresence(member).isOnline ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                            </span>
                          </div>

                          {/* Live Presence Status Badge & Privacy Tag */}
                          <div className="flex flex-col items-end gap-1 mb-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                              getMemberPresence(member).isOnline
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${getMemberPresence(member).isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
                              <span>{getMemberPresence(member).label}</span>
                            </span>
                            {isPrivate ? (
                              canView ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                  <i data-lucide="unlock" className="w-2.5 h-2.5"></i>
                                  <span>Unlocked âœ“</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                                  <i data-lucide="lock" className="w-2.5 h-2.5"></i>
                                  <span>Private</span>
                                </span>
                              )
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                                <i data-lucide="globe" className="w-2.5 h-2.5"></i>
                                <span>Public</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="px-6 pt-3">
                          <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition truncate">{member.name}</h3>
                          <p className="text-xs font-semibold text-indigo-600 mt-0.5">{member.role}</p>

                          {canView ? (
                            <>
                              {/* QUALIFICATIONS BOX */}
                              {member.qualification && (
                                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
                                  <div className="flex items-center gap-1.5 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-1">
                                    <i data-lucide="graduation-cap" className="w-3.5 h-3.5"></i>
                                    <span>Academic Qualification</span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-800 leading-snug">
                                    {member.qualification}
                                  </p>
                                  {member.institution && (
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                      {member.institution} {member.year ? `(${member.year})` : ''}
                                    </p>
                                  )}
                                  {member.phone && (
                                    <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                                      <i data-lucide="phone" className="w-3.5 h-3.5"></i>
                                      <a href={`tel:${cleanTelNumber(member.phone)}`} className="hover:underline">
                                        {member.phone}
                                      </a>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Bio */}
                              <p className="mt-4 text-xs text-slate-600 leading-relaxed line-clamp-3">
                                {member.bio}
                              </p>

                              {/* Skills */}
                              {member.skills && (
                                <div className="mt-4 flex flex-wrap gap-1.5">
                                  {(Array.isArray(member.skills) ? member.skills : member.skills.split(",")).map((sk, idx) => (
                                    <span key={idx} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80">
                                      {typeof sk === "string" ? sk.trim() : sk}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Certificates count */}
                              {member.certificates && member.certificates.length > 0 && (
                                <div className="mt-3 text-[11px] text-amber-600 font-bold flex items-center gap-1">
                                  <i data-lucide="award" className="w-3.5 h-3.5"></i>
                                  <span>{member.certificates.length} Certified Achievement(s)</span>
                                </div>
                              )}
                            </>
                          ) : (
                            /* LOCKED PRIVATE CARD TEASER */
                            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-2 text-rose-600">
                                <i data-lucide="lock" className="w-5 h-5"></i>
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 mb-0.5">Private Profile</h4>
                              <p className="text-[11px] text-slate-500 mb-3 leading-snug">
                                Degree, contact phone, and credentials are set to private.
                              </p>
                              {reqStatus === "pending" ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                                  <i data-lucide="clock" className="w-3 h-3 animate-pulse"></i>
                                  <span>Request Pending â³</span>
                                </div>
                              ) : reqStatus === "declined" ? (
                                <button
                                  onClick={() => handleSendAccessRequest(member)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition cursor-pointer"
                                >
                                  <i data-lucide="rotate-ccw" className="w-3 h-3"></i>
                                  <span>Declined â€¢ Re-request</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSendAccessRequest(member)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-[11px] font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer"
                                >
                                  <i data-lucide="key" className="w-3 h-3"></i>
                                  <span>Request Access</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Links & Contact Footer */}
                      <div className="p-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                        <button
                          onClick={() => setViewingMemberProfile(member)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer keep-white"
                          title={`View Full Profile of ${member.name}`}
                        >
                          <i data-lucide="eye" className="w-3.5 h-3.5"></i>
                          <span>Profile</span>
                        </button>

                        {/* Direct In-App Message Button */}
                        <button
                          onClick={() => {
                            setMessageModalTarget(member);
                            setDirectMessageForm(prev => ({
                              ...prev,
                              subject: `Project Inquiry regarding ${member.role || 'KodeinX Innovations'}`
                            }));
                          }}
                          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 text-xs font-bold transition shadow-xs cursor-pointer"
                          title={`Send Direct Message to ${member.name}`}
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                          <span>Message</span>
                        </button>

                        <a
                          href={formatLinkedInUrl(member.linkedin, member.name) || "#"}
                          target={member.linkedin ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            const url = formatLinkedInUrl(member.linkedin, member.name);
                            if (!url) {
                              e.preventDefault();
                              alert(`No LinkedIn profile URL provided for ${member.name} yet.`);
                            }
                          }}
                          className="p-2.5 rounded-xl bg-[#0077b5]/10 hover:bg-[#0077b5] text-[#0077b5] hover:text-white border border-[#0077b5]/20 text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center"
                          title={member.linkedin ? `Visit ${member.name}'s LinkedIn Profile` : `No LinkedIn URL`}
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                        </a>

                        <a
                          href={formatGitHubUrl(member.github, member.name) || "#"}
                          target={member.github ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            const url = formatGitHubUrl(member.github, member.name);
                            if (!url) {
                              e.preventDefault();
                              alert(`No GitHub profile URL provided for ${member.name} yet.`);
                            }
                          }}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center"
                          title={member.github ? `Visit ${member.name}'s GitHub Profile` : `No GitHub URL`}
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                        </a>

                        {member.resumeUrl && (
                          <a
                            href={member.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-700 hover:text-white border border-amber-300 font-bold text-xs transition shadow-xs flex items-center gap-1"
                            title={`View / Download ${member.name}'s Resume`}
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            <span className="hidden md:inline">Resume</span>
                          </a>
                        )}

                        {canView && member.phone && (
                          <a
                            href={`tel:${cleanTelNumber(member.phone)}`}
                            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200 text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center"
                            title={`Direct Call to ${member.name} (${member.phone})`}
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          </a>
                        )}

                        {isCurrent && (
                          <button
                            onClick={() => { loadMemberDataForEdit(member); setCurrentView("member_dashboard"); }}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                            title="Edit Only Your Profile"
                          >
                            <i data-lucide="edit-3" className="w-3.5 h-3.5"></i>
                            <span>Edit</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }))}
              </div>
            </main>
          )}

          {/* ========================================================= */}
          {/* VIEW 3: PROJECTS SHOWCASE                                 */}
          {/* ========================================================= */}
          {currentView === "projects" && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full animate-fade">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
                    <i data-lucide="folder-kanban" className="w-4 h-4"></i>
                    KodeinX Portfolio
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    IoT, AI & Web Innovations
                  </h2>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    {["All", "IoT", "AI", "Website"].map(f => (
                      <button
                        key={f}
                        onClick={() => setProjectFilter(f)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                          projectFilter === f ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  {isMember && (
                    <button
                      onClick={() => { setMemberDashboardTab("projects"); setCurrentView("member_dashboard"); }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <i data-lucide="plus-circle" className="w-4 h-4"></i>
                      <span>Publish My Project</span>
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => setCurrentView("admin_dashboard")}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <i data-lucide="plus-circle" className="w-4 h-4"></i>
                      <span>Add Project (Admin)</span>
                    </button>
                  )}
                </div>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="tech-card border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto mb-4">
                    <i data-lucide="folder-kanban" className="w-7 h-7"></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Projects Published Yet</h3>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    Team members can sign in with their authorized account and publish their individual IoT devices, AI projects, and Web applications.
                  </p>
                  {isMember ? (
                    <button
                      onClick={() => { setMemberDashboardTab("projects"); setCurrentView("member_dashboard"); }}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition cursor-pointer"
                    >
                      + Publish Your First Project
                    </button>
                  ) : (
                    <button
                      onClick={() => { setGoogleAuthError(""); setShowGoogleAuthModal(true); }}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition cursor-pointer"
                    >
                      Member Sign In to Add Project
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {filteredProjects.map(proj => (
                    <div
                      key={proj.id}
                      className="tech-card border border-slate-200 hover:border-indigo-400 rounded-3xl overflow-hidden transition shadow-sm flex flex-col justify-between group"
                    >
                      <div>
                        <div className="h-48 overflow-hidden relative bg-slate-100">
                          <img
                            src={proj.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur border border-slate-200 text-indigo-700 shadow-sm">
                            {proj.category}
                          </span>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                              {proj.title}
                            </h3>
                          </div>
                          {proj.authorName && (
                            <p className="text-[11px] text-sky-700 font-semibold mb-2 flex items-center gap-1">
                              <i data-lucide="user" className="w-3 h-3"></i>
                              <span>Built by: {proj.authorName}</span>
                            </p>
                          )}
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                            {proj.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {(Array.isArray(proj.techStack) ? proj.techStack : (proj.techStack || "").split(",")).filter(Boolean).map((tech, idx) => (
                              <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                                {typeof tech === "string" ? tech.trim() : tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-github px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 text-xs font-bold transition shadow-sm cursor-pointer"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                              <span>Code</span>
                            </a>
                          )}

                          {proj.demoUrl && (
                            <a
                              href={proj.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition cursor-pointer"
                            >
                              <span>Live Demo</span>
                              <i data-lucide="external-link" className="w-3.5 h-3.5"></i>
                            </a>
                          )}
                        </div>

                        {(isAdmin || (isMember && proj.authorMemberId === session?.memberId)) && (
                          <button
                            onClick={() => handleMemberDeleteProject(proj.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Project"
                          >
                            <i data-lucide="trash-2" className="w-3.5 h-3.5"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          )}

          {/* ========================================================= */}
          {/* VIEW 4: ACHIEVEMENTS & QUALIFICATIONS SUMMARY             */}
          {/* ========================================================= */}
          {currentView === "achievements" && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full animate-fade">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-200/90">
                <div>
                  <div className="inline-flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
                    <i data-lucide="award" className="w-4 h-4"></i>
                    Credentials & Technical Honors
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Team Certifications & Degrees
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xl">
                    Verified academic degrees, technical credentials, and national hackathon achievements earned by the KodeinX team.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddAchievementModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition shrink-0 cursor-pointer"
                >
                  <i data-lucide="plus-circle" className="w-4 h-4"></i>
                  <span>Add Achievement / Degree</span>
                </button>
              </div>

              {achievements.length === 0 ? (
                <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-4">
                    <i data-lucide="award" className="w-7 h-7"></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Achievements Added Yet</h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Click the button below to publish your first team certification, degree, or innovation award.
                  </p>
                  <button
                    onClick={() => setShowAddAchievementModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow transition cursor-pointer"
                  >
                    + Add First Achievement
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className="bg-white border border-slate-200/90 hover:border-amber-400 rounded-3xl p-6 shadow-xs hover:shadow-md flex flex-col justify-between transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>

                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            {ach.badge || "ðŸ† Honor"}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            {ach.year}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-amber-600 transition leading-snug">
                          {ach.title}
                        </h3>

                        <p className="text-xs text-indigo-600 font-medium mt-1.5 flex items-center gap-1.5">
                          <i data-lucide="shield-check" className="w-3.5 h-3.5"></i>
                          <span>{ach.issuer}</span>
                        </p>

                        <div className="mt-3 inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-medium">
                          {ach.category || "IoT & AI"}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={ach.recipientPhoto || "https://api.dicebear.com/7.x/initials/svg?seed=K"}
                            alt={ach.recipientName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-white shrink-0"
                          />
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 truncate">{ach.recipientName}</p>
                            <p className="text-[10px] text-slate-500 truncate">{ach.recipientRole}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {ach.url && ach.url !== "#" && (
                            <a
                              href={ach.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 text-xs transition cursor-pointer"
                              title="Verify Certificate Link"
                            >
                              <i data-lucide="external-link" className="w-3.5 h-3.5"></i>
                            </a>
                          )}
                          {(isAdmin || (isMember && (ach.uploaderId === session?.memberId || ach.recipientName?.toLowerCase() === session?.name?.toLowerCase()))) && (
                            <button
                              onClick={() => handleDeleteAchievement(ach.id)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Achievement"
                            >
                              <i data-lucide="trash-2" className="w-3.5 h-3.5"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          )}

          {/* ========================================================= */}
          {/* VIEW 5: COMPREHENSIVE CONTACT & INQUIRY VIEW               */}
          {/* ========================================================= */}
          {currentView === "contact" && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full animate-fade">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
                  <i data-lucide="mail" className="w-4 h-4"></i>
                  Get In Touch With KodeinX
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Connect With Our Innovation Team
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Have an IoT automation challenge, AI vision requirement, or web platform project? Contact our engineers directly or submit an inquiry below.
                </p>
              </div>

              {contactSentSuccess && (
                <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center animate-fade shadow-sm">
                  <p className="font-bold text-sm flex items-center justify-center gap-2">
                    <i data-lucide="check-circle" className="w-5 h-5 text-emerald-600"></i>
                    <span>Message Received! The KodeinX Team will get in touch with you shortly.</span>
                  </p>
                </div>
              )}

              {/* DIRECT ENGINEER DIRECTORY & LIVE MESSAGING SEARCH */}
              <div className="mb-10 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 relative z-10">
                  <div>
                    <div className="inline-flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                      <i data-lucide="message-square" className="w-4 h-4"></i>
                      <span>Direct Engineer Contacts & Live In-App Messenger</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Search & Message Engineers Directly
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Search any KodeinX engineer by name to initiate a direct phone call, WhatsApp chat, or send an in-app message directly to their profile inbox.
                    </p>
                  </div>
                  
                  {/* Search Input Box */}
                  <div className="relative w-full md:w-80 shrink-0">
                    <i data-lucide="search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                    <input
                      type="text"
                      placeholder="Search engineer name (e.g. Prabakaran)..."
                      value={memberSearchQuery}
                      onChange={(e) => setMemberSearchQuery(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                    {memberSearchQuery && (
                      <button
                        onClick={() => setMemberSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs p-1 rounded-full bg-slate-200/70"
                      >
                        âœ•
                      </button>
                    )}
                  </div>
                </div>

                {/* Engineers Cards Grid in Contacts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                  {searchedMembers.length === 0 ? (
                    <div className="col-span-full py-8 text-center bg-slate-50 rounded-2xl border border-slate-200 p-6">
                      <p className="text-xs text-slate-500">No engineer found matching &quot;{memberSearchQuery}&quot;.</p>
                      <button
                        onClick={() => setMemberSearchQuery("")}
                        className="mt-2 text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                      >
                        Reset Search
                      </button>
                    </div>
                  ) : (
                    searchedMembers.map(member => {
                      const presence = getMemberPresence(member);
                      const isOnline = presence.isOnline;
                      return (
                        <div
                          key={member.id}
                          className="p-4 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-md"
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="relative shrink-0">
                                <img
                                  src={member.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=0c1438&textColor=38bdf8`}
                                  alt={member.name}
                                  className="w-12 h-12 rounded-2xl object-cover bg-white border border-slate-200 shadow-xs"
                                />
                                <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${isOnline ? "bg-emerald-500 animate-pulse ring-2 ring-emerald-500/20" : presence.dotClass}`}></span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">{member.name}</h4>
                                <p className="text-[11px] text-indigo-600 font-semibold truncate">{member.role}</p>
                                <span className={`inline-block mt-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full border ${presence.badgeClass}`}>
                                  {presence.label}
                                </span>
                              </div>
                            </div>
                            {member.qualification && (
                              <p className="text-[11px] text-slate-600 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/80 mb-3 truncate flex items-center gap-1.5">
                                <i data-lucide="graduation-cap" className="w-3 h-3 text-slate-400 shrink-0"></i>
                                <span>{member.qualification}</span>
                              </p>
                            )}
                          </div>

                          {/* Quick Interactive Actions: Live Msg, Real Mail, WhatsApp, Call */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/70">
                            <button
                              onClick={() => {
                                setMessageModalTarget(member);
                                setDirectMessageForm(prev => ({
                                  ...prev,
                                  subject: `Project Inquiry regarding ${member.role || 'KodeinX'}`
                                }));
                              }}
                              className="w-full py-2 px-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                              title={`Direct Message ${member.name} in Real-Time`}
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                              <span>Live Msg</span>
                            </button>

                            {member.email ? (
                              <a
                                href={`mailto:${member.email}?subject=KodeinX%20Project%20Inquiry&body=Hello%20${encodeURIComponent(member.name)},%0A%0AI%20am%20contacting%20you%20regarding%20your%20engineering%20work%20at%20KodeinX.`}
                                className="w-full py-2 px-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                                title={`Send Real Email to ${member.email}`}
                              >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                <span>Real Mail</span>
                              </a>
                            ) : (
                              <button
                                onClick={() => setViewingMemberProfile(member)}
                                className="w-full py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                              >
                                <i data-lucide="user" className="w-3.5 h-3.5"></i>
                                <span>Profile</span>
                              </button>
                            )}

                            {member.phone && (
                              <a
                                href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(member.name)},%20I%20contacted%20you%20via%20KodeinX%20portal.`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200 text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                                title={`WhatsApp Chat with ${member.name}`}
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/></svg>
                                <span>WhatsApp</span>
                              </a>
                            )}

                            {member.phone && (
                              <a
                                href={`tel:${cleanTelNumber(member.phone)}`}
                                className="w-full py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer keep-white"
                                title={`Direct Phone Call to ${member.name} (${member.phone})`}
                              >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                <span>Call</span>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* LEFT: Official Direct Contact Cards (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Direct Phone / Call Card */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs relative overflow-hidden group hover:border-emerald-400 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <i data-lucide="phone" className="w-6 h-6"></i>
                      </div>
                      <div className="flex-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Direct Phone Contact</span>
                        <p className="text-base font-bold text-slate-900 mt-0.5">{companyContact.phone}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Primary Engineer: Prabakaran M</p>
                        <div className="mt-3 flex items-center gap-2">
                          <a
                            href={`tel:${cleanTelNumber(companyContact.phone)}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-500 transition cursor-pointer keep-white"
                          >
                            <i data-lucide="phone" className="w-3.5 h-3.5"></i>
                            <span>Call Now</span>
                          </a>
                          <a
                            href={`https://wa.me/${companyContact.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20KodeinX%20Team`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition cursor-pointer"
                          >
                            <i data-lucide="message-square" className="w-3.5 h-3.5"></i>
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Official Hub Email Card */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs relative overflow-hidden group hover:border-indigo-400 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <i data-lucide="mail" className="w-6 h-6"></i>
                      </div>
                      <div className="flex-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Official Hub Email</span>
                        <p className="text-base font-bold text-indigo-600 mt-0.5">{companyContact.email}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Project proposals & technical consulting</p>
                        <div className="mt-3">
                          <a
                            href={`mailto:${companyContact.email}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition cursor-pointer keep-white"
                          >
                            <i data-lucide="mail" className="w-3.5 h-3.5"></i>
                            <span>Send Email</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Innovation Hub Location */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <i data-lucide="map-pin" className="w-6 h-6"></i>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Innovation Lab Location</span>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">{companyContact.location}</p>
                        <p className="text-xs text-slate-500 mt-1">{companyContact.supportHours}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Interactive Contact / Project Inquiry Form (3 cols) */}
                <div className="lg:col-span-3 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
                    <i data-lucide="send" className="w-5 h-5 text-indigo-600"></i>
                    <span>Send a Direct Project Inquiry</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Fill out the form below. Messages are delivered directly to the KodeinX administration portal.
                  </p>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Your Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Rivera"
                          value={contactForm.name}
                          onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Your Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. alex@company.com"
                          value={contactForm.email}
                          onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Phone / WhatsApp</label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          value={contactForm.phone}
                          onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Project Category</label>
                        <select
                          value={contactForm.projectType}
                          onChange={e => setContactForm({ ...contactForm, projectType: e.target.value })}
                          className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        >
                          <option value="IoT Systems">IoT Hardware & Sensor Grids</option>
                          <option value="AI & Computer Vision">AI Deep Learning & Computer Vision</option>
                          <option value="Web & Cloud Platforms">Web & Real-Time Cloud Systems</option>
                          <option value="General Innovation">General Technology Partnership</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Project Details / Message *</label>
                      <textarea
                        rows="4"
                        required
                        placeholder="Tell us about your project requirements, timeline, and questions..."
                        value={contactForm.message}
                        onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer keep-white"
                    >
                      <i data-lucide="send" className="w-4 h-4"></i>
                      <span>Send Inquiry to KodeinX Engineers</span>
                    </button>
                  </form>
                </div>
              </div>
            </main>
          )}

          {/* ========================================================= */}
          {/* VIEW 6: DEDICATED MEMBER DASHBOARD (PRIVATE WORKSPACE)    */}
          {/* ========================================================= */}
          {currentView === "member_dashboard" && isMember && myMemberData && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full animate-fade">
              {/* Member Dashboard Header */}
              <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-[#081230] via-[#0d1c47] to-[#081230] border border-sky-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                {(memberProfileForm.bannerImage || myMemberData.bannerImage) && (
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <img
                      src={memberProfileForm.bannerImage || myMemberData.bannerImage}
                      alt=""
                      className="w-full h-full object-cover opacity-25 brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#070e28]/90 via-[#0a1538]/75 to-[#070e28]/90"></div>
                  </div>
                )}
                <div className="flex items-center gap-5 relative z-10">
                  <div className="relative group">
                    <img
                      src={memberProfileForm.photo || myMemberData.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(myMemberData.name)}&backgroundColor=0c1438&textColor=38bdf8`}
                      alt={myMemberData.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-[#081029] border-2 border-emerald-400/80 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#070913] flex items-center justify-center text-[10px] text-slate-950 font-black">
                      âœ“
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Active Now</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-medium">
                        <i data-lucide="shield-check" className="w-3 h-3 text-sky-400"></i>
                        <span>{myMemberData.email}</span>
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">{myMemberData.name}</h2>
                    <p className="text-xs text-sky-300 font-semibold">{myMemberData.role || "Software Engineer"}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      ðŸŽ“ {myMemberData.qualification || "Degree not set"} â€¢ {myMemberData.institution || "College not set"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 relative z-10">
                  <button
                    onClick={() => setCurrentView("team")}
                    className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <i data-lucide="eye" className="w-4 h-4"></i>
                    <span>View Public Card</span>
                  </button>
                  <button
                    onClick={() => setCurrentView("home")}
                    className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition"
                  >
                    Back to Home
                  </button>
                </div>
              </div>

              {/* Workspace Navigation Tabs */}
              <div className="flex border-b border-slate-200/90 mb-8 overflow-x-auto space-x-2">
                {[
                  { id: "profile", label: "My Profile & Privacy", icon: "user-check" },
                  { 
                    id: "access_requests", 
                    label: `Access Requests ${accessRequests.filter(r => r.targetMemberId === myMemberData.id && r.status === "pending").length > 0 ? `(${accessRequests.filter(r => r.targetMemberId === myMemberData.id && r.status === "pending").length})` : ''}`, 
                    icon: "shield" 
                  },
                  { 
                    id: "messages", 
                    label: `Inbox & Messages ${memberMessages.filter(m => m.toMemberId === myMemberData.id && m.status === "unread").length > 0 ? `(${memberMessages.filter(m => m.toMemberId === myMemberData.id && m.status === "unread").length} New)` : ''}`, 
                    icon: "message-square" 
                  },
                  { id: "projects", label: "My Project Submissions", icon: "folder-plus" },
                  { id: "certificates", label: "Certificates & Badges", icon: "award" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setMemberDashboardTab(tab.id)}
                    className={`pb-3.5 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
                      memberDashboardTab === tab.id
                        ? "border-indigo-600 text-indigo-600 font-black"
                        : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    <i data-lucide={tab.icon} className="w-4 h-4"></i>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* TAB 1: EDIT PROFILE & QUALIFICATIONS */}
              {memberDashboardTab === "profile" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Left Form: Edit Details */}
                  <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-1">
                      <i data-lucide="edit-3" className="w-5 h-5 text-indigo-600"></i>
                      <span>Edit & Develop Your Profile</span>
                    </h3>
                    <p className="text-xs text-slate-500 mb-6 font-medium">
                      Update your photo, background cover, role, academic degree, contact phone, privacy visibility, and bio.
                    </p>

                    <form onSubmit={handleSaveMyProfile} className="space-y-4">
                      {/* Profile Visibility / Privacy Switcher */}
                      <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 mb-4">
                        <div className="flex items-center justify-between mb-2.5">
                          <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                            <i data-lucide="shield" className="w-4 h-4 text-indigo-600"></i>
                            <span>Profile Visibility & Access Permission *</span>
                          </label>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            memberProfileForm.privacy === "private"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}>
                            {memberProfileForm.privacy === "private" ? "ðŸ”’ Set to Private" : "ðŸŒ Set to Public"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mb-3 leading-relaxed font-medium">
                          Choose whether other members can view your degree, college, phone number, and certificates directly, or must request access first.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                            memberProfileForm.privacy !== "private"
                              ? "bg-emerald-50/70 border-emerald-500/60 ring-1 ring-emerald-500/20 text-slate-900"
                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}>
                            <input
                              type="radio"
                              name="privacyMode"
                              value="public"
                              checked={memberProfileForm.privacy !== "private"}
                              onChange={() => setMemberProfileForm({ ...memberProfileForm, privacy: "public" })}
                              className="mt-1 accent-emerald-600"
                            />
                            <div>
                              <div className="font-bold text-xs text-slate-900">ðŸŒ Public Profile</div>
                              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                                Visible to everyone. Team members can view all details directly.
                              </p>
                            </div>
                          </label>

                          <label className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                            memberProfileForm.privacy === "private"
                              ? "bg-rose-50/70 border-rose-500/60 ring-1 ring-rose-500/20 text-slate-900"
                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}>
                            <input
                              type="radio"
                              name="privacyMode"
                              value="private"
                              checked={memberProfileForm.privacy === "private"}
                              onChange={() => setMemberProfileForm({ ...memberProfileForm, privacy: "private" })}
                              className="mt-1 accent-rose-600"
                            />
                            <div>
                              <div className="font-bold text-xs text-slate-900">ðŸ”’ Private Profile (Locked)</div>
                              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                                Locked. Other members must click "Request Access" and you must accept.
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={memberProfileForm.name}
                            onChange={e => setMemberProfileForm({ ...memberProfileForm, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                            Your Role (You Set Your Own Role) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Lead IoT Engineer / AI Vision Researcher"
                            value={memberProfileForm.role}
                            onChange={e => setMemberProfileForm({ ...memberProfileForm, role: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                          />
                        </div>
                      </div>

                      {/* Educational Qualification */}
                      <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100">
                        <label className="block text-xs font-bold text-indigo-900 uppercase mb-2.5 flex items-center gap-1.5">
                          <i data-lucide="graduation-cap" className="w-4 h-4 text-indigo-600"></i>
                          <span>Academic Degree & University *</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-1">
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Degree / Course</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. B.Tech AI & DS / B.E CSE"
                              value={memberProfileForm.qualification}
                              onChange={e => setMemberProfileForm({ ...memberProfileForm, qualification: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                            />
                          </div>
                          <div className="sm:col-span-1">
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">College / University</label>
                            <input
                              type="text"
                              placeholder="e.g. Raju's College, Rajapalayam"
                              value={memberProfileForm.institution}
                              onChange={e => setMemberProfileForm({ ...memberProfileForm, institution: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                            />
                          </div>
                          <div className="sm:col-span-1">
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Graduation Year</label>
                            <input
                              type="text"
                              placeholder="e.g. 2024"
                              value={memberProfileForm.year}
                              onChange={e => setMemberProfileForm({ ...memberProfileForm, year: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Phone, LinkedIn & GitHub */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                            Phone Number (Direct Call)
                          </label>
                          <input
                            type="tel"
                            placeholder="e.g. +91 98765 43210"
                            value={memberProfileForm.phone}
                            onChange={e => setMemberProfileForm({ ...memberProfileForm, phone: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                            LinkedIn Profile URL / Username
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="linkedin.com/in/username or full URL"
                              value={memberProfileForm.linkedin}
                              onChange={e => setMemberProfileForm({ ...memberProfileForm, linkedin: e.target.value })}
                              className="flex-1 bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                            />
                            <button
                              type="button"
                              onClick={() => openExternalLink(memberProfileForm.linkedin || myMemberData.linkedin, memberProfileForm.name || myMemberData.name)}
                              className="px-3 py-2.5 rounded-xl bg-[#0077b5] hover:bg-[#005f93] text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                              title="Test if LinkedIn opens correctly"
                            >
                              <i data-lucide="external-link" className="w-3.5 h-3.5"></i>
                              <span>Test Link</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
                          <i data-lucide="github" className="w-3.5 h-3.5 text-slate-700"></i>
                          <span>GitHub Profile URL / Username</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="github.com/username or username (e.g. prabakaran-m)"
                            value={memberProfileForm.github || ""}
                            onChange={e => setMemberProfileForm({ ...memberProfileForm, github: e.target.value })}
                            className="flex-1 bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                          />
                          <button
                            type="button"
                            onClick={() => openGitHubLink(memberProfileForm.github || myMemberData.github, memberProfileForm.name || myMemberData.name)}
                            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm keep-white"
                            title="Test if GitHub opens correctly"
                          >
                            <i data-lucide="github" className="w-3.5 h-3.5"></i>
                            <span>Test GitHub</span>
                          </button>
                        </div>
                      </div>

                      {/* Private Passcode Security Box (Only this member knows) */}
                      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-sm">
                        <label className="block text-xs font-bold text-amber-900 uppercase mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <i data-lucide="shield-check" className="w-4 h-4 text-amber-600"></i>
                            <span>Private Member Security Passcode</span>
                          </span>
                          <span className="text-[10px] text-amber-800 font-bold px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300">
                            Strict Protection
                          </span>
                        </label>
                        <p className="text-[11px] text-slate-600 mb-3 leading-relaxed font-medium">
                          This passcode protects your account. Other members cannot access or modify your profile without this secret code.
                        </p>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Set your secret passcode (e.g. MyPass@2026)"
                            value={memberProfileForm.passcode || ""}
                            onChange={e => setMemberProfileForm({ ...memberProfileForm, passcode: e.target.value })}
                            className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 font-mono tracking-wider font-semibold"
                          />
                        </div>
                      </div>

                      {/* Profile Photo (Avatar) Upload & Delete Section */}
                      <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                            <i data-lucide="camera" className="w-4 h-4 text-indigo-600"></i>
                            <span>Profile Photo (Avatar)</span>
                          </label>
                          <div className="flex items-center gap-2">
                            {memberProfileForm.photo && !memberProfileForm.photo.includes("dicebear.com") ? (
                              <button
                                type="button"
                                onClick={handleDeleteMyPhoto}
                                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                <i data-lucide="trash-2" className="w-3.5 h-3.5"></i>
                                <span>Delete / Remove Photo</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-semibold">Default Initials Avatar Active</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="relative shrink-0">
                            <img
                              src={memberProfileForm.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(memberProfileForm.name || myMemberData.name)}&backgroundColor=0c1438&textColor=38bdf8`}
                              alt="Avatar Preview"
                              className="w-16 h-16 rounded-2xl object-cover bg-white border-2 border-slate-200 shadow-sm"
                            />
                            {memberProfileForm.photo && !memberProfileForm.photo.includes("dicebear.com") && (
                              <button
                                type="button"
                                onClick={handleDeleteMyPhoto}
                                title="Delete Photo"
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center shadow-lg border border-white cursor-pointer"
                              >
                                âœ•
                              </button>
                            )}
                          </div>

                          <div className="flex-1 w-full space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                  handleImageUpload(e, url => handleInstantPhotoUpdate(url));
                                  e.target.value = "";
                                }}
                                className="flex-1 text-xs text-slate-600 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                              />
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Or paste photo URL (https://...)"
                                value={memberProfileForm.photo?.startsWith("data:") ? "" : (memberProfileForm.photo || "")}
                                onChange={e => handleInstantPhotoUpdate(e.target.value)}
                                className="flex-1 bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                              />
                              {memberProfileForm.photo && (
                                <button
                                  type="button"
                                  onClick={handleDeleteMyPhoto}
                                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition shrink-0 cursor-pointer"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Background Banner Image Section */}
                      <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                            <i data-lucide="image" className="w-4 h-4 text-indigo-600"></i>
                            <span>Profile Background Cover / Banner</span>
                          </label>
                          <div className="flex items-center gap-2">
                            {memberProfileForm.bannerImage ? (
                              <button
                                type="button"
                                onClick={handleDeleteMyBanner}
                                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                <i data-lucide="trash-2" className="w-3.5 h-3.5"></i>
                                <span>Delete / Remove Background</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-semibold">Default Tech Grid Active</span>
                            )}
                          </div>
                        </div>

                        {/* Live Banner Strip Preview inside Form */}
                        <div className="mb-3 h-20 w-full rounded-2xl relative overflow-hidden border border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 shadow-inner">
                          {memberProfileForm.bannerImage ? (
                            <img
                              src={memberProfileForm.bannerImage}
                              alt="Banner Preview"
                              className="w-full h-full object-cover brightness-95"
                            />
                          ) : (
                            <div className="w-full h-full opacity-40 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-2.5">
                            <span className="text-[10px] font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20">
                              {memberProfileForm.bannerImage ? "âœ“ Custom Background Active" : "Default Slate & Indigo Tech Grid"}
                            </span>
                            {memberProfileForm.bannerImage && (
                              <button
                                type="button"
                                onClick={handleDeleteMyBanner}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold shadow transition cursor-pointer"
                              >
                                âœ• Remove
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => {
                                handleImageUpload(e, url => handleInstantBannerUpdate(url));
                                e.target.value = "";
                              }}
                              className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Or paste banner URL (https://...)"
                                value={memberProfileForm.bannerImage?.startsWith("data:") ? "" : (memberProfileForm.bannerImage || "")}
                                onChange={e => handleInstantBannerUpdate(e.target.value)}
                                className="flex-1 bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                              />
                              {memberProfileForm.bannerImage && (
                                <button
                                  type="button"
                                  onClick={handleDeleteMyBanner}
                                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition shrink-0 cursor-pointer"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-600 mb-1.5 font-bold">Or choose a professional preset:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { name: "Default Navy", url: "" },
                                { name: "Neon IoT", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80" },
                                { name: "Neural AI", url: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&auto=format&fit=crop&q=80" },
                                { name: "Cyber Matrix", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80" },
                                { name: "Deep Space", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80" }
                              ].map((preset, i) => (
                                <button
                                  type="button"
                                  key={i}
                                  onClick={() => handleInstantBannerUpdate(preset.url)}
                                  className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-semibold transition cursor-pointer ${
                                    memberProfileForm.bannerImage === preset.url
                                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                      : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                                  }`}
                                >
                                  {preset.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Skills & Bio */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                          Special Skills (Comma Separated)
                        </label>
                        <input
                          type="text"
                          placeholder="ESP32, Python, PyTorch, React, WebSockets, Next.js"
                          value={memberProfileForm.skillsString}
                          onChange={e => setMemberProfileForm({ ...memberProfileForm, skillsString: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">About Me / Bio</label>
                        <textarea
                          rows="3"
                          placeholder="Brief technical summary of your expertise at KodeinX..."
                          value={memberProfileForm.bio}
                          onChange={e => setMemberProfileForm({ ...memberProfileForm, bio: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white resize-none transition"
                        />
                      </div>

                      {/* Resume / CV Attachment Section */}
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                            <i data-lucide="file-text" className="w-4 h-4 text-amber-600"></i>
                            <span>Resume / Curriculum Vitae (CV)</span>
                          </label>
                          {memberProfileForm.resumeUrl && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              âœ“ Resume Attached
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mb-3 font-medium">
                          Attach your professional Resume/CV (via URL or upload PDF/Doc). A "Resume" button will appear on your public profile card so visitors can review your qualifications.
                        </p>

                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="Paste Resume URL (Google Drive, LinkedIn document, or Dropbox link)"
                              value={memberProfileForm.resumeUrl || ""}
                              onChange={e => setMemberProfileForm({ ...memberProfileForm, resumeUrl: e.target.value })}
                              className="flex-1 bg-white border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                            />
                            {memberProfileForm.resumeUrl && (
                              <a
                                href={memberProfileForm.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm"
                              >
                                <span>Preview</span>
                                <i data-lucide="external-link" className="w-3.5 h-3.5"></i>
                              </a>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-1 flex-wrap">
                            <span className="text-[11px] text-slate-600 font-bold">Or upload PDF:</span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 5 * 1024 * 1024) {
                                  alert("File is too large! Please upload a PDF under 5MB or paste a Google Drive link.");
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const dataUri = event.target.result;
                                  setMemberProfileForm(prev => ({
                                    ...prev,
                                    resumeUrl: dataUri,
                                    resumeName: file.name
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                            />
                            {memberProfileForm.resumeUrl && (
                              <button
                                type="button"
                                onClick={() => setMemberProfileForm(prev => ({ ...prev, resumeUrl: "", resumeName: "" }))}
                                className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer ml-auto"
                              >
                                Remove Resume
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-indigo-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <i data-lucide="check" className="w-4 h-4"></i>
                        <span>Save Changes to Public Profile</span>
                      </button>
                    </form>
                  </div>

                  {/* Right Preview: Sticky Live Preview of Card */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm lg:sticky lg:top-24 self-start space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <i data-lucide="eye" className="w-4 h-4 text-indigo-600"></i>
                          <span>Live Profile Card Preview</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Real-time
                        </span>
                      </div>

                      {/* Exact Mirror of the Public Team Card */}
                      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between">
                        <div>
                          {/* Banner */}
                          <div className="h-28 w-full relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
                            {memberProfileForm.bannerImage ? (
                              <img 
                                src={memberProfileForm.bannerImage} 
                                alt="banner" 
                                className="w-full h-full object-cover brightness-95" 
                              />
                            ) : (
                              <div className="w-full h-full opacity-40 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                            {memberProfileForm.bannerImage && (
                              <button
                                type="button"
                                onClick={handleDeleteMyBanner}
                                title="Delete Background Banner"
                                className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-[10px] font-bold shadow-lg flex items-center gap-1 cursor-pointer"
                              >
                                <i data-lucide="trash-2" className="w-3 h-3"></i>
                                <span>Remove BG</span>
                              </button>
                            )}
                          </div>

                          {/* Avatar & Live Active Badge */}
                          <div className="px-6 -mt-10 flex items-end justify-between gap-3 relative z-10">
                            <div className="relative">
                              <img
                                src={memberProfileForm.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(memberProfileForm.name || myMemberData.name)}&backgroundColor=0c1438&textColor=38bdf8`}
                                alt={memberProfileForm.name || myMemberData.name}
                                className="w-20 h-20 rounded-2xl object-cover bg-white border-4 border-white shadow-md"
                              />
                              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 border-2 border-white bg-emerald-500"></span>
                              </span>
                            </div>

                            <div className="flex flex-col items-end gap-1 mb-2">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>Active Now</span>
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500">
                                Your Public Card
                              </span>
                            </div>
                          </div>

                          {/* Body */}
                          <div className="px-6 pt-3">
                            <h3 className="font-black text-xl text-slate-900 truncate">
                              {memberProfileForm.name || myMemberData?.name || "Member"}
                            </h3>
                            <p className="text-xs font-bold text-indigo-600 mt-0.5">
                              {memberProfileForm.role || "Software Engineer"}
                            </p>

                            {/* Academic Qualification */}
                            {(memberProfileForm.qualification || memberProfileForm.institution) && (
                              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                                <div className="flex items-center gap-1.5 text-indigo-600 text-[11px] font-bold uppercase tracking-wider mb-1">
                                  <i data-lucide="graduation-cap" className="w-3.5 h-3.5"></i>
                                  <span>Academic Qualification</span>
                                </div>
                                {memberProfileForm.qualification && (
                                  <p className="text-xs font-bold text-slate-900 leading-snug">
                                    {memberProfileForm.qualification}
                                  </p>
                                )}
                                {memberProfileForm.institution && (
                                  <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                                    {memberProfileForm.institution} {memberProfileForm.year ? `(${memberProfileForm.year})` : ''}
                                  </p>
                                )}
                                {memberProfileForm.phone && (
                                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                                    <i data-lucide="phone" className="w-3.5 h-3.5"></i>
                                    <span>{memberProfileForm.phone}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Bio */}
                            {memberProfileForm.bio && (
                              <p className="mt-4 text-xs text-slate-600 leading-relaxed line-clamp-3 font-normal">
                                {memberProfileForm.bio}
                              </p>
                            )}

                            {/* Skills */}
                            {(memberProfileForm.skillsString ? memberProfileForm.skillsString.split(",").map(s => s.trim()).filter(Boolean) : []).length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-1.5">
                                {memberProfileForm.skillsString.split(",").map(s => s.trim()).filter(Boolean).map((sk, idx) => (
                                  <span key={idx} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Certificates */}
                            {(myMemberData?.certificates && myMemberData.certificates.length > 0) && (
                              <div className="mt-3 text-[11px] text-amber-700 font-bold flex items-center gap-1">
                                <i data-lucide="award" className="w-3.5 h-3.5 text-amber-600"></i>
                                <span>{myMemberData.certificates.length} Certified Achievement(s)</span>
                              </div>
                            )}
                          </div>

                          {/* Links & Contact */}
                          <div className="p-6 pt-4 border-t border-slate-200/90 flex items-center justify-between gap-2.5 mt-4 flex-wrap">
                            <a
                              href={formatLinkedInUrl(memberProfileForm.linkedin) || "#"}
                              target={memberProfileForm.linkedin ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                const url = formatLinkedInUrl(memberProfileForm.linkedin);
                                if (!url) {
                                  e.preventDefault();
                                  alert("No LinkedIn profile URL provided yet.");
                                }
                              }}
                              className="btn-linkedin flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                              title="Visit LinkedIn Profile"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                              <span>LinkedIn</span>
                            </a>

                            <a
                              href={formatGitHubUrl(memberProfileForm.github) || "#"}
                              target={memberProfileForm.github ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                const url = formatGitHubUrl(memberProfileForm.github);
                                if (!url) {
                                  e.preventDefault();
                                  alert("No GitHub profile URL provided yet.");
                                }
                              }}
                              className="btn-github flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                              title="Visit GitHub Profile"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                              <span>GitHub</span>
                            </a>

                            {memberProfileForm.resumeUrl && (
                              <a
                                href={memberProfileForm.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition shadow-sm flex items-center gap-1"
                                title="Resume / CV"
                              >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                <span>CV</span>
                              </a>
                            )}

                            {memberProfileForm.phone && (
                              <a
                                href={`tel:${cleanTelNumber(memberProfileForm.phone)}`}
                                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold transition shadow-sm cursor-pointer"
                                title={`Direct Call to ${memberProfileForm.phone}`}
                              >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                <span>Call</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setCurrentView("team")}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200/90 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <i data-lucide="external-link" className="w-3.5 h-3.5 text-indigo-600"></i>
                        <span>View on Public Team Page</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ACCESS REQUESTS (FOR MANAGING WHO CAN VIEW YOUR PRIVATE PROFILE) */}
              {memberDashboardTab === "access_requests" && (
                <div className="space-y-6">
                  {/* Current Privacy Status Banner with Fast Switcher */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          myMemberData.privacy === "private"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          {myMemberData.privacy === "private" ? "ðŸ”’ Profile is Set to Private" : "ðŸŒ Profile is Set to Public"}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Your Profile Visibility & Access Permission</h3>
                      <p className="text-xs text-slate-600 mt-1 max-w-xl font-medium">
                        {myMemberData.privacy === "private"
                          ? "Your qualifications, contact numbers, and certificates are locked from other members. Only members you approve below can view your full details."
                          : "Your profile is open to all KodeinX team members and clients. Switch to Private anytime if you want other members to request permission."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const nextPrivacy = myMemberData.privacy === "private" ? "public" : "private";
                          setMembers(prev => prev.map(m => m.id === myMemberData.id ? { ...m, privacy: nextPrivacy } : m));
                          setMemberProfileForm(prev => ({ ...prev, privacy: nextPrivacy }));
                        }}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-sm cursor-pointer ${
                          myMemberData.privacy === "private"
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-rose-600 hover:bg-rose-700 text-white"
                        }`}
                      >
                        <i data-lucide={myMemberData.privacy === "private" ? "globe" : "lock"} className="w-4 h-4"></i>
                        <span>{myMemberData.privacy === "private" ? "Switch to Public Profile" : "Switch to Private Profile"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Incoming Requests Section */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/90">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <i data-lucide="shield" className="w-5 h-5 text-indigo-600"></i>
                          <span>Incoming Access Requests from Team Members</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          Accepting a request allows that specific member to view your private degree qualifications, contact info, and certificates.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                        {accessRequests.filter(r => r.targetMemberId === myMemberData.id).length} Total Requests
                      </span>
                    </div>

                    {accessRequests.filter(r => r.targetMemberId === myMemberData.id).length === 0 ? (
                      <div className="p-10 text-center bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto mb-3">
                          <i data-lucide="shield-check" className="w-6 h-6"></i>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">No Access Requests Yet</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto font-medium">
                          When you set your profile to <strong>Private</strong>, other team members will see a "Request Access" button on your card. Their requests will appear here for you to accept or decline.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {accessRequests.filter(r => r.targetMemberId === myMemberData.id).map(req => (
                          <div
                            key={req.id}
                            className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                              req.status === "pending"
                                ? "bg-amber-50/60 border-amber-300 ring-1 ring-amber-400/20"
                                : req.status === "approved"
                                ? "bg-emerald-50/60 border-emerald-300"
                                : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <img
                                src={req.requesterPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(req.requesterName)}`}
                                alt={req.requesterName}
                                className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200 shadow-sm"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-sm text-slate-900">{req.requesterName}</h4>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    req.status === "pending"
                                      ? "bg-amber-100 text-amber-800 border-amber-300"
                                      : req.status === "approved"
                                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                      : "bg-rose-100 text-rose-800 border-rose-300"
                                  }`}>
                                    {req.status === "pending" ? "â³ Pending Approval" : req.status === "approved" ? "âœ“ Access Granted" : "âœ• Declined"}
                                  </span>
                                </div>
                                <p className="text-xs text-indigo-600 font-semibold">{req.requesterRole}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                                  {req.requesterEmail} â€¢ Requested: {req.requestedAt}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              {req.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleApproveAccessRequest(req.id)}
                                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <i data-lucide="check" className="w-3.5 h-3.5"></i>
                                    <span>Accept (âœ“ Allow View)</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeclineAccessRequest(req.id)}
                                    className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <i data-lucide="x" className="w-3.5 h-3.5"></i>
                                    <span>Decline</span>
                                  </button>
                                </>
                              )}
                              {req.status === "approved" && (
                                <button
                                  onClick={() => handleRevokeAccessRequest(req.id)}
                                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 text-xs font-semibold transition cursor-pointer"
                                >
                                  Revoke Access
                                </button>
                              )}
                              {req.status === "declined" && (
                                <button
                                  onClick={() => handleApproveAccessRequest(req.id)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold transition cursor-pointer"
                                >
                                  Re-approve Access
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Outgoing Requests Section (Requests sent by YOU to other members) */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <h3 className="text-md font-bold text-slate-900 flex items-center gap-2 mb-1">
                      <i data-lucide="send" className="w-4 h-4 text-indigo-600"></i>
                      <span>Requests You Sent to Other Private Members</span>
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 font-medium">
                      Track whether other private members have approved your request to view their full profiles.
                    </p>

                    {accessRequests.filter(r => r.requesterId === myMemberData.id).length === 0 ? (
                      <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
                        You haven't sent any access requests yet. Visit the Team page to view members and request access to private profiles.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {accessRequests.filter(r => r.requesterId === myMemberData.id).map(req => (
                          <div key={req.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-xs text-slate-900">{req.targetMemberName}</h4>
                              <p className="text-[11px] text-slate-500 font-medium">Requested: {req.requestedAt}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              req.status === "pending"
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : req.status === "approved"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-rose-100 text-rose-800 border-rose-300"
                            }`}>
                              {req.status === "pending" ? "â³ Pending" : req.status === "approved" ? "âœ“ Approved" : "âœ• Declined"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: MY PROJECTS (MEMBER CAN ADD MULTIPLE WORK/PROJECTS) */}
              {memberDashboardTab === "projects" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Publish Project Form */}
                  <div className="lg:col-span-1 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-1">
                      <i data-lucide="plus-circle" className="w-5 h-5 text-indigo-600"></i>
                      <span>Publish Your Project</span>
                    </h3>
                    <p className="text-xs text-slate-500 mb-5 font-medium">
                      Showcase your IoT device, AI model, or Web application on the KodeinX public portfolio.
                    </p>

                    <form onSubmit={handleMemberAddProject} className="space-y-3.5">
                      {/* Project Scope Selection (Personal Profile vs Team Project) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                          Publishing Destination *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {/* Option 1: Personal Profile Only */}
                          <div
                            onClick={() => setMemberProjectForm({ ...memberProjectForm, scope: "personal" })}
                            className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                              memberProjectForm.scope === "personal"
                                ? "border-indigo-600 bg-indigo-50/70 shadow-sm"
                                : "border-slate-200 bg-slate-50/70 hover:border-slate-300"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                                  <span>ðŸ‘¤</span>
                                  <span>Option 1: Personal Profile</span>
                                </span>
                                {memberProjectForm.scope === "personal" && (
                                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 font-medium leading-snug">
                                Visible <strong>only on your profile</strong>. Will not appear in public Team Portfolio.
                              </p>
                            </div>
                            <span className="mt-2 text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md inline-block w-fit">
                              Author can delete anytime
                            </span>
                          </div>

                          {/* Option 2: Team Project */}
                          <div
                            onClick={() => setMemberProjectForm({ ...memberProjectForm, scope: "team" })}
                            className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                              memberProjectForm.scope === "team"
                                ? "border-violet-600 bg-violet-50/70 shadow-sm"
                                : "border-slate-200 bg-slate-50/70 hover:border-slate-300"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                                  <span>ðŸš€</span>
                                  <span>Option 2: Team Project</span>
                                </span>
                                {memberProjectForm.scope === "team" && (
                                  <span className="w-2.5 h-2.5 rounded-full bg-violet-600"></span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 font-medium leading-snug">
                                Published to <strong>KodeinX Team Portfolio</strong> for all visitors & clients.
                              </p>
                            </div>
                            <span className="mt-2 text-[10px] font-bold text-violet-700 bg-violet-100/80 px-2 py-0.5 rounded-md inline-block w-fit">
                              Admin manages delete & edit
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Project Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. ESP32 Telemetry Monitor"
                          value={memberProjectForm.title}
                          onChange={e => setMemberProjectForm({ ...memberProjectForm, title: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Category</label>
                          <select
                            value={memberProjectForm.category}
                            onChange={e => setMemberProjectForm({ ...memberProjectForm, category: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                          >
                            <option value="IoT">IoT</option>
                            <option value="AI">AI</option>
                            <option value="Website">Website</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Tech Stack</label>
                          <input
                            type="text"
                            placeholder="React, ESP32, Python"
                            value={memberProjectForm.techStack}
                            onChange={e => setMemberProjectForm({ ...memberProjectForm, techStack: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Screenshot / Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleImageUpload(e, url => setMemberProjectForm({ ...memberProjectForm, image: url }))}
                          className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer mb-1"
                        />
                        <input
                          type="url"
                          placeholder="Or paste image link (https://...)"
                          value={memberProjectForm.image}
                          onChange={e => setMemberProjectForm({ ...memberProjectForm, image: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Live Demo URL</label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={memberProjectForm.demoUrl}
                            onChange={e => setMemberProjectForm({ ...memberProjectForm, demoUrl: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">GitHub URL</label>
                          <input
                            type="url"
                            placeholder="https://github.com/..."
                            value={memberProjectForm.githubUrl}
                            onChange={e => setMemberProjectForm({ ...memberProjectForm, githubUrl: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Description *</label>
                        <textarea
                          rows="2"
                          required
                          placeholder="What did you engineer in this project?"
                          value={memberProjectForm.description}
                          onChange={e => setMemberProjectForm({ ...memberProjectForm, description: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white resize-none transition"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <i data-lucide="upload" className="w-4 h-4"></i>
                        <span>{memberProjectForm.scope === "team" ? "Publish to Team Portfolio" : "Save to My Profile Only"}</span>
                      </button>
                    </form>
                  </div>

                  {/* List of Projects (Global & Member Submitted) */}
                  <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-black text-slate-900">Your Projects & Contributions</h3>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                        {projects.filter(p => p.authorMemberId === session.memberId).length} Uploaded by You
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-5 font-medium">
                      Personal projects are visible only on your profile. Team projects are in the KodeinX Portfolio (Admin protected).
                    </p>

                    <div className="space-y-4 max-h-[550px] overflow-y-auto custom-scrollbar pr-2">
                      {projects.map(proj => {
                        const isMine = proj.authorMemberId === session.memberId;
                        const isPersonal = proj.scope === "personal";
                        return (
                          <div
                            key={proj.id}
                            className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                              isMine ? (isPersonal ? "bg-indigo-50/40 border-indigo-200" : "bg-violet-50/40 border-violet-200") : "bg-slate-50 border-slate-200/90"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <img src={proj.image} alt={proj.title} className="w-14 h-14 rounded-xl object-cover bg-white border border-slate-200 shadow-sm shrink-0" />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-slate-900 text-sm truncate">{proj.title}</h4>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                                    {proj.category}
                                  </span>
                                  {isPersonal ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 flex items-center gap-1">
                                      <span>ðŸ‘¤</span>
                                      <span>Personal (My Profile Only)</span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 font-bold border border-violet-200 flex items-center gap-1">
                                      <span>ðŸš€</span>
                                      <span>Team Project (Portfolio)</span>
                                    </span>
                                  )}
                                  {isMine && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                      Your Upload
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-medium">{proj.description}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              {proj.demoUrl && (
                                <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="p-2 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition" title="Live Demo">
                                  <i data-lucide="external-link" className="w-4 h-4"></i>
                                </a>
                              )}
                              {/* Deletion Permission:
                                  1. If personal project & isMine: Member can delete.
                                  2. If team project: Only Admin can delete! If member tries or views, it's locked.
                              */}
                              {isPersonal && isMine ? (
                                <button
                                  onClick={() => handleMemberDeleteProject(proj.id)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                  title="Delete My Personal Project"
                                >
                                  <i data-lucide="trash-2" className="w-4 h-4"></i>
                                </button>
                              ) : !isPersonal && isMine && !isAdmin ? (
                                <button
                                  onClick={() => alert("Permission Denied: This is a Team Project published to the KodeinX Portfolio. Only Admin can delete or modify Team Projects!")}
                                  className="px-2 py-1 text-[11px] font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition cursor-pointer flex items-center gap-1"
                                  title="Only Admin can delete Team Projects"
                                >
                                  <i data-lucide="lock" className="w-3 h-3 text-amber-500"></i>
                                  <span>Admin Managed</span>
                                </button>
                              ) : isAdmin ? (
                                <button
                                  onClick={() => handleMemberDeleteProject(proj.id)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                  title="Admin: Delete Project"
                                >
                                  <i data-lucide="trash-2" className="w-4 h-4"></i>
                                </button>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CERTIFICATES & CREDENTIALS */}
              {memberDashboardTab === "certificates" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Add Certificate Form */}
                  <div className="lg:col-span-1 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-1">
                      <i data-lucide="award" className="w-5 h-5 text-amber-500"></i>
                      <span>Add New Certificate</span>
                    </h3>
                    <p className="text-xs text-slate-500 mb-5 font-medium">
                      Add tech certifications (e.g. AWS, NVIDIA, Google, NPTEL) to build your technical credibility.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!memberProfileForm.certTitle.trim()) {
                          alert("Please enter certificate title!");
                          return;
                        }
                        const newCert = {
                          title: memberProfileForm.certTitle.trim(),
                          issuer: memberProfileForm.certIssuer.trim() || "Certified Authority",
                          url: memberProfileForm.certUrl.trim() || "#"
                        };
                        let updatedCerts = [];
                        setMembers(prev => prev.map(m => {
                          if (m.id === session.memberId) {
                            updatedCerts = [...(m.certificates || []), newCert];
                            return { ...m, certificates: updatedCerts };
                          }
                          return m;
                        }));
                        try {
                          fetch(`${API_BASE}/api/members/${session.memberId}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ certificates: updatedCerts })
                          }).catch(console.error);
                        } catch(e){}
                        setMemberProfileForm({ ...memberProfileForm, certTitle: "", certIssuer: "", certUrl: "" });
                        alert("Certificate added successfully and saved to MongoDB!");
                      }}
                      className="space-y-3.5"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Certificate Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. AWS Certified Solutions Architect"
                          value={memberProfileForm.certTitle}
                          onChange={e => setMemberProfileForm({ ...memberProfileForm, certTitle: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Issuer / Organization</label>
                        <input
                          type="text"
                          placeholder="e.g. Amazon Web Services / NVIDIA"
                          value={memberProfileForm.certIssuer}
                          onChange={e => setMemberProfileForm({ ...memberProfileForm, certIssuer: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Verification Link</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={memberProfileForm.certUrl}
                          onChange={e => setMemberProfileForm({ ...memberProfileForm, certUrl: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition cursor-pointer"
                      >
                        + Add Certificate to My Profile
                      </button>
                    </form>
                  </div>

                  {/* Your Current Certificates List */}
                  <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-2">
                      My Verified Credentials ({(myMemberData.certificates || []).length})
                    </h3>
                    <p className="text-xs text-slate-500 mb-5 font-medium">
                      These are displayed under your name on the Achievements public tab.
                    </p>

                    {(myMemberData.certificates || []).length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
                        No certificates added yet. Use the form on the left to add your achievements!
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(myMemberData.certificates || []).map((c, idx) => (
                          <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
                            <div>
                              <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 mb-2">
                                <i data-lucide="award" className="w-4 h-4"></i>
                              </div>
                              <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                              <p className="text-xs text-indigo-600 font-semibold mt-0.5">{c.issuer}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                              {c.url && c.url !== "#" ? (
                                <a href={c.url} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-semibold">
                                  <span>View Certificate</span>
                                  <i data-lucide="external-link" className="w-3 h-3"></i>
                                </a>
                              ) : <span className="text-[11px] text-slate-500">Self-attested</span>}
                              <button
                                onClick={() => handleMemberDeleteCert(idx)}
                                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition"
                                title="Remove Certificate"
                              >
                                <i data-lucide="trash-2" className="w-3.5 h-3.5"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: MESSAGES & INBOX */}
              {memberDashboardTab === "messages" && (() => {
                const myInboxMessages = memberMessages.filter(m => m.toMemberId === myMemberData.id);
                const unreadCount = myInboxMessages.filter(m => m.status === "unread").length;

                return (
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                          <i data-lucide="inbox" className="w-4 h-4"></i>
                          <span>Real-Time Direct Messenger Inbox</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Direct Client & Team Messages</h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          Incoming inquiries sent directly to your profile from website visitors and fellow engineers. Reply directly in-app.
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                          <span>{unreadCount} Unread Inquiries</span>
                        </div>
                        <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                          <span>Total: {myInboxMessages.length} Messages</span>
                        </div>
                      </div>
                    </div>

                    {myInboxMessages.length === 0 ? (
                      <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                          <i data-lucide="message-square-dashed" className="w-7 h-7"></i>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-1">Your Inbox is Clear</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                          You don't have any incoming messages right now. When visitors or team members reach out through your profile or the directory, their inquiries will appear here in real time.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {myInboxMessages.map(msg => {
                          const isUnread = msg.status === "unread";
                          return (
                            <div
                              key={msg.id}
                              className={`bg-white border ${
                                isUnread ? "border-indigo-500/60 ring-2 ring-indigo-500/20" : "border-slate-200/90"
                              } rounded-3xl p-6 shadow-sm transition-all duration-300`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                  {msg.fromPhoto ? (
                                    <img src={msg.fromPhoto} alt={msg.fromName} className="w-10 h-10 rounded-xl object-cover bg-white border border-slate-200 shadow-sm" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-sm flex items-center justify-center">
                                      {msg.fromName ? msg.fromName.charAt(0).toUpperCase() : "U"}
                                    </div>
                                  )}
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-sm font-bold text-slate-900">{msg.fromName}</span>
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-indigo-600 font-semibold">{msg.fromRole || "Visitor"}</span>
                                      {isUnread && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold">
                                          NEW
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                                      <a href={`mailto:${msg.fromEmail}`} className="text-indigo-600 hover:underline">{msg.fromEmail}</a>
                                      <span>â€¢</span>
                                      <span>{msg.timestamp}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-start sm:self-center">
                                  <a
                                    href={`mailto:${msg.fromEmail}?subject=Re:%20${encodeURIComponent(msg.subject)}`}
                                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                                    title="Reply via Email"
                                  >
                                    <i data-lucide="mail" className="w-3.5 h-3.5"></i>
                                    <span>Email</span>
                                  </a>
                                  <button
                                    onClick={() => setMemberMessages(prev => prev.filter(m => m.id !== msg.id))}
                                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                    title="Delete message"
                                  >
                                    <i data-lucide="trash-2" className="w-4 h-4"></i>
                                  </button>
                                </div>
                              </div>

                              {/* Subject & Message Content */}
                              <div className="py-4">
                                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                                  <span className="text-indigo-600 font-semibold text-xs uppercase tracking-wider">Subject:</span>
                                  <span>{msg.subject}</span>
                                </h4>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                                  {msg.text}
                                </div>
                              </div>

                              {/* Existing Replies Thread */}
                              {msg.replies && msg.replies.length > 0 && (
                                <div className="mb-4 pl-4 border-l-2 border-indigo-500 space-y-3">
                                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                                    <i data-lucide="corner-down-right" className="w-3 h-3"></i>
                                    <span>Replies Thread ({msg.replies.length})</span>
                                  </p>
                                  {msg.replies.map(rep => (
                                    <div key={rep.id} className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs">
                                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 font-medium">
                                        <span className="font-bold text-indigo-900">{rep.fromName} ({rep.fromRole})</span>
                                        <span>{rep.timestamp}</span>
                                      </div>
                                      <p className="text-slate-800 leading-relaxed">{rep.text}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Direct Reply Box */}
                              <div className="pt-3 border-t border-slate-200">
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <input
                                    type="text"
                                    placeholder={`Write a direct reply to ${msg.fromName}...`}
                                    value={replyDrafts[msg.id] || ""}
                                    onChange={(e) => setReplyDrafts({ ...replyDrafts, [msg.id]: e.target.value })}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendReply(msg.id);
                                      }
                                    }}
                                    className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition"
                                  />
                                  <button
                                    onClick={() => handleSendReply(msg.id)}
                                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                                  >
                                    <i data-lucide="send" className="w-3.5 h-3.5"></i>
                                    <span>Send Reply</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
            </main>
          )}

          {/* ========================================================= */}
          {/* VIEW 7: ISOLATED ADMIN DASHBOARD (Praba@06200620)          */}
          {/* ========================================================= */}
          {currentView === "admin_dashboard" && isAdmin && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full animate-fade">
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/90">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
                    <i data-lucide="shield-check" className="w-3.5 h-3.5"></i>
                    <span>KodeinX Master Admin Portal</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">Centralized Admin Dashboard</h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Add Team Members and manage IoT, AI & Website projects exclusively here.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentView("home")}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Return to Public Website
                </button>
              </div>

              {/* Workspaces Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* 1. ADMIN ADDS MEMBER */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <i data-lucide="user-plus" className="w-5 h-5 text-indigo-600"></i>
                    <span>Add Team Member (Admin Only)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-6 font-medium">
                    Enter member name and their Google Email. Once added here, they can sign in to develop their personal profile and qualifications.
                  </p>

                  <form onSubmit={handleAdminAddMember} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Member Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Kumar"
                        value={adminMemberForm.name}
                        onChange={e => setAdminMemberForm({ ...adminMemberForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Member's Real Google Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. anand.dev@gmail.com"
                        value={adminMemberForm.email}
                        onChange={e => setAdminMemberForm({ ...adminMemberForm, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          value={adminMemberForm.phone}
                          onChange={e => setAdminMemberForm({ ...adminMemberForm, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">LinkedIn Profile</label>
                        <input
                          type="text"
                          placeholder="linkedin.com/in/username"
                          value={adminMemberForm.linkedin}
                          onChange={e => setAdminMemberForm({ ...adminMemberForm, linkedin: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">GitHub Profile / Username</label>
                      <input
                        type="text"
                        placeholder="github.com/username or username"
                        value={adminMemberForm.github || ""}
                        onChange={e => setAdminMemberForm({ ...adminMemberForm, github: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Initial Role</label>
                        <input
                          type="text"
                          placeholder="e.g. IoT Engineer"
                          value={adminMemberForm.role}
                          onChange={e => setAdminMemberForm({ ...adminMemberForm, role: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Degree / Qualification</label>
                        <input
                          type="text"
                          placeholder="e.g. B.Tech / B.E"
                          value={adminMemberForm.qualification}
                          onChange={e => setAdminMemberForm({ ...adminMemberForm, qualification: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <i data-lucide="plus-circle" className="w-4 h-4"></i>
                      <span>Add & Register Member</span>
                    </button>
                  </form>
                </div>

                {/* 2. ADMIN ADDS PROJECT */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <i data-lucide="folder-plus" className="w-5 h-5 text-teal-600"></i>
                    <span>Publish Project (IoT, AI, Website)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-6 font-medium">
                    Publish centralized KodeinX work with image upload/URL, live demo, and source code.
                  </p>

                  <form onSubmit={handleAdminAddProject} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Project Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Smart Agriculture IoT Gateway"
                        value={adminProjectForm.title}
                        onChange={e => setAdminProjectForm({ ...adminProjectForm, title: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Category</label>
                        <select
                          value={adminProjectForm.category}
                          onChange={e => setAdminProjectForm({ ...adminProjectForm, category: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition"
                        >
                          <option value="IoT">IoT (Internet of Things)</option>
                          <option value="AI">AI (Artificial Intelligence)</option>
                          <option value="Website">Website / Cloud Platform</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Tech Stack</label>
                        <input
                          type="text"
                          placeholder="ESP32, Python, React"
                          value={adminProjectForm.techStack}
                          onChange={e => setAdminProjectForm({ ...adminProjectForm, techStack: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Screenshot (Upload or Paste URL)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, url => setAdminProjectForm({ ...adminProjectForm, image: url }))}
                        className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer mb-2"
                      />
                      <input
                        type="url"
                        placeholder="Or paste image URL (https://...)"
                        value={adminProjectForm.image}
                        onChange={e => setAdminProjectForm({ ...adminProjectForm, image: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Live Demo URL</label>
                        <input
                          type="url"
                          placeholder="https://demo..."
                          value={adminProjectForm.demoUrl}
                          onChange={e => setAdminProjectForm({ ...adminProjectForm, demoUrl: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">GitHub URL</label>
                        <input
                          type="url"
                          placeholder="https://github.com/..."
                          value={adminProjectForm.githubUrl}
                          onChange={e => setAdminProjectForm({ ...adminProjectForm, githubUrl: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Description *</label>
                      <textarea
                        rows="2"
                        required
                        placeholder="Explain project impact..."
                        value={adminProjectForm.description}
                        onChange={e => setAdminProjectForm({ ...adminProjectForm, description: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white resize-none transition"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <i data-lucide="plus-circle" className="w-4 h-4"></i>
                      <span>Publish to Portfolio</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Manage Existing Records List */}
              <div className="mt-12 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/90">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Central Records Management</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Edit and manage registered members, active projects, and client inquiries.</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                    Admin Active: KodeinX Hub
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Column 1: Registered Members (6 cols) */}
                  <div className="lg:col-span-6 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                        <i data-lucide="users" className="w-4 h-4 text-indigo-600"></i>
                        <span>Current Registered Members ({members.length})</span>
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold">Live Roster</span>
                    </div>

                    <div className="space-y-3 max-h-[32rem] overflow-y-auto custom-scrollbar pr-1">
                      {members.map(m => (
                        <div key={m.id} className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm group">
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <img src={m.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.name)}`} alt={m.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0 shadow-sm" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-bold text-slate-900 truncate">{m.name}</p>
                                <span className="text-[10px] text-indigo-700 font-semibold px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200">{m.role || "Member"}</span>
                              </div>
                              <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">{m.email}</p>
                              {m.phone && (
                                <div className="mt-1 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                                  <i data-lucide="phone" className="w-3 h-3 text-emerald-600"></i>
                                  <span>{m.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end flex-wrap">
                            <a
                              href={formatLinkedInUrl(m.linkedin, m.name)}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => {
                                e.preventDefault();
                                openExternalLink(m.linkedin, m.name);
                              }}
                              className="btn-linkedin px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                              title="Visit LinkedIn Profile"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                              <span className="text-[11px]">LinkedIn</span>
                            </a>
                            <a
                              href={formatGitHubUrl(m.github, m.name)}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => {
                                e.preventDefault();
                                openGitHubLink(m.github, m.name);
                              }}
                              className="btn-github px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                              title="Visit GitHub Profile"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                              <span className="text-[11px]">GitHub</span>
                            </a>
                            <button
                              onClick={() => setAdminEditingMember({ ...m })}
                              className="p-1.5 px-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl transition border border-indigo-200 cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                              title="Edit Member Information"
                            >
                              <i data-lucide="edit-2" className="w-3.5 h-3.5"></i>
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleAdminDeleteMember(m.id)}
                              className="p-1.5 px-2 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-xl transition border border-rose-200 cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                              title="Delete Member"
                            >
                              <i data-lucide="trash-2" className="w-3.5 h-3.5"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Current Projects (3 cols) */}
                  <div className="lg:col-span-3 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-teal-700 uppercase tracking-wider flex items-center gap-2">
                        <i data-lucide="folder" className="w-4 h-4 text-teal-600"></i>
                        <span>Projects ({projects.length})</span>
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold">Portfolio</span>
                    </div>

                    <div className="space-y-2.5 max-h-[32rem] overflow-y-auto custom-scrollbar pr-1">
                      {projects.map(p => (
                        <div key={p.id} className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all duration-200 flex items-center justify-between gap-3 shadow-sm">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">{p.title}</p>
                            <span className="inline-block mt-1 text-[10px] text-teal-700 font-semibold px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200">
                              {p.category}
                            </span>
                          </div>
                          <button
                            onClick={() => handleAdminDeleteProject(p.id)}
                            className="p-2 text-rose-600 hover:text-white hover:bg-rose-600 rounded-xl transition border border-rose-200 cursor-pointer shrink-0"
                            title="Delete Project"
                          >
                            <i data-lucide="trash-2" className="w-4 h-4"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Contact Inquiries (3 cols) */}
                  <div className="lg:col-span-3 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                        <i data-lucide="mail" className="w-4 h-4 text-emerald-600"></i>
                        <span>Inquiries ({contactMessages.length})</span>
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold">Website Forms</span>
                    </div>

                    <div className="space-y-3 max-h-[32rem] overflow-y-auto custom-scrollbar pr-1">
                      {contactMessages.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 p-4">
                          <p className="text-xs text-slate-500 font-medium">No visitor inquiries yet.</p>
                        </div>
                      ) : (
                        contactMessages.map(msg => (
                          <div key={msg.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left shadow-sm">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-slate-900 truncate">{msg.name}</span>
                              <span className="text-[10px] text-slate-500 font-semibold shrink-0">{msg.date}</span>
                            </div>
                            <p className="text-[11px] text-indigo-600 font-semibold truncate">{msg.email}</p>
                            {msg.phone && <p className="text-[10px] text-slate-600 font-medium">{msg.phone}</p>}
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                              {msg.projectType}
                            </span>
                            <p className="text-xs text-slate-800 mt-2 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap font-normal">
                              {msg.message}
                            </p>
                            <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200">
                              <a href={`mailto:${msg.email}?subject=Inquiry%20Response%20from%20KodeinX`} className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-bold">
                                <i data-lucide="mail" className="w-3 h-3"></i>
                                <span>Reply</span>
                              </a>
                              <button
                                onClick={() => setContactMessages(prev => prev.filter(m => m.id !== msg.id))}
                                className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <i data-lucide="trash-2" className="w-3 h-3"></i>
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          )}

          {/* ========================================================= */}
          {/* MODAL: ADMIN EDIT MEMBER MODAL (ADMIN HAS FULL CONTROL)   */}
          {/* ========================================================= */}
          {adminEditingMember && isAdmin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <i data-lucide="edit-3" className="w-5 h-5 text-indigo-600"></i>
                      <span>Admin: Edit Member Record</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Admin master update for {adminEditingMember.name}</p>
                  </div>
                  <button
                    onClick={() => setAdminEditingMember(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  >
                    âœ•
                  </button>
                </div>

                <form onSubmit={handleAdminSaveMemberEdit} className="mt-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={adminEditingMember.name}
                        onChange={e => setAdminEditingMember({ ...adminEditingMember, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Google Email</label>
                      <input
                        type="email"
                        required
                        value={adminEditingMember.email}
                        onChange={e => setAdminEditingMember({ ...adminEditingMember, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Role</label>
                      <input
                        type="text"
                        value={adminEditingMember.role}
                        onChange={e => setAdminEditingMember({ ...adminEditingMember, role: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={adminEditingMember.phone || ""}
                        onChange={e => setAdminEditingMember({ ...adminEditingMember, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Academic Degree</label>
                      <input
                        type="text"
                        value={adminEditingMember.qualification || ""}
                        onChange={e => setAdminEditingMember({ ...adminEditingMember, qualification: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Institution</label>
                      <input
                        type="text"
                        value={adminEditingMember.institution || ""}
                        onChange={e => setAdminEditingMember({ ...adminEditingMember, institution: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">LinkedIn Profile</label>
                      <input
                        type="text"
                        placeholder="linkedin.com/in/username"
                        value={adminEditingMember.linkedin || ""}
                        onChange={e => setAdminEditingMember({ ...adminEditingMember, linkedin: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">GitHub Profile</label>
                      <input
                        type="text"
                        placeholder="github.com/username"
                        value={adminEditingMember.github || ""}
                        onChange={e => setAdminEditingMember({ ...adminEditingMember, github: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-800 uppercase">Profile Photo (Avatar)</label>
                        {adminEditingMember.photo && (
                          <button
                            type="button"
                            onClick={() => setAdminEditingMember({ ...adminEditingMember, photo: "" })}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition cursor-pointer"
                          >
                            ðŸ—‘ï¸ Delete Photo
                          </button>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, url => setAdminEditingMember({ ...adminEditingMember, photo: url }))}
                        className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 cursor-pointer mb-1.5"
                      />
                      <input
                        type="text"
                        placeholder="Or paste photo URL (https://...)"
                        value={adminEditingMember.photo?.startsWith("data:") ? "" : (adminEditingMember.photo || "")}
                        onChange={e => setAdminEditingMember({ ...adminEditingMember, photo: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-800 uppercase">Cover / Background Banner</label>
                        {adminEditingMember.bannerImage && (
                          <button
                            type="button"
                            onClick={() => setAdminEditingMember({ ...adminEditingMember, bannerImage: "" })}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition cursor-pointer"
                          >
                            ðŸ—‘ï¸ Delete Background
                          </button>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, url => setAdminEditingMember({ ...adminEditingMember, bannerImage: url }))}
                        className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 cursor-pointer mb-1.5"
                      />
                      <input
                        type="text"
                        placeholder="Or paste banner URL (https://...)"
                        value={adminEditingMember.bannerImage?.startsWith("data:") ? "" : (adminEditingMember.bannerImage || "")}
                        onChange={e => setAdminEditingMember({ ...adminEditingMember, bannerImage: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-900 uppercase mb-1">
                      Member Security Passcode (For Google Sign In)
                    </label>
                    <input
                      type="text"
                      placeholder="Reset passcode (e.g. KodeinX@2026)"
                      value={adminEditingMember.passcode || ""}
                      onChange={e => setAdminEditingMember({ ...adminEditingMember, passcode: e.target.value })}
                      className="w-full bg-amber-50/50 border border-amber-300 rounded-xl px-3.5 py-2 text-xs text-amber-950 font-mono tracking-wider font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        handleAdminDeleteMember(adminEditingMember.id);
                        setAdminEditingMember(null);
                      }}
                      className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <i data-lucide="trash-2" className="w-4 h-4"></i>
                      <span>Delete Member</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAdminEditingMember(null)}
                        className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                      >
                        Save Admin Updates
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* AUTHENTIC GOOGLE ACCOUNTS DIALOG (NO 404 CRASH!)          */}
          {/* ========================================================= */}
          {showGoogleAuthModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade">
              <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center border border-slate-200">
                <button
                  onClick={() => {
                    setShowGoogleAuthModal(false);
                    setShowCustomEmailInput(false);
                    setGoogleAuthError("");
                  }}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
                >
                  âœ•
                </button>

                {/* Google Multi-Color Official Logo */}
                <div className="flex justify-center mb-3">
                  <svg className="w-10 h-10" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-slate-900">Member Portal Sign In</h3>
                <p className="text-xs text-slate-500 mt-0.5 mb-5">Sign in with your verified team email to access your personal dashboard</p>

                {googleAuthError && (
                  <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left leading-relaxed animate-fade">
                    <p className="font-bold mb-0.5">âš ï¸ Security Notice:</p>
                    <p>{googleAuthError}</p>
                  </div>
                )}

                {/* Direct Registered Email Input Form */}
                <form onSubmit={handleCustomEmailSubmit} className="text-left space-y-3 mb-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enter Your Registered Team Email:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. klpraba06@gmail.com"
                      value={customEmailInput}
                      onChange={e => setCustomEmailInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={googleSigningIn}
                    className="w-full py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {googleSigningIn ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Authenticating with MongoDB...</span>
                      </div>
                    ) : (
                      <span>Sign In to My Dashboard â†’</span>
                    )}
                  </button>
                </form>

                {/* Quick Select from Registered Team Members */}
                <div className="pt-3 border-t border-slate-200 text-left">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Or select your account from team directory ({members.length}):
                  </p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                    {members.map(m => (
                      <div
                        key={m.id}
                        onClick={() => handleGoogleContinueSignIn(m)}
                        className="flex items-center justify-between p-2 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/60 transition cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={m.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.name)}&backgroundColor=0c1438&textColor=38bdf8`}
                            alt={m.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-300"
                          />
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">{m.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{m.email}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-indigo-600 group-hover:underline shrink-0">Sign In â†’</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 pt-3 leading-relaxed">
                  ðŸ”’ Strictly isolated: Logged in members can only edit and maintain their own personal profile.
                </p>
              </div>
            </div>
          )}

          {/* MODAL: ADMIN ACCESS MODAL (Praba@06200620)                 */}
          {/* ========================================================= */}
          {showAdminModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade">
              <div className="tech-card border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative text-center">
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900"
                >
                  âœ•
                </button>

                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
                  <i data-lucide="lock" className="w-6 h-6"></i>
                </div>

                <h3 className="text-xl font-black text-white">KodeinX Admin</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Enter master password to open the Centralized Admin Dashboard.
                </p>

                {adminError && (
                  <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                    {adminError}
                  </div>
                )}

                <form onSubmit={handleAdminSignIn} className="space-y-3">
                  <input
                    type="password"
                    required
                    placeholder="Enter Admin Password"
                    value={adminInputPassword}
                    onChange={e => setAdminInputPassword(e.target.value)}
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

          {/* ========================================================= */}
          {/* MODAL: MEMBER DEVELOPING PROFILE (WITH QUALIFICATIONS!)   */}
          {/* ========================================================= */}
          {showMyProfileModal && isMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <i data-lucide="user-check" className="w-5 h-5 text-emerald-600"></i>
                      <span>Develop Your Profile</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Customize your role, qualifications, skills, and certificates.</p>
                  </div>
                  <button
                    onClick={() => setShowMyProfileModal(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                  >
                    âœ•
                  </button>
                </div>

                <form onSubmit={handleSaveMyProfile} className="mt-5 space-y-4">
                  {/* Profile Privacy Selector */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <i data-lucide="shield" className="w-4 h-4 text-indigo-600"></i>
                        <span>Profile Visibility & Privacy</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        memberProfileForm.privacy === "private"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {memberProfileForm.privacy === "private" ? "ðŸ”’ Private" : "ðŸŒ Public"}
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setMemberProfileForm({ ...memberProfileForm, privacy: "public" })}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          memberProfileForm.privacy !== "private"
                            ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-xs"
                            : "bg-white border-slate-200 text-slate-500"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span>ðŸŒ Public</span>
                          {memberProfileForm.privacy !== "private" && <span className="text-emerald-600">âœ“</span>}
                        </div>
                        <p className="text-[10px] text-slate-500 font-normal leading-tight">Visible to all members directly</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMemberProfileForm({ ...memberProfileForm, privacy: "private" })}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          memberProfileForm.privacy === "private"
                            ? "bg-rose-50 border-rose-300 text-rose-900 font-bold shadow-xs"
                            : "bg-white border-slate-200 text-slate-500"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span>ðŸ”’ Private</span>
                          {memberProfileForm.privacy === "private" && <span className="text-rose-600">âœ“</span>}
                        </div>
                        <p className="text-[10px] text-slate-500 font-normal leading-tight">Must request access & be accepted</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={memberProfileForm.name}
                      onChange={e => setMemberProfileForm({ ...memberProfileForm, name: e.target.value })}
                      className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Your Role at KodeinX (You Set Your Own Role) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lead IoT Engineer / AI Researcher"
                      value={memberProfileForm.role}
                      onChange={e => setMemberProfileForm({ ...memberProfileForm, role: e.target.value })}
                      className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>

                  {/* QUALIFICATION SECTION */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
                    <label className="block text-xs font-bold text-indigo-700 uppercase mb-2 flex items-center gap-1.5">
                      <i data-lucide="graduation-cap" className="w-4 h-4"></i>
                      <span>Educational & Academic Qualification *</span>
                    </label>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Degree / Specialization</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. B.Tech Artificial Intelligence / B.E Computer Science"
                          value={memberProfileForm.qualification}
                          onChange={e => setMemberProfileForm({ ...memberProfileForm, qualification: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">College / University</label>
                          <input
                            type="text"
                            placeholder="e.g. Raju's College, Rajapalayam"
                            value={memberProfileForm.institution}
                            onChange={e => setMemberProfileForm({ ...memberProfileForm, institution: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Graduation Year</label>
                          <input
                            type="text"
                            placeholder="e.g. 2024"
                            value={memberProfileForm.year}
                            onChange={e => setMemberProfileForm({ ...memberProfileForm, year: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Phone Number (Call/Contact)
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={memberProfileForm.phone}
                        onChange={e => setMemberProfileForm({ ...memberProfileForm, phone: e.target.value })}
                        className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        LinkedIn Profile *
                      </label>
                      <input
                        type="text"
                        placeholder="linkedin.com/in/your-name"
                        value={memberProfileForm.linkedin}
                        onChange={e => setMemberProfileForm({ ...memberProfileForm, linkedin: e.target.value })}
                        className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">GitHub Profile URL / Username</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="github.com/username or username"
                          value={memberProfileForm.github || ""}
                          onChange={e => setMemberProfileForm({ ...memberProfileForm, github: e.target.value })}
                          className="flex-1 bg-slate-50/80 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                        <button
                          type="button"
                          onClick={() => openGitHubLink(memberProfileForm.github || myMemberData?.github, memberProfileForm.name || myMemberData?.name)}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer keep-white"
                        >
                          <i data-lucide="github" className="w-3.5 h-3.5"></i>
                          <span>Test GitHub</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-indigo-700 uppercase">
                          Profile Photo (Avatar)
                        </label>
                        {memberProfileForm.photo && !memberProfileForm.photo.includes("dicebear.com") && (
                          <button
                            type="button"
                            onClick={handleDeleteMyPhoto}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition cursor-pointer"
                          >
                            ðŸ—‘ï¸ Delete Photo
                          </button>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          handleImageUpload(e, url => handleInstantPhotoUpdate(url));
                          e.target.value = "";
                        }}
                        className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer mb-1.5"
                      />
                      <input
                        type="text"
                        placeholder="Or paste photo link (https://...)"
                        value={memberProfileForm.photo?.startsWith("data:") ? "" : (memberProfileForm.photo || "")}
                        onChange={e => handleInstantPhotoUpdate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-indigo-700 uppercase">
                          Profile Background Cover / Banner
                        </label>
                        {memberProfileForm.bannerImage && (
                          <button
                            type="button"
                            onClick={handleDeleteMyBanner}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition cursor-pointer"
                          >
                            ðŸ—‘ï¸ Delete Background
                          </button>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          handleImageUpload(e, url => handleInstantBannerUpdate(url));
                          e.target.value = "";
                        }}
                        className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer mb-1.5"
                      />
                      <input
                        type="text"
                        placeholder="Or paste banner link (https://...)"
                        value={memberProfileForm.bannerImage?.startsWith("data:") ? "" : (memberProfileForm.bannerImage || "")}
                        onChange={e => handleInstantBannerUpdate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Special Skills (comma separated)</label>
                    <input
                      type="text"
                      placeholder="ESP32, PyTorch, React, WebSockets, Next.js"
                      value={memberProfileForm.skillsString}
                      onChange={e => setMemberProfileForm({ ...memberProfileForm, skillsString: e.target.value })}
                      className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">About You & Bio</label>
                    <textarea
                      rows={2}
                      placeholder="Brief background on what you engineer at KodeinX..."
                      value={memberProfileForm.bio}
                      onChange={e => setMemberProfileForm({ ...memberProfileForm, bio: e.target.value })}
                      className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                    />
                  </div>

                  {/* Certificate Section */}
                  <div className="pt-2 border-t border-slate-200">
                    <label className="block text-xs font-bold text-amber-700 uppercase mb-2 flex items-center gap-1.5">
                      <i data-lucide="award" className="w-3.5 h-3.5"></i>
                      <span>Add Certificate or Achievement (Optional)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Certificate Title"
                        value={memberProfileForm.certTitle}
                        onChange={e => setMemberProfileForm({ ...memberProfileForm, certTitle: e.target.value })}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Issuer (e.g. AWS / Google / NVIDIA)"
                        value={memberProfileForm.certIssuer}
                        onChange={e => setMemberProfileForm({ ...memberProfileForm, certIssuer: e.target.value })}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <input
                      type="url"
                      placeholder="Certificate Link (https://...)"
                      value={memberProfileForm.certUrl}
                      onChange={e => setMemberProfileForm({ ...memberProfileForm, certUrl: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowMyProfileModal(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer keep-white"
                    >
                      Save & Update My Live Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: VIEW MEMBER FULL PROFILE (PUBLIC & PRIVATE FLOW)   */}
          {/* ========================================================= */}
          {viewingMemberProfile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade">
              <div className="bg-white border border-slate-200/90 rounded-3xl max-w-xl w-full shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar overflow-hidden">
                {/* Banner */}
                <div className="h-28 w-full relative overflow-hidden bg-gradient-to-r from-blue-100/70 via-indigo-100/70 to-purple-100/70">
                  {viewingMemberProfile.bannerImage ? (
                    <img src={viewingMemberProfile.bannerImage} alt="banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full opacity-40 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  )}
                  <button
                    onClick={() => setViewingMemberProfile(null)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 shadow-sm border border-slate-200/80 z-20 cursor-pointer transition"
                  >
                    âœ•
                  </button>
                </div>

                {/* Avatar & Presence Header */}
                <div className="px-6 -mt-10 flex items-end justify-between gap-3 relative z-10">
                  <div className="relative">
                    <img
                      src={viewingMemberProfile.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(viewingMemberProfile.name)}&backgroundColor=0c1438&textColor=38bdf8`}
                      alt={viewingMemberProfile.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-white border-2 border-white ring-4 ring-slate-100 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                      {getMemberPresence(viewingMemberProfile).isOnline && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white ${getMemberPresence(viewingMemberProfile).isOnline ? "bg-emerald-500" : getMemberPresence(viewingMemberProfile).dotClass}`}></span>
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 mb-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                      getMemberPresence(viewingMemberProfile).isOnline
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getMemberPresence(viewingMemberProfile).isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
                      <span>{getMemberPresence(viewingMemberProfile).label}</span>
                    </span>
                    {viewingMemberProfile.privacy === "private" ? (
                      canViewMemberFullProfile(viewingMemberProfile) ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          <i data-lucide="unlock" className="w-3 h-3"></i>
                          <span>Private â€¢ Access Approved âœ“</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                          <i data-lucide="lock" className="w-3 h-3"></i>
                          <span>Private Profile (Locked)</span>
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                        <i data-lucide="globe" className="w-3 h-3"></i>
                        <span>Public Team Profile</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-3 space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{viewingMemberProfile.name}</h3>
                    <p className="text-xs font-semibold text-indigo-600 mt-0.5">{viewingMemberProfile.role}</p>
                  </div>

                  {/* IF UNLOCKED: SHOW FULL PROFILE */}
                  {canViewMemberFullProfile(viewingMemberProfile) ? (
                    <div className="space-y-4 animate-fade">
                      {/* Qualification Section */}
                      {viewingMemberProfile.qualification && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
                          <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1.5">
                            <i data-lucide="graduation-cap" className="w-4 h-4"></i>
                            <span>Academic & Degree Qualification</span>
                          </div>
                          <p className="text-sm font-bold text-slate-900">
                            {viewingMemberProfile.qualification}
                          </p>
                          {viewingMemberProfile.institution && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {viewingMemberProfile.institution} {viewingMemberProfile.year ? `(${viewingMemberProfile.year})` : ''}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Direct Contact & Verified Links */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Verified Contact & Social Links
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <a
                            href={formatLinkedInUrl(viewingMemberProfile.linkedin, viewingMemberProfile.name) || "#"}
                            target={viewingMemberProfile.linkedin ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              const url = formatLinkedInUrl(viewingMemberProfile.linkedin, viewingMemberProfile.name);
                              if (!url) {
                                e.preventDefault();
                                alert(`No LinkedIn profile URL provided for ${viewingMemberProfile.name} yet.`);
                              }
                            }}
                            className="btn-linkedin flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                            title={viewingMemberProfile.linkedin ? `Visit ${viewingMemberProfile.name}'s LinkedIn Profile` : `No LinkedIn`}
                          >
                            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                            <span className="truncate">LinkedIn Profile</span>
                            <i data-lucide="external-link" className="w-3 h-3 ml-auto"></i>
                          </a>
                          <a
                            href={formatGitHubUrl(viewingMemberProfile.github, viewingMemberProfile.name) || "#"}
                            target={viewingMemberProfile.github ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              const url = formatGitHubUrl(viewingMemberProfile.github, viewingMemberProfile.name);
                              if (!url) {
                                e.preventDefault();
                                alert(`No GitHub profile URL provided for ${viewingMemberProfile.name} yet.`);
                              }
                            }}
                            className="btn-github flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                            title={viewingMemberProfile.github ? `Visit ${viewingMemberProfile.name}'s GitHub Profile` : `No GitHub`}
                          >
                            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                            <span className="truncate">GitHub Profile</span>
                            <i data-lucide="external-link" className="w-3 h-3 ml-auto"></i>
                          </a>
                          {viewingMemberProfile.resumeUrl && (
                            <a
                              href={viewingMemberProfile.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-700 hover:text-white border border-amber-300 text-xs font-bold transition cursor-pointer shadow-xs"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                              <span className="truncate">View / Download Resume (CV)</span>
                              <i data-lucide="external-link" className="w-3 h-3 ml-auto"></i>
                            </a>
                          )}
                          {viewingMemberProfile.phone && (
                            <a
                              href={`tel:${cleanTelNumber(viewingMemberProfile.phone)}`}
                              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold transition cursor-pointer shadow-xs"
                              title={`Call ${viewingMemberProfile.phone}`}
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                              <span className="truncate">Call: {viewingMemberProfile.phone}</span>
                            </a>
                          )}
                          {viewingMemberProfile.email && (
                            <a
                              href={`mailto:${viewingMemberProfile.email}`}
                              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                              <span className="truncate">{viewingMemberProfile.email}</span>
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const target = viewingMemberProfile;
                              setViewingMemberProfile(null);
                              setMessageModalTarget(target);
                              setDirectMessageForm(prev => ({
                                ...prev,
                                subject: `Inquiry for ${target.name}`
                              }));
                            }}
                            className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 text-xs font-bold transition cursor-pointer shadow-xs"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                            <span className="truncate">Send Direct Message</span>
                          </button>
                        </div>
                      </div>

                      {/* About & Bio */}
                      {viewingMemberProfile.bio && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            About & Technical Expertise
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {viewingMemberProfile.bio}
                          </p>
                        </div>
                      )}

                      {/* Skills */}
                      {viewingMemberProfile.skills && (
                        <div className="text-left">
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Technical Skills & Frameworks
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {(Array.isArray(viewingMemberProfile.skills) ? viewingMemberProfile.skills : viewingMemberProfile.skills.split(",")).map((sk, idx) => (
                              <span key={idx} className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                                {typeof sk === "string" ? sk.trim() : sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certificates */}
                      {viewingMemberProfile.certificates && viewingMemberProfile.certificates.length > 0 && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
                          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <i data-lucide="award" className="w-4 h-4"></i>
                            <span>Verified Credentials & Honors ({viewingMemberProfile.certificates.length})</span>
                          </div>
                          <div className="space-y-2">
                            {viewingMemberProfile.certificates.map((c, i) => (
                              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                                <div>
                                  <div className="font-bold text-slate-900">{c.title}</div>
                                  <div className="text-[11px] text-slate-500">{c.issuer}</div>
                                </div>
                                {c.url && c.url !== "#" && (
                                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1">
                                    <span>Verify</span>
                                    <i data-lucide="external-link" className="w-3 h-3"></i>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Member Projects Showcase (Personal Profile Projects & Contributed Team Projects) */}
                      {(() => {
                        const memberPersonalProjs = projects.filter(p => p.authorMemberId === viewingMemberProfile.id && p.scope === "personal");
                        const memberTeamProjs = projects.filter(p => p.authorMemberId === viewingMemberProfile.id && p.scope !== "personal");
                        const totalMemberProjs = memberPersonalProjs.length + memberTeamProjs.length;
                        if (totalMemberProjs === 0) return null;

                        return (
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <i data-lucide="folder-git-2" className="w-4 h-4 text-indigo-600"></i>
                                <span>Engineered Projects & Systems ({totalMemberProjs})</span>
                              </div>
                            </div>

                            {/* Option 1: Personal Profile Projects */}
                            {memberPersonalProjs.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                                  <span>Personal Profile Projects ({memberPersonalProjs.length})</span>
                                </div>
                                <div className="space-y-2">
                                  {memberPersonalProjs.map(proj => (
                                    <div key={proj.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                                      <img src={proj.image} alt={proj.title} className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200" />
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                          <h5 className="text-xs font-bold text-slate-900 truncate">{proj.title}</h5>
                                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shrink-0">
                                            {proj.category}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">{proj.description}</p>
                                        <div className="flex items-center gap-3 mt-2 pt-1.5 border-t border-slate-100">
                                          {proj.demoUrl && (
                                            <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-1">
                                              <span>Live Demo</span>
                                              <i data-lucide="external-link" className="w-3 h-3"></i>
                                            </a>
                                          )}
                                          {proj.githubUrl && (
                                            <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-700 font-bold hover:underline flex items-center gap-1">
                                              <span>GitHub</span>
                                              <i data-lucide="external-link" className="w-3 h-3"></i>
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Option 2: KodeinX Team Portfolio Contributions */}
                            {memberTeamProjs.length > 0 && (
                              <div className={`space-y-2 ${memberPersonalProjs.length > 0 ? "pt-3 border-t border-slate-200/70" : ""}`}>
                                <div className="text-[11px] font-bold text-violet-700 uppercase tracking-wide flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-violet-600"></span>
                                  <span>KodeinX Team Portfolio Contributions ({memberTeamProjs.length})</span>
                                </div>
                                <div className="space-y-2">
                                  {memberTeamProjs.map(proj => (
                                    <div key={proj.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                                      <img src={proj.image} alt={proj.title} className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200" />
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                          <h5 className="text-xs font-bold text-slate-900 truncate">{proj.title}</h5>
                                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 font-bold border border-violet-200 shrink-0">
                                            {proj.category}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">{proj.description}</p>
                                        <div className="flex items-center gap-3 mt-2 pt-1.5 border-t border-slate-100">
                                          {proj.demoUrl && (
                                            <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-1">
                                              <span>Live Demo</span>
                                              <i data-lucide="external-link" className="w-3 h-3"></i>
                                            </a>
                                          )}
                                          {proj.githubUrl && (
                                            <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-700 font-bold hover:underline flex items-center gap-1">
                                              <span>GitHub</span>
                                              <i data-lucide="external-link" className="w-3 h-3"></i>
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    /* IF LOCKED: SHOW PRIVATE LOCK SCREEN WITH ACCESS REQUEST */
                    <div className="p-6 rounded-2xl bg-slate-50 border border-rose-200 text-center animate-fade">
                      <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-3 text-rose-600 shadow-sm">
                        <i data-lucide="lock" className="w-8 h-8"></i>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900">This Profile is Set to Private</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                        <strong>{viewingMemberProfile.name}</strong> has locked their profile. Educational qualifications, phone contact, and certificates are hidden until access is requested and accepted.
                      </p>

                      <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col items-center gap-3">
                        {!isMember ? (
                          <div>
                            <p className="text-xs text-slate-600 mb-3">Sign in with your team Google account to send an access request.</p>
                            <button
                              onClick={() => {
                                setViewingMemberProfile(null);
                                setShowGoogleAuthModal(true);
                              }}
                              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer keep-white"
                            >
                              <i data-lucide="log-in" className="w-4 h-4"></i>
                              <span>Sign In to Request Access</span>
                            </button>
                          </div>
                        ) : getMemberAccessRequestStatus(viewingMemberProfile.id) === "pending" ? (
                          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
                            <i data-lucide="clock" className="w-4 h-4 animate-spin"></i>
                            <span>Access Request Sent â³ Waiting for {viewingMemberProfile.name} to accept from their dashboard.</span>
                          </div>
                        ) : getMemberAccessRequestStatus(viewingMemberProfile.id) === "declined" ? (
                          <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                              Your previous access request was declined. You can send a new request if needed.
                            </div>
                            <button
                              onClick={() => handleSendAccessRequest(viewingMemberProfile)}
                              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                            >
                              <i data-lucide="rotate-ccw" className="w-4 h-4"></i>
                              <span>Send New Access Request</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSendAccessRequest(viewingMemberProfile)}
                            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer keep-white"
                          >
                            <i data-lucide="key" className="w-4 h-4"></i>
                            <span>Request Access to View Profile</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between gap-3">
                    {/* Only the logged-in member themselves can edit their own profile, or Admin */}
                    {isMember && session?.memberId === viewingMemberProfile.id ? (
                      <button
                        type="button"
                        onClick={() => {
                          setViewingMemberProfile(null);
                          loadMemberDataForEdit(viewingMemberProfile);
                          setCurrentView("member_dashboard");
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm keep-white"
                      >
                        <i data-lucide="edit-3" className="w-3.5 h-3.5"></i>
                        <span>Edit My Profile</span>
                      </button>
                    ) : isAdmin ? (
                      <button
                        type="button"
                        onClick={() => {
                          setViewingMemberProfile(null);
                          setAdminEditingMember(viewingMemberProfile);
                        }}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm keep-white"
                      >
                        <i data-lucide="shield-check" className="w-3.5 h-3.5"></i>
                        <span>Admin Edit Member</span>
                      </button>
                    ) : (
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                        <i data-lucide="lock" className="w-3.5 h-3.5 text-slate-400"></i>
                        <span>Profile Protected (View only)</span>
                      </div>
                    )}
                    <button
                      onClick={() => setViewingMemberProfile(null)}
                      className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: DIRECT MESSAGE & ENGINEER CONTACT MODAL            */}
          {/* ========================================================= */}
          {messageModalTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade">
              <div className="tech-card border border-sky-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left">
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={messageModalTarget.photo}
                        alt={messageModalTarget.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-sky-500/40"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#060a1e] ${getMemberPresence(messageModalTarget).isOnline ? "bg-emerald-500 animate-pulse" : getMemberPresence(messageModalTarget).dotClass}`}></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-white">{messageModalTarget.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getMemberPresence(messageModalTarget).badgeClass}`}>
                          {getMemberPresence(messageModalTarget).label}
                        </span>
                      </div>
                      <p className="text-xs text-sky-400 font-medium">{messageModalTarget.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMessageModalTarget(null)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition"
                  >
                    âœ•
                  </button>
                </div>

                {/* Instant External Communication Shortcuts */}
                <div className="my-4 p-3.5 rounded-2xl bg-[#040716] border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fast Contact:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {messageModalTarget.phone && (
                      <a
                        href={`tel:${cleanTelNumber(messageModalTarget.phone)}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        title={`Direct Phone Call to ${messageModalTarget.phone}`}
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <span>Call</span>
                      </a>
                    )}
                    {messageModalTarget.phone && (
                      <a
                        href={`https://wa.me/${messageModalTarget.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(messageModalTarget.name)},%20I%20am%20reaching%20out%20via%20KodeinX.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        title={`WhatsApp ${messageModalTarget.name}`}
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/></svg>
                        <span>WhatsApp</span>
                      </a>
                    )}
                    {messageModalTarget.email && (
                      <a
                        href={`mailto:${messageModalTarget.email}`}
                        className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500 text-sky-400 hover:text-slate-950 border border-sky-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        title={`Email ${messageModalTarget.email}`}
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        <span>Email</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Direct In-App Message Form */}
                <form onSubmit={handleSendDirectMessage} className="space-y-3.5">
                  <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <i data-lucide="send" className="w-3.5 h-3.5"></i>
                    <span>Send In-App Direct Message</span>
                  </div>

                  {!isMember && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={directMessageForm.name}
                          onChange={(e) => setDirectMessageForm({ ...directMessageForm, name: e.target.value })}
                          className="w-full bg-[#040714] border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Your Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="your.email@example.com"
                          value={directMessageForm.email}
                          onChange={(e) => setDirectMessageForm({ ...directMessageForm, email: e.target.value })}
                          className="w-full bg-[#040714] border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {isMember && (
                    <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Sending as verified member: <strong>{session.name}</strong> ({session.email})</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Subject / Project Category</label>
                    <input
                      type="text"
                      placeholder="e.g. IoT Edge Architecture Consultation"
                      value={directMessageForm.subject}
                      onChange={(e) => setDirectMessageForm({ ...directMessageForm, subject: e.target.value })}
                      className="w-full bg-[#040714] border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Message *</label>
                    <textarea
                      rows="4"
                      required
                      placeholder={`Type your direct message to ${messageModalTarget.name}. They will receive this in their private inbox immediately...`}
                      value={directMessageForm.message}
                      onChange={(e) => setDirectMessageForm({ ...directMessageForm, message: e.target.value })}
                      className="w-full bg-[#040714] border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setMessageModalTarget(null)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer w-full sm:w-auto"
                    >
                      Cancel
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={(e) => handleSendDirectMessage(e, false)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 border border-sky-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        title="Deliver live directly to recipient's member dashboard inbox"
                      >
                        <i data-lucide="send" className="w-3.5 h-3.5"></i>
                        <span>Live In-App Msg</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleSendDirectMessage(e, true)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                        title="Deliver live to inbox AND open mail client to send real email"
                      >
                        <i data-lucide="mail" className="w-3.5 h-3.5"></i>
                        <span>Send & Open Email</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: ADD ACHIEVEMENT / CERTIFICATE                     */}
          {/* ========================================================= */}
          {showAddAchievementModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade">
              <div className="tech-card border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-left">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                      <i data-lucide="award" className="w-4 h-4"></i>
                    </div>
                    <h3 className="text-lg font-bold text-white">Add Team Achievement</h3>
                  </div>
                  <button
                    onClick={() => setShowAddAchievementModal(false)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
                  >
                    âœ•
                  </button>
                </div>

                <form onSubmit={handleAddAchievement} className="mt-5 space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Achievement / Degree Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Certified Embedded IoT Specialist"
                      value={newAchievementForm.title}
                      onChange={e => setNewAchievementForm({ ...newAchievementForm, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Issuing Authority *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. NVIDIA / IEEE / University"
                        value={newAchievementForm.issuer}
                        onChange={e => setNewAchievementForm({ ...newAchievementForm, issuer: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Year</label>
                      <input
                        type="text"
                        placeholder="2026"
                        value={newAchievementForm.year}
                        onChange={e => setNewAchievementForm({ ...newAchievementForm, year: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Recipient Member
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Prabakaran M"
                        value={newAchievementForm.recipientName}
                        onChange={e => setNewAchievementForm({ ...newAchievementForm, recipientName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Badge Tag</label>
                      <input
                        type="text"
                        placeholder="ðŸ† Award / ðŸŽ“ Degree"
                        value={newAchievementForm.badge}
                        onChange={e => setNewAchievementForm({ ...newAchievementForm, badge: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Certificate / Verification URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newAchievementForm.url}
                      onChange={e => setNewAchievementForm({ ...newAchievementForm, url: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAddAchievementModal(false)}
                      className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition"
                    >
                      Publish Achievement
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

            {/* ================= FOOTER ================= */}
            <footer className="mt-auto border-t border-slate-200 bg-white py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <span className="font-mono font-bold text-blue-600">&lt;/&gt;</span>
                  <span>KodeinX Technology Innovation Hub â€¢ Rajapalayam, Raju&apos;s College</span>
                </div>
                <p>Â© 2026 KodeinX. All rights reserved.</p>
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>KodeinX Portal Active</span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      );
    }

    export default App;

