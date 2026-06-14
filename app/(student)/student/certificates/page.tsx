"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { studentDb, StudentProfile, AVAILABLE_COURSES, StudentCourse } from "@/lib/studentDb";
import StudentSidebar from "@/components/student/Sidebar";
import { Award, Eye, Download, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentCertificatesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCertCourse, setSelectedCertCourse] = useState<StudentCourse | null>(null);

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
          <span className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Chargement de vos certificats...</p>
        </div>
      </div>
    );
  }

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

  const enrolledCourses = AVAILABLE_COURSES.filter(c => profile?.enrolledCourses.includes(c.id));
  
  // Filter courses that are 100% completed
  const completedCourses = enrolledCourses.filter(c => {
    const total = getTotalCount(c);
    return total > 0 && getCompletedCount(c.id) === total;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      <StudentSidebar />

      <main className="flex-grow p-8 overflow-y-auto max-h-screen">
        <div className="mb-8 border-b border-gray-100 pb-5">
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-[var(--color-primary)]">
            Mes Certificats de Réussite
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
            Obtenez vos certifications officielles CFIG après avoir complété l'intégralité de vos leçons.
          </p>
        </div>

        {completedCourses.length === 0 ? (
          <div className="bg-white border border-gray-100 p-12 rounded-3xl text-center max-w-2xl mx-auto flex flex-col items-center shadow-sm">
            <Award className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-sm font-bold text-gray-600">Aucun certificat disponible pour le moment</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Pour débloquer un certificat, vous devez finaliser 100% des modules de l'une de vos formations actives.
            </p>
            {enrolledCourses.length > 0 ? (
              <div className="mt-6 w-full text-left space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Progression en cours :</p>
                {enrolledCourses.map(c => {
                  const completed = getCompletedCount(c.id);
                  const total = getTotalCount(c);
                  const percent = Math.round((completed / total) * 100);
                  return (
                    <div key={c.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
                      <div>
                        <h4 className="text-xs font-bold text-gray-700">{c.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{completed} sur {total} leçons complétées</p>
                      </div>
                      <span className="text-xs font-bold text-[var(--color-accent)]">{percent}%</span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((course) => (
              <div key={course.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xs text-[var(--color-primary)] uppercase tracking-wider">{course.category}</h3>
                  <h4 className="font-heading font-extrabold text-sm text-[var(--color-primary)] mt-1">{course.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-2">Délivré le {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCertCourse(course)}
                    className="py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Aperçu</span>
                  </button>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Téléchargement du certificat PDF en cours...");
                    }}
                    className="py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {selectedCertCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCertCourse(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-3xl w-full p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-200 relative overflow-hidden text-center text-gray-950 font-serif"
            >
              <button
                onClick={() => setSelectedCertCourse(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-650 transition-colors font-sans"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Decorative Frame */}
              <div className="absolute inset-4 border-4 border-double border-[var(--color-primary)]/20 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-amber-600">Certificat de Réussite</span>
                
                <h2 className="text-2xl md:text-3xl font-black text-[var(--color-primary)] font-heading">
                  CFIG GUINÉE
                </h2>
                
                <p className="text-xs italic text-gray-500 font-sans">
                  Le Cabinet de Formation Informatique de Gestion certifie que
                </p>

                <h3 className="text-xl md:text-2xl font-bold border-b-2 border-gray-100 pb-2 w-fit mx-auto text-gray-900 font-sans">
                  {profile?.fullName}
                </h3>

                <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed font-sans">
                  a complété avec succès l'ensemble du programme de formation certifiante et des travaux pratiques associés à :
                </p>

                <h4 className="text-base md:text-lg font-extrabold text-[var(--color-primary)] font-sans">
                  {selectedCertCourse.title}
                </h4>

                <p className="text-[10px] text-gray-400 font-sans uppercase tracking-widest pt-4">
                  Délivré à Conakry, le {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>

                {/* Signatures */}
                <div className="flex justify-between items-end pt-8 max-w-md mx-auto font-sans">
                  <div className="text-left">
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider">ID du Certificat</p>
                    <p className="text-[10px] font-mono font-bold text-gray-700">CERT-{selectedCertCourse.id.toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-800">Direction Générale CFIG</p>
                    <div className="mt-2 h-10 w-24 border border-dashed border-gray-200 rounded flex items-center justify-center text-[8px] text-gray-300 italic select-none">
                      Signature & Cachet
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
