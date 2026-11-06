import { RoleGate } from '../components/RoleGate';

export function AdminDashboard() {
  return <RoleGate allowed={['admin']} fallback={<section className="services-section"><h1>Accès refusé</h1><p>Espace réservé à l’administrateur.</p></section>}>
    <section className="services-section"><span className="eyebrow">ADMINISTRATEUR</span><h1>Tableau de bord de supervision</h1><p>Supervision des comptes, du réseau et des demandes. Les autorisations de données sont appliquées par Supabase RLS.</p><div className="service-grid"><article className="service-card"><h2>Utilisateurs</h2><p>Consulter les profils selon les autorisations de la base.</p></article><article className="service-card"><h2>Demandes</h2><p>Suivre les demandes et les missions du service.</p></article><article className="service-card"><h2>Sécurité</h2><p>Les rôles élevés doivent être attribués depuis un contexte de confiance.</p></article></div></section>
  </RoleGate>;
}
