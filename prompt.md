Tu es un développeur frontend senior expert en Next.js 14+ (App Router), TailwindCSS, et design UI/UX professionnel. 
Tu génères du code production-grade, complet, fonctionnel et visuellement mémorable.

---

## CONTEXTE PROJET

Tu dois générer le frontend complet d'un site web pour **CFIG Guinée** — un cabinet de formation professionnelle basé à Conakry, Guinée.

**Identité du cabinet :**
- Nom complet : Cabinet de Formation Informatique de Gestion – CFIG Guinée SARLU
- Spécialités : Formation professionnelle continue (informatique bureautique, gestion comptable, logistique, communication digitale, analyse de données, QHSE, infographie, suivi-évaluation de projets)
- Localisation : Lambanyi-Marché, Ratoma, Conakry, République de Guinée
- Contact : +224 622 88 67 73 / 626 62 51 62 | cfigguinee@gmail.com
- Tagline : *Former pour performer*

---

## CHARTE GRAPHIQUE

**Palette de couleurs :**
- Bleu marine principal : `#0D1B4B`
- Bleu ciel accent : `#1A73E8`
- Or/doré accent : `#D4A853`
- Blanc pur : `#FFFFFF`
- Gris clair fond : `#F5F7FA`
- Texte sombre : `#1A1A2E`

**Typographie :**
- Titres : `Playfair Display` (Google Fonts) — élégant, autoritaire
- Corps : `DM Sans` (Google Fonts) — lisible, moderne
- Accent/chiffres : `Space Grotesk` pour stats et badges uniquement

**Style :** Professionnel, raffiné, légèrement institutionnel — inspiré des grandes écoles de formation africaines. Pas de style startup playful. Sérieux mais chaleureux. Animations subtiles (fade-in, slide-up au scroll).

---

## STACK TECHNIQUE

- **Framework :** Next.js 14+ avec App Router
- **Styling :** TailwindCSS v3 (configuration custom avec les couleurs ci-dessus)
- **Animations :** Framer Motion pour les entrées au scroll
- **Icônes :** Lucide React
- **Fonts :** next/font/google (Playfair Display + DM Sans)
- **Images :** next/image avec placeholders
- **Formulaires :** React Hook Form + validation basique
- **Structure :** Composants dans `/components`, pages dans `/app`

---

## STRUCTURE À GÉNÉRER

### Pages (App Router) :
1. `/` — Page d'accueil
2. `/a-propos` — Présentation du cabinet
3. `/formations` — Liste de toutes les formations
4. `/formations/[slug]` — Détail d'une formation
5. `/actualites` — Blog / Actualités
6. `/temoignages` — Témoignages clients
7. `/galerie` — Galerie photos
8. `/inscription` — Formulaire d'inscription / demande de devis
9. `/contact` — Page contact

### Composants globaux :
- `Navbar` — Logo + menu responsive avec hamburger mobile, liens actifs highlighted
- `Footer` — Coordonnées, liens rapides, réseaux sociaux, copyright
- `WhatsAppButton` — Bouton flottant WhatsApp (vert, coin bas-droit, avec tooltip)
- `SectionTitle` — Composant réutilisable pour les titres de section avec ligne décorative dorée

---

## DÉTAIL PAGE PAR PAGE

### 1. PAGE D'ACCUEIL (`/`)

**Section Hero :**
- Fond : gradient bleu marine avec texture géométrique subtile en overlay
- Titre H1 : "Développez vos compétences avec CFIG Guinée"
- Sous-titre : "Cabinet de référence en formation professionnelle à Conakry"
- 2 CTA : bouton primaire "Découvrir nos formations" (bleu) + bouton secondaire "Nous contacter" (outline doré)
- Animation : fade-in staggeré (titre → sous-titre → CTAs)

**Section Stats :**
- 4 cartes avec chiffres animés au scroll : "500+ Apprenants formés", "8 Domaines de formation", "10+ Experts formateurs", "95% de satisfaction"
- Fond blanc, accents dorés, icônes Lucide

**Section Formations (aperçu) :**
- Titre : "Nos programmes phares"
- Grid 3 colonnes (desktop) / 1 colonne (mobile)
- Afficher 6 formations avec : icône, titre, courte description, badge durée, bouton "En savoir plus"
- Les 6 formations à afficher :
  1. Informatique Bureautique (Word, Excel, PowerPoint)
  2. Gestion Comptable (Sage Comptabilité)
  3. Analyse de données avec PowerBI
  4. Communication Digitale & Marketing
  5. Logistique et Transport
  6. Montage et Suivi-Évaluation de Projets
- CTA bas de section : "Voir toutes nos formations →"

**Section À propos (résumé) :**
- 2 colonnes : gauche texte, droite image placeholder
- Texte : présentation courte du cabinet, mission, valeurs
- Bouton "En savoir plus sur nous"

**Section Témoignages :**
- Carrousel ou grid de 3 témoignages fictifs
- Nom, poste, photo avatar (initiales colorées), étoiles, texte

**Section CTA final :**
- Fond bleu marine
- Titre : "Prêt à investir dans votre avenir ?"
- Bouton : "S'inscrire maintenant" (doré, large)

---

### 2. PAGE À PROPOS (`/a-propos`)

Sections :
- Hero avec titre et breadcrumb
- **Présentation** : CFIG Guinée SARLU, spécialisé dans formation + consulting en gestion d'entreprise, analyse de données, RH, comptabilité
- **Notre approche** : approche holistique, formation pratique + consultation stratégique, solutions personnalisées
- **Notre équipe** : grid de 4 cards formateurs fictifs avec photo (initiales), nom, spécialité
- **Mission & Vision** : 2 colonnes avec icônes, texte complet de la mission et vision du cabinet
- **Services offerts** : 4 cards — Formation Professionnelle, Consulting Stratégique, Implémentation Logicielles (Sage), Support Continu

---

### 3. PAGE FORMATIONS (`/formations`)

- Hero + filtres par catégorie (tabs) : Tous | Bureautique | Gestion | Logistique | Communication | Données | QHSE | Infographie | Projets
- Grid de toutes les formations avec card : icône domaine, titre module, liste outils utilisés (badges), bouton détail
- **Données formations complètes à utiliser :**

```json
[
  {
    "categorie": "Informatique Bureautique",
    "modules": [
      { "titre": "Initiation Bureautique", "outils": ["Windows", "Word", "Excel", "PowerPoint"] },
      { "titre": "Excel Avancé", "outils": ["Microsoft Excel"] }
    ]
  },
  {
    "categorie": "Gestion",
    "modules": [
      { "titre": "Gestion Comptable", "outils": ["Sage Comptabilité", "Excel"] },
      { "titre": "Gestion Commerciale", "outils": ["Sage Gestion Commerciale", "Excel"] },
      { "titre": "Gestion de la Paie", "outils": ["Sage Paie et RH", "Excel"] },
      { "titre": "Management RH – Auditeur Social", "outils": ["Sage Paie et RH", "Excel"] },
      { "titre": "Responsable Administratif et Financier", "outils": ["Excel"] }
    ]
  },
  {
    "categorie": "Logistique et Transport",
    "modules": [
      { "titre": "Responsable Logistique", "outils": ["Excel"] },
      { "titre": "Responsable Achat et Approvisionnement", "outils": ["Excel"] },
      { "titre": "Gestionnaire de Stock", "outils": ["Excel"] },
      { "titre": "Logistique Minière", "outils": ["Excel"] }
    ]
  },
  {
    "categorie": "QHSE",
    "modules": [
      { "titre": "Superviseur HSE", "outils": [] }
    ]
  },
  {
    "categorie": "Analyse des Données",
    "modules": [
      { "titre": "Tableau de bord avec Excel", "outils": ["Excel", "PowerPivot", "PowerQuery"] },
      { "titre": "Tableau de bord avec PowerBI", "outils": ["PowerBI Desktop", "PowerBI Services", "PowerBI Mobile", "PowerPivot", "PowerQuery"] },
      { "titre": "Collecte et Analyse des Données", "outils": ["KoboCollect", "KoboToolbox"] }
    ]
  },
  {
    "categorie": "Communication Digitale",
    "modules": [
      { "titre": "Community Management", "outils": ["Facebook", "WhatsApp Business", "Canva", "ChatGPT"] },
      { "titre": "Marketing Digital", "outils": ["Facebook", "Instagram", "LinkedIn", "Wix", "Email Marketing", "Canva", "Filmora"] },
      { "titre": "Communication Institutionnelle", "outils": [] }
    ]
  },
  {
    "categorie": "Infographie",
    "modules": [
      { "titre": "Conception de Visuels", "outils": ["Adobe Photoshop", "Adobe Illustrator"] }
    ]
  },
  {
    "categorie": "Suivi-Évaluation de Projets",
    "modules": [
      { "titre": "Montage Suivi et Évaluation des Projets", "outils": ["MS Project", "KoboCollect", "SPSS"] }
    ]
  }
]
```

---

### 4. PAGE INSCRIPTION (`/inscription`)

Formulaire complet avec React Hook Form :
- Nom complet *
- Email *
- Téléphone * (format guinéen +224)
- Entreprise / Organisation (optionnel)
- Type de demande : radio — "Inscription individuelle" | "Formation en entreprise" | "Demande de devis"
- Domaine de formation souhaité : select dropdown avec toutes les catégories
- Message / Besoins spécifiques : textarea
- Bouton submit : "Envoyer ma demande"
- Message de confirmation après soumission (pas de backend requis, juste UI state)
- Note en bas : "Ou contactez-nous directement sur WhatsApp" + lien wa.me/+224622886773

---

### 5. PAGE CONTACT (`/contact`)

- 2 colonnes : formulaire gauche, infos contact droite
- Infos contact : adresse (Lambanyi-Marché, Ratoma, Conakry), téléphones, email, horaires (Lundi-Vendredi 8h-18h, Samedi 9h-13h)
- Formulaire : Nom, Email, Sujet, Message, bouton Envoyer
- Embedded Google Maps placeholder (div stylisée avec icône de carte)

---

## RÈGLES DE GÉNÉRATION

1. **Génère chaque fichier séparément** avec son chemin complet en commentaire en tête de fichier
2. **Commence par** : `tailwind.config.ts` → `app/layout.tsx` → composants globaux → pages dans l'ordre
3. **Chaque composant** doit être auto-suffisant, bien typé (TypeScript), avec les imports corrects
4. **Animations Framer Motion** : utilise `motion.div` avec `initial={{ opacity: 0, y: 30 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true }}` pour les sections au scroll
5. **Responsive** : mobile-first, breakpoints sm/md/lg/xl
6. **Pas de données hardcodées en inline** : crée un fichier `lib/data.ts` pour toutes les données (formations, témoignages, stats, équipe)
7. **Images** : utilise `next/image` avec `src="/images/placeholder.jpg"` et `alt` descriptif — pas d'images externes
8. **WhatsApp Button** : composant flottant `position: fixed, bottom: 24px, right: 24px`, fond vert `#25D366`, icône MessageCircle de Lucide, animation pulse CSS
9. **SEO** : chaque page doit avoir un `export const metadata` avec title et description appropriés
10. **Qualité du code** : pas de TODO, pas de commentaires inutiles, code propre et professionnel

---

## FORMAT DE RÉPONSE

Pour chaque fichier, réponds ainsi :
=== FICHIER: chemin/du/fichier.tsx ===
[code complet ici]

Génère dans cet ordre :
1. `tailwind.config.ts`
2. `app/globals.css`
3. `lib/data.ts`
4. `components/Navbar.tsx`
5. `components/Footer.tsx`
6. `components/WhatsAppButton.tsx`
7. `components/SectionTitle.tsx`
8. `app/layout.tsx`
9. `app/page.tsx` (Accueil)
10. `app/a-propos/page.tsx`
11. `app/formations/page.tsx`
12. `app/formations/[slug]/page.tsx`
13. `app/inscription/page.tsx`
14. `app/contact/page.tsx`
15. `app/temoignages/page.tsx`
16. `app/galerie/page.tsx`
17. `app/actualites/page.tsx`

Commence maintenant.