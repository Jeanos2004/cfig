"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { studentDb } from "@/lib/studentDb";
import { motion } from "framer-motion";
import { User, Lock, Mail, ArrowRight, Eye, EyeOff, Phone, Briefcase } from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Log in
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/student/dashboard");
      } else {
        // Sign up
        if (!fullName.trim()) {
          setError("Veuillez renseigner votre nom complet.");
          setLoading(false);
          return;
        }
        if (!phone.trim()) {
          setError("Veuillez renseigner votre numéro de téléphone.");
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await studentDb.createProfile(userCredential.user.uid, email, fullName, phone, profession);
        router.push("/student/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Cet e-mail est déjà utilisé par un autre compte.");
      } else if (err.code === "auth/weak-password") {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Identifiants incorrects. Veuillez réessayer.");
      } else {
        setError("Une erreur est survenue lors de l'authentification.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-stretch font-sans text-gray-800">
      {/* Left panel: Info & Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--color-primary)] text-white p-16 flex-col justify-between relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[var(--color-accent)] via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-heading font-black tracking-wider text-white">
            <span className="text-[var(--color-accent)]">CFIG</span> GUINÉE
          </Link>
        </div>

        <div className="my-auto relative z-10 max-w-lg">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm text-[var(--color-accent)] text-xs font-bold uppercase tracking-wider mb-6 rounded-full">
            Espace Apprenant
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold leading-tight mb-6">
            Développez vos compétences métiers dès aujourd'hui
          </h2>
          <p className="text-white/70 leading-relaxed mb-8">
            Rejoignez notre plateforme de formation pratique en informatique de gestion. Accédez à vos vidéos, vos ressources et suivez votre progression en temps réel.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">✓</div>
              <p className="text-sm font-semibold text-white/95">Apprentissage 100% orienté pratique</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">✓</div>
              <p className="text-sm font-semibold text-white/95">Supports et exercices téléchargeables</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">✓</div>
              <p className="text-sm font-semibold text-white/95">Accès à vie après paiement unique</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/50 border-t border-white/10 pt-6">
          &copy; {new Date().getFullYear()} CFIG Guinée. Tous droits réservés.
        </div>
      </div>

      {/* Right panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="lg:hidden inline-flex items-center gap-2 text-xl font-heading font-black tracking-wider text-[var(--color-primary)] mb-6">
              <span className="text-[var(--color-accent)]">CFIG</span> GUINÉE
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-[var(--color-primary)]">
              {isLogin ? "Bon retour !" : "Créez votre compte"}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {isLogin
                ? "Connectez-vous pour continuer votre apprentissage."
                : "Remplissez le formulaire pour accéder à l'espace étudiant."}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold mb-6 flex items-start gap-2"
            >
              <span className="shrink-0 font-bold">⚠️</span>
              <div>{error}</div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Nom Complet</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      className="w-full bg-gray-50 border border-gray-200 px-10 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all rounded-xl"
                      placeholder="Ex: Amadou Diallo"
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
                      className="w-full bg-gray-50 border border-gray-200 pl-14 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all rounded-xl"
                      placeholder="622 00 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Statut Professionnel *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      required
                      className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all rounded-xl appearance-none"
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
              </>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Adresse E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full bg-gray-50 border border-gray-200 px-10 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all rounded-xl"
                  placeholder="Ex: name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-gray-50 border border-gray-200 px-10 pr-12 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all rounded-xl"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white py-3.5 px-4 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 mt-6"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? "Se connecter" : "Créer mon compte"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors"
            >
              {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà inscrit ? Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
