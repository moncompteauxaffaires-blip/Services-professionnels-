import { useEffect, useState } from 'react';
import { RoleGate } from '../components/RoleGate';
import { supabase } from '../lib/supabase';

type Listing = { id: string; title: string; description: string; category: string; city: string; price: number | null; status: string };
type Request = { id: string; message: string; status: string; created_at: string };

function ProfessionalContent() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Aide à domicile');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!supabase) return;
    const [{ data: userData }, listingResult, requestResult] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from('service_listings').select('id,title,description,category,city,price,status').order('created_at', { ascending: false }),
      supabase.from('service_requests').select('id,message,status,created_at').order('created_at', { ascending: false }),
    ]);
    if (!userData.user) return;
    setListings((listingResult.data ?? []) as Listing[]);
    setRequests((requestResult.data ?? []) as Request[]);
    if (listingResult.error) setMessage('Impossible de charger les offres : ' + listingResult.error.message);
    else if (requestResult.error) setMessage('Impossible de charger les demandes : ' + requestResult.error.message);
  }

  useEffect(() => { void load(); }, []);

  async function createListing(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setMessage('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMessage('Reconnectez-vous pour publier une offre.'); setBusy(false); return; }
    const { error } = await supabase.from('service_listings').insert({ owner_id: user.id, title, category, city, description, price: price ? Number(price) : null, status: 'published' });
    setBusy(false);
    if (error) { setMessage('Création impossible : ' + error.message); return; }
    setTitle(''); setCity(''); setDescription(''); setPrice(''); setMessage('Votre offre est publiée.');
    await load();
  }

  async function setListingStatus(id: string, status: string) {
    if (!supabase) return;
    const { error } = await supabase.from('service_listings').update({ status }).eq('id', id);
    setMessage(error ? 'Mise à jour impossible : ' + error.message : 'Offre mise à jour.');
    await load();
  }

  async function respond(id: string, status: 'accepted' | 'declined') {
    if (!supabase) return;
    const { error } = await supabase.from('service_requests').update({ status }).eq('id', id);
    setMessage(error ? 'Réponse impossible : ' + error.message : 'Votre réponse a été enregistrée.');
    await load();
  }

  return <section className="services-section">
    <span className="eyebrow">PROFESSIONNEL</span><h1>Espace professionnel</h1><p>Publiez vos offres et répondez aux demandes reçues.</p>
    {message && <p role="status">{message}</p>}
    <div className="service-grid">
      <article className="service-card"><h2>Créer une offre</h2><form onSubmit={createListing} className="dashboard-form">
        <label>Titre<input required maxLength={100} value={title} onChange={e => setTitle(e.target.value)} /></label>
        <label>Catégorie<input required value={category} onChange={e => setCategory(e.target.value)} /></label>
        <label>Ville<input required value={city} onChange={e => setCity(e.target.value)} /></label>
        <label>Tarif (€)<input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} /></label>
        <label>Description<textarea required value={description} onChange={e => setDescription(e.target.value)} /></label>
        <button className="button button-dark" disabled={busy}>{busy ? 'Publication…' : 'Publier l’offre'}</button>
      </form></article>
      <article className="service-card"><h2>Mes offres ({listings.length})</h2>{listings.length ? listings.map(item => <div className="dashboard-item" key={item.id}><strong>{item.title}</strong><p>{item.category} · {item.city} · {item.price == null ? 'Tarif à préciser' : `${item.price} €`}</p><p>{item.description}</p><small>Statut : {item.status}</small><div><button className="button button-quiet" onClick={() => void setListingStatus(item.id, item.status === 'published' ? 'archived' : 'published')}>{item.status === 'published' ? 'Archiver' : 'Publier'}</button><button className="button button-quiet" onClick={() => void setListingStatus(item.id, 'draft')}>Brouillon</button></div></div>) : <p>Aucune offre pour le moment.</p>}</article>
      <article className="service-card"><h2>Demandes reçues ({requests.length})</h2>{requests.length ? requests.map(item => <div className="dashboard-item" key={item.id}><p>{item.message || 'Demande sans message'}</p><small>{new Date(item.created_at).toLocaleDateString('fr-FR')} · {item.status}</small>{item.status === 'pending' && <div><button className="button button-dark" onClick={() => void respond(item.id, 'accepted')}>Accepter</button> <button className="button button-quiet" onClick={() => void respond(item.id, 'declined')}>Refuser</button></div>}</div>) : <p>Aucune demande pour le moment.</p>}</article>
    </div>
  </section>;
}

export function ProfessionalDashboard() {
  return <RoleGate allowed={['professional']} fallback={<section className="services-section"><h1>Accès refusé</h1><p>Espace réservé aux professionnels autorisés.</p></section>}><ProfessionalContent /></RoleGate>;
}
