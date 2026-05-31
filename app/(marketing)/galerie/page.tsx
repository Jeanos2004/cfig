"use client";

import Link from "next/link";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/SectionTitle";

import Image from "next/image";

export default function GaleriePage() {
  // Mock images data for the gallery
  const images = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    title: `Session de formation ${i + 1}`,
    category: i % 3 === 0 ? "Ateliers" : i % 2 === 0 ? "Remise de certificats" : "Salles de cours",
    src: "/images/gallery.png"
  }));

  return (
    <>
      <section className="bg-[var(--color-primary)] py-20 relative overflow-hidden">
        <Image
          src="/images/gallery.png"
          alt="Galerie Photos CFIG Guinée"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Galerie Photos</h1>
            <div className="flex items-center text-sm text-gray-300">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-[var(--color-accent)]">Galerie</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[var(--color-surface)] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Immersion au sein de CFIG" 
            subtitle="Découvrez nos locaux, nos apprenants en action et nos cérémonies de remise de certificats."
            centered
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative h-72 rounded-xl overflow-hidden bg-gray-200 cursor-pointer shadow-sm hover:shadow-xl transition-all"
              >
                <Image 
                  src={image.src} 
                  alt={image.title} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)] via-[var(--color-primary)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-wider mb-1 block transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {image.category}
                  </span>
                  <h3 className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {image.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
