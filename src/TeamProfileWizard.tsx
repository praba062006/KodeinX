import React, { useState } from "react";
import {
  Users,
  Building,
  Image,
  UploadCloud,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Trash2,
  UserPlus,
  Mail,
  Shield,
  Sparkles,
  Eye,
  Check,
} from "lucide-react";

export type RoleType = "Lead" | "Contributor" | "Viewer" | "Admin";

export interface TeamMember {
  id: string;
  email: string;
  role: RoleType;
}

export interface TeamData {
  name: string;
  tagline: string;
  category: string;
  description: string;
  logoUrl: string | null;
  bannerColor: string;
  bannerUrl: string | null;
  members: TeamMember[];
}

const CATEGORIES = [
  "Engineering & Tech",
  "Design & Creative",
  "Clinical & Healthcare",
  "Product Management",
  "Marketing & Growth",
  "Operations & HR",
];

const PRESET_BANNERS = [
  { name: "Indigo Wave", class: "from-indigo-600 to-blue-500" },
  { name: "Emerald Pulse", class: "from-emerald-600 to-teal-500" },
  { name: "Sunset Horizon", class: "from-rose-500 to-orange-400" },
  { name: "Royal Purple", class: "from-purple-600 to-indigo-700" },
  { name: "Midnight Glow", class: "from-slate-800 to-slate-950" },
];

export const TeamProfileWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<TeamData>({
    name: "",
    tagline: "",
    category: "Engineering & Tech",
    description: "",
    logoUrl: null,
    bannerColor: PRESET_BANNERS[0].class,
    bannerUrl: null,
    members: [
      { id: "1", email: "", role: "Lead" },
      { id: "2", email: "", role: "Contributor" },
    ],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Validation
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        errs.name = "Team name is required";
      } else if (formData.name.trim().length < 3) {
        errs.name = "Team name must be at least 3 characters";
      }

      if (!formData.tagline.trim()) {
        errs.tagline = "A brief tagline helps teammates understand your purpose";
      }

      if (!formData.description.trim()) {
        errs.description = "Team description is required";
      }
    }

    if (step === 3) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      formData.members.forEach((m, idx) => {
        if (m.email.trim() && !emailRegex.test(m.email.trim())) {
          errs[`member_${idx}`] = "Please enter a valid email address";
        }
      });
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setSubmitted(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, logoUrl: fakeUrl }));
    }
  };

  const addMemberRow = () => {
    setFormData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        { id: Math.random().toString(36).substring(7), email: "", role: "Contributor" },
      ],
    }));
  };

  const removeMemberRow = (id: string) => {
    if (formData.members.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
    }));
  };

  const updateMember = (id: string, field: "email" | "role", value: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }));
  };

  const steps = [
    { number: 1, label: "Team Details", desc: "Basic information & purpose" },
    { number: 2, label: "Visual Branding", desc: "Logo, colors & theme" },
    { number: 3, label: "Invite Members", desc: "Teammates & role access" },
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-xl border border-slate-100 text-center animate-fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Team Created Successfully!</h2>
        <p className="text-slate-600 mb-6">
          <span className="font-semibold text-slate-800">{formData.name}</span> is ready. Invitations have been queued for your team members.
        </p>

        {/* Mini Preview Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-md mx-auto text-left shadow-sm mb-8">
          <div className={`h-20 rounded-lg bg-gradient-to-r ${formData.bannerColor} relative mb-8`}>
            <div className="absolute -bottom-6 left-5 w-14 h-14 rounded-xl border-2 border-white shadow-md bg-white flex items-center justify-center overflow-hidden">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building className="w-7 h-7 text-indigo-600" />
              )}
            </div>
          </div>
          <h3 className="font-bold text-lg text-slate-900">{formData.name}</h3>
          <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider mb-2">{formData.category}</p>
          <p className="text-sm text-slate-600 italic mb-4">"{formData.tagline}"</p>
          <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-xs text-slate-500">
            <span>{formData.members.filter((m) => m.email.trim()).length} members invited</span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-medium rounded-full">Active</span>
          </div>
        </div>

        <button
          onClick={() => {
            setSubmitted(false);
            setCurrentStep(1);
          }}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition duration-150 shadow-md shadow-indigo-100"
        >
          Create Another Team
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Team Profile</h1>
          <p className="mt-1 text-slate-500">Set up your workspace, personalize branding, and onboard collaborators.</p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              const isPassed = currentStep > step.number;
              return (
                <div
                  key={step.number}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-indigo-50/70 border border-indigo-200"
                      : isPassed
                      ? "bg-slate-50 border border-transparent"
                      : "opacity-60"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition ${
                      isPassed
                        ? "bg-emerald-500 text-white"
                        : isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isPassed ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.number}
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wider font-semibold ${isActive ? "text-indigo-600" : "text-slate-500"}`}>
                      Step {step.number}
                    </p>
                    <p className="text-sm font-bold text-slate-800">{step.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Grid with Form & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            {/* Step 1: Team Details */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Step 1: Team Details</h2>
                  <p className="text-sm text-slate-500 mt-1">Provide core identity and organizational context.</p>
                </div>

                {/* Team Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Team Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Oncology Biomarkers Core"
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.name ? "border-rose-400 bg-rose-50/20" : "border-slate-300 focus:border-indigo-500"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-100 transition`}
                  />
                  {errors.name && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.name}</p>}
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Tagline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Accelerating genomic targeted therapies"
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.tagline ? "border-rose-400 bg-rose-50/20" : "border-slate-300 focus:border-indigo-500"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-100 transition`}
                  />
                  {errors.tagline && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.tagline}</p>}
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">Category / Department</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Mission & Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your team's responsibilities, current objectives, and mission statement..."
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.description ? "border-rose-400 bg-rose-50/20" : "border-slate-300 focus:border-indigo-500"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-100 transition resize-none`}
                  />
                  {errors.description && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.description}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Visual Branding */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Step 2: Visual Branding</h2>
                  <p className="text-sm text-slate-500 mt-1">Make your team instantly recognizable across the platform.</p>
                </div>

                {/* Logo Upload Dropzone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">Team Avatar / Logo</label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-3">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800">
                        Drop logo here, or <span className="text-indigo-600 underline">browse files</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG, or SVG up to 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Banner Gradient Picker */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Cover Banner Palette</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PRESET_BANNERS.map((banner) => (
                      <button
                        type="button"
                        key={banner.name}
                        onClick={() => setFormData({ ...formData, bannerColor: banner.class })}
                        className={`h-16 rounded-xl bg-gradient-to-r ${banner.class} relative flex items-end p-2 transition shadow-sm hover:scale-[1.02] border-2 ${
                          formData.bannerColor === banner.class ? "border-slate-900 ring-2 ring-indigo-200" : "border-transparent"
                        }`}
                      >
                        <span className="text-[11px] font-semibold text-white/90 drop-shadow-sm">{banner.name}</span>
                        {formData.bannerColor === banner.class && (
                          <span className="absolute top-2 right-2 bg-white text-slate-900 rounded-full p-0.5 shadow">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Member Invitations */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Step 3: Member Invitations</h2>
                  <p className="text-sm text-slate-500 mt-1">Add colleagues and grant workspace permissions.</p>
                </div>

                <div className="space-y-3">
                  {formData.members.map((member, index) => (
                    <div key={member.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          placeholder="colleague@organization.com"
                          value={member.email}
                          onChange={(e) => updateMember(member.id, "email", e.target.value)}
                          className={`w-full pl-9 pr-3 py-2 rounded-xl border ${
                            errors[`member_${index}`] ? "border-rose-400 bg-rose-50/20" : "border-slate-300"
                          } focus:outline-none focus:border-indigo-500 text-sm`}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <select
                            value={member.role}
                            onChange={(e) => updateMember(member.id, "role", e.target.value as RoleType)}
                            className="appearance-none bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="Lead">Lead</option>
                            <option value="Contributor">Contributor</option>
                            <option value="Viewer">Viewer</option>
                            <option value="Admin">Admin</option>
                          </select>
                          <Shield className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {formData.members.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMemberRow(member.id)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
                            title="Remove invitation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addMemberRow}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Add another member
                </button>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`inline-flex items-center px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition ${
                  currentStep === 1 ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-100 transition"
              >
                {currentStep === 3 ? "Complete & Create Team" : "Next Step"}
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>

          {/* Real-Time Live Preview Sidebar Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sticky top-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                <Eye className="w-3.5 h-3.5 mr-1 text-indigo-500" /> Live Preview
              </span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">Public Card</span>
            </div>

            {/* Profile Card Mockup */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
              {/* Cover Banner */}
              <div className={`h-24 bg-gradient-to-r ${formData.bannerColor} relative`}>
                <div className="absolute -bottom-6 left-5 w-16 h-16 rounded-2xl border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building className="w-8 h-8 text-indigo-500" />
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="pt-8 px-5 pb-5">
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {formData.name.trim() ? formData.name : "Your Team Name"}
                </h3>
                <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider mt-0.5 mb-2">
                  {formData.category}
                </p>

                <p className="text-xs text-slate-600 font-medium italic line-clamp-2 mb-3">
                  {formData.tagline.trim() ? `"${formData.tagline}"` : "Team mission tagline will appear here."}
                </p>

                <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                  {formData.description.trim()
                    ? formData.description
                    : "Full team description and collaborative objectives summary preview."}
                </p>

                {/* Members list count & avatars */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-indigo-500 text-white text-[10px] flex items-center justify-center font-bold">
                      You
                    </div>
                    {formData.members.filter((m) => m.email.trim()).slice(0, 3).map((m, idx) => (
                      <div
                        key={m.id}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-300 text-slate-700 text-[10px] flex items-center justify-center font-bold uppercase"
                      >
                        {m.email[0]}
                      </div>
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">
                    {formData.members.filter((m) => m.email.trim()).length + 1} Total members
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-900 leading-relaxed">
                Changes made in the wizard update in real-time on this card, showing exactly how your team will appear in the directory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamProfileWizard;
