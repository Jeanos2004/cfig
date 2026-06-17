"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { studentDb, StudentProfile, AVAILABLE_COURSES } from "@/lib/studentDb";
import StudentSidebar from "@/components/student/Sidebar";
import StudentHeader from "@/components/student/Header";
import { CreditCard, FileText, Download, CheckCircle, MessageSquare, Bell } from "lucide-react";

export default function StudentBillingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Chargement de vos factures...</p>
        </div>
      </div>
    );
  }

  const enrolledCourses = AVAILABLE_COURSES.filter(c => profile?.enrolledCourses.includes(c.id));

  // Format currency (GNF)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF", maximumFractionDigits: 0 })
      .format(price)
      .replace("GNF", "FG");
  };

  const initials = profile?.fullName
    ? profile.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "ST";

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row font-sans text-gray-800">
      <StudentSidebar />

      <div className="flex-grow flex flex-col h-auto md:h-screen md:max-h-screen overflow-y-auto md:overflow-hidden">
        <StudentHeader title="Facturation & Historique" />

        {/* Main Content Body */}
        <main className="flex-grow p-8 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-heading font-black text-gray-900">
              Historique des Paiements
            </h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
              Consultez vos reçus d'achat et l'historique des règlements effectués pour vos formations.
            </p>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 rounded-none text-center w-full shadow-sm mt-8">
              <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-gray-650">Aucun historique de paiement</h3>
              <p className="text-xs text-gray-400 mt-2">
                Une fois que vous aurez acheté une formation, votre reçu apparaîtra dans cette section.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white border border-gray-200 rounded-none overflow-hidden shadow-sm w-full">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-55 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        <th className="py-4 px-6">ID Facture</th>
                        <th className="py-4 px-6">Formation</th>
                        <th className="py-4 px-6">Moyen de Paiement</th>
                        <th className="py-4 px-6">Montant</th>
                        <th className="py-4 px-6">Statut</th>
                        <th className="py-4 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {enrolledCourses.map((course, index) => {
                        const invoiceId = `FAC-${2026 + index}-${Math.floor(1000 + Math.random() * 9000)}`;
                        return (
                          <tr key={course.id} className="hover:bg-slate-50/50">
                            <td className="py-4 px-6 font-mono font-bold text-gray-600">{invoiceId}</td>
                            <td className="py-4 px-6 font-semibold text-gray-800">{course.title}</td>
                            <td className="py-4 px-6 text-gray-500">
                              {index % 2 === 0 ? "Orange Money Guinée" : "Carte Visa"}
                            </td>
                            <td className="py-4 px-6 font-bold text-gray-800">{formatPrice(course.price)}</td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-green-50 border border-green-200 text-green-700 text-[9px] font-bold uppercase tracking-wider">
                                <CheckCircle className="w-3 h-3" />
                                Payé
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => alert(`Téléchargement de la facture ${invoiceId}...`)}
                                className="p-1.5 border border-gray-200 hover:border-[var(--color-accent)] text-gray-500 hover:text-[var(--color-accent)] rounded-none transition-all shadow-sm"
                                title="Télécharger la facture"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card List View */}
              <div className="block md:hidden space-y-4">
                {enrolledCourses.map((course, index) => {
                  const invoiceId = `FAC-${2026 + index}-${Math.floor(1000 + Math.random() * 9000)}`;
                  return (
                    <div key={course.id} className="bg-white border border-gray-200 rounded-none p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-gray-500 text-[10px]">{invoiceId}</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-green-50 border border-green-250 text-green-700 text-[9px] font-bold uppercase tracking-wider">
                          <CheckCircle className="w-3 h-3" />
                          Payé
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="font-heading font-black text-xs text-gray-900 leading-snug">{course.title}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">{index % 2 === 0 ? "Orange Money Guinée" : "Carte Visa"}</p>
                      </div>

                      <div className="pt-3.5 border-t border-slate-50 flex items-center justify-between">
                        <div>
                          <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">Montant</span>
                          <span className="text-xs font-black text-gray-800 mt-1.5 block">{formatPrice(course.price)}</span>
                        </div>
                        <button
                          onClick={() => alert(`Téléchargement de la facture ${invoiceId}...`)}
                          className="px-4.5 py-2 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-gray-600 text-[9px] font-bold uppercase tracking-widest rounded-none transition-all flex items-center gap-1.5 shadow-sm"
                          title="Télécharger la facture"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Reçu</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
