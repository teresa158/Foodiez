// ── DATA ─────────────────────────────────────────────────────────────────────
let orders = [
  {
    id: 'ORD-7721', customer: 'Ahmed Khan', status: 'PENDING',
    time: '12 mins ago', items: '2x Pepperoni Pizza, 1x Large Soda, 1x Garlic Bread',
    total: 120.00, reason: ''
  },
  {
    id: 'ORD-7725', customer: 'Sarah Jenkins', status: 'ACCEPTED',
    time: '24 mins ago', items: '1x Veggie Burger, 1x Sweet Potato Fries',
    total: 45.50, reason: ''
  },
  {
    id: 'ORD-7718', customer: 'Marco Rossi', status: 'COMPLETED',
    time: '1h ago', items: '3x Pasta Carbonara, 1x Tiramisu',
    total: 82.00, reason: ''
  },
  {
    id: 'ORD-7712', customer: 'Elena Smith', status: 'REJECTED',
    time: '2h ago', items: '1x Seafood Paella, 2x Sangria',
    total: 64.20, reason: 'OUT OF STOCK'
  },
  {
    id: 'ORD-7730', customer: 'David Zhang', status: 'PENDING',
    time: 'Just now', items: '4x Cheeseburgers, 4x Fries, 4x Milkshakes, 1x Extra Dip',
    total: 156.40, reason: ''
  }
];

// ── STATE ─────────────────────────────────────────────────────────────────────
let activeTab    = 'ALL';
let searchQuery  = '';
let pendingStatusOrderId = null;

// ── ICONS & LABELS ─────────────────────────────────────────────────────────────
const STATUS_META = {
  PENDING:   { icon: '⏱',  iconClass: 'icon-pending',   badgeClass: 'badge-pending',   label: 'Pending'   },
  ACCEPTED:  { icon: '✅', iconClass: 'icon-accepted',  badgeClass: 'badge-accepted',  label: 'Accepted'  },
  COMPLETED: { icon: '✔️', iconClass: 'icon-completed', badgeClass: 'badge-completed', label: 'Completed' },
  REJECTED:  { icon: '⊗',  iconClass: 'icon-rejected',  badgeClass: 'badge-rejected',  label: 'Rejected'  }
};

// ── HELPERS ────────────────────────────────────────────────────────────────────
function fmt(n) { return n.toFixed(2) + '€'; }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function getFiltered() {
  return orders.filter(o => {
    const matchTab    = activeTab === 'ALL' || o.status === activeTab;
    const q           = searchQuery.toLowerCase();
    const matchSearch = !q || o.customer.toLowerCase().includes(q) ||
                        o.id.toLowerCase().includes(q) ||
                        o.items.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });
}

// ── RENDER CARDS ──────────────────────────────────────────────────────────────
function renderOrders() {
  const grid = document.getElementById('ordersGrid');
  const list = getFiltered();

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No orders found</h3>
        <p>Try a different filter or search term.</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(o => {
    const m = STATUS_META[o.status];

    // Items or rejection reason block
    const infoBlock = o.status === 'REJECTED'
      ? `<div class="reason-label">Reason: ${o.reason || 'N/A'}</div>
         <div class="reason-text">${o.items}</div>`
      : `<div class="items-label">Items</div>
         <div class="items-text">${o.items}</div>`;

    // Action buttons per status
    let actions = '';
    if (o.status === 'PENDING') {
      actions = `
        <button class="delete-btn" data-id="${o.id}" data-action="delete" title="Delete">🗑</button>
        <button class="action-btn primary" data-id="${o.id}" data-action="accept">Accept</button>`;
    } else if (o.status === 'ACCEPTED') {
      actions = `
        <button class="delete-btn" data-id="${o.id}" data-action="delete" title="Delete">🗑</button>
        <button class="action-btn with-arrow" data-id="${o.id}" data-action="update-status">
          Update Status <span>▾</span>
        </button>`;
    } else if (o.status === 'COMPLETED') {
      actions = `
        <button class="delete-btn" data-id="${o.id}" data-action="delete" title="Delete">🗑</button>
        <button class="action-btn" data-id="${o.id}" data-action="details">Details</button>`;
    } else if (o.status === 'REJECTED') {
      actions = `
        <button class="delete-btn" data-id="${o.id}" data-action="delete" title="Delete">🗑</button>
        <button class="action-btn" data-id="${o.id}" data-action="archive">Archive</button>`;
    }

    return `
      <div class="order-card" id="card-${o.id}">
        <div class="card-top">
          <div class="order-icon ${m.iconClass}">${m.icon}</div>
          <span class="status-badge ${m.badgeClass}">${m.label}</span>
        </div>
        <div class="customer-name">${o.customer}</div>
        <div class="order-meta">#${o.id} • ${o.time}</div>
        <hr class="card-divider" />
        ${infoBlock}
        <hr class="card-divider" />
        <div class="card-footer">
          <div class="total-block">
            <div class="total-label">Total</div>
            <div class="total-amount">${fmt(o.total)}</div>
          </div>
          <div class="card-actions">${actions}</div>
        </div>
      </div>`;
  }).join('');

  // Attach button events
  grid.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      handleCardAction(btn.dataset.action, btn.dataset.id);
    });
  });
}

// ── CARD ACTIONS ──────────────────────────────────────────────────────────────
function handleCardAction(action, id) {
  switch (action) {
    case 'accept':
      updateOrderStatus(id, 'ACCEPTED');
      showToast(`✅ Order #${id} accepted`);
      break;

    case 'update-status':
      pendingStatusOrderId = id;
      document.getElementById('newStatus').value = 'ACCEPTED';
      document.getElementById('reasonField').style.display = 'none';
      openModal('statusModal');
      break;

    case 'details':
      openDetailsModal(id);
      break;

    case 'archive':
      orders = orders.filter(o => o.id !== id);
      showToast(`🗂 Order #${id} archived`);
      renderOrders();
      break;

    case 'delete':
      if (confirm(`Delete order #${id}?`)) {
        orders = orders.filter(o => o.id !== id);
        showToast(`🗑 Order #${id} deleted`);
        renderOrders();
      }
      break;
  }
}

function updateOrderStatus(id, status, reason = '') {
  const o = orders.find(o => o.id === id);
  if (!o) return;
  o.status = status;
  if (reason) o.reason = reason.toUpperCase();
  renderOrders();
}

// ── TABS ──────────────────────────────────────────────────────────────────────
document.getElementById('tabsContainer').addEventListener('click', e => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  activeTab = tab.dataset.status;
  renderOrders();
});

// ── SEARCH ────────────────────────────────────────────────────────────────────
document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value;
  renderOrders();
});

// ── MODALS ────────────────────────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay click
['createModal', 'statusModal', 'detailsModal'].forEach(id => {
  document.getElementById(id).addEventListener('click', e => {
    if (e.target.id === id) closeModal(id);
  });
});

// Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['createModal', 'statusModal', 'detailsModal'].forEach(id => closeModal(id));
  }
});

// ── CREATE ORDER ──────────────────────────────────────────────────────────────
document.getElementById('createOrderBtn').addEventListener('click', () => openModal('createModal'));
document.getElementById('closeCreateModal').addEventListener('click', () => closeModal('createModal'));
document.getElementById('cancelCreate').addEventListener('click', () => closeModal('createModal'));

document.getElementById('submitCreate').addEventListener('click', () => {
  const customer = document.getElementById('newCustomer').value.trim();
  const items    = document.getElementById('newItems').value.trim();
  const total    = parseFloat(document.getElementById('newTotal').value);

  if (!customer || !items || isNaN(total) || total <= 0) {
    showToast('⚠️ Please fill all fields correctly');
    return;
  }

  const newId = 'ORD-' + (7000 + Math.floor(Math.random() * 999));
  orders.unshift({
    id: newId, customer, status: 'PENDING',
    time: 'Just now', items, total, reason: ''
  });

  document.getElementById('newCustomer').value = '';
  document.getElementById('newItems').value    = '';
  document.getElementById('newTotal').value    = '';

  closeModal('createModal');
  showToast(`🎉 Order #${newId} created!`);

  // Switch to ALL tab to show new order
  activeTab = 'ALL';
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.status === 'ALL');
  });
  renderOrders();
});

// ── UPDATE STATUS ─────────────────────────────────────────────────────────────
document.getElementById('closeStatusModal').addEventListener('click', () => closeModal('statusModal'));
document.getElementById('cancelStatus').addEventListener('click', () => closeModal('statusModal'));

document.getElementById('newStatus').addEventListener('change', e => {
  document.getElementById('reasonField').style.display =
    e.target.value === 'REJECTED' ? 'block' : 'none';
});

document.getElementById('submitStatus').addEventListener('click', () => {
  const status = document.getElementById('newStatus').value;
  const reason = document.getElementById('rejectionReason').value.trim();
  if (status === 'REJECTED' && !reason) {
    showToast('⚠️ Please provide a rejection reason');
    return;
  }
  updateOrderStatus(pendingStatusOrderId, status, reason);
  showToast(`✔️ Status updated to ${status}`);
  document.getElementById('rejectionReason').value = '';
  closeModal('statusModal');
});

// ── DETAILS MODAL ─────────────────────────────────────────────────────────────
function openDetailsModal(id) {
  const o = orders.find(o => o.id === id);
  if (!o) return;
  const m = STATUS_META[o.status];
  document.getElementById('detailsTitle').textContent = `Order #${o.id}`;
  document.getElementById('detailsBody').innerHTML = `
    <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1.25rem;">
      <div class="order-icon ${m.iconClass}" style="width:40px;height:40px;font-size:1.1rem;">${m.icon}</div>
      <span class="status-badge ${m.badgeClass}">${m.label}</span>
    </div>
    <div style="display:grid;gap:.75rem;">
      <div><div class="modal-label">Customer</div><div style="font-weight:700;font-size:1.05rem;">${o.customer}</div></div>
      <div><div class="modal-label">Time</div><div>${o.time}</div></div>
      <div><div class="modal-label">Items</div><div style="font-weight:600;">${o.items}</div></div>
      <div><div class="modal-label">Total</div><div style="font-size:1.2rem;font-weight:700;color:var(--accent);">${fmt(o.total)}</div></div>
      ${o.reason ? `<div><div class="modal-label">Reason</div><div style="color:#c62828;">${o.reason}</div></div>` : ''}
    </div>`;
  openModal('detailsModal');
}

document.getElementById('closeDetailsModal').addEventListener('click', () => closeModal('detailsModal'));
document.getElementById('closeDetailsDone').addEventListener('click', () => closeModal('detailsModal'));

// ── SIDEBAR NAV ───────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (btn.id === 'nav-neworder') {
      openModal('createModal');
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      document.getElementById('nav-orders').classList.add('active');
    }
  });
});

// ── INIT ──────────────────────────────────────────────────────────────────────
renderOrders();
