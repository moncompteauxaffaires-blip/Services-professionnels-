import { RoleGate } from '../components/RoleGate';

export function ProfessionalDashboard() {
  return (
    <RoleGate
      allowed={['professional']}
      fallback={<div style={{ padding: '2rem', color: '#4b5a50' }}>Accès refusé : cet espace est réservé à un professionnel.</div>}
    >
      <section style={{ padding: '2rem 1.5rem', display: 'grid', gap: '1rem' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem 1.5rem', border: '1px solid #e6e9e3' }}>
          <p style={{ margin: 0, color: '#5c775d', fontWeight: 700, letterSpacing: '0.12em', fontSize: '10px' }}>PROFESSIONNEL</p>
          <h2 style={{ margin: '0.6rem 0 0.5rem', fontSize: '2rem' }}>Espace professionnel</h2>
          <p style={{ margin: 0, color: '#607066', lineHeight: 1.7 }}>
            Gérez vos offres, vos disponibilités et les demandes reçues. L’accès est valide uniquement si le profil est autorisé dans Supabase.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#eef4ec', borderRadius: '12px', padding: '1rem', border: '1px solid #e3eadf' }}>
            <strong>Mes offres</strong>
            <p style={{ margin: '0.5rem 0 0', color: '#4b5a50' }}>Gérer les services et tarifs.</p>
          </div>
          <div style={{ background: '#eef4ec', borderRadius: '12px', padding: '1rem', border: '1px solid #e3eadf' }}>
            <strong>Demandes reçues</strong>
            <p style={{ margin: '0.5rem 0 0', color: '#4b5a50' }}>Consulter et répondre aux demandes.</p>
          </div>
          <div style={{ background: '#eef4ec', borderRadius: '12px', padding: '1rem', border: '1px solid #e3eadf' }}>
            <strong>Disponibilités</strong>
            <p style={{ margin: '0.5rem 0 0', color: '#4b5a50' }}>Suivre les créneaux et les missions.</p>
          </div>
        </div>
      </section>
    </RoleGate>
  );
}
