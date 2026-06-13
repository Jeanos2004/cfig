"use client";

import Link from "next/link";
import { ChevronRight, Play, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/SectionTitle";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db, GalleryItem } from "@/lib/db";

export default function GaleriePage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      const data = await db.getGallery();
      setImages(data);
      setIsLoading(false);
    };
    loadGallery();
  }, []);

  return (
    <>
      <section className="bg-[var(--color-primary)] py-20 relative overflow-hidden">
        <Image
          src="/images/gallery.png"
          alt="Galerie Photos CFIG Guinée"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="object-cover opacity-20"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Galerie Photos & Vidéos</h1>
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
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative h-72 rounded-xl overflow-hidden bg-gray-200 shadow-sm hover:shadow-xl transition-all"
                >
                  {image.mediaType === "video" ? (
                    <video 
                      src={image.mediaUrl} 
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    />
                  ) : (
                    <img 
                      src={image.mediaUrl} 
                      alt={image.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  
                  {image.mediaType !== "video" && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)] via-[var(--color-primary)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none">
                      <span className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-wider mb-1 block transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {image.category}
                      </span>
                      <h3 className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        {image.title}
                      </h3>
                    </div>
                  )}

                  {image.mediaType === "video" && (
                    <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 text-xs uppercase font-bold rounded-full flex items-center gap-1.5 backdrop-blur-sm pointer-events-none">
                      <Play className="w-3.5 h-3.5 fill-current" /> Vidéo
                    </div>
                  )}
                </motion.div>
              ))}
              
              {images.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="font-medium text-lg">La galerie est en cours de mise à jour.</p>
                  <p className="text-sm mt-1">Revenez très bientôt pour découvrir nos images !</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
