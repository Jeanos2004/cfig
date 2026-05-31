"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { testimonialsData } from "@/lib/data";
import { SectionTitle } from "@/components/SectionTitle";

export default function TemoignagesPage() {
  return (
    <>
      <section className="bg-[var(--color-primary)] py-20 relative overflow-hidden">
        <Image
          src="/images/testimonials_hero.png"
          alt="Témoignages CFIG Guinée"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Témoignages</h1>
            <div className="flex items-center text-sm text-gray-300">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-[var(--color-accent)]">Témoignages</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[var(--color-surface)] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Ce qu'ils disent de nous" 
            subtitle="Découvrez les retours d'expérience de ceux qui ont choisi CFIG Guinée pour développer leurs compétences."
            centered
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {/* Duplicating testimonials slightly for the page to look full */}
            {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 relative mt-8"
              >
                <div className="absolute -top-6 left-8 bg-[var(--color-primary)] w-12 h-12 rounded-full flex items-center justify-center text-[var(--color-accent)] shadow-lg">
                  <Quote className="w-6 h-6" fill="currentColor" />
                </div>
                
                <div className="flex text-[var(--color-accent)] mb-4 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? "fill-current" : "text-gray-300"}`} />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-8 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center pt-6 border-t border-gray-100">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4 ${testimonial.color}`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-primary)]">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Prêt à rejoindre notre réseau d'alumni ?</h3>
            <p className="text-gray-600 mb-8">Inscrivez-vous dès maintenant et boostez votre carrière.</p>
            <Link 
              href="/inscription" 
              className="inline-flex items-center px-8 py-3 bg-[var(--color-accent)] text-white rounded-md font-medium hover:bg-[var(--color-primary)] transition-colors shadow-lg"
            >
              Je m'inscris
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
