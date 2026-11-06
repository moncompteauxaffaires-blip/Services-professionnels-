import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Check, ChevronDown, HeartHandshake, MapPin, Menu, Search, ShieldCheck, Sparkles, Star, UserRound, UsersRound, X } from 'lucide-react';
import { isSupabaseConfigured, supabase } from './lib/supabase';

type Role = 'admin' | 'company' | 'professional';
type Profile = { id: string; display_name: string | null; role: Role };
type Listing = { id: string; title: string; description: string; category: string; city: string; price: number | null };

const categories = ['Tous les services', 'Aide à domicile', 'Garde d’enfants', 'Accompagnement', 'Ménage', 'Jardinage'];
const roleNames: Record<Role, string> = { admin: 'Administrateur', company: 'Entreprise', professional: 'Professionnel' };
const showcase: Listing[] = [
  { id: 'a', title: 'Un quotidien plus serein', description: 'Des professionnels de confiance pour vous accompagner à la maison.', category: 'Aide à domicile', city: 'Près de chez vous', price: null },
  { id: 'b', title: 'Le bon accompagnement', description: 'Garde, présence et aide aux gestes du quotidien, selon vos besoins.', category: 'Accompagnement', city: 'Services personnalisés', price: null },
  { id: 'c', title: 'Du temps pour l’essentiel', description: 'Trouvez des intervenants qualifiés et disponibles autour de vous.', category: 'Ménage', city: 'Une sélection de proximité', price: null },
];

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>(showcase);
  const [category, setCategory] = useState(categories[0]);
  const [search, setSearch] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let mounted = true;
    const loadProfile = async (current: Session | null) => {
      if (!mounted) return;
      setSession(current);
      if (!current) { setProfile(null); setLoading(false); return; }
      const { data, error: profileError } = await supabase!.from('user_profiles').select('id,display_name,role').eq('id', current.user.id).maybeSingle();
      if (!mounted) return;
      if (profileError) setError(`Profil indisponible : ${profileError.message}`);
      setProfile(data as Profile | null);
      setLoading(false);
    };
    supabase.auth.getSession().then(({ data }) => loadProfile(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, current) => { void loadProfile(current); });
    void supabase.from('service_listings').select('id,title,description,category,city,price').eq('status', 'published').limit(12)
      .then(({ data }) => { if (mounted && data?.length) setListings(data as Listing[]); });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const filtered = listings.filter((item) => (category === categories[0] || item.category === category)
    && `${item.title} ${item.description} ${item.category} ${item.city}`.toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr')));

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setNotice('');
    if (!supabase) return;
    setBusy(true);
    const result = authMode === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) { setError(result.error.message); return; }
    if (authMode === 'signup' && !result.data.session) {
      setNotice('Vérifiez votre boîte mail pour confirmer votre adresse. Votre espace Professionnel sera créé après confirmation.');
    } else { setAuthOpen(false); setPassword(''); }
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut(); setProfile(null); setSession(null); setNotice('Vous êtes déconnecté.');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#accueil" aria-label="Services Professionnels, accueil"><span className="brand-mark"><HeartHandshake size={23} /></span><span>services<span className="brand-light">professionnels</span></span></a>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Navigation principale">
          <a href="#services" onClick={() => setMenuOpen(false)}>Nos services</a><a href="#confiance" onClick={() => setMenuOpen(false)}>Notre engagement</a><a href="#comment-ca-marche" onClick={() => setMenuOpen(false)}>Comment ça marche</a>
        </nav>
        <div className="top-actions">
          {session ? <><span className="signed-in">{profile ? roleNames[profile.role] : 'Compte connecté'}</span><button className="button button-quiet" onClick={signOut}>Déconnexion</button></>
            : <button className="button button-quiet login-button" onClick={() => { setAuthMode('login'); setAuthOpen(true); }}>Connexion</button>}
          <a className="button button-dark header-cta" href="#services">Trouver un service <ArrowRight size={16} /></a>
        </div>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section className="hero" id="accueil">
          <div className="hero-copy"><span className="eyebrow"><Sparkles size={15} /> L’aide qui vous ressemble</span><h1>Le bon service.<br /><span>La bonne personne.</span></h1><p className="hero-lead">Des professionnels de confiance pour vous accompagner, vous et vos proches, au quotidien.</p>
            <div className="hero-buttons"><a className="button button-dark button-large" href="#services">Découvrir les services <ArrowRight size={17} /></a><button className="button button-outline button-large" onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}>Je suis professionnel</button></div>
            <div className="hero-proof"><div className="avatar-stack"><span>É</span><span>M</span><span>A</span><span>+</span></div><div><div className="stars"><Star /><Star /><Star /><Star /><Star /></div><small>La confiance, près de chez vous</small></div></div>
          </div>
          <div className="hero-art" aria-label="Illustration d'une professionnelle accompagnant une personne âgée"><div className="art-sun" /><div className="art-window"><div /><div /><div /><div /></div><div className="plant"><i /><i /><i /><b /></div><div className="person person-client"><div className="head head-client" /><div className="body body-client" /><div className="arm arm-client" /></div><div className="person person-helper"><div className="head head-helper" /><div className="body body-helper" /><div className="arm arm-helper" /></div><div className="art-table" /><div className="floating-card"><span className="check-circle"><Check size={17} /></span><span><b>À vos côtés</b><small>Des pros vérifiés</small></span><BadgeCheck className="verified" size={19} /></div><div className="art-caption"><span>01</span><span>Un accompagnement humain, avant tout.</span></div></div>
          <div className="hero-bottom"><span>LE LIEN QUI FAIT DU BIEN</span><span className="bottom-line" /><span>PROXIMITÉ · CONFIANCE · BIENVEILLANCE</span></div>
        </section>

        <section className="trust-strip" id="confiance"><div><ShieldCheck /><span><b>Des profils attentivement sélectionnés</b><small>La confiance au cœur de chaque rencontre</small></span></div><div><HeartHandshake /><span><b>Un accompagnement humain</b><small>À l’écoute de vos besoins</small></span></div><div><MapPin /><span><b>Des services près de chez vous</b><small>La proximité, tout simplement</small></span></div></section>

        <section className="services-section" id="services"><div className="section-heading"><div><span className="eyebrow">FAIT POUR VOUS, TOUT SIMPLEMENT</span><h2>Comment pouvons-nous<br /><em>vous aider ?</em></h2></div><p>Le quotidien est plus doux quand on est bien entouré. Trouvez le service qui correspond à vos besoins.</p></div>
          <div className="search-panel"><label className="search-input"><Search size={19} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Un service, un besoin…" aria-label="Rechercher un service" /></label><label className="select-wrap"><MapPin size={18} /><select aria-label="Choisir une catégorie" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></label><button className="button button-green" onClick={() => document.getElementById('resultats')?.scrollIntoView({ behavior: 'smooth' })}>Rechercher <ArrowRight size={16} /></button></div>
          <div className="results-heading" id="resultats"><span>{isSupabaseConfigured ? 'SERVICES DISPONIBLES' : 'NOS DOMAINES D’INTERVENTION'}</span><a href="#services">Voir tous les services <ArrowRight size={15} /></a></div>
          <div className="service-grid">{filtered.length ? filtered.map((item, index) => <article className={`service-card card-${index % 3}`} key={item.id}><div className="card-icon">{index % 3 === 0 ? <HeartHandshake /> : index % 3 === 1 ? <UsersRound /> : <BriefcaseBusiness />}</div><span className="card-category">{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><div className="card-footer"><span><MapPin size={15} />{item.city}</span>{item.price != null && <span>À partir de {item.price} €</span>}<button aria-label={`En savoir plus sur ${item.title}`} onClick={() => { setAuthMode('login'); setAuthOpen(true); }}><ArrowRight size={18} /></button></div></article>) : <div className="empty-state">Aucun service ne correspond à cette recherche. Essayez un autre mot-clé.</div>}</div>
        </section>

        <section className="how-section" id="comment-ca-marche"><div className="how-intro"><span className="eyebrow">SIMPLE COMME BONJOUR</span><h2>À chaque étape,<br /><em>à vos côtés.</em></h2><p>Parce que demander de l’aide devrait être simple et rassurant.</p><a className="text-link" href="#services">Découvrir notre approche <ArrowRight size={16} /></a></div><div className="steps"><article><span className="step-number">01</span><div><h3>Vous nous dites</h3><p>Ce dont vous avez besoin, à votre rythme.</p></div></article><article><span className="step-number">02</span><div><h3>On vous accompagne</h3><p>Nous trouvons les professionnels adaptés.</p></div></article><article><span className="step-number">03</span><div><h3>Vous êtes bien entouré</h3><p>Le quotidien devient plus léger, ensemble.</p></div></article></div></section>

        <section className="join-banner"><div><span className="eyebrow">VOUS ÊTES PROFESSIONNEL ?</span><h2>Votre savoir-faire mérite<br />d’être <em>bien accompagné.</em></h2><p>Rejoignez une communauté engagée et donnez du sens à votre métier.</p></div><button className="button button-dark button-large" onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}>Créer mon espace <ArrowRight size={17} /></button><div className="banner-decoration"><HeartHandshake /></div></section>
      </main>

      <footer className="footer"><a className="brand" href="#accueil"><span className="brand-mark"><HeartHandshake size={21} /></span><span>services<span className="brand-light">professionnels</span></span></a><span>Des services humains, tout près de vous.</span><span>© {new Date().getFullYear()} Services Professionnels</span></footer>

      {session && profile && <div className="account-panel"><span><UserRound size={17} /> Espace {roleNames[profile.role]}</span><p>{profile.role === 'admin' ? 'Accès administration autorisé par le rôle vérifié dans Supabase.' : profile.role === 'company' ? 'Votre espace entreprise est connecté.' : 'Votre espace professionnel est connecté.'}</p></div>}
      {loading && <div className="loading-note">Vérification de la session…</div>}
      {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Fermer"><X size={16} /></button></div>}
      {!isSupabaseConfigured && <div className="setup-note"><span>Connexion Supabase à configurer</span><small>Ajoutez les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre environnement.</small></div>}

      {authOpen && <div className="modal-backdrop" onClick={() => setAuthOpen(false)}><section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setAuthOpen(false)} aria-label="Fermer"><X /></button><span className="brand-mark"><HeartHandshake size={23} /></span><span className="eyebrow">VOTRE ESPACE, EN TOUTE CONFIANCE</span><h2 id="auth-title">{authMode === 'login' ? 'Ravi de vous retrouver.' : 'Bienvenue parmi nous.'}</h2><p>{authMode === 'login' ? 'Connectez-vous pour retrouver votre espace.' : 'Créez un compte Professionnel. Les autres rôles sont attribués de manière sécurisée dans Supabase.'}</p>
          <form onSubmit={submitAuth}><label>Adresse e-mail<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" /></label><label>Mot de passe<input type="password" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 caractères minimum" /></label>{error && <div className="form-error" role="alert">{error}</div>}<button className="button button-dark auth-submit" disabled={busy || !isSupabaseConfigured}>{busy ? 'Veuillez patienter…' : authMode === 'login' ? 'Se connecter' : 'Créer mon compte'} <ArrowRight size={16} /></button></form>
          <div className="auth-switch">{authMode === 'login' ? 'Pas encore de compte ?' : 'Déjà inscrit·e ?'} <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(''); }}>{authMode === 'login' ? 'Créer un compte' : 'Se connecter'}</button></div><div className="auth-security"><ShieldCheck size={16} /> Les rôles et les accès sont contrôlés par Supabase.</div>
        </section></div>}
    </div>
  );
}
