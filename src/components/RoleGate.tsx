import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getCurrentProfile, type AppRole } from '../lib/auth';

type RoleGateProps = { allowed: readonly AppRole[]; children: ReactNode; fallback?: ReactNode };

export function RoleGate({ allowed, children, fallback = <div role="alert">Accès refusé.</div> }: RoleGateProps) {
  const [state, setState] = useState<'loading' | 'allowed' | 'denied'>('loading');
  const allowedKey = allowed.join(':');
  useEffect(() => {
    let active = true;
    setState('loading');
    void getCurrentProfile().then((profile) => {
      if (active) setState(profile && allowed.includes(profile.role) ? 'allowed' : 'denied');
    }).catch(() => { if (active) setState('denied'); });
    return () => { active = false; };
  }, [allowedKey]);
  if (state === 'loading') return <p role="status">Vérification de l’accès…</p>;
  if (state === 'denied') return <>{fallback}</>;
  return <>{children}</>;
}
