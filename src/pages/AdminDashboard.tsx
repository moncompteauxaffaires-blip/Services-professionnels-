import { RoleGate } from '../components/RoleGate';

export function AdminDashboard() {
  return (
    <RoleGate
      allowed={['admin']}
      fallback={<div style={{ padding: '2rem', color: '#4b5a50' }}>Accès refusé : cet espace est réservé à l’administrateur.</div>}
    >
      <section style={{ padding: '2rem 1.5rem', display: 'grid', gap: '1rem' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem 1.5rem', border: '1px solid #e6e9e3' }}>
          <p style={{ margin: 0, color: '#5c775d', fontWeight: 700, letterSpacing: '0.12em', fontSize: '10px' }}>ADMINISTRATEUR</p>
          <h2 style={{ margin: '0.6rem 0 0.5rem', fontSize: '2rem' }}>Tableau de bord de supervision</h2>
          <p style={{ margin: 0, color: '#607066', lineHeight: 1.7 }}>
            Cette zone est réservée à la supervision du réseau, des comptes et des demandes. Les règles d’accès sont vérifiées dans Supabase RLS.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#eef5ee', borderRadius: '12px', padding: '1rem', border: '1px solid #dfe9df' }}>
            <strong>Utilisateurs</strong>
            <p style={{ margin: '0.5rem 0 0', color: '#4b5a50' }}>Vérification des comptes et des rôles.</p>
          </div>
          <div style={{ background: '#eef5ee', borderRadius: '12px', padding: '1rem', border: '1px solid #dfe9df' }}>
            <strong>Demandes</strong>
            <p style={{ margin: '0.5rem 0 0', color: '#4b5a50' }}>Suivi des demandes et validation des missions.</p>
          </div>
          <div style={{ background: '#eef5ee', borderRadius: '12px', padding: '1rem', border: '1px solid #dfe9df' }}>
            <strong>Réseau</strong>
            <p style={{ margin: '0.5rem 0 0', color: '#4b5a50' }}>Audits, sécurité et conformité.</p>
          </div>
        </div>
      </section>
    </RoleGate>
  );
}
