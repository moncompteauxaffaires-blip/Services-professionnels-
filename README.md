# Services Professionnels

Site de services d’aide à la personne avec espaces Professionnel, Entreprise et Administrateur.

**Site en ligne :** https://services-professionn-azgl.bolt.host

## Démarrage local

1. Copier `.env.example` vers `.env.local` (PowerShell : `Copy-Item .env.example .env.local`).
2. Installer les dépendances : `npm install`.
3. Appliquer les migrations SQL dans l’ordre indiqué dans `supabase/migrations/` depuis Supabase SQL Editor.
4. Lancer `npm run dev`. Vérifier une compilation de production avec `npm run build`.

`.env.local` est ignoré par Git. `.env.example` contient l’URL et la clé publishable fournies : cette clé est publique et peut être incluse dans un client Vite. Ne jamais utiliser une clé `service_role` dans le navigateur, une variable `VITE_*` ou un commit.

## Authentification et rôles

Les inscriptions attribuent toujours le rôle `professional` par défaut. Les rôles `company` et `admin` doivent être attribués dans Supabase SQL Editor ou via un backend de confiance, après vérification de l’utilisateur. Le frontend ne comporte aucune fonction d’auto-promotion. Les politiques RLS protègent les données, indépendamment de l’affichage des tableaux de bord.

## Déploiement

Dans les variables d’environnement de Bolt ou de l’hébergeur, configurer `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`, puis reconstruire/redéployer l’application. Les valeurs de `.env.local` ne sont pas envoyées par ce dépôt.

Le dépôt ne contenait pas le code source du site Bolt original : cette application est un socle de développement reconstruit, pas une copie garantie du déploiement public.
