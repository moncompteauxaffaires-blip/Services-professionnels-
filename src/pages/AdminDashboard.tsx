import { RoleGate } from '../components/RoleGate';
export function AdminDashboard() {
  return <RoleGate allowed={['admin']}><section className="services-section"><span className="eyebrow">ADMINISTRATEUR</span><h1>Tableau de bord de supervision</h1><p>La gestion des comptes et des rôles doit utiliser un canal administratif sécurisé. Les données restent protégées par RLS.</p><div className="service-grid"><article className="service-card"><h2>Utilisateurs</h2><p>Gestion réservée à l’administration.</p></article><article className="service-card"><h2>Demandes</h2><p>Suivi des demandes selon les permissions de la base.</p></article></div></section></RoleGate>;
}
