# Authentification Mobile - MesFinances Mobile

Ce document décrit les optimisations apportées à l'écran de connexion pour une utilisation mobile fluide.

## Améliorations UX Mobile
1. **Champs et Clavier :**
   - L'input Email est configuré avec `autoComplete="email"`, `inputMode="email"` et `autoCapitalize="none"` pour ouvrir directement le clavier mobile adapté aux emails.
   - L'input Mot de passe possède `autoComplete="current-password"`, `autoCapitalize="none"` et `autoCorrect="off"`.
2. **Affichage / Masquage du Mot de passe :**
   - Un bouton d'action à droite de l'input mot de passe permet de basculer dynamiquement le type entre `text` et `password` avec un indicateur visuel (œil).
3. **Safe Areas & Safe Layouts :**
   - Le layout prend en compte les encoches natifs via les variables CSS `env(safe-area-inset-top)` et `env(safe-area-inset-bottom)`.
4. **Validation stricte :**
   - Utilisation de Zod et React Hook Form en local pour bloquer la soumission et afficher les messages d'erreurs clairs sous les inputs sans requêtes inutiles vers le réseau.
