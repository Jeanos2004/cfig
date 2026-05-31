import { formationsData, testimonialsData } from "./data";

// === TYPES ===

export interface ModuleItem {
  titre: string;
  outils: string[];
}

export interface CategorieFormations {
  categorie: string;
  modules: ModuleItem[];
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

export interface InscriptionRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  requestType: string;
  domain: string;
  message: string;
  date: string;
  status: "En attente" | "Validé" | "Annulé";
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "Non lu" | "Lu";
}

export interface Testimonial {
  name: string;
  role: string;
  initials: string;
  color: string;
  text: string;
  rating: number;
  active: boolean;
}

// === DEFAULT DATA ===

const defaultArticles: Article[] = [
  {
    id: 1,
    title: "Cérémonie de remise des certificats - Promotion 2024",
    excerpt: "Retour en images sur la cérémonie de remise des attestations aux 150 apprenants de la cohorte 2024. Un moment riche en émotions et en opportunités.",
    date: "2026-05-15",
    author: "Direction",
    category: "Événements",
    image: "/images/news_hero.png"
  },
  {
    id: 2,
    title: "L'importance de PowerBI dans la prise de décision stratégique",
    excerpt: "Découvrez pourquoi maîtriser PowerBI est devenu un atout indispensable pour les managers et analystes en entreprise aujourd'hui.",
    date: "2026-05-02",
    author: "Ousmane Condé",
    category: "Conseils",
    image: "/images/about.png"
  },
  {
    id: 3,
    title: "Nouveau partenariat avec l'Université de Conakry",
    excerpt: "CFIG Guinée est fier d'annoncer son partenariat stratégique pour accompagner les étudiants en fin de cycle vers l'employabilité.",
    date: "2026-04-20",
    author: "Relations Publiques",
    category: "Partenariats",
    image: "/images/hero.png"
  }
];

const defaultTestimonials: Testimonial[] = testimonialsData.map(t => ({
  ...t,
  active: true
}));

const defaultInscriptions: InscriptionRequest[] = [
  {
    id: "REG-9872",
    fullName: "Moussa Camara",
    email: "moussa.camara@example.gn",
    phone: "+224 622 11 22 33",
    company: "Société des Eaux de Guinée",
    requestType: "Formation en entreprise",
    domain: "Analyse des Données",
    message: "Demande de formation sur PowerBI pour notre équipe de contrôle financier.",
    date: "2026-05-28T14:32:00Z",
    status: "En attente"
  },
  {
    id: "REG-1243",
    fullName: "Aicha Sylla",
    email: "aicha.sylla@gmail.com",
    phone: "+224 626 44 55 66",
    company: "",
    requestType: "Inscription individuelle",
    domain: "Gestion",
    message: "Je souhaite m'inscrire au module de Sage Comptabilité.",
    date: "2026-05-30T10:15:00Z",
    status: "Validé"
  }
];

const defaultMessages: ContactMessage[] = [
  {
    id: "MSG-0091",
    fullName: "Kadiatou Diallo",
    email: "kadiatou.d@gmail.com",
    subject: "Demande de tarifs",
    message: "Bonjour, j'aimerais obtenir la grille tarifaire complète pour vos formations individuelles en bureautique.",
    date: "2026-05-29T09:00:00Z",
    status: "Non lu"
  }
];

// === STORAGE INTERACTION ===

const isClient = typeof window !== "undefined";

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (!isClient) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading key ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (!isClient) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing key ${key} to localStorage:`, error);
  }
}

// === PUBLIC DATABASE API ===

export const db = {
  // Formations
  getFormations(): CategorieFormations[] {
    return getStorageItem<CategorieFormations[]>("cfig_formations", formationsData);
  },
  saveFormations(data: CategorieFormations[]): void {
    setStorageItem("cfig_formations", data);
  },

  // Articles / Blog
  getArticles(): Article[] {
    return getStorageItem<Article[]>("cfig_articles", defaultArticles);
  },
  saveArticles(data: Article[]): void {
    setStorageItem("cfig_articles", data);
  },

  // Inscriptions / Devis
  getInscriptions(): InscriptionRequest[] {
    return getStorageItem<InscriptionRequest[]>("cfig_inscriptions", defaultInscriptions);
  },
  saveInscriptions(data: InscriptionRequest[]): void {
    setStorageItem("cfig_inscriptions", data);
  },
  addInscription(request: Omit<InscriptionRequest, "id" | "date" | "status">): InscriptionRequest {
    const inscriptions = this.getInscriptions();
    const newRequest: InscriptionRequest = {
      ...request,
      id: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      status: "En attente"
    };
    inscriptions.unshift(newRequest);
    this.saveInscriptions(inscriptions);
    return newRequest;
  },

  // Contact Messages
  getMessages(): ContactMessage[] {
    return getStorageItem<ContactMessage[]>("cfig_messages", defaultMessages);
  },
  saveMessages(data: ContactMessage[]): void {
    setStorageItem("cfig_messages", data);
  },
  addMessage(msg: Omit<ContactMessage, "id" | "date" | "status">): ContactMessage {
    const messages = this.getMessages();
    const newMsg: ContactMessage = {
      ...msg,
      id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      status: "Non lu"
    };
    messages.unshift(newMsg);
    this.saveMessages(messages);
    return newMsg;
  },

  // Testimonials
  getTestimonials(): Testimonial[] {
    return getStorageItem<Testimonial[]>("cfig_testimonials", defaultTestimonials);
  },
  saveTestimonials(data: Testimonial[]): void {
    setStorageItem("cfig_testimonials", data);
  },

  // Database Initialization Helper
  init(): void {
    if (!isClient) return;
    if (!localStorage.getItem("cfig_formations")) setStorageItem("cfig_formations", formationsData);
    if (!localStorage.getItem("cfig_articles")) setStorageItem("cfig_articles", defaultArticles);
    if (!localStorage.getItem("cfig_inscriptions")) setStorageItem("cfig_inscriptions", defaultInscriptions);
    if (!localStorage.getItem("cfig_messages")) setStorageItem("cfig_messages", defaultMessages);
    if (!localStorage.getItem("cfig_testimonials")) setStorageItem("cfig_testimonials", defaultTestimonials);
  }
};
