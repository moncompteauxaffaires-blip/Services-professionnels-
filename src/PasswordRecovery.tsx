import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from './lib/supabase';

export function PasswordRecovery() {
  const [hasSession, setHasSession] = useState(false);
  const [recovery, setRecovery] = useState(() => window.location.hash.includes('type=recovery'));
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => setHasSession(Boolean(data.session)));
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setHasSession(Boolean(session));
      if (event === 'PASSWORD_RECOVERY' || window.location.hash.includes('type=recovery')) {
        setRecovery(true);
        setOpen(true);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!supabase) {
      setError('La connexion au service est indisponible. Réessayez plus tard.');
      return;
    }

    setBusy(true);
    try {
      if (recovery || hasSession) {
        if (password.length < 8) {
          setError('Choisissez un mot de passe d’au moins 8 caractères.');
          return;
        }
        if (password !== confirmation) {
          setError('Les deux mots de passe ne correspondent pas.');
          return;
        }
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) {
          setError(updateError.message);
          return;
        }
        setPassword('');
        setConfirmation('');
        setRecovery(false);
        setNotice('Votre mot de passe a été modifié.');
        window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);
      } else {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (resetError) {
          setError(resetError.message);
          return;
        }
        setNotice('Si un compte correspond à cette adresse, un courriel de réinitialisation a été envoyé.');
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setBusy(false);
    }
  }

  if (!supabase) return null;

  const isChanging = recovery || hasSession;
  const buttonStyle = {
    position: 'fixed' as const,
    right: 18,
    bottom: 18,
    zIndex: 1000,
    border: '1px solid #d5ded5',
    borderRadius: 999,
    padding: '10px 16px',
    background: '#fff',
    color: '#244c37',
    font: '600 14px system-ui, sans-serif',
    cursor: 'pointer',
    boxShadow: '0 4px 18px rgba(0,0,0,.12)',
  };
  const inputStyle = {
    boxSizing: 'border-box' as const,
    width: '100%',
    marginTop: 6,
    padding: '11px 12px',
    border: '1px solid #cbd5ce',
    borderRadius: 8,
    font: '16px system-ui, sans-serif',
  };

  return <>
    {!open && <button type="button" style={buttonStyle} onClick={() => { setOpen(true); setError(''); setNotice(''); }}>
      {hasSession ? 'Changer mon mot de passe' : 'Mot de passe oublié ?'}
    </button>}
    {open && <div role="presentation" onClick={() => { if (!recovery) setOpen(false); }} style={{ position: 'fixed', inset: 0, zIndex: 1001, display: 'grid', placeItems: 'center', padding: 16, background: 'rgba(20,30,24,.55)' }}>
      <section role="dialog" aria-modal="true" aria-labelledby="password-title" onClick={(event) => event.stopPropagation()} style={{ boxSizing: 'border-box', width: 'min(100%, 430px)', padding: 24, borderRadius: 14, background: '#fff', color: '#202b24', fontFamily: 'system-ui, sans-serif', boxShadow: '0 16px 50px rgba(0,0,0,.2)' }}>
        <h2 id="password-title" style={{ margin: '0 0 8px', fontSize: 22 }}>{isChanging ? 'Choisir un nouveau mot de passe' : 'Réinitialiser le mot de passe'}</h2>
        <p style={{ margin: '0 0 18px', color: '#5c665f', lineHeight: 1.5 }}>{isChanging ? 'Entrez votre nouveau mot de passe et confirmez-le.' : 'Nous vous enverrons un lien sécurisé par courriel.'}</p>
        <form onSubmit={submit}>
          {!isChanging ? <label style={{ display: 'block', marginBottom: 14, fontSize: 14 }}>Adresse courriel<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} style={inputStyle} /></label> : <>
            <label style={{ display: 'block', marginBottom: 14, fontSize: 14 }}>Nouveau mot de passe<input required type="password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} /></label>
            <label style={{ display: 'block', marginBottom: 14, fontSize: 14 }}>Confirmer le mot de passe<input required type="password" autoComplete="new-password" minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} style={inputStyle} /></label>
          </>}
          {error && <p role="alert" style={{ color: '#a32222', fontSize: 14 }}>{error}</p>}
          {notice && <p role="status" style={{ color: '#245b39', fontSize: 14 }}>{notice}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            {!recovery && <button type="button" onClick={() => setOpen(false)} style={{ padding: '10px 14px', border: '1px solid #cbd5ce', borderRadius: 8, background: '#fff', cursor: 'pointer' }}>Fermer</button>}
            <button type="submit" disabled={busy} style={{ padding: '10px 14px', border: 0, borderRadius: 8, background: '#245b39', color: '#fff', fontWeight: 600, cursor: busy ? 'wait' : 'pointer' }}>
              {busy ? 'Veuillez patienter…' : isChanging ? 'Enregistrer le mot de passe' : 'Envoyer le lien'}
            </button>
          </div>
        </form>
      </section>
    </div>}
  </>;
}
