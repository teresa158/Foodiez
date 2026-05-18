# 🍔 Foodiez — Smart Restaurant Orders (SPA)

Foodiez est une application **SPA (Single Page Application)** permettant de gérer les commandes d’un restaurant en temps réel.

Elle utilise **HTML, Tailwind CSS, JavaScript Vanilla (ES6+) et JSON Server** comme backend simulé.

---

## 🚀 Fonctionnalités

### 📊 Dashboard
- Total des commandes
- Commandes en attente
- Commandes acceptées
- Commandes refusées
- Commandes complétées
- Statistiques mises à jour automatiquement depuis l’API

---

### 📦 Gestion des commandes
- Affichage dynamique des commandes (cards)
- Ajout d’une nouvelle commande (POST API)
- Modification du statut :
  - pending → accepted → completed
  - ou rejected
- Suppression d’une commande (DELETE API)
- Filtrage par statut

---

### ➕ Nouvelle commande
- Formulaire dynamique :
  - Nom du client
  - Items de la commande
  - Prix total
- Ajout instantané dans l’interface (SPA)

---

### 🧭 Navigation SPA
- Dashboard
- Commandes
- Nouvelle commande
- Navigation sans rechargement de page
- Gestion des vues en JavaScript

---

### 🧾 Footer dynamique
- Nom du restaurant
- Email de contact
- Données chargées depuis `/settings`

---

## 🧱 Stack Technique

- HTML5
- Tailwind CSS
- JavaScript (ES6+)
- Fetch API
- JSON Server

---

## 📂 Structure des données (db.json)

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