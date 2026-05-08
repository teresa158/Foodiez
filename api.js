// ============================================================
//  api.js  —  Foodiez REST API helper (json-server @ :3000)
// ============================================================
const API = 'http://localhost:3000';

const api = {
  // ---------- ORDERS ----------
  getOrders:   ()           => fetch(`${API}/orders`).then(r => r.json()),
  getOrder:    (id)         => fetch(`${API}/orders/${id}`).then(r => r.json()),
  createOrder: (data)       => fetch(`${API}/orders`, { method:'POST',  headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }).then(r => r.json()),
  updateOrder: (id, data)   => fetch(`${API}/orders/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }).then(r => r.json()),
  deleteOrder: (id)         => fetch(`${API}/orders/${id}`, { method:'DELETE' }),

  // ---------- MENU ----------
  getMenu:     ()           => fetch(`${API}/menu`).then(r => r.json()),
  getMenuItem: (id)         => fetch(`${API}/menu/${id}`).then(r => r.json()),
  createMenuItem: (data)    => fetch(`${API}/menu`, { method:'POST',  headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }).then(r => r.json()),
  updateMenuItem: (id, data)=> fetch(`${API}/menu/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }).then(r => r.json()),
  deleteMenuItem: (id)      => fetch(`${API}/menu/${id}`, { method:'DELETE' }),

  // ---------- SETTINGS ----------
  getSettings:    ()        => fetch(`${API}/settings/1`).then(r => r.json()),
  updateSettings: (data)    => fetch(`${API}/settings/1`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }).then(r => r.json()),
};