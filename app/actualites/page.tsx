"use client";

import Link from "next/link";
import { ChevronRight, Calendar, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/SectionTitle";

import Image from "next/image";

export default function ActualitesPage() {
  // Mock articles
  const articles = [
    {
      id: 1,
      title: "Cérémonie de remise des certificats - Promotion 2024",
      excerpt: "Retour en images sur la cérémonie de remise des attestations aux 150 apprenants de la cohorte 2024. Un moment riche en émotions et en opportunités.",
      date: "15 Mai 2024",
      author: "Direction",
      category: "Événements",
      image: "/images/gallery.png"
    },
    {
      id: 2,
      title: "L'importance de PowerBI dans la prise de décision stratégique",
      excerpt: "Découvrez pourquoi maîtriser PowerBI est devenu un atout indispensable pour les managers et analystes en entreprise aujourd'hui.",
      date: "02 Mai 2024",
      author: "Ousmane Condé",
      category: "Conseils",
      image: "/images/about.png"
    },
    {
      id: 3,
      title: "Nouveau partenariat avec l'Université de Conakry",
      excerpt: "CFIG Guinée est fier d'annoncer son partenariat stratégique pour accompagner les étudiants en fin de cycle vers l'employabilité.",
      date: "20 Avril 2024",
      author: "Relations Publiques",
      category: "Partenariats",
      image: "/images/hero.png"
    }
  ];

  return (
    <>
      <section className="bg-[var(--color-primary)] py-20 relative overflow-hidden">
        <Image
          src="/images/news_hero.png"
          alt="Actualités & Blog CFIG"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Actualités & Blog</h1>
            <div className="flex items-center text-sm text-gray-300">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-[var(--color-accent)]">Actualités</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[var(--color-surface)] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Dernières nouvelles" 
            subtitle="Restez informés des événements, des nouvelles formations et des conseils de nos experts."
            centered
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all flex flex-col group border border-gray-100"
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <Image 
                    src={article.image} 
                    alt={article.title} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-[var(--color-accent)] text-white text-xs font-bold rounded-full shadow-sm">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {article.date}
                    </div>
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {article.author}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[var(--color-primary)] mb-3 group-hover:text-[var(--color-secondary)] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <a href="#" className="inline-flex items-center text-[var(--color-secondary)] font-medium text-sm group-hover:underline mt-auto">
                    Lire l'article <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button className="px-8 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-md font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors">
              Charger plus d'articles
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
