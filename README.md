# Services Professionnels

Site de services d’aide à la personne avec espaces Professionnel, Entreprise et Administrateur.

## Démarrage

1. Copier `.env.example` vers `.env.local` et y configurer `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.
2. Installer les dépendances avec `npm install`.
3. Appliquer `supabase/migrations/202611060001_initial_schema.sql` dans le projet Supabase.
4. Lancer `npm run dev` et vérifier la compilation avec `npm run build`.

`.env.local` est ignoré par Git. Ne jamais placer de clé `service_role` dans l’application frontend ou dans un fichier `VITE_*`. La clé publishable/anon est publique ; la protection des données repose sur RLS.

Les inscriptions créent uniquement un profil `professional`. Les rôles `company` et `admin` doivent être attribués par un administrateur via un contexte de confiance, jamais depuis le navigateur. Les vues frontend ne sont pas une frontière de sécurité : les politiques RLS sont la source d’autorisation des données.

Le dépôt initial ne contenait pas le code source du site Bolt ; cette application est un socle de développement, pas une copie garantie du déploiement Bolt.
