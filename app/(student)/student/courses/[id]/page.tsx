"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { studentDb, StudentProfile, AVAILABLE_COURSES, StudentCourse, Lecture } from "@/lib/studentDb";
import StudentSidebar from "@/components/student/Sidebar";
import VideoLecturePlayer from "@/components/student/VideoLecturePlayer";
import { ArrowLeft, BookOpen, Download, FileText, CheckCircle2, ChevronRight, Play } from "lucide-react";
import Link from "next/link";

export default function StudentCoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);

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

  // Set first lecture active by default when course loads
  useEffect(() => {
    if (course && course.modules.length > 0 && course.modules[0].lectures.length > 0) {
      setActiveLecture(course.modules[0].lectures[0]);
    }
  }, [course]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Chargement de votre leçon...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <p className="text-sm text-gray-500 font-bold">Cours introuvable.</p>
          <Link href="/student/courses" className="text-xs text-[var(--color-accent)] underline mt-3 inline-block">
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

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      <StudentSidebar />

      <main className="flex-grow flex flex-col lg:flex-row items-stretch h-screen max-h-screen overflow-hidden">
        {/* Left Side: Video Player / Rich Text & Description (70% width) */}
        <div className="flex-grow lg:w-[70%] p-8 overflow-y-auto h-full flex flex-col gap-6">
          {/* Back button */}
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/student/courses"
              className="w-9 h-9 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[9px] font-bold text-[var(--color-accent)] uppercase tracking-widest">{course.category}</span>
              <h1 className="text-sm font-bold text-gray-600 leading-tight mt-0.5">{course.title}</h1>
            </div>
          </div>

          {/* Player / Content Switch */}
          {activeLecture ? (
            activeLecture.type === "video" ? (
              <VideoLecturePlayer
                videoUrl={activeLecture.videoUrl || ""}
                title={activeLecture.title}
                isCompleted={isLectureCompleted(activeLecture.id)}
                onComplete={handleToggleComplete}
              />
            ) : (
              <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                {/* Top header bar */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">📖 Leçon écrite</h4>
                  <button
                    onClick={handleToggleComplete}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      isLectureCompleted(activeLecture.id)
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)] shadow-sm"
                    }`}
                  >
                    {isLectureCompleted(activeLecture.id) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Validé</span>
                      </>
                    ) : (
                      <span>Marquer comme terminé</span>
                    )}
                  </button>
                </div>
                {/* Content */}
                <div className="p-8 prose max-w-none text-xs md:text-sm text-gray-600 leading-relaxed space-y-4">
                  <h2 className="text-lg font-heading font-extrabold text-[var(--color-primary)] mb-4">{activeLecture.title}</h2>
                  <div 
                    className="space-y-4 text-xs md:text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: activeLecture.textContent || "" }} 
                  />
                </div>
              </div>
            )
          ) : (
            <div className="aspect-video bg-gray-950 rounded-3xl flex items-center justify-center text-white/50 text-xs">
              Sélectionnez une leçon pour démarrer la vidéo.
            </div>
          )}

          {/* Description & Resources */}
          {activeLecture && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
                <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">Description de la leçon</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Cette session pratique fait partie du cours "{course.title}". Utilisez les fichiers joints ci-dessous pour réaliser les exercices présentés dans la vidéo ou le guide étape par étape.
                </p>
              </div>

              {/* Downloads & Resources */}
              {activeLecture.resources && activeLecture.resources.length > 0 && (
                <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
                  <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[var(--color-accent)]" />
                    Supports et Ressources (Disponible hors-connexion)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLecture.resources.map((res, index) => (
                      <a
                        key={index}
                        href={res.url}
                        className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 hover:border-[var(--color-primary)]/30 rounded-2xl transition-all"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/5 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold truncate max-w-[180px] text-gray-700">{res.name}</span>
                        </div>
                        <Download className="w-4 h-4 text-gray-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Course Playlist (30% width) */}
        <div className="lg:w-[30%] bg-white border-l border-gray-100 h-full flex flex-col overflow-hidden shrink-0">
          <div className="p-6 border-b border-gray-100 shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--color-accent)]" />
              Sommaire du Cours
            </h3>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {course.modules.map((m) => (
              <div key={m.id} className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">{m.title}</h4>
                
                <div className="space-y-1">
                  {m.lectures.map((lecture) => {
                    const isCurrent = activeLecture?.id === lecture.id;
                    const isDone = isLectureCompleted(lecture.id);
                    return (
                      <button
                        key={lecture.id}
                        onClick={() => setActiveLecture(lecture)}
                        className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between border ${
                          isCurrent
                            ? "bg-[var(--color-primary)]/5 border-[var(--color-primary)]/30 text-[var(--color-primary)]"
                            : "bg-white border-transparent hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          )}
                          <span className="text-xs font-semibold truncate leading-tight">{lecture.title}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-mono shrink-0">{lecture.duration}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
