import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { ArrowRight, HeartHandshake, LogOut, Search, ShieldCheck } from 'lucide-react';
import { getCurrentProfile, type AppProfile } from './lib/auth';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { AdminDashboard } from './pages/AdminDashboard';
import { CompanyDashboard } from './pages/CompanyDashboard';
import { ProfessionalDashboard } from './pages/ProfessionalDashboard';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let active = true;
    const refresh = async (next: Session | null) => {
      setSession(next);
      if (!next) { setProfile(null); setLoading(false); return; }
      setLoading(true);
      const current = await getCurrentProfile();
      if (!active) return;
      setProfile(current);
      setLoading(false);
    };
    void supabase.auth.getSession().then(({ data }) => refresh(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => { void refresh(next); });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(''); setNotice('');
    if (!supabase) return;
    setBusy(true);
    try {
      const result = signup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) { setError(result.error.message); return; }
      if (signup && !result.data.session) {
        setNotice('Consultez votre courriel pour confirmer votre compte. Le rôle initial est Professionnel.');
      } else {
        setAuthOpen(false); setPassword('');
      }
    } catch {
      setError('Connexion impossible pour le moment. Réessayez plus tard.');
    } finally { setBusy(false); }
  }

  async function signOut() {
    if (!supabase) return;
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) { setError(signOutError.message); return; }
    setProfile(null); setSession(null); setNotice('Vous êtes déconnecté.');
  }

  if (loading) return <main className="app-shell"><p role="status" className="loading-note">Vérification de la session…</p></main>;

  if (session && !profile) {
    return <main className="app-shell"><header className="topbar"><a className="brand" href="#accueil"><span className="brand-mark"><HeartHandshake /></span>Services professionnels</a><button className="button button-quiet" onClick={signOut}><LogOut size={16}/> Déconnexion</button></header><section className="services-section"><h1>Profil indisponible</h1><p>Votre session est valide, mais aucun rôle autorisé n’a pu être confirmé dans Supabase. L’accès est refusé.</p>{error && <p role="alert">{error}</p>}</section></main>;
  }

  if (session && profile) {
    const dashboard = profile.role === 'admin' ? <AdminDashboard /> : profile.role === 'company' ? <CompanyDashboard /> : <ProfessionalDashboard />;
    return <div className="app-shell"><header className="topbar"><a className="brand" href="#accueil"><span className="brand-mark"><HeartHandshake /></span>Services professionnels</a><span className="signed-in">Espace {profile.role === 'admin' ? 'Administrateur' : profile.role === 'company' ? 'Entreprise' : 'Professionnel'}</span><button className="button button-quiet" onClick={signOut}><LogOut size={16}/> Déconnexion</button></header>{dashboard}</div>;
  }

  const offerings = [
    ['Aide à domicile', 'Un accompagnement humain et adapté à votre quotidien.'],
    ['Garde et présence', 'Des professionnels de confiance pour vos proches.'],
    ['Services de proximité', 'Trouvez une aide qui correspond à vos besoins.'],
  ].filter(([title, description]) => `${title} ${description}`.toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr')));

  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#accueil"><span className="brand-mark"><HeartHandshake /></span>Services professionnels</a><nav className="nav"><a href="#services">Nos services</a><a href="#confiance">Notre engagement</a></nav><div className="top-actions"><button className="button button-quiet" onClick={() => { setSignup(false); setAuthOpen(true); }}>Connexion</button><button className="button button-dark" onClick={() => { setSignup(true); setAuthOpen(true); }}>Créer un compte <ArrowRight size={16}/></button></div></header>
    <main><section className="hero" id="accueil"><div className="hero-copy"><span className="eyebrow"><HeartHandshake size={16}/> L’aide qui vous ressemble</span><h1>Le bon service.<br/><span>La bonne personne.</span></h1><p className="hero-lead">Des professionnels de confiance pour vous accompagner, vous et vos proches, au quotidien.</p><a className="button button-dark button-large" href="#services">Découvrir les services <ArrowRight size={17}/></a></div><div className="hero-art" role="img" aria-label="Illustration d’un accompagnement humain"><div className="art-sun"/><div className="art-window"><div/><div/><div/><div/></div><div className="plant"><i/><i/><i/><b/></div><div className="person person-client"><div className="head head-client"/><div className="body body-client"/></div><div className="person person-helper"><div className="head head-helper"/><div className="body body-helper"/></div><div className="art-table"/><div className="floating-card"><ShieldCheck size={18}/> Des pros vérifiés</div></div></section>
    <section className="trust-strip" id="confiance"><div><ShieldCheck/><span><b>Des profils attentivement sélectionnés</b><small>La confiance au cœur de chaque rencontre</small></span></div><div><HeartHandshake/><span><b>Un accompagnement humain</b><small>À l’écoute de vos besoins</small></span></div></section>
    <section className="services-section" id="services"><div className="section-heading"><div><span className="eyebrow">FAIT POUR VOUS</span><h2>Comment pouvons-nous<br/><em>vous aider ?</em></h2></div></div><label className="search-input"><Search size={18}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un service" aria-label="Rechercher un service"/></label><div className="service-grid">{offerings.map(([title, description]) => <article className="service-card" key={title}><div className="card-icon"><HeartHandshake/></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className="join-banner"><div><span className="eyebrow">VOUS ÊTES PROFESSIONNEL ?</span><h2>Votre savoir-faire mérite d’être <em>bien accompagné.</em></h2><p>Créez un compte Professionnel. Les rôles Entreprise et Administrateur sont attribués uniquement par un canal de confiance.</p></div><button className="button button-dark" onClick={() => { setSignup(true); setAuthOpen(true); }}>Créer mon espace <ArrowRight size={16}/></button></section></main>
    <footer className="footer"><span>Services professionnels</span><span>Des services humains, tout près de vous.</span></footer>
    {!isSupabaseConfigured && <div className="setup-note"><b>Connexion Supabase à configurer</b><small>Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans l’environnement de déploiement.</small></div>}
    {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Fermer">×</button></div>}
    {authOpen && <div className="modal-backdrop" onClick={() => setAuthOpen(false)}><section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setAuthOpen(false)} aria-label="Fermer">×</button><span className="brand-mark"><HeartHandshake/></span><h2 id="auth-title">{signup ? 'Créer un compte Professionnel' : 'Connexion'}</h2><p>Les autorisations sont vérifiées dans Supabase ; le navigateur ne peut pas attribuer de rôle.</p><form onSubmit={submitAuth}><label>Adresse e-mail<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)}/></label><label>Mot de passe<input type="password" autoComplete={signup ? 'new-password' : 'current-password'} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)}/></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark auth-submit" disabled={busy || !isSupabaseConfigured}>{busy ? 'Veuillez patienter…' : signup ? 'Créer mon compte' : 'Se connecter'}</button></form><div className="auth-switch">{signup ? 'Déjà inscrit·e ?' : 'Pas encore de compte ?'} <button onClick={() => { setSignup(!signup); setError(''); }}>{signup ? 'Se connecter' : 'Créer un compte'}</button></div></section></div>}
  </div>;
}
