"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, Target, Eye, GraduationCap, Briefcase, Laptop, LifeBuoy } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { teamData, servicesData } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] py-20 relative overflow-hidden">
        <Image
          src="/images/about.png"
          alt="À Propos de CFIG Guinée"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">À Propos de CFIG Guinée</h1>
            <div className="flex items-center text-sm text-gray-300">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-[var(--color-accent)]">À Propos</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Presentation */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionTitle title="CFIG Guinée SARLU" subtitle="Votre partenaire de confiance en Guinée" />
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Le Cabinet de Formation Informatique de Gestion (CFIG Guinée SARLU) est un cabinet de référence spécialisé dans la formation professionnelle continue et le consulting d'entreprise.
                </p>
                <p>
                  Nous intervenons dans plusieurs domaines stratégiques : gestion d'entreprise, analyse de données, ressources humaines, comptabilité, logistique et communication digitale. Notre objectif est de doter les professionnels et les organisations des compétences nécessaires pour exceller dans un environnement concurrentiel.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[var(--color-surface)] p-8 rounded-2xl shadow-inner border border-gray-100"
            >
              <h3 className="text-2xl font-heading font-bold text-[var(--color-primary)] mb-6">Notre Approche</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                    <Target className="w-5 h-5 text-[var(--color-secondary)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-primary)]">Holistique</h4>
                    <p className="text-sm text-gray-600">Une vision globale des défis de votre entreprise.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                    <Briefcase className="w-5 h-5 text-[var(--color-secondary)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-primary)]">Pratique</h4>
                    <p className="text-sm text-gray-600">Des formations axées sur la pratique et l'utilisation d'outils réels.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                    <LifeBuoy className="w-5 h-5 text-[var(--color-secondary)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-primary)]">Personnalisée</h4>
                    <p className="text-sm text-gray-600">Des solutions de consultation adaptées à votre contexte spécifique.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-2xl shadow-md border-t-4 border-[var(--color-secondary)]"
            >
              <Target className="w-12 h-12 text-[var(--color-secondary)] mb-6" />
              <h3 className="text-2xl font-heading font-bold text-[var(--color-primary)] mb-4">Notre Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                Fournir des services de formation et de consultation de haute qualité qui permettent aux individus de réaliser leur plein potentiel et aux organisations d'optimiser leurs performances opérationnelles et stratégiques.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 rounded-2xl shadow-md border-t-4 border-[var(--color-accent)]"
            >
              <Eye className="w-12 h-12 text-[var(--color-accent)] mb-6" />
              <h3 className="text-2xl font-heading font-bold text-[var(--color-primary)] mb-4">Notre Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                Devenir le partenaire privilégié et le leader incontesté de la formation professionnelle continue et du conseil en gestion en République de Guinée et dans la sous-région, reconnu pour notre excellence et notre impact positif.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Offerts */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Nos Services" subtitle="Une gamme complète de solutions pour votre développement" centered />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {servicesData.map((service, index) => {
              const icons: Record<string, React.ReactNode> = {
                GraduationCap: <GraduationCap className="w-8 h-8" />,
                Briefcase: <Briefcase className="w-8 h-8" />,
                Laptop: <Laptop className="w-8 h-8" />,
                LifeBuoy: <LifeBuoy className="w-8 h-8" />,
              };

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[var(--color-surface)] p-8 rounded-xl text-center hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)] text-white mb-6">
                    {icons[service.icon]}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-primary)] mb-3">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-[var(--color-primary)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Notre Équipe d'Experts" subtitle="Des professionnels qualifiés et passionnés" centered className="text-white" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {teamData.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-colors"
              >
                <div className="w-24 h-24 mx-auto bg-[var(--color-accent)] rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
                  {member.initials}
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-sm text-[var(--color-accent)]">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
