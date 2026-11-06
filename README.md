# Services-professionnels-
Aide à la personne avec des services professionnels.

https://services-professionn-azgl.bolt.host

## Préparation locale

1. Copier le fichier d’exemple des variables d’environnement :
   `cp .env.example .env.local`
2. Renseigner les valeurs du projet Supabase dans `.env.local` :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Installer les dépendances :
   `npm install`
4. Lancer le projet :
   `npm run dev`

## Variables d’environnement

Les variables ne doivent jamais être ajoutées dans le code source ni dans Git. Le dépôt ne contient que le modèle `.env.example` sans vraie valeur.

```dotenv
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<public-anon-key>
```

## Sécurité et rôles

L’application expose uniquement la clé publique `anon` de Supabase. Les autorisations réelles sont vérifiées côté serveur via les politiques RLS dans Supabase.

Rôles supportés :
- `admin`
- `company`
- `professional`

Le rôle `admin` et le rôle `company` doivent être attribués par un canal de confiance côté serveur (SQL Supabase ou backend sécurisé). L’application frontend ne doit pas permettre à un utilisateur de s’auto-attribuer un rôle élevé.

## Migration Supabase

Exécuter la migration suivante dans l’éditeur SQL de Supabase avant de tester l’application :

`supabase/migrations/202611060001_initial_schema.sql`

Cette migration crée les tables utilisateur et service ainsi que les politiques RLS. Les droits d’accès ne dépendent pas d’un paramètre modifiable dans le navigateur.
