# Progressive Web App (PWA) — MesFinances

## Fonctionnement

MesFinances est maintenant livré comme une PWA installable avec :

- un manifest complet,
- un service worker configuré via next-pwa,
- une page hors ligne,
- une bannière de statut réseau,
- un composant d’installation et une détection de mise à jour.

## Stratégies de cache

- Ressources statiques : cache prioritaire.
- Pages et données dynamiques : réseau en priorité puis cache en secours.
- Les mises à jour de service worker sont gérées automatiquement.

## Installation

- Chrome Android : installer depuis le menu du navigateur.
- Edge Desktop : installer depuis le bouton dédié.
- iPhone : ouvrir le menu Partager puis « Ajouter à l’écran d’accueil ».

## Limitations

- L’installation complète dépend du navigateur et du système d’exploitation.
- Tout contenu strictement dynamique peut nécessiter une connexion réseau.

## Déploiement

- Vérifier que les fichiers de manifest et d’icônes sont bien servis en production.
- Tester sur un environnement HTTPS réel.
