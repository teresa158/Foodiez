/* ── state ── */
let allOrders=[], menuItems=[], currentFilter='all', quickCart={}, deleteAction=null;

/* ── utils ── */
const fmt=n=>'$'+n.toFixed(2);
const total=o=>o.items.reduce((s,i)=>s+i.price*(i.qty||1),0);
const initials=n=>n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
const avC=['bg-orange-100 text-orange-700','bg-blue-100 text-blue-700','bg-green-100 text-green-700','bg-purple-100 text-purple-700','bg-pink-100 text-pink-700','bg-teal-100 text-teal-700'];
const avColor=n=>avC[n.charCodeAt(0)%avC.length];
const bMap={Pending:'badge-pending',Accepted:'badge-accepted',Preparing:'badge-preparing',Completed:'badge-completed',Rejected:'badge-rejected'};
const badge=s=>`<span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${bMap[s]||'badge-pending'} uppercase tracking-wide">${s}</span>`;
const nextStatusLabel={Pending:'Accept',Accepted:'Start Prep',Preparing:'Complete'};

function showToast(msg,type='info'){
  const tc=document.getElementById('toast-container');
  const t=document.createElement('div');
  t.className=`toast ${type==='success'?'success':type==='error'?'error':''}`;
  t.innerHTML=`<span class="material-symbols-outlined" style="font-size:18px;font-variation-settings:'FILL' 1">${type==='success'?'check_circle':type==='error'?'error':'info'}</span>${msg}`;
  tc.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(20px)';t.style.transition='all .3s';setTimeout(()=>t.remove(),300);},3500);
}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('sidebar-overlay').classList.toggle('hidden');}

/* ── render orders ── */
function renderOrders(){
  const q=document.getElementById('search-input').value.toLowerCase();
  const filtered=allOrders.filter(o=>{
    const matchFilter=currentFilter==='all'||o.status===currentFilter;
    const matchSearch=!q||o.customer.toLowerCase().includes(q)||String(o.id).toLowerCase().includes(q);
    return matchFilter&&matchSearch;
  });

  // update counts
  ['all','Pending','Accepted','Preparing','Completed','Rejected'].forEach(k=>{
    const el=document.getElementById('cnt-'+k);
    if(el) el.textContent=k==='all'?allOrders.length:allOrders.filter(o=>o.status===k).length;
  });

  document.getElementById('orders-loading').classList.add('hidden');
  const grid=document.getElementById('orders-grid');
  const empty=document.getElementById('orders-empty');

  if(!filtered.length){grid.innerHTML='';empty.classList.remove('hidden');return;}
  empty.classList.add('hidden');

  grid.innerHTML=filtered.map(o=>{
    const t=total(o);
    const items=o.items.map(i=>`${i.qty||1}× ${i.name}`).join(', ');
    return `<div class="bg-white rounded-2xl p-5 border border-gray-100 soft-shadow hover:border-orange-200 transition-colors flex flex-col fade-in">
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-full ${avColor(o.customer)} flex items-center justify-center font-bold">${initials(o.customer)}</div>
          <div>
            <h3 class="font-bold text-gray-900 text-sm">${o.customer}</h3>
            <p class="text-xs text-gray-400 font-mono">#${o.id}</p>
          </div>
        </div>
        ${badge(o.status)}
      </div>
      <div class="flex-1 mb-4">
        <p class="text-xs text-gray-500 mb-1">${o.notes||''}</p>
        <p class="text-xs text-gray-600">${items}</p>
      </div>
      <div class="border-t border-gray-100 pt-4">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-gray-400">${o.time}</span>
          <span class="font-bold text-gray-900 text-sm">${fmt(t)}</span>
        </div>
        <div class="flex gap-2">
          <button onclick="openEditModal('${o.id}')" class="flex-1 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-1 transition-colors">
            <span class="material-symbols-outlined" style="font-size:15px;">edit</span> Edit
          </button>
          ${nextStatusLabel[o.status]?`
          <button onclick="quickAdvance('${o.id}')" class="flex-1 py-2 bg-orange-600 text-white rounded-lg text-xs font-semibold hover:bg-orange-700 flex items-center justify-center gap-1 transition-colors">
            <span class="material-symbols-outlined" style="font-size:15px;">arrow_forward</span> ${nextStatusLabel[o.status]}
          </button>`:``}
          <button onclick="confirmDelete('${o.id}')" class="py-2 px-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
            <span class="material-symbols-outlined" style="font-size:15px;">delete</span>
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function setFilter(f,btn){
  currentFilter=f;
  document.querySelectorAll('.filter-tab').forEach(b=>{
    b.classList.remove('border-orange-600','text-orange-600','font-semibold');
    b.classList.add('border-transparent','text-gray-500','font-medium');
  });
  btn.classList.add('border-orange-600','text-orange-600','font-semibold');
  btn.classList.remove('border-transparent','text-gray-500','font-medium');
  renderOrders();
}

/* ── quick advance status ── */
async function quickAdvance(id){
  const o=allOrders.find(o=>String(o.id)===String(id));
  if(!o) return;
  const map={Pending:'Accepted',Accepted:'Preparing',Preparing:'Completed'};
  if(!map[o.status]) return;
  try{
    const updated=await api.updateOrder(id,{status:map[o.status]});
    o.status=updated.status;
    renderOrders();
    showToast(`Order #${id} → ${updated.status}`,'success');
  }catch(e){
    showToast('Failed to update order','error');
  }
}

/* ── edit modal ── */
function openEditModal(id){
  const o=allOrders.find(o=>String(o.id)===String(id));
  if(!o) return;
  document.getElementById('edit-id').value=o.id;
  document.getElementById('edit-modal-title').textContent=`Edit Order #${o.id}`;
  document.getElementById('edit-customer').value=o.customer;
  document.getElementById('edit-status').value=o.status;
  document.getElementById('edit-notes').value=o.notes||'';
  const sub=total(o);
  document.getElementById('edit-sub').textContent=fmt(sub);
  document.getElementById('edit-tax').textContent=fmt(sub*.1);
  document.getElementById('edit-total').textContent=fmt(sub*1.1);
  document.getElementById('edit-items').innerHTML=o.items.map(i=>`
    <div class="flex justify-between py-0.5"><span>${i.qty||1}× ${i.name}</span><span class="font-medium">${fmt(i.price*(i.qty||1))}</span></div>`).join('');
  document.getElementById('edit-modal').classList.remove('hidden');
}
function closeEditModal(){document.getElementById('edit-modal').classList.add('hidden');}

async function saveEditedOrder(){
  const id=document.getElementById('edit-id').value;
  const data={
    customer:document.getElementById('edit-customer').value.trim(),
    status:document.getElementById('edit-status').value,
    notes:document.getElementById('edit-notes').value,
  };
  if(!data.customer){showToast('Customer name required','error');return;}
  try{
    const updated=await api.updateOrder(id,data);
    const idx=allOrders.findIndex(o=>String(o.id)===String(id));
    if(idx>-1) allOrders[idx]={...allOrders[idx],...updated};
    closeEditModal();
    renderOrders();
    showToast('Order updated!','success');
  }catch(e){showToast('Failed to save','error');}
}

/* ── create order modal ── */
function openCreateModal(){
  quickCart={};
  document.getElementById('new-customer').value='';
  document.getElementById('new-notes').value='';
  document.getElementById('create-summary').classList.add('hidden');
  document.getElementById('create-items-grid').innerHTML=menuItems.filter(m=>m.available).map(m=>`
    <button id="qi-${m.id}" onclick="toggleCartItem(${m.id})" class="flex items-center gap-2 p-2 border border-gray-200 rounded-xl text-xs font-medium hover:border-orange-400 hover:bg-orange-50 transition-colors text-left">
      <span class="text-base">${m.emoji}</span>
      <div class="min-w-0 flex-1">
        <p class="truncate">${m.name}</p>
        <p class="text-gray-400 font-medium">$${m.price.toFixed(2)}</p>
      </div>
    </button>`).join('');
  document.getElementById('create-modal').classList.remove('hidden');
}
function closeCreateModal(){document.getElementById('create-modal').classList.add('hidden');}

function toggleCartItem(id){
  const m=menuItems.find(m=>m.id===id);
  if(!m) return;
  const btn=document.getElementById('qi-'+id);
  if(quickCart[id]){
    delete quickCart[id];
    btn.classList.remove('border-orange-500','bg-orange-50');
  }else{
    quickCart[id]={...m,qty:1};
    btn.classList.add('border-orange-500','bg-orange-50');
  }
  const items=Object.values(quickCart);
  const summary=document.getElementById('create-summary');
  if(!items.length){summary.classList.add('hidden');return;}
  summary.classList.remove('hidden');
  document.getElementById('create-cart-list').innerHTML=items.map(i=>`
    <div class="flex justify-between"><span>${i.name}</span><span>$${i.price.toFixed(2)}</span></div>`).join('');
  document.getElementById('create-total').textContent='$'+(items.reduce((s,i)=>s+i.price,0)*1.1).toFixed(2);
}

async function submitCreateOrder(){
  const customer=document.getElementById('new-customer').value.trim();
  if(!customer){showToast('Customer name required','error');return;}
  const items=Object.values(quickCart);
  if(!items.length){showToast('Select at least one item','error');return;}
  const newOrder={
    id:`FDEZ-${Date.now()}`,
    customer,
    status:'Pending',
    time:'Just now',
    notes:document.getElementById('new-notes').value,
    items:items.map(i=>({name:i.name,qty:1,price:i.price}))
  };
  try{
    const created=await api.createOrder(newOrder);
    allOrders.unshift(created);
    closeCreateModal();
    renderOrders();
    showToast(`Order placed for ${customer}!`,'success');
  }catch(e){showToast('Failed to create order','error');}
}

/* ── delete modal ── */
function confirmDelete(id){
  document.getElementById('delete-msg').textContent=`Delete order #${id}? This cannot be undone.`;
  deleteAction=async()=>{
    try{
      await api.deleteOrder(id);
      allOrders=allOrders.filter(o=>String(o.id)!==String(id));
      renderOrders();
      showToast('Order deleted.','success');
    }catch(e){showToast('Failed to delete','error');}
  };
  document.getElementById('delete-confirm-btn').onclick=()=>{closeDeleteModal();deleteAction&&deleteAction();};
  document.getElementById('delete-modal').classList.remove('hidden');
}
function closeDeleteModal(){document.getElementById('delete-modal').classList.add('hidden');}

document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeEditModal();closeCreateModal();closeDeleteModal();}});

/* ── INIT ── */
const FALLBACK_ORDERS=[
  {id:'FDEZ-9021',customer:'John Doe',status:'Pending',time:'2 min ago',notes:'Table 4',items:[{name:'Grilled Salmon',qty:1,price:18.99},{name:'Sparkling Water',qty:2,price:3.50}]},
  {id:'FDEZ-9022',customer:'Maria Garcia',status:'Accepted',time:'8 min ago',notes:'Table 2',items:[{name:'Chicken Burger',qty:2,price:14.50},{name:'French Fries',qty:1,price:5.99}]},
  {id:'FDEZ-9023',customer:'Alex Kim',status:'Preparing',time:'15 min ago',notes:'Delivery',items:[{name:'Margherita Pizza',qty:1,price:16.50},{name:'Tiramisu',qty:2,price:7.50}]},
  {id:'FDEZ-9024',customer:'Sara Patel',status:'Completed',time:'22 min ago',notes:'Table 7',items:[{name:'Caesar Salad',qty:1,price:12.00},{name:'Iced Tea',qty:2,price:4.00}]},
  {id:'FDEZ-9025',customer:'Tom Wilson',status:'Rejected',time:'35 min ago',notes:'Table 1',items:[{name:'Beef Steak',qty:1,price:28.00}]},
  {id:'FDEZ-9026',customer:'Emma Brown',status:'Pending',time:'1 min ago',notes:'Table 9',items:[{name:'Veggie Wrap',qty:2,price:11.50},{name:'Lemonade',qty:2,price:4.50}]},
  {id:'FDEZ-9027',customer:'James Lee',status:'Accepted',time:'5 min ago',notes:'Table 3',items:[{name:'Pasta Carbonara',qty:1,price:15.00},{name:'Garlic Bread',qty:1,price:4.00}]},
  {id:'FDEZ-9028',customer:'Olivia Chen',status:'Preparing',time:'12 min ago',notes:'Table 5',items:[{name:'Sushi Platter',qty:1,price:32.00},{name:'Miso Soup',qty:1,price:5.00}]},
];
const FALLBACK_MENU=[
  {id:1,name:'Grilled Salmon',category:'Mains',price:18.99,available:true,emoji:'🐟'},
  {id:2,name:'Chicken Burger',category:'Mains',price:14.50,available:true,emoji:'🍔'},
  {id:3,name:'Margherita Pizza',category:'Mains',price:16.50,available:true,emoji:'🍕'},
  {id:4,name:'Caesar Salad',category:'Starters',price:12.00,available:true,emoji:'🥗'},
  {id:5,name:'Beef Steak',category:'Mains',price:28.00,available:true,emoji:'🥩'},
  {id:7,name:'French Fries',category:'Starters',price:5.99,available:true,emoji:'🍟'},
  {id:8,name:'Tiramisu',category:'Desserts',price:7.50,available:true,emoji:'🎂'},
  {id:9,name:'Sparkling Water',category:'Drinks',price:3.50,available:true,emoji:'💧'},
];

async function init(){
  try{
    [allOrders,menuItems]=await Promise.all([api.getOrders(),api.getMenu()]);
    showToast('Orders loaded from API ✓','success');
  }catch(e){
    showToast('API offline — demo data','error');
    allOrders=[...FALLBACK_ORDERS];
    menuItems=[...FALLBACK_MENU];
  }
  renderOrders();
}
init();