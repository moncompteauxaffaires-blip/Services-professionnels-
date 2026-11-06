import { RoleGate } from '../components/RoleGate';
export function ProfessionalDashboard() {
  return <RoleGate allowed={['professional']}><section className="services-section"><span className="eyebrow">PROFESSIONNEL</span><h1>Espace professionnel</h1><p>Gérez vos offres et suivez vos demandes. Le rôle et les accès sont confirmés par Supabase.</p><div className="service-grid"><article className="service-card"><h2>Mes offres</h2><p>Préparer et gérer vos services.</p></article><article className="service-card"><h2>Demandes reçues</h2><p>Consulter les demandes autorisées.</p></article></div></section></RoleGate>;
}
