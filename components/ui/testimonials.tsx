"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

// TypeScript interface for a single testimonial object
export interface VideoTestimonialItem {
  id: number;
  quote: string;
  name: string;
  role: string;
  imageSrc: string;
}

interface VideoTestimonialCardProps {
  testimonial: VideoTestimonialItem;
  index: number;
}

// Animation variants for each testimonial card
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
} as const;

export const VideoTestimonialCard = ({ testimonial, index }: VideoTestimonialCardProps) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-card shadow-md flex-shrink-0 w-72 md:w-80"
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
    >
      <div className="relative" style={{ height: "480px" }}>
        <img
          src={testimonial.imageSrc}
          alt={testimonial.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Content within the card */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-left text-white">
        <Quote
          className="mb-3 h-7 w-7 text-white/40"
          aria-hidden="true"
        />
        <blockquote className="text-sm font-medium leading-relaxed text-white/90">
          {testimonial.quote}
        </blockquote>
        <figcaption className="mt-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-white border border-white/30">
            {testimonial.name.charAt(0)}
          </div>
          <p className="font-semibold text-white text-sm">
            {testimonial.name}
            <span className="block text-white/60 text-xs font-normal">
              {testimonial.role}
            </span>
          </p>
        </figcaption>
      </div>
    </motion.div>
  );
};
