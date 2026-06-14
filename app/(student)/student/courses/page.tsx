"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { studentDb, StudentProfile, AVAILABLE_COURSES, StudentCourse } from "@/lib/studentDb";
import StudentSidebar from "@/components/student/Sidebar";
import CourseProgressCard from "@/components/student/CourseProgressCard";
import PaymentModal from "@/components/student/PaymentModal";

export default function StudentCoursesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Chargement du catalogue...</p>
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

  const handleEnrollSuccess = async () => {
    if (user && selectedCourse) {
      await studentDb.enrollInCourse(user.uid, selectedCourse.id);
      await fetchProfile(user.uid);
    }
  };

  const isEnrolled = (courseId: string) => {
    return profile?.enrolledCourses.includes(courseId) || false;
  };

  const enrolledCourses = AVAILABLE_COURSES.filter(c => isEnrolled(c.id));
  const availableCourses = AVAILABLE_COURSES.filter(c => !isEnrolled(c.id));

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      <StudentSidebar />

      <main className="flex-grow p-8 overflow-y-auto max-h-screen">
        <div className="mb-8 border-b border-gray-100 pb-5">
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-[var(--color-primary)]">
            Espace d'Apprentissage &amp; Catalogue
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
            Gérez vos formations actives ou explorez de nouvelles compétences à débloquer.
          </p>
        </div>

        {/* Mes Cours (Actifs) */}
        {enrolledCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-base font-bold uppercase tracking-wider text-[var(--color-primary)] mb-6">Mes cours actifs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id}>
                  <CourseProgressCard
                    course={course}
                    isEnrolled={true}
                    completedCount={getCompletedCount(course.id)}
                    totalCount={getTotalCount(course)}
                    onAction={() => router.push(`/student/courses/${course.id}`)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catalogue */}
        <div>
          <h2 className="text-base font-bold uppercase tracking-wider text-[var(--color-primary)] mb-6">Formations disponibles</h2>
          {availableCourses.length === 0 ? (
            <div className="p-10 bg-white border border-gray-100 rounded-3xl text-center">
              <p className="text-xs text-gray-500 font-semibold">
                Félicitations ! Vous possédez tous les cours disponibles au catalogue.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => (
                <div key={course.id}>
                  <CourseProgressCard
                    course={course}
                    isEnrolled={false}
                    completedCount={0}
                    totalCount={getTotalCount(course)}
                    onAction={() => {
                      setSelectedCourse(course);
                      setPaymentOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Payment Modal */}
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
