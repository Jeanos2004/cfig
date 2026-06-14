"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { studentDb, StudentProfile } from "@/lib/studentDb";
import StudentSidebar from "@/components/student/Sidebar";
import { User as UserIcon, Mail, Phone, Briefcase, CheckCircle, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("student");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const p = await studentDb.getProfile(currentUser.uid);
        if (p) {
          setProfile(p);
          setFullName(p.fullName);
          setPhone(p.phone || "");
          setProfession(p.profession || "other");
        }
      } else {
        router.push("/student/login");
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSuccess(false);

    try {
      // Create profile is an upsert action
      const updated = await studentDb.createProfile(user.uid, user.email || "", fullName, phone, profession);
      setProfile(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde du profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      <StudentSidebar />

      <main className="flex-grow p-8 overflow-y-auto max-h-screen">
        <div className="mb-8 border-b border-gray-100 pb-5">
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-[var(--color-primary)]">
            Mon Profil Étudiant
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
            Modifiez vos informations personnelles et gérez les détails de votre compte.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wider mb-6 rounded-2xl flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Profil mis à jour avec succès !</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-505 mb-1.5">Adresse E-mail (Non modifiable)</label>
              <div className="relative opacity-60">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 px-10 py-3 text-xs rounded-xl cursor-not-allowed"
                  value={profile?.email || ""}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Nom Complet *</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-200 px-10 py-3 text-xs rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Numéro de Téléphone *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">+224</span>
                <input
                  type="tel"
                  required
                  className="w-full bg-gray-50 border border-gray-200 pl-14 pr-4 py-3 text-xs font-bold rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Statut Professionnel *</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  required
                  className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 text-xs rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all appearance-none"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                >
                  <option value="student">Étudiant / Élève</option>
                  <option value="employee">Salarié / Professionnel</option>
                  <option value="unemployed">Recherche d'emploi</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Enregistrer</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
