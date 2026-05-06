// ===================== SETTINGS =====================

async function loadSettings() {
  // Afficher le loader, masquer le reste
  document.getElementById('settings-loading').classList.remove('hidden');
  document.getElementById('settings-error').classList.add('hidden');
  document.getElementById('settings-content').classList.add('hidden');

  try {
    const res = await fetch('http://localhost:3000/settings');
    if (!res.ok) throw new Error('Erreur API');
    const data = await res.json();

    // Remplir les champs avec les données de l'API
    document.getElementById('setting-restaurant-name').value = data.restaurantName || '';
    document.getElementById('setting-contact-email').value   = data.contactEmail   || '';
    document.getElementById('setting-phone').value           = data.phone           || '';
    document.getElementById('setting-address').value         = data.address         || '';
    document.getElementById('setting-open-time').value       = data.openTime        || '08:00';
    document.getElementById('setting-close-time').value      = data.closeTime       || '22:00';

    // Mettre à jour l'aperçu en temps réel
    updateSettingsPreview();

    // Afficher le contenu
    document.getElementById('settings-loading').classList.add('hidden');
    document.getElementById('settings-content').classList.remove('hidden');

    // Écouter les changements pour l'aperçu live
    document.getElementById('setting-restaurant-name').addEventListener('input', updateSettingsPreview);
    document.getElementById('setting-contact-email').addEventListener('input', updateSettingsPreview);
    document.getElementById('setting-open-time').addEventListener('change', updateSettingsPreview);
    document.getElementById('setting-close-time').addEventListener('change', updateSettingsPreview);

  } catch (err) {
    document.getElementById('settings-loading').classList.add('hidden');
    document.getElementById('settings-error').classList.remove('hidden');
    showToast('Impossible de charger les paramètres.', 'error');
  }
}

async function saveSettings() {
  const btn = document.getElementById('btn-save-settings');
  const indicator = document.getElementById('settings-saved-indicator');

  // Récupérer les valeurs du formulaire
  const payload = {
    restaurantName : document.getElementById('setting-restaurant-name').value.trim(),
    contactEmail   : document.getElementById('setting-contact-email').value.trim(),
    phone          : document.getElementById('setting-phone').value.trim(),
    address        : document.getElementById('setting-address').value.trim(),
    openTime       : document.getElementById('setting-open-time').value,
    closeTime      : document.getElementById('setting-close-time').value,
  };

  // Validation basique
  if (!payload.restaurantName) {
    showToast('Le nom du restaurant est obligatoire.', 'error');
    return;
  }
  if (!payload.contactEmail || !payload.contactEmail.includes('@')) {
    showToast('Veuillez entrer un email valide.', 'error');
    return;
  }

  // Désactiver le bouton pendant la requête
  btn.disabled = true;
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin" style="font-size:17px;">progress_activity</span> Sauvegarde…';

  try {
    const res = await fetch('http://localhost:3000/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Erreur API');

    // Mettre à jour le footer dynamiquement
    const footerName = document.getElementById('footer-name');
    const footerEmail = document.getElementById('footer-email');
    if (footerName) footerName.textContent = payload.restaurantName;
    if (footerEmail) footerEmail.textContent = payload.contactEmail;

    // Indicateur de succès
    indicator.classList.remove('hidden');
    setTimeout(() => indicator.classList.add('hidden'), 3000);

    showToast('Paramètres sauvegardés avec succès !', 'success');
  } catch (err) {
    showToast('Erreur lors de la sauvegarde.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:17px;">save</span> Enregistrer';
  }
}

function updateSettingsPreview() {
  const name  = document.getElementById('setting-restaurant-name').value || '—';
  const email = document.getElementById('setting-contact-email').value   || '—';
  const open  = document.getElementById('setting-open-time').value        || '08:00';
  const close = document.getElementById('setting-close-time').value       || '22:00';

  document.getElementById('preview-name').textContent  = name;
  document.getElementById('preview-email').textContent = email;
  document.getElementById('preview-hours').textContent = `${open} – ${close}`;
}

// Toggles pour les switches de notifications
function toggleNotif(id) {
  const checkbox = document.getElementById(id);
  const thumb    = document.getElementById('thumb-' + id);
  checkbox.checked = !checkbox.checked;
  // Déplacer le thumb
  if (checkbox.checked) {
    thumb.style.transform = 'translateX(20px)';
    thumb.parentElement.style.background = '#f97316'; // orange-500
  } else {
    thumb.style.transform = 'translateX(0)';
    thumb.parentElement.style.background = '#e5e7eb'; // gray-200
  }
}