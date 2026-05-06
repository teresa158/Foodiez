// ── Configuration ──────────────────────
const API = 'http://localhost:3000';
let allOrders = [];
let activeFilter = 'all';

// ── Utilitaires ────────────────────────
function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 60000;
  if (diff < 1) return 'just now';
  if (diff < 60) return Math.round(diff) + ' min ago';
  return Math.round(diff / 60) + 'h ago';
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const avatarColors = [
  'background:#dcfce7;color:#15803d',
  'background:#dbeafe;color:#1d4ed8',
  'background:#fef9c3;color:#854d0e',
  'background:#fee2e2;color:#dc2626',
  'background:#f3e8ff;color:#7e22ce',
  'background:#ffedd5;color:#c2410c',
];

function getAvatarColor(name) {
  let hash = 0;
  for (let c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return avatarColors[hash % avatarColors.length];
}

// ── Update compteurs tabs ───────────────
function updateCountBadges() {
  const counts = { all: allOrders.length, pending: 0, accepted: 0, preparing: 0, completed: 0, rejected: 0 };
  allOrders.forEach(o => counts[o.status] = (counts[o.status] || 0) + 1);
  document.getElementById('count-all').textContent = counts.all;
  document.getElementById('count-pending').textContent = counts.pending;
  document.getElementById('count-accepted').textContent = counts.accepted;
  document.getElementById('count-preparing').textContent = counts.preparing;
  document.getElementById('count-completed').textContent = counts.completed;
  document.getElementById('count-rejected').textContent = counts.rejected;
}

// ── Render une card ─────────────────────
function renderCard(order) {
  const av = initials(order.customerName);
  const color = getAvatarColor(order.customerName);

  // Grouper les items
  const items = (order.items || []).map(i => typeof i === 'string' ? i : i.name);
  const grouped = {};
  items.forEach(it => grouped[it] = (grouped[it] || 0) + 1);
  const itemsStr = Object.entries(grouped).map(([n, c]) => `${c}× ${n}`).join(', ');

  // Bouton action selon statut
  const actionBtns = {
    pending:   `<button class="btn-action" onclick="changeStatus(${order.id}, 'accepted')">→ Accept</button>`,
    accepted:  `<button class="btn-action" onclick="changeStatus(${order.id}, 'preparing')">→ Start Prep</button>`,
    preparing: `<button class="btn-action" onclick="changeStatus(${order.id}, 'completed')">→ Complete</button>`,
    completed: '',
    rejected:  '',
  };

  return `
    <div class="order-card" id="card-${order.id}">
      <div class="card-top">
        <div class="card-info">
          <div class="avatar" style="${color}">${av}</div>
          <div>
            <p class="customer-name">${order.customerName}</p>
            <p class="order-id">#FDEZ-${String(order.id).padStart(4, '0')}</p>
          </div>
        </div>
        <span class="badge badge-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
      </div>
      <p class="table-note">${order.tableNote || ''}</p>
      <p class="items-list">${itemsStr}</p>
      <div class="card-footer">
        <span class="time-ago">${timeAgo(order.createdAt)}</span>
        <span class="total-price">$${Number(order.totalPrice).toFixed(2)}</span>
      </div>
      <div class="card-actions">
        <button class="btn-edit">✏ Edit</button>
        ${actionBtns[order.status] || ''}
        <button class="btn-delete" onclick="deleteOrder(${order.id})">🗑</button>
      </div>
    </div>`;
}

// ── Render toutes les orders ────────────
function renderOrders() {
  let filtered = allOrders;
  if (activeFilter !== 'all') {
    filtered = allOrders.filter(o => o.status === activeFilter);
  }

  const grid = document.getElementById('orders-grid');

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <p>📭 Aucune commande trouvée</p>
        <small>Essayez un autre filtre</small>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(o => renderCard(o)).join('');
}

// ── Load orders depuis API ──────────────
async function loadOrders() {
  const grid = document.getElementById('orders-grid');

  // Loading state
  grid.innerHTML = `
    <div class="skeleton-card"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>
    <div class="skeleton-card"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>
    <div class="skeleton-card"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>`;

  try {
    const res = await fetch(`${API}/orders`);
    if (!res.ok) throw new Error('API error');
    allOrders = await res.json();
    updateCountBadges();
    renderOrders();
  } catch (error) {
    // Error state
    grid.innerHTML = `
      <div class="error-state">
        <p>❌ Impossible de charger les commandes</p>
        <small>Vérifiez que JSON Server est lancé</small>
        <button onclick="loadOrders()">🔄 Réessayer</button>
      </div>`;
  }
}

// ── Filter tabs ─────────────────────────
document.querySelectorAll('.filter-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderOrders();
  });
});

// ── Change statut ───────────────────────
async function changeStatus(id, newStatus) {
  try {
    const res = await fetch(`${API}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) throw new Error();
    const updated = await res.json();
    const idx = allOrders.findIndex(o => o.id === id);
    if (idx !== -1) allOrders[idx] = updated;
    updateCountBadges();
    renderOrders();
  } catch {
    alert('Erreur lors de la mise à jour du statut');
  }
}

// ── Delete order ────────────────────────
async function deleteOrder(id) {
  if (!confirm('Supprimer cette commande ?')) return;
  try {
    const res = await fetch(`${API}/orders/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    allOrders = allOrders.filter(o => o.id !== id);
    updateCountBadges();
    renderOrders();
  } catch {
    alert('Erreur lors de la suppression');
  }
}

// ── Démarrage ───────────────────────────
loadOrders();