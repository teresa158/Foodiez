// ============================================================
//  api.js  —  Foodiez REST API helper (json-server @ :3000)
// ============================================================

const API = 'http://localhost:3000';

// ---------- Fonction helper pour envoyer des requêtes ----------
async function request(url, method = 'GET', data = null) {
  const options = {
    method: method,
  };

  if (data) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  return response.json();
}

// ---------- ORDERS ----------

async function getOrders() {
  return request(`${API}/orders`);
}

async function getOrder(id) {
  return request(`${API}/orders/${id}`);
}

async function createOrder(data) {
  return request(`${API}/orders`, 'POST', data);
}

async function updateOrder(id, data) {
  return request(`${API}/orders/${id}`, 'PATCH', data);
}

async function deleteOrder(id) {
  const response = await fetch(`${API}/orders/${id}`, { method: 'DELETE' });
  return response;
}

// ---------- MENU ----------

async function getMenu() {
  return request(`${API}/menu`);
}

async function getMenuItem(id) {
  return request(`${API}/menu/${id}`);
}

async function createMenuItem(data) {
  return request(`${API}/menu`, 'POST', data);
}

async function updateMenuItem(id, data) {
  return request(`${API}/menu/${id}`, 'PATCH', data);
}

async function deleteMenuItem(id) {
  const response = await fetch(`${API}/menu/${id}`, { method: 'DELETE' });
  return response;
}

// ---------- SETTINGS ----------

async function getSettings() {
  return request(`${API}/settings/1`);
}

async function updateSettings(data) {
  return request(`${API}/settings/1`, 'PATCH', data);
}

// ---------- Export de toutes les fonctions ----------
const api = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getMenu,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getSettings,
  updateSettings,
};