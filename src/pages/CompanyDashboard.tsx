import { useEffect, useState } from 'react';
import { RoleGate } from '../components/RoleGate';
import { supabase } from '../lib/supabase';

type Listing = { id: string; owner_id: string; title: string; description: string; category: string; city: string; price: number | null };
type Request = { id: string; message: string; status: string; created_at: string };

function CompanyContent() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  async function load() {
    if (!supabase) return;
    const [{ data: userData }, listingResult, requestResult] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from('service_listings').select('id,owner_id,title,description,category,city,price').eq('status', 'published').order('created_at', { ascending: false }),
      supabase.from('service_requests').select('id,message,status,created_at').order('created_at', { ascending: false }),
    ]);
    if (!userData.user) return;
    if (listingResult.error) setError(listingResult.error.message);
    else setListings((listingResult.data ?? []) as Listing[]);
    if (requestResult.error) setError(requestResult.error.message);
    else setRequests((requestResult.data ?? []) as Request[]);
  }
  useEffect(() => { void load(); }, []);

  async function requestService(listing: Listing) {
    if (!supabase) return;
    setBusyId(listing.id); setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Reconnectez-vous pour envoyer une demande.'); setBusyId(''); return; }
    const { error: insertError } = await supabase.from('service_requests').insert({ company_id: user.id, professional_id: listing.owner_id, listing_id: listing.id, message: `Demande de contact concernant « ${listing.title} » à ${listing.city}.` });
    setBusyId('');
    if (insertError) setError(insertError.message);
    else { setError('Demande envoyée.'); await load(); }
  }

  return <section className="services-section"><span className="eyebrow">ENTREPRISE</span><h1>Espace entreprise</h1><p>Parcourez les offres publiées et envoyez une demande aux professionnels.</p>
    {error && <p role="status">{error}</p>}
    <h2>Offres disponibles ({listings.length})</h2><div className="service-grid">{listings.length ? listings.map(item => <article className="service-card" key={item.id}><span className="eyebrow">{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><p>{item.city} · {item.price == null ? 'Tarif à préciser' : `${item.price} €`}</p><button className="button button-dark" disabled={busyId === item.id} onClick={() => void requestService(item)}>{busyId === item.id ? 'Envoi…' : 'Contacter ce professionnel'}</button></article>) : <p>Aucune offre publiée pour le moment.</p>}</div>
    <h2>Mes demandes ({requests.length})</h2><div className="service-grid">{requests.length ? requests.map(item => <article className="service-card" key={item.id}><p>{item.message}</p><small>{new Date(item.created_at).toLocaleDateString('fr-FR')} · {item.status}</small></article>) : <p>Vous n’avez pas encore envoyé de demande.</p>}</div>
  </section>;
}

export function CompanyDashboard() {
  return <RoleGate allowed={['company']} fallback={<section className="services-section"><h1>Accès refusé</h1><p>Espace réservé aux entreprises autorisées.</p></section>}><CompanyContent /></RoleGate>;
}
