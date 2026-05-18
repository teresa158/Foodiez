# 🍕 Foodiez — Application de Gestion des Commandes

> Application web monopage (SPA) de gestion des commandes de restaurant, construite en JavaScript Vanilla ES6+ sans aucun framework.

---

## 📋 Table des Matières

- [Aperçu](#aperçu)
- [Stack Technique](#stack-technique)
- [Structure du Projet](#structure-du-projet)
- [Structure des Données](#structure-des-données)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Gestion des États](#gestion-des-états)
- [User Stories](#user-stories)

---

## 📖 Aperçu

**Foodiez** est une startup spécialisée dans la digitalisation des commandes de restaurant. Cette application transforme une interface statique en une SPA entièrement dynamique, connectée à une API REST simulée via JSON Server.

Chaque donnée est chargée depuis l'API, chaque action — créer, modifier, supprimer — déclenche un appel réseau et une mise à jour immédiate du DOM, **sans jamais recharger la page**.

---

## 🛠️ Stack Technique

| Technologie | Rôle |
|---|---|
| **HTML5** | Structure sémantique |
| **Tailwind CSS** | Styles utilitaires |
| **JavaScript ES6+** | Logique SPA & manipulation DOM |
| **JSON Server** | Backend REST simulé |
| **Fetch API** | Appels HTTP (GET, POST, PATCH, DELETE) |

---

## 📁 Structure du Projet

```
foodiez/
├── index.html          # Point d'entrée de l'application
├── db.json             # Base de données JSON Server
├── assets/
│   └── css/
│       └── style.css   # Styles complémentaires (si besoin)
└── js/
    ├── app.js          # Point d'entrée JS & initialisation
    ├── router.js       # Gestion navigation SPA
    ├── api.js          # Appels Fetch vers JSON Server
    ├── dashboard.js    # Logique tableau de bord
    ├── orders.js       # Liste & actions commandes
    └── form.js         # Formulaire nouvelle commande
```

---

## 🧩 Structure des Données

### Base de données (`db.json`)

```json
{
  "orders": [
    {
      "id": 1,
      "customerName": "Ahmed",
      "items": ["Pizza", "Soda"],
      "totalPrice": 120,
      "status": "pending",
      "createdAt": "2025-03-16"
    }
  ],
  "settings": {
    "restaurantName": "Foodiez",
    "contactEmail": "contact@foodiez.com"
  }
}
```

### Cycle de vie d'une commande

```
pending  →  accepted  →  completed
                ↓
            rejected
```

| Statut | Description |
|---|---|
| `pending` | Commande en attente de traitement |
| `accepted` | Commande acceptée par le restaurant |
| `completed` | Commande livrée et finalisée |
| `rejected` | Commande refusée |

---

## ✨ Fonctionnalités

### 🗂️ Dashboard
- Compteurs dynamiques : total, en attente, acceptées, refusées, complétées
- Statistiques recalculées automatiquement après chaque action
- Zone des dernières commandes récentes

### 📦 Liste des Commandes
- Cards dynamiques avec nom client, articles, prix et statut
- Modification du statut via dropdown ou boutons
- Suppression instantanée d'une commande
- Filtrage par statut sans rechargement de page

### ➕ Nouvelle Commande
- Formulaire avec nom client, liste d'items et prix total
- Soumission via `POST` vers l'API
- Ajout immédiat dans la liste après validation
- Reset automatique du formulaire

### 🔧 Composants Communs
- **Navbar** : navigation SPA entre Dashboard, Commandes et Nouvelle Commande, avec gestion du lien actif
- **Footer** : données chargées dynamiquement depuis `/settings` (nom du restaurant, email)

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/ton-username/foodiez.git
cd foodiez
```

### 2. Installer JSON Server

```bash
npm install -g json-server
```

### 3. Lancer le backend simulé

```bash
json-server --watch db.json --port 3000
```

L'API sera disponible sur `http://localhost:3000`.

| Endpoint | Description |
|---|---|
| `GET /orders` | Récupérer toutes les commandes |
| `POST /orders` | Créer une nouvelle commande |
| `PATCH /orders/:id` | Modifier le statut d'une commande |
| `DELETE /orders/:id` | Supprimer une commande |
| `GET /settings` | Récupérer les paramètres du restaurant |

### 4. Lancer l'application

Ouvrir `index.html` dans le navigateur, ou utiliser une extension comme **Live Server** (VS Code).

---

## 💡 Utilisation

1. **Dashboard** — Consultez le résumé des commandes en temps réel
2. **Commandes** — Parcourez, filtrez, modifiez ou supprimez les commandes
3. **Nouvelle Commande** — Remplissez le formulaire et soumettez une commande
4. La navbar permet de naviguer entre les sections **sans rechargement**

---

## ⚙️ Gestion des États

L'application gère trois états critiques pour chaque appel API :

| État | Comportement |
|---|---|
| ⏳ **Loading** | Affichage d'un loader pendant l'appel réseau |
| ❌ **Error** | Message d'erreur clair en cas d'échec API |
| 📭 **Empty** | Message informatif si aucune commande n'existe |

---

## 📝 User Stories

| # | Story | Statut |
|---|---|---|
| US1 | Dashboard avec résumé dynamique des commandes | ✅ |
| US2 | Liste des commandes sous forme de cards | ✅ |
| US3 | Soumission d'une nouvelle commande via formulaire | ✅ |
| US4 | Modification du statut avec mise à jour API + DOM | ✅ |
| US5 | Suppression d'une commande | ✅ |
| US6 | Filtrage des commandes par statut | ✅ |

---

> **Foodiez** — HTML · Tailwind CSS · JS · JSON Server · Fetch API