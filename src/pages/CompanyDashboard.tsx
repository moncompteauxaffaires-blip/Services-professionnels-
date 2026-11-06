import { RoleGate } from '../components/RoleGate';

export function CompanyDashboard() {
  return <RoleGate allowed={['company']} fallback={<section className="services-section"><h1>Accès refusé</h1><p>Espace réservé aux entreprises autorisées.</p></section>}>
    <section className="services-section"><span className="eyebrow">ENTREPRISE</span><h1>Espace entreprise</h1><p>Suivez les demandes, les missions et les professionnels selon les règles de sécurité Supabase.</p><div className="service-grid"><article className="service-card"><h2>Demandes actives</h2><p>Consulter les demandes en cours.</p></article><article className="service-card"><h2>Professionnels</h2><p>Rechercher des intervenants disponibles.</p></article><article className="service-card"><h2>Prestations</h2><p>Suivre les missions publiées.</p></article></div></section>
  </RoleGate>;
}
