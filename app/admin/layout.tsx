import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration — CFIG Guinée",
  description: "Espace d'administration sécurisé du Cabinet de Formation CFIG Guinée.",
};

/**
 * Layout isolé pour la section /admin.
 * Ce layout remplace le root layout pour toutes les routes sous /admin :
 * - Pas de Navbar publique
 * - Pas de Footer publique
 * - Pas de bouton WhatsApp
 * Le dashboard gère sa propre interface complète.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell">
      {children}
    </div>
  );
}
