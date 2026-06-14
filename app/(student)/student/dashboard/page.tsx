"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { studentDb, StudentProfile, AVAILABLE_COURSES, StudentCourse } from "@/lib/studentDb";
import StudentSidebar from "@/components/student/Sidebar";
import { GraduationCap, Award, BookOpen, MessageSquare, Bell, Search, ChevronRight, ChevronLeft, Calendar as CalendarIcon, CheckCircle, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Calendar state
  const [currentDate] = useState(new Date());

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const p = await studentDb.getProfile(currentUser.uid);
        setProfile(p);
      } else {
        router.push("/student/login");
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  const enrolledCourses = AVAILABLE_COURSES.filter(c => profile?.enrolledCourses.includes(c.id));

  const getCompletedCount = (courseId: string) => {
    return profile?.progress[courseId]?.length || 0;
  };

  const getTotalCount = (course: StudentCourse) => {
    let count = 0;
    course.modules.forEach(m => {
      count += m.lectures.length;
    });
    return count;
  };

  // Get total progress percentage
  let overallProgress = 0;
  if (enrolledCourses.length > 0) {
    let totalLectures = 0;
    let completedLectures = 0;
    enrolledCourses.forEach(c => {
      totalLectures += getTotalCount(c);
      completedLectures += getCompletedCount(c.id);
    });
    overallProgress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
  }

  // Get completed certificate courses
  const completedCertificates = enrolledCourses.filter(c => {
    const total = getTotalCount(c);
    return total > 0 && getCompletedCount(c.id) === total;
  });

  // Get next 3 upcoming/uncompleted lectures from active courses
  const upcomingLectures: { course: StudentCourse; lecture: any }[] = [];
  enrolledCourses.forEach(course => {
    course.modules.forEach(module => {
      module.lectures.forEach(lecture => {
        const isDone = profile?.progress[course.id]?.includes(lecture.id);
        if (!isDone && upcomingLectures.length < 3) {
          upcomingLectures.push({ course, lecture });
        }
      });
    });
  });

  const formattedDate = currentDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  const initials = profile?.fullName
    ? profile.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "ST";

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-gray-800">
      {/* Column 1: Sidebar */}
      <StudentSidebar />

      {/* Column 2: Main Content (Dashboard middle) */}
      <main className="flex-1 max-h-screen overflow-y-auto p-8 space-y-8">
        {/* Banner widget */}
        <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-lg shadow-blue-600/10 flex items-center justify-between">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-200 capitalize">
              {formattedDate}
            </p>
            <h1 className="text-3xl font-heading font-black">
              Ravi de vous revoir, {profile?.fullName.split(" ")[0]} !
            </h1>
            <p className="text-xs text-blue-100 font-medium max-w-sm">
              Vous avez validé <span className="font-extrabold text-white">{overallProgress}%</span> de vos modules de formation hebdomadaires !
            </p>
          </div>

          <div className="hidden md:flex relative z-10 w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl items-center justify-center shadow-xl">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* My Courses Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-gray-900">Mes Formations</h2>
            <Link href="/student/courses" className="text-xs font-bold text-blue-600 hover:underline">
              Tout voir
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="bg-white border border-gray-100 p-8 rounded-3xl text-center shadow-sm">
              <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-xs text-gray-500 font-semibold">Aucun cours actif pour le moment.</p>
              <Link href="/student/courses" className="mt-3 inline-block text-xs font-bold text-blue-600 hover:underline">
                Découvrir le catalogue →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {enrolledCourses.map((c) => {
                const completed = getCompletedCount(c.id);
                const total = getTotalCount(c);
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
                
                // Color badges depending on course id
                const bgColors = ["bg-purple-50 text-purple-600", "bg-orange-50 text-orange-600", "bg-blue-50 text-blue-600"];
                const badgeStyle = bgColors[c.title.length % bgColors.length];

                return (
                  <div
                    key={c.id}
                    onClick={() => router.push(`/student/courses/${c.id}`)}
                    className="bg-white border border-gray-100 p-5 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm mb-4 ${badgeStyle}`}>
                        {c.title.charAt(0)}
                      </div>
                      <h3 className="font-extrabold text-xs text-gray-900 leading-snug line-clamp-2 min-h-[34px]">{c.title}</h3>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">{c.category}</p>
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-bold text-gray-400">
                        <span>Leçons : {completed}/{total}</span>
                        <span className="text-blue-600">{percent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Achievements / Certificates section */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-6">Certificats Obtenus</h2>
          {completedCertificates.length === 0 ? (
            <div className="p-6 bg-white border border-gray-100 rounded-3xl text-center text-xs text-gray-400">
              Complétez 100% d'un cours pour voir votre certificat s'afficher ici.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedCertificates.map(c => (
                <div key={c.id} className="bg-amber-50/30 border border-amber-100/50 p-5 rounded-[2rem] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-md">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900 line-clamp-1">{c.title}</h4>
                      <p className="text-[9px] font-semibold text-amber-700 uppercase tracking-widest mt-1">Certificat Validé</p>
                    </div>
                  </div>

                  <Link
                    href="/student/certificates"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    Voir
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Column 3: Calendar & Upcoming Tasks (Right Panel) */}
      <aside className="w-80 bg-white border-l border-gray-100 p-6 flex flex-col gap-6 max-h-screen overflow-y-auto shrink-0">
        {/* Right Header: Notification, Message, Profile */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors relative">
              <MessageSquare className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
            </button>
          </div>

          {/* Profile widget */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h4 className="font-bold text-xs truncate max-w-[100px] leading-none text-gray-900">{profile?.fullName.split(" ")[0]}</h4>
              <span className="text-[9px] font-semibold text-gray-400 mt-1 uppercase tracking-wider block leading-none">
                {profile?.profession === "student" ? "Étudiant" : "Apprenant"}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shadow-inner">
              {initials}
            </div>
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="bg-slate-50/50 border border-gray-100 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-gray-800">
            <span className="capitalize">
              {currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </span>
            <div className="flex items-center gap-2 text-gray-400">
              <button className="hover:text-gray-600"><ChevronLeft className="w-4 h-4" /></button>
              <button className="hover:text-gray-600"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Mini Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-2 text-center text-[9px] font-bold text-gray-400">
            {["L", "M", "M", "J", "V", "S", "D"].map(d => <span key={d}>{d}</span>)}
            
            {/* Mocked days around June 2026 */}
            {[...Array(30)].map((_, i) => {
              const day = i + 1;
              const isToday = day === currentDate.getDate();
              return (
                <span
                  key={i}
                  className={`w-6 h-6 flex items-center justify-center mx-auto rounded-full ${
                    isToday ? "bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/20" : "text-gray-700 hover:bg-slate-100 cursor-pointer"
                  }`}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </div>

        {/* Upcoming Tasks / Lessons */}
        <div className="space-y-4 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Tâches aujourd'hui</h3>
              <Link href="/student/courses" className="text-[10px] font-bold text-blue-600 hover:underline">
                Voir tout
              </Link>
            </div>

            {upcomingLectures.length === 0 ? (
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center text-[10px] text-gray-400">
                Toutes vos leçons ont été complétées pour aujourd'hui !
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingLectures.map(({ course, lecture }, i) => {
                  const colors = ["bg-red-50 text-red-500", "bg-yellow-50 text-yellow-600", "bg-purple-50 text-purple-600"];
                  const iconStyle = colors[i % colors.length];
                  
                  return (
                    <div
                      key={lecture.id}
                      onClick={() => router.push(`/student/courses/${course.id}`)}
                      className="p-3.5 bg-white border border-gray-150 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconStyle}`}>
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-gray-900 truncate max-w-[150px] leading-tight">{lecture.title}</h4>
                          <p className="text-[9px] text-gray-400 truncate max-w-[150px] mt-0.5 leading-none">{course.title}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Stats Summary */}
          <div className="p-4 bg-blue-50/50 border border-blue-100/30 rounded-[2rem] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                ✓
              </div>
              <span className="text-[10px] font-bold text-blue-900">Progression globale</span>
            </div>
            <span className="text-xs font-black text-blue-600">{overallProgress}%</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
