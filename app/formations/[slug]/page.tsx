"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  MonitorPlay,
  Clock,
  Award,
  ShieldCheck,
  Layers,
  Globe,
  UserCheck,
} from "lucide-react";
import { db } from "@/lib/db";

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const categoryImages: Record<string, string> = {
  "Informatique Bureautique": "/images/gallery.png",
  "Gestion": "/images/about.png",
  "Logistique et Transport": "/images/hero.png",
  "QHSE": "/images/hero.png",
  "Analyse des Données": "/images/gallery.png",
  "Communication Digitale": "/images/about.png",
  "Infographie": "/images/gallery.png",
  "Suivi-Évaluation de Projets": "/images/about.png",
};

export default function FormationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [formation, setFormation] = useState<any>(null);

  useEffect(() => {
    if (params.slug) {
      db.init();
      const currentFormations = db.getFormations();
      let found = null;
      for (const cat of currentFormations) {
        for (const mod of cat.modules) {
          if (generateSlug(mod.titre) === params.slug) {
            found = { ...mod, categorie: cat.categorie };
            break;
          }
        }
        if (found) break;
      }
      if (found) {
        setFormation(found);
      } else {
        router.push("/formations");
      }
    }
  }, [params.slug, router]);

  if (!formation) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-sans">
        Chargement...
      </div>
    );
  }

  const imageSrc = categoryImages[formation.categorie] || "/images/gallery.png";

  return (
    <>
      {/* PAGE HERO */}
      <section className="bg-[var(--color-primary)] py-20 relative overflow-hidden">
        <Image
          src={imageSrc}
          alt={formation.titre}
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/formations"
            className="inline-flex items-center gap-1.5 text-[var(--color-light)] hover:text-white text-xs font-bold uppercase tracking-wider mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux formations
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--color-light)]" />
            <Link href="/formations" className="hover:text-white transition-colors">Formations</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--color-light)]" />
            <span className="text-[var(--color-light)]">{formation.categorie}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight max-w-3xl">
            {formation.titre}
          </h1>
        </div>
      </section>

      {/* MAIN CONTENT + SIDEBAR */}
      <section className="py-16 bg-[var(--color-gray)] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* === MAIN CONTENT === */}
            <div className="lg:w-2/3">
              <div className="bg-white border border-gray-200 p-8 mb-6">
                <span className="inline-block px-3 py-1 bg-[var(--color-accent)] text-white text-[10px] font-bold uppercase tracking-widest mb-5">
                  Programme
                </span>
                <h2 className="text-2xl font-heading font-bold text-[var(--color-primary)] mb-5">
                  Objectifs de la formation
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  La formation <span className="font-bold text-gray-800">{formation.titre}</span> est conçue
                  par des experts du domaine <span className="font-semibold">{formation.categorie}</span>.
                  Elle vous dote des compétences pratiques et techniques nécessaires pour exceller
                  dans votre environnement professionnel.
                </p>

                <div className="w-10 h-1 bg-[var(--color-accent)] mb-6" />

                <h3 className="text-lg font-heading font-bold text-[var(--color-primary)] mb-5">
                  Ce que vous allez maîtriser
                </h3>

                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { title: "Pratique terrain", desc: "Méthodes concrètes applicables dès le retour en entreprise." },
                    { title: "Maîtrise des outils", desc: "Logiciels et outils indispensables du secteur." },
                    { title: "Études de cas réels", desc: "Simulations et exercices basés sur des scénarios métier." },
                    { title: "Certification CFIG", desc: "Attestation officielle valorisant votre parcours." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-gray-800 text-sm mb-1">{item.title}</div>
                        <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* === SIDEBAR LMS WIDGET === */}
            <div className="lg:w-1/3">
              <div className="bg-white border border-gray-200 sticky top-[96px] overflow-hidden">
                {/* Accent top bar */}
                <div className="h-1.5 bg-[var(--color-accent)]" />

                <div className="p-7">
                  <h3 className="text-lg font-heading font-bold text-[var(--color-primary)] mb-5">
                    Caractéristiques
                  </h3>

                  {/* LMS-style feature list */}
                  <ul className="space-y-0 divide-y divide-gray-100">
                    {[
                      {
                        icon: <Layers className="w-4 h-4 text-[var(--color-accent)]" />,
                        label: "Catégorie",
                        value: (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] bg-blue-50 px-2 py-0.5">
                            {formation.categorie}
                          </span>
                        ),
                      },
                      {
                        icon: <MonitorPlay className="w-4 h-4 text-[var(--color-accent)]" />,
                        label: "Outils",
                        value:
                          formation.outils && formation.outils.length > 0 ? (
                            <div className="flex flex-wrap gap-1 justify-end max-w-[160px]">
                              {formation.outils.map((o: string, i: number) => (
                                <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium">
                                  {o}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">Concepts & Métier</span>
                          ),
                      },
                      {
                        icon: <Clock className="w-4 h-4 text-[var(--color-accent)]" />,
                        label: "Durée",
                        value: <span className="text-xs font-bold text-gray-700">Flexible / Sur mesure</span>,
                      },
                      {
                        icon: <UserCheck className="w-4 h-4 text-[var(--color-accent)]" />,
                        label: "Niveau",
                        value: <span className="text-xs font-bold text-gray-700">Débutant → Avancé</span>,
                      },
                      {
                        icon: <Globe className="w-4 h-4 text-[var(--color-accent)]" />,
                        label: "Langue",
                        value: <span className="text-xs font-bold text-gray-700">Français</span>,
                      },
                      {
                        icon: <Award className="w-4 h-4 text-[var(--color-accent)]" />,
                        label: "Certificat",
                        value: (
                          <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                            Attestation CFIG
                          </span>
                        ),
                      },
                    ].map(({ icon, label, value }, i) => (
                      <li key={i} className="flex items-start justify-between py-3.5 gap-4">
                        <span className="flex items-center gap-2 text-gray-500 text-xs font-medium pt-0.5">
                          {icon}
                          {label}
                        </span>
                        <span className="text-right">{value}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action buttons */}
                  <div className="mt-6 space-y-3 pt-5 border-t border-gray-100">
                    <Link
                      href="/inscription"
                      className="flex items-center justify-center w-full py-3.5 bg-[var(--color-accent)] hover:bg-[var(--color-primary)] text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      S'inscrire à ce module
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center justify-center w-full py-3.5 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Demander un devis
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
