"use client";

import { useState } from "react";
import { Play, ShieldAlert, Check } from "lucide-react";

interface VideoLecturePlayerProps {
  videoUrl: string;
  title: string;
  onComplete: () => void;
  isCompleted: boolean;
}

export default function VideoLecturePlayer({ videoUrl, title, onComplete, isCompleted }: VideoLecturePlayerProps) {
  const [dataSaver, setDataSaver] = useState(false);

  // Extract YouTube ID helper
  const getYoutubeId = (url: string): string | null => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const ytId = getYoutubeId(videoUrl);
  const isDirect = videoUrl.includes("cloudinary.com") || videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm");

  return (
    <div className="bg-black rounded-3xl overflow-hidden shadow-xl border border-gray-900 font-sans relative">
      {/* Top bar with settings */}
      <div className="bg-gray-950 px-6 py-3 flex items-center justify-between border-b border-gray-900 text-white">
        <h4 className="text-xs font-bold truncate max-w-[60%]">{title}</h4>
        
        <div className="flex items-center gap-3">
          {/* Data Saver Mode Switch */}
          <button
            onClick={() => setDataSaver(!dataSaver)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              dataSaver
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
            }`}
            title="Réduit la qualité de la vidéo pour économiser vos données internet."
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dataSaver ? "bg-amber-400 animate-pulse" : "bg-white/40"}`} />
            <span>Mode Éco {dataSaver ? "Activé" : "Désactivé"}</span>
          </button>

          {/* Mark as completed button */}
          <button
            onClick={onComplete}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
              isCompleted
                ? "bg-green-500/20 border border-green-500/40 text-green-300"
                : "bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black"
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-3 h-3" />
                <span>Complété</span>
              </>
            ) : (
              <span>Valider la leçon</span>
            )}
          </button>
        </div>
      </div>

      {/* Video Content */}
      <div className="relative aspect-video bg-gray-950 flex items-center justify-center">
        {dataSaver ? (
          <div className="absolute inset-0 bg-gray-950 z-10 flex flex-col items-center justify-center p-6 text-center text-white">
            <ShieldAlert className="w-12 h-12 text-amber-400 mb-4 opacity-80" />
            <h5 className="text-sm font-bold">Mode Économie de Données</h5>
            <p className="text-[10px] text-white/60 mt-1 max-w-sm">
              Pour économiser votre forfait internet, la lecture automatique est désactivée et la qualité vidéo est réduite au minimum.
            </p>
            <button
              onClick={() => setDataSaver(false)}
              className="mt-4 px-4 py-2 bg-white text-gray-950 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-gray-100 transition-all"
            >
              Désactiver pour charger la vidéo HD
            </button>
          </div>
        ) : null}

        {(() => {
          if (ytId) {
            return (
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?rel=0&autoplay=0${dataSaver ? "&vq=small" : ""}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            );
          } else if (isDirect) {
            return (
              <video
                src={videoUrl}
                controls
                preload={dataSaver ? "none" : "auto"}
                className="w-full h-full"
              />
            );
          } else {
            return (
              <div className="p-8 text-center text-white flex flex-col items-center">
                <Play className="w-12 h-12 text-[var(--color-primary)] mb-4" />
                <p className="text-xs">Vidéo externe.</p>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 px-4 py-2 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg"
                >
                  Regarder la vidéo
                </a>
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
}
