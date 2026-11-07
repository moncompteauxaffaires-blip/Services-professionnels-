# Services Professionnels

Site de services d’aide à la personne avec espaces Professionnel, Entreprise et Administrateur.

**Site en ligne :** https://services-professionn-azgl.bolt.host

## Démarrage local

1. Copier `.env.example` vers `.env.local` (PowerShell : `Copy-Item .env.example .env.local`).
2. Installer les dépendances : `npm install`.
3. Appliquer les migrations SQL dans l’ordre (`supabase/migrations/202611060001_initial_schema.sql`, puis `202611060002_harden_policies.sql`) depuis Supabase SQL Editor.
4. Lancer `npm run dev`. Vérifier une compilation de production avec `npm run build`.

`.env.local` est ignoré par Git. La clé `sb_publishable` est publique ; ne jamais utiliser une clé `service_role` dans le navigateur, une variable `VITE_*` ou un commit. Configurer `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans l’environnement de déploiement, puis reconstruire l’application.

## Fonctionnalités présentes

- Inscription/connexion par courriel et mot de passe via Supabase Auth.
- Rôle initial `professional`, profil chargé depuis la base.
- Espace professionnel : création/publication/archivage d’offres, consultation et réponse aux demandes.
- Espace entreprise : consultation des offres publiées et envoi/suivi de demandes.
- Espace administrateur : compteurs de profils, offres et demandes (selon les droits RLS).
- Les rôles `company` et `admin` doivent être attribués dans un contexte de confiance. La protection des données repose sur RLS, pas seulement sur les écrans du navigateur.

## Tests avant lancement

1. `npm install` puis `npm run build`.
2. Créer un compte professionnel, vérifier le courriel si la confirmation est activée et tester la publication d’une offre.
3. Promouvoir un compte de test en `company` depuis Supabase SQL Editor, puis tester la création et le suivi d’une demande.
4. Vérifier la réponse du professionnel (accepter/refuser) et les restrictions RLS avec plusieurs comptes.
5. Tester sur mobile et configurer les URL de redirection Auth du domaine de production.

Le dépôt ne contenait pas le code source du site Bolt original : le site en ligne doit être redéployé depuis le dépôt pour refléter ces modifications.
