"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { studentDb, StudentProfile, StudentCourse } from "@/lib/studentDb";
import StudentSidebar from "@/components/student/Sidebar";
import StudentHeader from "@/components/student/Header";
import CourseProgressCard from "@/components/student/CourseProgressCard";
import PaymentModal from "@/components/student/PaymentModal";

export default function StudentCatalogPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isMounted, setIsMounted] = useState(false);

  const fetchProfile = async (uid: string) => {
    const p = await studentDb.getProfile(uid);
    setProfile(p);
  };

  useEffect(() => {
    setIsMounted(true);
    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchProfile(currentUser.uid);
        try {
          const list = await studentDb.getCourses();
          setCourses(list);
        } catch (e) {
          console.error("Error loading courses:", e);
        }
      } else {
        router.push("/student/login");
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Chargement du catalogue...</p>
        </div>
      </div>
    );
  }

  const getTotalCount = (course: StudentCourse) => {
    let count = 0;
    course.modules.forEach(m => {
      count += (m.sessions || []).length;
    });
    return count;
  };

  const handleEnrollSuccess = async () => {
    if (user && selectedCourse) {
      await studentDb.enrollInCourse(user.uid, selectedCourse.id);
      await fetchProfile(user.uid);
    }
  };

  const isEnrolled = (courseId: string) => {
    return profile?.enrolledCourses?.includes(courseId) || false;
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableCourses = courses.filter(c => !isEnrolled(c.id));
  
  const categories = ["Toutes", ...Array.from(new Set(availableCourses.map(c => c.category)))];

  const completelyFiltered = availableCourses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "Toutes" || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalPages = Math.ceil(completelyFiltered.length / itemsPerPage);
  const paginatedCourses = completelyFiltered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row font-sans text-gray-800">
      <StudentSidebar />

      <div className="flex-grow flex flex-col h-auto md:h-screen md:max-h-screen overflow-y-auto md:overflow-hidden">
        <StudentHeader showSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          
          <div className="mb-8">
            <h1 className="text-2xl font-heading font-black text-[var(--color-primary)]">
              Catalogue des Formations
            </h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
              Découvrez et débloquez de nouvelles compétences.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border transition-all rounded-none ${
                  selectedCategory === cat 
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" 
                    : "bg-white text-gray-500 border-gray-200 hover:border-[var(--color-accent)] hover:text-[var(--color-primary)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div>
            {completelyFiltered.length === 0 ? (
              <div className="p-10 bg-white border border-gray-200 rounded-none text-center shadow-sm">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Aucune formation trouvée pour cette recherche.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedCourses.map((course) => (
                    <CourseProgressCard
                      key={course.id}
                      course={course}
                      isEnrolled={false}
                      completedCount={0}
                      totalCount={getTotalCount(course)}
                      variant="grid"
                      onAction={() => {
                        setSelectedCourse(course);
                        setPaymentOpen(true);
                      }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button 
                      disabled={currentPage === 1} 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                      className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none"
                    >
                      Précédent
                    </button>
                    
                    {Array.from({length: totalPages}).map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentPage(i+1)} 
                        className={`w-8 h-8 flex items-center justify-center border text-[10px] font-bold transition-colors rounded-none ${
                          currentPage === i + 1 
                            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" 
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {i+1}
                      </button>
                    ))}

                    <button 
                      disabled={currentPage === totalPages} 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                      className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        
        </main>
      </div>

      {selectedCourse && (
        <PaymentModal
          course={selectedCourse}
          isOpen={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          onSuccess={handleEnrollSuccess}
        />
      )}
    </div>
  );
}
