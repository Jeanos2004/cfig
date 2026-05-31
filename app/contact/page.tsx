"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] py-20 relative overflow-hidden">
        <Image
          src="/images/contact_hero.png"
          alt="Contactez CFIG Guinée"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Contactez-nous</h1>
            <div className="flex items-center text-sm text-gray-300">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-[var(--color-accent)]">Contact</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[var(--color-surface)] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
            
            {/* Form Column */}
            <div className="lg:w-3/5 p-8 md:p-12">
              <h2 className="text-3xl font-heading font-bold text-[var(--color-primary)] mb-6">Envoyez-nous un message</h2>
              <p className="text-gray-600 mb-8">
                Vous avez une question sur nos formations ou souhaitez un accompagnement sur mesure ? Remplissez le formulaire ci-dessous et notre équipe vous répondra rapidement.
              </p>
              
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Message envoyé !"); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                    <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-shadow" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-shadow" placeholder="votre@email.com" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sujet *</label>
                  <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-shadow" placeholder="Objet de votre message" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea rows={5} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-shadow" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                </div>
                
                <button type="submit" className="inline-flex items-center px-8 py-3 bg-[var(--color-primary)] text-white rounded-md font-medium hover:bg-gray-800 transition-colors">
                  Envoyer le message <Send className="w-4 h-4 ml-2" />
                </button>
              </form>
            </div>
            
            {/* Contact Info Column */}
            <div className="lg:w-2/5 bg-[var(--color-primary)] text-white p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-accent)] opacity-10 rounded-full translate-y-1/3 -translate-x-1/4"></div>
              
              <h2 className="text-2xl font-heading font-bold mb-8 relative z-10">Informations de contact</h2>
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Adresse</h3>
                    <p className="text-gray-300">Lambanyi-Marché, Ratoma<br/>Conakry, République de Guinée</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Téléphones</h3>
                    <p className="text-gray-300">+224 622 88 67 73<br/>+224 626 62 51 62</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-gray-300">cfigguinee@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Heures d'ouverture</h3>
                    <p className="text-gray-300">Lundi - Vendredi : 8h - 18h<br/>Samedi : 9h - 13h</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[450px] w-full relative bg-gray-100 border-t border-gray-200">
        <iframe
          src="https://maps.google.com/maps?q=Lambanyi%20March%C3%A9,%20Conakry,%20Guin%C3%A9e&t=&z=16&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localisation de CFIG Guinée"
          className="w-full h-full grayscale-[15%] contrast-[105%] opacity-95 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        />
      </section>
    </>
  );
}
