import { RoleGate } from '../components/RoleGate';

export function ProfessionalDashboard() {
  return (
    <RoleGate
      allowed={['professional']}
      fallback={<div style={{ padding: '2rem', color: '#4b5a50' }}>Accès refusé : cet espace est réservé au profil professionnel.</div>}
    >
      <section style={{ padding: '2rem 1.5rem', display: 'grid', gap: '1rem' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem 1.5rem', border: '1px solid #e6e9e3' }}>
          <p style={{ margin: 0, color: '#5c775d', fontWeight: 700, letterSpacing: '0.12em', fontSize: '10px' }}>PROFESSIONNEL</p>
          <h2 style={{ margin: '0.6rem 0 0.5rem', fontSize: '2rem' }}>Espace professionnel</h2>
          <p style={{ margin: 0, color: '#607066', lineHeight: 1.7 }}>
            Les offres, disponibilités et demandes sont contrôlées par Supabase. Le navigateur ne peut pas modifier le rôle de l’utilisateur.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f2f7f1', borderRadius: '12px', padding: '1rem', border: '1px solid #e1eaeb' }}>
            <strong>Mes offres</strong>
            <p style={{ margin: '0.5rem 0 0', color: '#4b5a50' }}>Ajouter, modifier et publier des services.</p>
          </div>
          <div style={{ background: '#f2f7f1', borderRadius: '12px', padding: '1rem', border: '1px solid #e1eaeb' }}>
            <strong>Disponibilités</strong>
            <p style={{ margin: '0.5rem 0 0', color: '#4b5a50' }}>Gérer les créneaux et les demandes reçues.</p>
          </div>
          <div style={{ background: '#f2f7f1', borderRadius: '12px', padding: '1rem', border: '1px solid #e1eaeb' }}>
            <strong>Suivi</strong>
            <p style={{ margin: '0.5rem 0 0', color: '#4b5a50' }}>Consulter l’historique et les statistiques.</p>
          </div>
        </div>
      </section>
    </RoleGate>
  );
}
