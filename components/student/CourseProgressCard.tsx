"use client";

import { StudentCourse } from "@/lib/studentDb";
import { BookOpen, Award, CheckCircle, ArrowRight, Lock } from "lucide-react";
import Image from "next/image";

interface CourseProgressCardProps {
  course: StudentCourse;
  completedCount: number;
  totalCount: number;
  isEnrolled: boolean;
  onAction: () => void;
}

export default function CourseProgressCard({ course, completedCount, totalCount, isEnrolled, onAction }: CourseProgressCardProps) {
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Format currency (GNF)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF", maximumFractionDigits: 0 })
      .format(price)
      .replace("GNF", "FG");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full font-sans">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden shrink-0">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        
        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          {course.category}
        </span>

        {!isEnrolled && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white">
              <Lock className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <h4 className="font-bold text-sm text-[var(--color-primary)] leading-snug line-clamp-2 min-h-[40px]">{course.title}</h4>
          <p className="text-[11px] text-gray-400 mt-2 line-clamp-3 leading-relaxed">{course.description}</p>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100">
          {isEnrolled ? (
            <div className="space-y-3">
              {/* Progress info */}
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-gray-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  {completedCount}/{totalCount} Leçons
                </span>
                <span className="text-[var(--color-accent)]">{progressPercent}% Complété</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <button
                onClick={onAction}
                className="w-full mt-2 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Reprendre le cours</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 leading-none">Prix unique</span>
                <span className="text-sm font-black text-[var(--color-primary)] mt-1">{formatPrice(course.price)}</span>
              </div>

              <button
                onClick={onAction}
                className="px-4 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center gap-1"
              >
                <span>Débloquer</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
