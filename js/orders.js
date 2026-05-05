// ── Configuration ──────────────────────
const API = 'http://localhost:3000';

// ── Test Jour 1 : vérifier la connexion API ──
async function testAPI() {
  try {
    const response = await fetch(`${API}/orders`);
    const orders = await response.json();
    console.log('✅ API connectée ! Nombre de commandes:', orders.length);
    console.log('📦 Données:', orders);
  } catch (error) {
    console.error('❌ Erreur API - JSON Server est-il lancé ?', error);
  }
}

// Appel au chargement de la page
testAPI();