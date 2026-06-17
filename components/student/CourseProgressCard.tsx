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
  variant?: "grid" | "list";
}

export default function CourseProgressCard({ 
  course, 
  completedCount, 
  totalCount, 
  isEnrolled, 
  onAction,
  variant = "grid"
}: CourseProgressCardProps) {
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Format currency (GNF)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF", maximumFractionDigits: 0 })
      .format(price)
      .replace("GNF", "FG");
  };

  if (variant === "list") {
    return (
      <div className="bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans w-full rounded-none">
        <div className="flex items-center gap-4 min-w-0">
          {/* Smaller square thumbnail on left */}
          <div className="relative w-20 h-14 bg-slate-50 overflow-hidden shrink-0 border border-gray-200 rounded-none">
            <Image
              src={course.image}
              alt={course.title}
              fill
              sizes="80px"
              className="object-cover"
            />
            {!isEnrolled && (
              <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
 
          <div className="min-w-0">
            <span className="inline-block text-[8px] font-extrabold text-blue-600 uppercase tracking-widest mb-0.5">
              {course.category}
            </span>
            <h4 className="font-bold text-xs text-gray-900 leading-tight truncate max-w-[280px] sm:max-w-[400px]">
              {course.title}
            </h4>
            <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 leading-normal">
              {course.description}
            </p>
          </div>
        </div>
 
        <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-50">
          {isEnrolled ? (
            <div className="flex items-center gap-4 ml-auto">
              <div className="text-right">
                <span className="block text-[8px] font-bold uppercase tracking-wider text-gray-400">Progression</span>
                <span className="block text-[10px] font-extrabold text-blue-650">{progressPercent}%</span>
              </div>
              <button
                onClick={onAction}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 rounded-none"
              >
                <span>Suivre</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-auto">
              <div className="text-right">
                <span className="block text-[8px] font-bold uppercase tracking-wider text-gray-400">Prix unique</span>
                <span className="block text-xs font-black text-gray-900 mt-0.5">{formatPrice(course.price)}</span>
              </div>
              <button
                onClick={onAction}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 rounded-none border border-blue-700"
              >
                <span>Débloquer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
 
  return (
    <div className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full font-sans rounded-none">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden shrink-0 border-b border-gray-200">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        
        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-none">
          {course.category}
        </span>
 
        {!isEnrolled && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white rounded-none">
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
 
        <div className="mt-5 pt-4 border-t border-gray-200">
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
              <div className="w-full h-1.5 bg-gray-100 border border-gray-200/50 overflow-hidden rounded-none">
                <div
                  className="h-full bg-[var(--color-accent)] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
 
              <button
                onClick={onAction}
                className="w-full mt-2 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 rounded-none"
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
                className="px-4 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1 rounded-none border border-[var(--color-accent)]"
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
