import { RoleGate } from '../components/RoleGate';

export function CompanyDashboard() {
  return (
    <RoleGate
      allowed={['company']}
      fallback={<div style={{ padding: '2rem', color: '#4b5a50' }}>Accès refusé : cet espace est réservé à une entreprise.</div>}
    >
      <section style={{ padding: '2rem 1.5rem', display: 'grid', gap: '1rem' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem 1.5rem', border: '1px solid #e6e9e3' }}>
          <p style={{ margin: 0, color: '#5c775d', fontWeight: 700, letterSpacing: '0.12em', fontSize: '10px' }}>ENTREPRISE</p>
          <h2 style={{ margin: '0.6rem 0 0.5rem', fontSize: '2rem' }}>Espace entreprise</h2>
          <p style={{ margin: 0, color: '#607066', lineHeight: 1.7 }}>
            Gérez les demandes, les missions et le suivi avec les professionnels. L’accès est protégé par les règles Supabase RLS.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f5f8ee', borderRadius: '12px', padding: '1rem', border: '1px solid #e6eadb' }}>
            <strong>Demandes actives</strong>
            <p style={{ margin: '0.5rem 0 0', color: '#4b5a50' }}>Consulter les demandes en cours.</p>
          </div>
          <div style={{ background: '#f5f8ee', borderRadius: '12px', padding: '1rem', border: '1px solid #e6eadb' }}>
            <strong>Professionnels</strong>
            <p style={{ margin: '0.5rem 0 0', color: '#4b5a50' }}>Accéder aux profils et aux disponibilités.</p>
          </div>
          <div style={{ background: '#f5f8ee', borderRadius: '12px', padding: '1rem', border: '1px solid #e6eadb' }}>
            <strong>Prestations</strong>
            <p style={{ margin: '0.5rem 0 0', color: '#4b5a50' }}>Suivre les missions publiées.</p>
          </div>
        </div>
      </section>
    </RoleGate>
  );
}
