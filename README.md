# Services-professionnels-
Aide à la personne avec des services professionnels 

https://services-professionn-azgl.bolt.host

## Démarrage local

Cette source est un nouveau socle Vite/React pour le projet. Elle ne prétend pas être une copie exacte du site Bolt, dont le code source n’était pas présent dans ce dépôt. Aucun fichier existant n’a été supprimé.

1. Installez Node.js 20 ou plus récent.
2. Copiez `.env.example` vers `.env.local` et renseignez l’URL Supabase ainsi que la clé publique `anon` du projet.
3. Dans Supabase, exécutez `supabase/migrations/202611060001_initial_schema.sql` via l’éditeur SQL.
4. Lancez `npm install`, puis `npm run dev`.

Les nouvelles inscriptions sont créées avec le rôle `professional`. Le rôle `company` ou `admin` doit être attribué par une procédure de confiance dans Supabase (par exemple, une opération administrative authentifiée hors navigateur). L’application ne propose aucun moyen de s’auto-attribuer ces rôles. La clé `service_role` ne doit jamais être ajoutée à l’application cliente.

Les politiques RLS constituent la frontière d’autorisation des données. Vérifiez-les dans un projet Supabase de test avant toute mise en production et configurez les URL de redirection Auth pour votre domaine.
