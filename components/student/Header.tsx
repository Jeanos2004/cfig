"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Bell, MessageSquare, Menu, Search, X, Check, 
  Play, Award, Calendar, ExternalLink 
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { studentDb, StudentProfile } from "@/lib/studentDb";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title?: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  showSearch?: boolean;
}

export default function StudentHeader({ 
  title, 
  searchQuery, 
  setSearchQuery, 
  showSearch = false 
}: HeaderProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  
  const messagesRef = useRef<HTMLDivElement>(null);
  const notifsRef = useRef<HTMLDivElement>(null);

  // Mock Messages Data
  const mockMessages = [
    {
      id: 1,
      sender: "M. Camara (Formateur)",
      text: "Bonjour, as-tu réussi à terminer le TP sur les mesures DAX ?",
      time: "Il y a 10 min",
      unread: true,
      initials: "MC"
    },
    {
      id: 2,
      sender: "Support CFIG Academy",
      text: "Votre paiement Orange Money a bien été validé.",
      time: "Il y a 2 h",
      unread: false,
      initials: "SP"
    },
    {
      id: 3,
      sender: "Sékou Bangoura (Étudiant)",
      text: "Salut, on se retrouve sur Google Meet pour bosser le module ?",
      time: "Hier",
      unread: false,
      initials: "SB"
    }
  ];

  // Mock Notifications Data
  const mockNotifications = [
    {
      id: 1,
      type: "live",
      title: "Session Live ce soir",
      desc: "Rejoins le coaching en direct à 18h00 avec le formateur.",
      time: "Dans 4 h",
      unread: true,
      icon: Calendar,
      color: "text-amber-600 bg-amber-50"
    },
    {
      id: 2,
      type: "course",
      title: "Nouvelle leçon disponible !",
      desc: "Le chapitre 'Modélisation des Données' a été mis en ligne.",
      time: "Il y a 1 jour",
      unread: false,
      icon: Play,
      color: "text-blue-600 bg-blue-50"
    },
    {
      id: 3,
      type: "cert",
      title: "Certificat disponible !",
      desc: "Ton certificat PowerBI est prêt à être téléchargé.",
      time: "Il y a 3 jours",
      unread: false,
      icon: Award,
      color: "text-green-600 bg-green-50"
    }
  ];

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const p = await studentDb.getProfile(currentUser.uid);
        setProfile(p);
      }
    });
    return () => unsub();
  }, []);

  // Click outside listener to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (messagesRef.current && !messagesRef.current.contains(event.target as Node)) {
        setMessagesOpen(false);
      }
      if (notifsRef.current && !notifsRef.current.contains(event.target as Node)) {
        setNotifsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = profile?.fullName
    ? profile.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "ST";

  const triggerSidebar = () => {
    window.dispatchEvent(new Event("toggle-student-sidebar"));
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-8 shrink-0 relative z-30 font-sans">
      
      {/* Mobile Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={triggerSidebar}
          className="md:hidden p-2 bg-slate-50 hover:bg-slate-100 border border-gray-200/80 rounded-xl text-gray-700 hover:text-gray-900 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {!showSearch && title && (
          <h1 className="text-xs font-bold text-gray-900 uppercase tracking-wider hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      {/* Optional Search Bar */}
      {showSearch && setSearchQuery && (
        <div className="flex-1 max-w-md relative mr-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une formation, une catégorie..."
            className="w-full bg-slate-50 border border-gray-200/80 rounded-2xl pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium text-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Right Icons: Messages, Notifications, Profile */}
      <div className="flex items-center gap-4 sm:gap-6 ml-auto">
        
        {/* Messages Dropdown */}
        <div className="relative" ref={messagesRef}>
          <button 
            onClick={() => {
              setMessagesOpen(!messagesOpen);
              setNotifsOpen(false);
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors relative ${
              messagesOpen ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
          </button>

          {messagesOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-3xl shadow-xl p-4 space-y-3 mt-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Messages récents</h3>
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">1 non lu</span>
              </div>

              <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto pr-1">
                {mockMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className="py-3 flex gap-3 cursor-pointer hover:bg-slate-50/50 rounded-xl px-1.5 transition-colors"
                    onClick={() => router.push("/student/dashboard")} // Mock nav
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {msg.initials}
                    </div>
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-950 truncate">{msg.sender}</span>
                        <span className="text-[8px] text-gray-400 font-semibold">{msg.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5 leading-normal">
                        {msg.text}
                      </p>
                    </div>
                    {msg.unread && (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 self-center shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifsRef}>
          <button 
            onClick={() => {
              setNotifsOpen(!notifsOpen);
              setMessagesOpen(false);
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors relative ${
              notifsOpen ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
          </button>

          {notifsOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-3xl shadow-xl p-4 space-y-3 mt-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Notifications</h3>
                <button 
                  onClick={() => alert("Toutes les notifications marquées comme lues")}
                  className="text-[9px] font-bold text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Tout lire
                </button>
              </div>

              <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto pr-1">
                {mockNotifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className="py-3 flex gap-3 cursor-pointer hover:bg-slate-50/50 rounded-xl px-1.5 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${notif.color}`}>
                      <notif.icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-950">{notif.title}</span>
                        <span className="text-[8px] text-gray-400 font-semibold">{notif.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                        {notif.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Widget */}
        <div className="flex items-center gap-3 border-l border-gray-100 pl-4 sm:pl-6">
          <div className="text-right hidden sm:block">
            <h4 className="font-bold text-xs text-gray-900 leading-none">{profile?.fullName.split(" ")[0]}</h4>
            <span className="text-[9px] font-semibold text-gray-400 mt-1 uppercase tracking-wider block leading-none">
              {profile?.profession === "student" ? "Étudiant" : "Apprenant"}
            </span>
          </div>
          <div 
            onClick={() => router.push("/student/profile")}
            className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shadow-inner cursor-pointer hover:scale-105 transition-transform"
          >
            {initials}
          </div>
        </div>

      </div>
    </header>
  );
}
