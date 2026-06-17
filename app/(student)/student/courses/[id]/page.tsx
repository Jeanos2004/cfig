"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { studentDb, StudentProfile, AVAILABLE_COURSES, StudentCourse, Lecture } from "@/lib/studentDb";
import StudentSidebar from "@/components/student/Sidebar";
import StudentHeader from "@/components/student/Header";
import VideoLecturePlayer from "@/components/student/VideoLecturePlayer";
import { 
  ArrowLeft, BookOpen, Download, FileText, CheckCircle2, 
  ChevronRight, Play, Award, Clock, Star, Bookmark, Calendar,
  User as UserIcon, Activity, ChevronDown, Video
} from "lucide-react";
import Link from "next/link";

export default function StudentCoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "resources">("overview");
  const [mobileAccordion, setMobileAccordion] = useState<string | null>("overview");
  const [bookmarked, setBookmarked] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const course = AVAILABLE_COURSES.find(c => c.id === courseId);

  const fetchProfile = async (uid: string) => {
    const p = await studentDb.getProfile(uid);
    setProfile(p);
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchProfile(currentUser.uid);
      } else {
        router.push("/student/login");
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  // Set first lecture active by default when course loads, and expand first module
  useEffect(() => {
    if (course && course.modules.length > 0) {
      setExpandedModules({ [course.modules[0].id]: true });
      if (course.modules[0].lectures.length > 0) {
        setActiveLecture(course.modules[0].lectures[0]);
      }
    }
  }, [course]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Chargement de votre leçon...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <p className="text-sm text-gray-500 font-bold">Cours introuvable.</p>
          <Link href="/student/courses" className="text-xs text-blue-600 underline mt-3 inline-block font-bold">
            Retourner aux cours
          </Link>
        </div>
      </div>
    );
  }

  const isLectureCompleted = (lectureId: string) => {
    return profile?.progress[courseId]?.includes(lectureId) || false;
  };

  const handleToggleComplete = async () => {
    if (user && activeLecture) {
      const currentStatus = isLectureCompleted(activeLecture.id);
      await studentDb.toggleLectureProgress(user.uid, courseId, activeLecture.id, !currentStatus);
      await fetchProfile(user.uid);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const completedCount = profile?.progress[courseId]?.length || 0;
  let totalLectures = 0;
  course.modules.forEach(m => {
    totalLectures += m.lectures.length;
  });
  const progressPercent = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

  // Next and Previous lecture navigation helper
  const allLectures: Lecture[] = [];
  course.modules.forEach(m => {
    m.lectures.forEach(l => {
      allLectures.push(l);
    });
  });

  const activeIndex = activeLecture ? allLectures.findIndex(l => l.id === activeLecture.id) : -1;
  const prevLecture = activeIndex > 0 ? allLectures[activeIndex - 1] : null;
  const nextLecture = activeIndex < allLectures.length - 1 ? allLectures[activeIndex + 1] : null;

  const initials = profile?.fullName
    ? profile.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "ST";

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans text-gray-800">
      <StudentSidebar />

      <div className="flex-grow flex flex-col md:flex-row items-stretch h-auto md:h-screen md:max-h-screen overflow-y-auto md:overflow-hidden">
        {/* Left Side: Learning Content Area (70% width) */}
        <div className="flex-grow md:w-[70%] flex flex-col md:h-full overflow-hidden">
          <StudentHeader title="Apprentissage" />
          <div className="flex-grow p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
          {/* Breadcrumbs & Header */}
          <div className="flex flex-col gap-3 shrink-0">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Link href="/student/courses" className="hover:text-blue-600 transition-colors">Catalogue</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-400">{course.category}</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-600 max-w-[200px] truncate">{course.title}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-heading font-black text-gray-950 leading-tight">
                    {activeLecture?.title || course.title}
                  </h1>
                  <span className="bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none border border-blue-200">
                    Offert par CFIG Guinée
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Formation : {course.title}
                </p>
              </div>
            </div>
          </div>

          {/* Active Lecture Media Content */}
          {activeLecture ? (
            activeLecture.type === "video" ? (
              <div className="rounded-none overflow-hidden shadow-sm border border-gray-200 bg-black aspect-video shrink-0 relative">
                <VideoLecturePlayer
                  videoUrl={activeLecture.videoUrl || ""}
                  title={activeLecture.title}
                  isCompleted={isLectureCompleted(activeLecture.id)}
                  onComplete={handleToggleComplete}
                />
              </div>
            ) : activeLecture.type === "live" ? (
              <div className="bg-slate-950 border border-gray-800 rounded-none shadow-sm p-8 md:p-12 text-white flex flex-col justify-between aspect-video shrink-0 relative">
                {/* Glowing decorative effect */}
                <div className="absolute right-0 top-0 w-48 h-48 bg-blue-500/5 blur-3xl pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-none h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
                      Cours interactif en direct (Live)
                    </span>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-heading font-black leading-tight text-white">
                    {activeLecture.title}
                  </h2>
                  <p className="text-xs text-blue-200/80 max-w-lg leading-relaxed">
                    Cette formation se déroule en direct avec l'un de nos formateurs agréés CFIG. Cliquez sur le bouton ci-dessous pour rejoindre la salle de classe virtuelle interactive (Zoom / Google Meet).
                  </p>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center relative z-10">
                  <a
                    href={activeLecture.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white text-[10px] font-bold uppercase tracking-widest rounded-none border border-[var(--color-primary)] transition-all text-center flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <Video className="w-4 h-4" />
                    Rejoindre la classe en direct
                  </a>
                  
                  <button
                    onClick={handleToggleComplete}
                    className={`w-full sm:w-auto px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest rounded-none transition-all border text-center ${
                      isLectureCompleted(activeLecture.id)
                        ? "bg-green-50/10 border-green-50/30 text-green-400"
                        : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    }`}
                  >
                    {isLectureCompleted(activeLecture.id) ? "Validé ✓" : "Marquer comme suivi"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-none overflow-hidden shadow-sm flex flex-col shrink-0">
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    Support écrit
                  </h4>
                  <button
                    onClick={handleToggleComplete}
                    className={`px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      isLectureCompleted(activeLecture.id)
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/10"
                    }`}
                  >
                    {isLectureCompleted(activeLecture.id) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Leçon validée</span>
                      </>
                    ) : (
                      <span>Marquer comme terminé</span>
                    )}
                  </button>
                </div>
                <div className="p-8 prose max-w-none text-xs md:text-sm text-gray-600 leading-relaxed max-h-[400px] overflow-y-auto">
                  <h2 className="text-base font-heading font-black text-gray-900 mb-4">{activeLecture.title}</h2>
                  <div 
                    className="space-y-4 text-xs md:text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: activeLecture.textContent || "" }} 
                  />
                </div>
              </div>
            )
          ) : (
            <div className="aspect-video bg-gray-950 border border-gray-800 rounded-none flex items-center justify-center text-white/50 text-xs shrink-0">
              Sélectionnez une leçon dans le sommaire pour commencer.
            </div>
          )}

          {/* Navigation & Controls Bar under media */}
          <div className="bg-white border border-gray-200 p-4 rounded-none shadow-sm flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                disabled={!prevLecture}
                onClick={() => prevLecture && setActiveLecture(prevLecture)}
                className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-gray-600 disabled:opacity-40 disabled:hover:bg-slate-50 text-[10px] font-bold uppercase tracking-wider rounded-none transition-all border border-gray-200 flex items-center gap-1.5 shadow-sm hover:shadow-md"
              >
                Précédent
              </button>
              <button
                disabled={!nextLecture}
                onClick={() => nextLecture && setActiveLecture(nextLecture)}
                className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-gray-600 disabled:opacity-40 disabled:hover:bg-slate-50 text-[10px] font-bold uppercase tracking-wider rounded-none transition-all border border-gray-200 flex items-center gap-1.5 shadow-sm hover:shadow-md"
              >
                Suivant
              </button>
            </div>

            {/* Quick Actions (Bookmark / Complete Status) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`w-10 h-10 rounded-none border transition-all ${
                  bookmarked 
                    ? "bg-blue-50 border-blue-300 text-blue-600 shadow-sm" 
                    : "bg-white border-gray-300 text-gray-400 hover:text-gray-600"
                }`}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
              {activeLecture && activeLecture.type === "video" && (
                <button
                  onClick={handleToggleComplete}
                  className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-none transition-all ${
                    isLectureCompleted(activeLecture.id)
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/10"
                  }`}
                >
                  {isLectureCompleted(activeLecture.id) ? "Validé ✓" : "Marquer Terminée"}
                </button>
              )}
            </div>
          </div>

          {/* Lesson Metadata Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 shrink-0">
            <div className="bg-white border border-gray-200 p-4 rounded-none shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-none border border-blue-200 bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Durée</span>
                <span className="block text-[11px] font-extrabold text-gray-900 mt-1">{course.duration}</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-none shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-none border border-purple-200 bg-purple-50 text-purple-600 flex items-center justify-center">
                <Award className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Crédits</span>
                <span className="block text-[11px] font-extrabold text-gray-900 mt-1">4.0 ECTS</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-none shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-none border border-orange-200 bg-orange-50 text-orange-600 flex items-center justify-center">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Modules</span>
                <span className="block text-[11px] font-extrabold text-gray-900 mt-1">{course.modules.length} chapitres</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-none shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-none border border-green-200 bg-green-50 text-green-600 flex items-center justify-center">
                <Star className="w-4.5 h-4.5 text-green-500 fill-current" />
              </div>
              <div>
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Évaluation</span>
                <span className="block text-[11px] font-extrabold text-gray-900 mt-1">4.9 (142 avis)</span>
              </div>
            </div>
          </div>

          {/* Description & Resources Section (Tab-based desktop / Accordion mobile) */}
          <div className="bg-white border border-gray-200 rounded-none overflow-hidden shadow-sm shrink-0">
            {/* Desktop Tabs Header */}
            <div className="hidden md:flex border-b border-gray-100 bg-gray-50/50 px-6">
              {[
                { id: "overview", label: "Aperçu de la formation" },
                { id: "details", label: "Objectifs & Programme" },
                { id: "resources", label: "Ressources à télécharger" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all relative ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Desktop Tab Contents */}
            <div className="hidden md:block p-6 text-xs md:text-sm text-gray-600 leading-relaxed">
              {activeTab === "overview" && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Description générale</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {course.description}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed mt-2">
                    Ce programme professionnel de CFIG Guinée a été conçu par des experts métiers pour vous assurer une autonomie totale et une mise en pratique immédiate en entreprise.
                  </p>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Ce que vous allez apprendre</h4>
                      <ul className="list-disc pl-4 text-xs text-gray-500 space-y-1">
                        <li>Les fondamentaux théoriques indispensables.</li>
                        <li>La modélisation de cas pratiques d'entreprises locales.</li>
                        <li>Les meilleures astuces pour automatiser votre travail.</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Prérequis obligatoires</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        Aucun prérequis technique avancé n'est requis. Une connaissance de base de l'informatique de bureau (Excel) est un atout.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div>
                  {activeLecture && activeLecture.resources && activeLecture.resources.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeLecture.resources.map((res, index) => (
                        <a
                          key={index}
                          href={res.url}
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Téléchargement de la ressource : ${res.name}`);
                          }}
                          className="flex items-center justify-between p-3.5 bg-slate-50 border border-gray-200 rounded-none shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded-none border border-blue-200 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold truncate max-w-[180px] text-gray-700">{res.name}</span>
                          </div>
                          <Download className="w-4 h-4 text-gray-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Aucune ressource téléchargeable n'est associée à la leçon active.</p>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Accordion (hidden on desktop) */}
            <div className="block md:hidden divide-y divide-gray-100">
              {/* Item 1: Overview */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileAccordion(mobileAccordion === "overview" ? null : "overview")}
                  className={`w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-left transition-all ${
                    mobileAccordion === "overview" 
                      ? "text-blue-600 bg-blue-50/40 border-b border-blue-100" 
                      : "text-gray-700 bg-slate-50/50 border-b border-slate-100"
                  }`}
                >
                  <span>Aperçu de la formation</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-250 ${mobileAccordion === "overview" ? "rotate-180 text-blue-500" : ""}`} />
                </button>
                {mobileAccordion === "overview" && (
                  <div className="p-4 text-xs text-gray-500 space-y-3 bg-white leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                    <h4 className="font-extrabold text-gray-900 uppercase tracking-wider text-[10px]">Description générale</h4>
                    <p>{course.description}</p>
                    <p>Ce programme professionnel de CFIG Guinée a été conçu par des experts métiers pour vous assurer une autonomie totale et une mise en pratique immédiate en entreprise.</p>
                  </div>
                )}
              </div>

              {/* Item 2: Details */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileAccordion(mobileAccordion === "details" ? null : "details")}
                  className={`w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-left transition-all ${
                    mobileAccordion === "details" 
                      ? "text-blue-600 bg-blue-50/40 border-b border-blue-100" 
                      : "text-gray-700 bg-slate-50/50 border-b border-slate-100"
                  }`}
                >
                  <span>Objectifs & Programme</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-250 ${mobileAccordion === "details" ? "rotate-180 text-blue-500" : ""}`} />
                </button>
                {mobileAccordion === "details" && (
                  <div className="p-4 text-xs text-gray-500 space-y-4 bg-white leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                    <h4 className="font-extrabold text-gray-900 uppercase tracking-wider text-[10px]">Ce que vous allez apprendre</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Les fondamentaux théoriques indispensables.</li>
                      <li>La modélisation de cas pratiques d'entreprises locales.</li>
                      <li>Les meilleures astuces pour automatiser votre travail.</li>
                    </ul>
                    <h4 className="font-extrabold text-gray-900 uppercase tracking-wider text-[10px] mt-3">Prérequis obligatoires</h4>
                    <p>Aucun prérequis technique avancé n'est requis. Une connaissance de base de l'informatique de bureau (Excel) est un atout.</p>
                  </div>
                )}
              </div>

              {/* Item 3: Resources */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileAccordion(mobileAccordion === "resources" ? null : "resources")}
                  className={`w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-left transition-all ${
                    mobileAccordion === "resources" 
                      ? "text-blue-600 bg-blue-50/40" 
                      : "text-gray-700 bg-slate-50/50"
                  }`}
                >
                  <span>Ressources à télécharger</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-250 ${mobileAccordion === "resources" ? "rotate-180 text-blue-500" : ""}`} />
                </button>
                {mobileAccordion === "resources" && (
                  <div className="p-4 text-xs text-gray-500 bg-white leading-relaxed border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    {activeLecture && activeLecture.resources && activeLecture.resources.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {activeLecture.resources.map((res, index) => (
                          <a
                            key={index}
                            href={res.url}
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Téléchargement de la ressource : ${res.name}`);
                            }}
                            className="flex items-center justify-between p-3 bg-slate-50 border border-gray-200 rounded-none shadow-sm hover:shadow-md transition-all"
                          >
                            <span className="font-bold truncate max-w-[200px] text-gray-700">{res.name}</span>
                            <Download className="w-4 h-4 text-gray-400 shrink-0" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="italic text-gray-400">Aucune ressource téléchargeable n'est associée à la leçon active.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Right Side: Navigation & Analytics Panel (30% width) */}
        <aside className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-gray-150 md:h-full flex flex-col overflow-hidden shrink-0">
          {/* Section 1: User course progress */}
          <div className="p-6 border-b border-gray-100 shrink-0 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none border border-blue-250 bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shadow-inner shrink-0">
                {initials}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-xs text-gray-900 leading-tight truncate">{profile?.fullName}</h4>
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Votre activité : {progressPercent}%</span>
              </div>
            </div>

            {/* Micro Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-1.5 bg-slate-100 border border-gray-200 rounded-none overflow-hidden">
                <div className="h-full bg-blue-600 rounded-none transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Section 2: SVG Interactive Activity Analytics */}
          <div className="p-6 border-b border-gray-100 shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                Analytics Hebdomadaires
              </h4>
              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-none border border-blue-100">
                +12% vs n-1
              </span>
            </div>

            {/* Interactive SVG Curve graph */}
            <div className="relative h-24 w-full bg-slate-50/50 border border-gray-200 rounded-none overflow-hidden p-2 flex flex-col justify-between shadow-sm">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#f1f5f9" strokeWidth="0.5" />
                
                {/* Activity Fill path - flat solid color fill in compliance with CFIG rules */}
                <path
                  d="M 0 90 Q 20 60 40 70 T 80 30 T 100 10 L 100 100 L 0 100 Z"
                  fill="#3b82f6"
                  opacity="0.1"
                />

                {/* Activity Line path */}
                <path
                  d="M 0 90 Q 20 60 40 70 T 80 30 T 100 10"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Daily Labels */}
              <div className="mt-auto relative z-10 flex justify-between text-[7px] font-bold text-gray-400 px-1 pt-1 border-t border-slate-100 bg-white/70">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mer</span>
                <span>Jeu</span>
                <span>Ven</span>
                <span>Sam</span>
                <span>Dim</span>
              </div>
            </div>
          </div>

          {/* Section 3: Expandable Sommaire/Lectures list */}
          <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-2 flex items-center justify-between">
              <span>Sommaire du Cours</span>
              <span className="font-mono text-gray-400 font-bold">{completedCount}/{totalLectures}</span>
            </h4>

            <div className="space-y-2.5">
              {course.modules.map((m) => {
                const isExpanded = expandedModules[m.id] !== false;
                return (
                  <div key={m.id} className="border border-gray-200 rounded-none overflow-hidden bg-slate-50/30 shadow-sm">
                    <button
                      onClick={() => toggleModule(m.id)}
                      className="w-full p-3 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between border-b border-gray-100 transition-colors"
                    >
                      <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider text-left line-clamp-1">
                        {m.title}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>

                    {isExpanded && (
                      <div className="p-2 bg-white space-y-1">
                        {m.lectures.map((lecture) => {
                          const isCurrent = activeLecture?.id === lecture.id;
                          const isDone = isLectureCompleted(lecture.id);
                          return (
                            <button
                              key={lecture.id}
                              onClick={() => setActiveLecture(lecture)}
                              className={`w-full p-2.5 rounded-none text-left transition-all flex items-center justify-between border ${
                                isCurrent
                                  ? "bg-blue-50 border-blue-300 text-blue-700 font-bold shadow-sm"
                                  : "bg-white border-transparent hover:bg-slate-50 text-gray-650"
                              }`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden pr-2">
                                {isDone ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                ) : (
                                  <Play className="w-3 h-3 text-gray-400 shrink-0 fill-current" />
                                )}
                                <span className="text-[11px] font-medium truncate leading-tight">{lecture.title}</span>
                              </div>
                              <span className="text-[9px] text-gray-400 font-mono shrink-0">{lecture.duration}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
