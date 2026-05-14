// =============================================
// DIAGNOSTIC PNEUS — diagnostic.js
// =============================================

// ── Utilitaires sécurité ───────────────────
function escapeHTML(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── État global ────────────────────────────
const state = {
  vehicle: { immat: '', marque: '', modele: '', annee: '', proprietaire: '' },
  tires: {
    fl: { photo: null, depth: null, visual: null, age: null },
    fr: { photo: null, depth: null, visual: null, age: null },
    rl: { photo: null, depth: null, visual: null, age: null },
    rr: { photo: null, depth: null, visual: null, age: null }
  },
  appointment: null,
  currentStep: 0
};

const TIRE_KEYS  = ['fl', 'fr', 'rl', 'rr'];
const TIRE_NAMES = { fl: 'Avant Gauche', fr: 'Avant Droit', rl: 'Arrière Gauche', rr: 'Arrière Droit' };
const TIRE_STEPS = { fl: 1, fr: 2, rl: 3, rr: 4 };

// ── Scoring ────────────────────────────────
function scoreTire(tire) {
  const depthScore  = { '>4': 3, '3-4': 2, '2-3': 1, '<2': 0 }[tire.depth]  ?? -1;
  const visualScore = { 'bon': 3, 'usure': 2, 'fissures': 1, 'deforme': 0 }[tire.visual] ?? -1;
  const ageScore    = { '<3': 3, '3-5': 2, '5-7': 1, '>7': 0 }[tire.age]    ?? -1;

  if (depthScore < 0 || visualScore < 0 || ageScore < 0) return null;

  const total = depthScore + visualScore + ageScore; // 0-9

  if (total >= 7) return { level: 'ok',      label: 'Bon état',     reco: 'Prochain contrôle dans 6 à 12 mois.', total };
  if (total >= 4) return { level: 'warning', label: 'Surveiller',   reco: 'Prévoir un contrôle dans 1 à 3 mois.', total };
  return           { level: 'danger',  label: 'Urgent',        reco: 'Remplacement nécessaire — peut être illégal (< 1,6 mm).', total };
}

function getDepthLabel(val)  { return { '>4': '> 4 mm', '3-4': '3 – 4 mm', '2-3': '2 – 3 mm', '<2': '< 2 mm (limite légale)' }[val] || '—'; }
function getVisualLabel(val) { return { 'bon': 'Bon état', 'usure': 'Usure légère', 'fissures': 'Fissures visibles', 'deforme': 'Déformation / bosse' }[val] || '—'; }
function getAgeLabel(val)    { return { '<3': '< 3 ans', '3-5': '3 à 5 ans', '5-7': '5 à 7 ans', '>7': '> 7 ans' }[val] || '—'; }

// ── Navigation ─────────────────────────────
function goToStep(step) {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`step-${step}`).classList.add('active');
  state.currentStep = step;
  updateProgress(step);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(step) {
  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i === step) dot.classList.add('active');
    else if (i < step) dot.classList.add('done');
  });
  document.querySelectorAll('.step-line').forEach((line, i) => {
    line.classList.toggle('done', i < step);
  });
}

// ── Build tire panels ──────────────────────
function buildTirePanel(tireKey) {
  const stepNum = TIRE_STEPS[tireKey];
  const panel   = document.getElementById(`step-${stepNum}`);
  const name    = TIRE_NAMES[tireKey];

  panel.innerHTML = `
    <div class="tire-step-header">
      <div class="tire-label-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
        Pneu ${stepNum} / 4
      </div>
      <h2>${name}</h2>
    </div>

    <div class="photo-upload-area" id="photo-area-${tireKey}">
      <input type="file" accept="image/*" capture="environment" id="photo-input-${tireKey}">
      <div class="photo-upload-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      </div>
      <div class="photo-upload-text">
        <strong>Photographier ce pneu</strong>
        Appuyez pour ouvrir l'appareil photo
      </div>
    </div>

    <div class="depth-guide">
      <div class="depth-bars">
        <div class="depth-bar" style="height:40px;background:#22c55e"></div>
        <div class="depth-bar" style="height:28px;background:#F59E0B"></div>
        <div class="depth-bar" style="height:16px;background:#f97316"></div>
        <div class="depth-bar" style="height:8px;background:#ef4444"></div>
      </div>
      <div class="depth-guide-text">
        <strong>Guide profondeur des sculptures</strong><br>
        Vert > 4mm · Orange 3-4mm · Rouge 2-3mm · Critique &lt; 2mm<br>
        <em>Limite légale : 1,6 mm (témoin d'usure TWI)</em>
      </div>
    </div>

    <div class="question-block">
      <div class="question-label"><span class="q-num">1</span> Profondeur des sculptures</div>
      <div class="options-grid cols-2" data-key="${tireKey}" data-field="depth">
        <button class="option-btn" data-val=">4"><span class="opt-icon">🟢</span>> 4 mm<br><em style="font-size:0.72rem;color:#9ca3af">Très bon</em></button>
        <button class="option-btn" data-val="3-4"><span class="opt-icon">🟡</span>3 – 4 mm<br><em style="font-size:0.72rem;color:#9ca3af">Acceptable</em></button>
        <button class="option-btn" data-val="2-3"><span class="opt-icon">🟠</span>2 – 3 mm<br><em style="font-size:0.72rem;color:#9ca3af">Surveiller</em></button>
        <button class="option-btn" data-val="<2"><span class="opt-icon">🔴</span>&lt; 2 mm<br><em style="font-size:0.72rem;color:#9ca3af">Dangereux</em></button>
      </div>
    </div>

    <div class="question-block">
      <div class="question-label"><span class="q-num">2</span> État visuel du pneu</div>
      <div class="options-grid cols-2" data-key="${tireKey}" data-field="visual">
        <button class="option-btn" data-val="bon"><span class="opt-icon">✅</span>Bon état<br><em style="font-size:0.72rem;color:#9ca3af">Aucun défaut</em></button>
        <button class="option-btn" data-val="usure"><span class="opt-icon">⚠️</span>Usure légère<br><em style="font-size:0.72rem;color:#9ca3af">Traces d'usure</em></button>
        <button class="option-btn" data-val="fissures"><span class="opt-icon">🔍</span>Fissures<br><em style="font-size:0.72rem;color:#9ca3af">Craquelures</em></button>
        <button class="option-btn" data-val="deforme"><span class="opt-icon">💥</span>Déformation<br><em style="font-size:0.72rem;color:#9ca3af">Bosse / hernie</em></button>
      </div>
    </div>

    <div class="question-block">
      <div class="question-label"><span class="q-num">3</span> Âge approximatif du pneu</div>
      <div class="options-grid cols-4" data-key="${tireKey}" data-field="age">
        <button class="option-btn" data-val="<3">&lt; 3 ans</button>
        <button class="option-btn" data-val="3-5">3-5 ans</button>
        <button class="option-btn" data-val="5-7">5-7 ans</button>
        <button class="option-btn" data-val=">7">&gt; 7 ans</button>
      </div>
    </div>

    <div class="tire-nav">
      ${stepNum > 1 ? `<button class="btn-diag btn-outline-diag" onclick="goToStep(${stepNum - 1})">← Précédent</button>` : ''}
      <button class="btn-diag btn-primary-diag" id="next-${tireKey}" onclick="nextTire('${tireKey}')">
        ${stepNum < 4 ? 'Pneu suivant →' : 'Voir les résultats →'}
      </button>
    </div>
  `;

  // Photo upload handler
  const photoInput = document.getElementById(`photo-input-${tireKey}`);
  const photoArea  = document.getElementById(`photo-area-${tireKey}`);

  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      state.tires[tireKey].photo = ev.target.result;
      photoArea.classList.add('has-photo');
      photoArea.innerHTML = `
        <img class="photo-preview" src="${ev.target.result}" alt="Photo pneu ${name}">
        <button class="photo-remove" onclick="removePhoto('${tireKey}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;
    };
    reader.readAsDataURL(file);
  });

  // Option buttons
  panel.querySelectorAll('.options-grid').forEach(grid => {
    grid.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.tires[grid.dataset.key][grid.dataset.field] = btn.dataset.val;
      });
    });
  });
}

window.removePhoto = function(tireKey) {
  state.tires[tireKey].photo = null;
  buildTirePanel(tireKey); // rebuild panel
};

window.nextTire = function(tireKey) {
  const tire   = state.tires[tireKey];
  const errors = [];
  if (!tire.depth)  errors.push('profondeur des sculptures');
  if (!tire.visual) errors.push('état visuel');
  if (!tire.age)    errors.push('âge du pneu');

  if (errors.length) {
    alert(`Veuillez sélectionner : ${errors.join(', ')}.`);
    return;
  }

  const stepNum = TIRE_STEPS[tireKey];
  if (stepNum < 4) {
    goToStep(stepNum + 1);
  } else {
    buildResults();
    goToStep(5);
  }
};

// ── Results ────────────────────────────────
function buildResults() {
  const grid    = document.getElementById('resultsGrid');
  const summary = document.getElementById('resultsSummary');

  let scores = {};
  let hasUrgent  = false;
  let hasWarning = false;

  grid.innerHTML = TIRE_KEYS.map(key => {
    const score = scoreTire(state.tires[key]);
    scores[key] = score;
    if (score?.level === 'danger')  hasUrgent  = true;
    if (score?.level === 'warning') hasWarning = true;

    const badgeClass = score ? `badge-${score.level}` : 'badge-ok';
    const borderClass = score ? `border-${score.level}` : '';
    const photo = state.tires[key].photo;

    return `
      <div class="result-card ${borderClass}">
        ${photo
          ? `<img class="result-card-photo" src="${photo}" alt="${TIRE_NAMES[key]}">`
          : `<div class="result-card-photo-placeholder">🚗</div>`}
        <div class="result-card-body">
          <div class="result-card-title">${TIRE_NAMES[key]}</div>
          ${score ? `
            <div class="result-badge ${badgeClass}">${score.label}</div>
            <div class="result-card-detail">
              ${getDepthLabel(state.tires[key].depth)} · ${getVisualLabel(state.tires[key].visual)}<br>
              ${getAgeLabel(state.tires[key].age)}
            </div>
          ` : '<div class="result-badge badge-ok">Non renseigné</div>'}
        </div>
      </div>
    `;
  }).join('');

  // Summary
  let summaryText = '';
  if (hasUrgent) {
    summaryText = `<p>⚠️ <span class="summary-urgent">Un ou plusieurs pneus nécessitent un remplacement urgent.</span> La limite légale de profondeur est de <strong>1,6 mm</strong>. Rouler avec des pneus hors normes est passible d'une amende et d'une immobilisation du véhicule. <strong>Appelez-nous dès maintenant.</strong></p>`;
  } else if (hasWarning) {
    summaryText = `<p>⚠️ <span class="summary-warning">Certains pneus montrent des signes d'usure.</span> Nous vous recommandons un contrôle professionnel dans les prochaines semaines. Réservez dès maintenant pour anticiper.</p>`;
  } else {
    summaryText = `<p>✅ <span class="summary-ok">Vos pneus sont en bon état général.</span> Continuez à les surveiller régulièrement. Prochain contrôle recommandé dans 6 à 12 mois.</p>`;
  }

  summary.innerHTML = `<h3>Bilan général</h3>${summaryText}`;
}

// ── Certificate ────────────────────────────
function buildCertificate() {
  const now      = new Date();
  const dateStr  = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr  = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const v        = state.vehicle;
  const esc      = str => escapeHTML(str) || '—';

  const tiresHtml = TIRE_KEYS.map(key => {
    const tire  = state.tires[key];
    const score = scoreTire(tire);
    const photo = tire.photo;
    const lvl   = score?.level || 'ok';
    return `
      <div class="cert-tire-card cert-${lvl}">
        ${photo
          ? `<img class="cert-tire-photo" src="${photo}" alt="${TIRE_NAMES[key]}">`
          : `<div class="cert-tire-photo-ph">🚗</div>`}
        <div class="cert-tire-body">
          <div class="cert-tire-name">${TIRE_NAMES[key]}</div>
          <div class="cert-tire-status ${lvl}">${score?.label || '—'}</div>
          <div class="cert-tire-detail">
            Profondeur : ${getDepthLabel(tire.depth)}<br>
            État : ${getVisualLabel(tire.visual)}<br>
            Âge : ${getAgeLabel(tire.age)}
          </div>
        </div>
      </div>
    `;
  }).join('');

  const scores    = TIRE_KEYS.map(k => scoreTire(state.tires[k]));
  const hasUrgent = scores.some(s => s?.level === 'danger');
  const hasWarn   = scores.some(s => s?.level === 'warning');

  let recoText = hasUrgent
    ? 'Un ou plusieurs pneumatiques présentent un état critique (profondeur < 2 mm). Un remplacement immédiat est fortement recommandé. Ces pneumatiques peuvent être considérés hors normes légales (profondeur minimale requise : 1,6 mm).'
    : hasWarn
    ? "Certains pneumatiques présentent des signes d'usure avancée. Un remplacement est conseillé dans les prochaines semaines afin d'assurer la sécurité du véhicule."
    : 'Les pneumatiques sont en bon état général. Un prochain contrôle est recommandé dans 6 à 12 mois.';

  const apptHtml = state.appointment ? `
    <div class="cert-appointment">
      <h4>Rendez-vous confirmé</h4>
      <p>Date : ${esc(state.appointment.date)} à ${esc(state.appointment.time)}</p>
    </div>
  ` : '';

  document.getElementById('certificate').innerHTML = `
    <div class="cert-header">
      <div>
        <div class="cert-logo">Dépannage<span>Auto</span>Nice</div>
        <div class="cert-logo-sub">Zone industrielle du Quai de la Blanquière, Nice · 06 17 68 42 70</div>
      </div>
      <div class="cert-title-block">
        <h2>Attestation de diagnostic<br>pneumatiques</h2>
        <p>Établie le ${dateStr} à ${timeStr}</p>
      </div>
    </div>

    <div class="cert-info-grid">
      <div class="cert-info-block">
        <h4>Propriétaire</h4>
        <div class="cert-info-row"><span>Nom</span><strong>${esc(v.proprietaire)}</strong></div>
        <div class="cert-info-row"><span>Date</span><strong>${dateStr}</strong></div>
        <div class="cert-info-row"><span>Heure</span><strong>${timeStr}</strong></div>
      </div>
      <div class="cert-info-block">
        <h4>Véhicule</h4>
        <div class="cert-info-row"><span>Immatriculation</span><strong>${esc(v.immat)}</strong></div>
        <div class="cert-info-row"><span>Marque / Modèle</span><strong>${esc(v.marque)} ${esc(v.modele)}</strong></div>
        <div class="cert-info-row"><span>Année</span><strong>${esc(v.annee)}</strong></div>
      </div>
    </div>

    <div class="cert-tires-title">État des pneumatiques au moment du diagnostic</div>
    <div class="cert-tires-grid">${tiresHtml}</div>

    <div class="cert-recommendation">
      <h4>Recommandation professionnelle</h4>
      <p>${recoText}</p>
    </div>

    ${apptHtml}

    <div class="cert-footer">
      <div class="cert-legal">
        Ce document a été établi suite à un auto-diagnostic assisté réalisé via <strong>depannagerautonice.fr</strong>.<br>
        Il atteste que le propriétaire du véhicule a entrepris une démarche de vérification de l'état de ses pneumatiques et, le cas échéant, a planifié leur remplacement.<br><br>
        Contact : <strong>06 17 68 42 70</strong> — Zone ind. Quai de la Blanquière, Nice
      </div>
      <div class="cert-signature">
        <div class="cert-signature-box"></div>
        <div class="cert-signature-label">Signature / Cachet du prestataire</div>
      </div>
    </div>
  `;
}

// ── Init ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Build all tire panels
  TIRE_KEYS.forEach(buildTirePanel);

  // Vehicle form
  document.getElementById('vehicleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    state.vehicle = {
      immat:        document.getElementById('immat').value.toUpperCase(),
      marque:       document.getElementById('marque').value,
      modele:       document.getElementById('modele').value,
      annee:        document.getElementById('annee').value,
      proprietaire: document.getElementById('proprietaire').value
    };
    goToStep(1);
  });

  // Appointment modal
  document.getElementById('btnAppointment').addEventListener('click', () => {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('apptDate').min = today;
    document.getElementById('appointmentModal').classList.add('open');
  });

  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('appointmentModal').classList.remove('open');
  });

  document.getElementById('appointmentModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('appointmentModal')) {
      document.getElementById('appointmentModal').classList.remove('open');
    }
  });

  document.getElementById('appointmentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('apptDate').value;
    const time = document.getElementById('apptTime').value;
    const note = document.getElementById('apptNote').value;

    state.appointment = { date, time, note };

    const v   = state.vehicle;
    const scores = TIRE_KEYS.map(k => {
      const s = scoreTire(state.tires[k]);
      return `${TIRE_NAMES[k]}: ${s?.label || '?'}`;
    }).join(' | ');

    const msg = [
      `🚗 *Demande de RDV — Diagnostic pneus*`,
      ``,
      `*Véhicule :* ${v.marque} ${v.modele} ${v.annee ? '(' + v.annee + ')' : ''}`,
      `*Immat :* ${v.immat || 'Non renseignée'}`,
      `*Propriétaire :* ${v.proprietaire}`,
      ``,
      `*État des pneus :*`,
      scores,
      ``,
      `*RDV souhaité :* ${new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long' })} à ${time}`,
      note ? `*Note :* ${note}` : ''
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/33617684270?text=${encodeURIComponent(msg)}`, '_blank');
    document.getElementById('appointmentModal').classList.remove('open');
  });

  // Certificate
  document.getElementById('btnCertificate').addEventListener('click', () => {
    buildCertificate();
    document.querySelector('.diag-main').style.display = 'none';
    document.getElementById('stepProgress').style.display = 'none';
    document.getElementById('certificateView').classList.remove('hidden');
  });

  document.getElementById('backToResults').addEventListener('click', () => {
    document.querySelector('.diag-main').style.display = '';
    document.getElementById('stepProgress').style.display = '';
    document.getElementById('certificateView').classList.add('hidden');
  });

});
