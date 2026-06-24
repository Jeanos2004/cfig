"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { studentDb, StudentProfile, StudentCourse } from "@/lib/studentDb";
import StudentSidebar from "@/components/student/Sidebar";
import StudentHeader from "@/components/student/Header";
import { GraduationCap, Award, BookOpen, Calendar as CalendarIcon, Clock, MapPin, Video, ChevronRight, ChevronLeft, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);

  // Calendar state
  const [currentDate] = useState(new Date("2026-06-24T12:00:00Z")); // Force date to mock "Today" based on DB data for demonstration

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const [p, list] = await Promise.all([
            studentDb.getProfile(currentUser.uid),
            studentDb.getCourses()
          ]);
          setProfile(p);
          setCourses(list);
        } catch (e) {
          console.error("Error loading dashboard data:", e);
        }
      } else {
        router.push("/student/login");
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Chargement de votre agenda...</p>
        </div>
      </div>
    );
  }

  const enrolledCourses = courses.filter(c => profile?.enrolledCourses.includes(c.id));

  const getCompletedCount = (courseId: string) => {
    return profile?.progress?.[courseId]?.length || 0;
  };

  const getTotalCount = (course: StudentCourse) => {
    let count = 0;
    course.modules.forEach(m => {
      count += (m.sessions || []).length;
    });
    return count;
  };

  // Get completed certificate courses
  const completedCertificates = enrolledCourses.filter(c => {
    const total = getTotalCount(c);
    return total > 0 && getCompletedCount(c.id) === total;
  });

  // Collect all sessions from enrolled courses
  const allSessions: { course: StudentCourse; session: any }[] = [];
  enrolledCourses.forEach(course => {
    (course.modules || []).forEach(module => {
      (module.sessions || []).forEach(session => {
        allSessions.push({ course, session });
      });
    });
  });

  // Sort sessions chronologically
  allSessions.sort((a, b) => new Date(a.session.date).getTime() - new Date(b.session.date).getTime());

  // Filter today's sessions
  const todayStr = currentDate.toISOString().split("T")[0];
  const todaysSessions = allSessions.filter(s => s.session.date.startsWith(todayStr));

  // Filter upcoming sessions (strictly after today)
  const upcomingSessions = allSessions.filter(s => new Date(s.session.date).getTime() > currentDate.getTime() && !s.session.date.startsWith(todayStr)).slice(0, 4);

  const formattedDate = currentDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-gray-800">
      <StudentSidebar />

      <div className="flex-grow flex flex-col lg:flex-row h-auto lg:h-screen lg:max-h-screen lg:overflow-hidden">
        {/* Main Content */}
        <div className="flex-grow flex flex-col h-auto lg:h-full lg:overflow-hidden">
          <StudentHeader title="Tableau de bord" />
          <main className="flex-grow p-6 lg:p-8 space-y-8 overflow-y-auto h-auto lg:h-full">
            {/* Banner widget */}
            <div className="bg-[var(--color-primary)] border border-[var(--color-primary)] p-8 text-white relative overflow-hidden shadow-sm flex items-center justify-between rounded-none">
              <div className="relative z-10 space-y-3">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-light)] capitalize flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {formattedDate}
                </p>
                <h1 className="text-2xl md:text-3xl font-heading font-bold">
                  Bonjour, {profile?.fullName ? profile.fullName.split(" ")[0] : "Apprenant"} !
                </h1>
                <p className="text-xs text-slate-350 font-medium max-w-sm">
                  {todaysSessions.length > 0 
                    ? `Vous avez ${todaysSessions.length} séance(s) programmée(s) aujourd'hui. Pensez à vérifier la salle.`
                    : "Aucun cours prévu pour aujourd'hui. Profitez-en pour réviser !"}
                </p>
              </div>
              <div className="hidden md:flex relative z-10 w-20 h-20 bg-white/5 border border-white/10 items-center justify-center shadow-lg rounded-none">
                <CalendarDays className="w-10 h-10 text-[var(--color-accent)]" />
              </div>
            </div>

            {/* Today's Schedule */}
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Mon Planning du Jour</h2>
              
              {todaysSessions.length === 0 ? (
                <div className="bg-white border border-gray-200 p-8 text-center shadow-sm rounded-none">
                  <CalendarIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-xs text-gray-500 font-semibold">Journée libre ! Aucun cours au planning.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todaysSessions.map(({ course, session }) => {
                    const sessionDate = new Date(session.date);
                    const timeString = sessionDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
                    
                    return (
                      <div key={session.id} className="bg-white border-l-4 border-l-[var(--color-accent)] border border-gray-200 p-5 shadow-sm rounded-none flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-slate-50 border border-gray-150 px-4 py-2 text-center shrink-0">
                            <span className="block text-sm font-black text-[var(--color-primary)]">{timeString}</span>
                            <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">{session.duration}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-extrabold text-[var(--color-accent)] uppercase tracking-widest">{course.title}</span>
                            <h3 className="font-bold text-sm text-gray-900 mt-1 leading-tight">{session.title}</h3>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 font-medium">
                              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {session.location}</span>
                            </div>
                          </div>
                        </div>

                        {session.meetUrl && (
                          <a 
                            href={session.meetUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full md:w-auto px-5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 transition-all text-[10px] font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2"
                          >
                            <Video className="w-3.5 h-3.5" />
                            Assister en ligne
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* My Formations */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mes Formations</h2>
                <Link href="/student/courses" className="text-[10px] font-extrabold uppercase text-[var(--color-accent)] hover:underline flex items-center gap-1">
                  Tout voir
                </Link>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="bg-white border border-gray-200 p-8 text-center shadow-sm rounded-none">
                  <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-xs text-gray-500 font-semibold">Aucun cours actif pour le moment.</p>
                  <Link href="/student/catalog" className="mt-3 inline-block text-[10px] font-extrabold uppercase text-blue-600 hover:underline">
                    Découvrir le catalogue →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCourses.map((c) => {
                    const completed = getCompletedCount(c.id);
                    const total = getTotalCount(c);
                    
                    // Find next session for this course
                    const nextSessionObj = allSessions.find(s => s.course.id === c.id && new Date(s.session.date).getTime() >= currentDate.getTime());
                    
                    return (
                      <div
                        key={c.id}
                        onClick={() => router.push(`/student/courses/${c.id}`)}
                        className="bg-white border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between rounded-none"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase tracking-wider font-extrabold">{c.category}</p>
                            <h3 className="font-bold text-sm text-gray-900 mt-1 leading-snug line-clamp-2">{c.title}</h3>
                          </div>
                          <div className="bg-slate-50 px-2 py-1 border border-gray-150 text-[10px] font-bold text-gray-500">
                            {completed}/{total} Séances
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-100">
                          {nextSessionObj ? (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <CalendarIcon className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                              <span className="font-semibold">Prochain cours :</span>
                              <span className="font-bold text-gray-900">{new Date(nextSessionObj.session.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' })} à {new Date(nextSessionObj.session.date).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-green-600">
                              <Award className="w-3.5 h-3.5" />
                              <span className="font-bold">Programme terminé</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Right Panel: Upcoming & Certificates */}
        <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-6 flex flex-col gap-8 overflow-y-auto shrink-0">

          {/* Upcoming Classes */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              À venir
            </h3>
            
            {upcomingSessions.length === 0 ? (
              <div className="p-4 bg-gray-50 border border-gray-200 text-center text-[10px] text-gray-400 rounded-none shadow-sm">
                Rien au programme pour les prochains jours.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.map(({ course, session }, i) => {
                  const d = new Date(session.date);
                  return (
                    <div key={session.id} className="p-3 border border-gray-150 bg-slate-50 flex items-start gap-3 rounded-none shadow-sm">
                      <div className="bg-white border border-gray-200 px-2 py-1 text-center shrink-0 min-w-[40px]">
                        <span className="block text-[8px] uppercase tracking-widest text-gray-400 font-bold">{d.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                        <span className="block text-sm font-black text-gray-800">{d.getDate()}</span>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[9px] font-extrabold text-[var(--color-primary)] uppercase tracking-widest truncate">{course.title}</p>
                        <h4 className="text-[11px] font-bold text-gray-900 mt-0.5 leading-tight line-clamp-2">{session.title}</h4>
                        <p className="text-[9px] text-gray-500 mt-1 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Certificates */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Certificats
            </h3>
            {completedCertificates.length === 0 ? (
              <div className="p-4 border border-dashed border-gray-200 text-center text-[10px] text-gray-400 font-medium">
                Complétez toutes vos séances pour obtenir votre premier certificat.
              </div>
            ) : (
              <div className="space-y-3">
                {completedCertificates.map(c => (
                  <Link href="/student/certificates" key={c.id} className="block p-3 border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                    <h4 className="text-[11px] font-bold text-gray-900 line-clamp-1">{c.title}</h4>
                    <span className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest mt-1 block">Débloqué</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </aside>
      </div>
    </div>
  );
}
