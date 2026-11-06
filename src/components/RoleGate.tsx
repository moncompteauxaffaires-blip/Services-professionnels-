import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getCurrentProfile, type AppRole } from '../lib/auth';

type RoleGateProps = {
  allowed: AppRole[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function RoleGate({ allowed, children, fallback }: RoleGateProps) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const profile = await getCurrentProfile();
      if (!active) return;
      setAuthorized(Boolean(profile && allowed.includes(profile.role)));
    })();

    return () => {
      active = false;
    };
  }, [allowed]);

  if (authorized === null) {
    return <div>Vérification de l’accès…</div>;
  }

  if (!authorized) {
    return <>{fallback ?? <div>Accès refusé.</div>}</>;
  }

  return <>{children}</>;
}
