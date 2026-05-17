// ── api.js — Foodiez API layer ──
// Tries real REST API first, falls back to orders.json

const API_URL = 'http://localhost:3000';

// Generic request helper
async function req(url, method = 'GET', data = null) {

  const opts = {
    method
  };

  if (data) {

    opts.headers = {
      'Content-Type': 'application/json'
    };

    opts.body = JSON.stringify(data);
  }

  const res = await fetch(url, opts);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

// Load fallback data from local JSON
async function loadFallback() {

  const res = await fetch('./orders.json');

  if (!res.ok) {
    throw new Error('Unable to load orders.json');
  }

  return res.json(); // { orders, menu }
}

// API object
const api = {

  // Get orders
  async getOrders() {

    try {

      return await req(`${API_URL}/orders`);

    } catch (err) {

      console.warn('REST API unavailable → fallback orders.json');

      const data = await loadFallback();

      return data.orders || [];
    }
  },

  // Get menu
  async getMenu() {

    try {

      return await req(`${API_URL}/menu`);

    } catch (err) {

      console.warn('REST API unavailable → fallback orders.json');

      const data = await loadFallback();

      return data.menu || [];
    }
  },

  // Create order
  async createOrder(data) {

    try {

      return await req(
        `${API_URL}/orders`,
        'POST',
        data
      );

    } catch (err) {

      console.warn('Offline mode → returning local order');

      return data;
    }
  },

  // Update order
  async updateOrder(id, data) {

    try {

      return await req(
        `${API_URL}/orders/${id}`,
        'PATCH',
        data
      );

    } catch (err) {

      console.warn('Offline mode → local update only');

      return {
        id,
        ...data
      };
    }
  },

  // Delete order
  async deleteOrder(id) {

    try {

      const res = await fetch(
        `${API_URL}/orders/${id}`,
        {
          method: 'DELETE'
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      return true;

    } catch (err) {

      console.warn('Offline mode → delete skipped');

      return false;
    }
  }
};