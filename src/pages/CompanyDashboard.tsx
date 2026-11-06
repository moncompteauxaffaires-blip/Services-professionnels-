import { RoleGate } from '../components/RoleGate';
export function CompanyDashboard() {
  return <RoleGate allowed={['company']}><section className="services-section"><span className="eyebrow">ENTREPRISE</span><h1>Espace entreprise</h1><p>Suivez vos demandes et vos prestations. Les données ne sont accessibles qu’avec les autorisations RLS prévues pour votre compte.</p><div className="service-grid"><article className="service-card"><h2>Demandes actives</h2><p>Consulter les demandes en cours.</p></article><article className="service-card"><h2>Professionnels</h2><p>Accéder aux profils disponibles selon les règles de la base.</p></article></div></section></RoleGate>;
}
