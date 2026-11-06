import { RoleGate } from '../components/RoleGate';

export function ProfessionalDashboard() {
  return <RoleGate allowed={['professional']} fallback={<section className="services-section"><h1>Accès refusé</h1><p>Espace réservé aux professionnels autorisés.</p></section>}>
    <section className="services-section"><span className="eyebrow">PROFESSIONNEL</span><h1>Espace professionnel</h1><p>Gérez vos offres, vos disponibilités et les demandes reçues.</p><div className="service-grid"><article className="service-card"><h2>Mes offres</h2><p>Préparer et gérer vos services.</p></article><article className="service-card"><h2>Demandes reçues</h2><p>Consulter et répondre aux demandes adressées.</p></article><article className="service-card"><h2>Disponibilités</h2><p>Suivre les créneaux et les missions.</p></article></div></section>
  </RoleGate>;
}
