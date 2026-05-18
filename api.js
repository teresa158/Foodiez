// api.js — Foodiez API layer
// يجيب menu من data.json ويحفظ orders في localStorage

const api = {

  // جيب menu items من data.json
  getMenu: async function () {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('Failed to load menu');
    const data = await res.json();
    return data.menu;
  },

  // جيب orders من localStorage
  getOrders: function () {
    const raw = localStorage.getItem('foodiez_orders');
    return raw ? JSON.parse(raw) : [];
  },

  // سجل order جديد في localStorage
  createOrder: function (order) {
    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem('foodiez_orders', JSON.stringify(orders));
    return order;
  },

  // بدّل status ديال order
  updateOrderStatus: function (id, status) {
    const orders = this.getOrders();
    const found = orders.find(o => o.id === id);
    if (found) found.status = status;
    localStorage.setItem('foodiez_orders', JSON.stringify(orders));
    return found;
  }

};