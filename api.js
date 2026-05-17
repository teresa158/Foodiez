// api.js — Foodiez Dashboard API layer
// يجيب orders و settings من dt.json عبر fetch

const api = {

  // جيب orders من dt.json
  getOrders: async function () {
    const res = await fetch('dt.json');
    if (!res.ok) throw new Error('Failed to load orders');
    const data = await res.json();
    return data.orders;
  },

  // جيب settings من dt.json
  getSettings: async function () {
    const res = await fetch('dt.json');
    if (!res.ok) throw new Error('Failed to load settings');
    const data = await res.json();
    return data.settings;
  }

};