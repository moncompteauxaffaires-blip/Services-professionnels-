import { useEffect, useState } from 'react';
import { RoleGate } from '../components/RoleGate';
import { supabase } from '../lib/supabase';

function AdminContent() {
  const [counts, setCounts] = useState({ profiles: 0, listings: 0, requests: 0 });
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) return;
      const [profiles, listings, requests] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('service_listings').select('id', { count: 'exact', head: true }),
        supabase.from('service_requests').select('id', { count: 'exact', head: true }),
      ]);
      if (!active) return;
      const firstError = profiles.error ?? listings.error ?? requests.error;
      if (firstError) setError(firstError.message);
      setCounts({ profiles: profiles.count ?? 0, listings: listings.count ?? 0, requests: requests.count ?? 0 });
    }
    void load();
    return () => { active = false; };
  }, []);
  return <section className="services-section"><span className="eyebrow">ADMINISTRATEUR</span><h1>Tableau de bord de supervision</h1><p>Vue synthétique des comptes, offres et demandes autorisés par les règles Supabase.</p>{error && <p role="alert">Statistiques indisponibles : {error}</p>}<div className="service-grid"><article className="service-card"><h2>Comptes</h2><p>{counts.profiles}</p></article><article className="service-card"><h2>Offres</h2><p>{counts.listings}</p></article><article className="service-card"><h2>Demandes</h2><p>{counts.requests}</p></article></div></section>;
}

export function AdminDashboard() {
  return <RoleGate allowed={['admin']} fallback={<section className="services-section"><h1>Accès refusé</h1><p>Espace réservé à l’administrateur.</p></section>}><AdminContent /></RoleGate>;
}
