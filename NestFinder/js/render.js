// ══════════════════════════════════════
//  NestFinder — Render Helpers
// ══════════════════════════════════════

function setupNav() {
  const u = STATE.currentUser;
  document.getElementById('nav-uname').textContent  = u.name;
  document.getElementById('nav-urole').textContent  = u.role;
  document.getElementById('nav-avatar').textContent = initials(u.name);
  renderNavLinks();
}

function getNavItems() {
  const u = STATE.currentUser;
  const pendingOwner = ownerRequests().filter(r=>r.status==='pending').length;
  const pendingMy    = myRequests().filter(r=>r.status==='pending').length;
  const notifCount   = myNotifs().length;
  if (u.role==='owner') return [
    {id:'my-flats',      label:'My Properties'},
    {id:'requests',      label:'Requests',      badge:pendingOwner},
    {id:'notifications', label:'Notifications', badge:notifCount},
  ];
  if (u.role==='customer') return [
    {id:'browse',        label:'Browse'},
    {id:'my-requests',   label:'My Requests',   badge:pendingMy},
    {id:'notifications', label:'Notifications', badge:notifCount},
  ];
  return [
    {id:'admin',       label:'Dashboard'},
    {id:'admin-flats', label:'All Listings'},
    {id:'admin-users', label:'Users'},
  ];
}

function renderNavLinks() {
  const items = getNavItems();
  const page  = STATE.detailFlatId ? '' : STATE.currentPage;
  document.getElementById('nav-links').innerHTML = items.map(n => `
    <button class="nav-btn${page===n.id?' active':''}" onclick="navigateTo('${n.id}')">
      ${n.label}
      ${n.badge>0 ? `<span class="nav-badge">${n.badge}</span>` : ''}
    </button>
  `).join('');
}

function navigateTo(pageId) {
  if (STATE.heroInterval) { clearInterval(STATE.heroInterval); STATE.heroInterval = null; }
  STATE.detailFlatId = null;
  STATE.currentPage  = pageId;
  renderNavLinks();
  renderPage();
}

// ── Reusable HTML builders ────────────────────────────────

function statCardHtml(num, label, icon, cls='') {
  return `<div class="stat-card ${cls}">
    <div class="stat-num">${num}</div>
    <div class="stat-lbl">${label}</div>
    <div class="stat-ico">${icon}</div>
  </div>`;
}

function emptyHtml(icon, title, sub) {
  return `<div class="empty">
    <div class="empty-ico">${icon}</div>
    <h3 class="empty-title">${title}</h3>
    <p class="empty-sub">${sub}</p>
  </div>`;
}

function buildingCardHtml(flat, photos, myReq, isOwner=false) {
  const building   = photos?.building;
  const photoCount = (photos?.interior?.length||0) + (building?1:0);
  const hasVideo   = !!photos?.video;
  const pending    = isOwner ? STATE.requests.filter(r=>r.flatId===flat.id&&r.status==='pending').length : 0;

  const imgHtml = building
    ? `<img src="${building}" alt="${flat.title}" />`
    : `<div class="bcard-img-fallback">🏢</div>`;

  let footerHtml = '';
  if (isOwner) {
    footerHtml = `
      <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openDetail('${flat.id}')">View</button>
      <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openFlatModal('${flat.id}')">Edit</button>
      <button class="btn btn-danger btn-sm"  onclick="event.stopPropagation();deleteFlat('${flat.id}')">Remove</button>
    `;
  } else if (myReq) {
    footerHtml = chipHtml(myReq.status);
  } else if (flat.status==='available') {
    footerHtml = `
      <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openDetail('${flat.id}')">View Details →</button>
      <button class="btn btn-gold btn-sm"    onclick="event.stopPropagation();openRequestModal('${flat.id}')">Book</button>
    `;
  } else {
    footerHtml = `<span style="font-size:.78rem;color:var(--tm);font-style:italic">Not available</span>`;
  }

  return `
    <div class="bcard" onclick="openDetail('${flat.id}')">
      <div class="bcard-img">
        ${imgHtml}
        <div class="bcard-img-overlay"></div>
        <span class="bcard-status ${flat.status}">${flat.status}</span>
        <div class="bcard-media-badge">📷 ${photoCount} photo${photoCount!==1?'s':''}${hasVideo?' · 🎬 Video':''}</div>
        ${pending>0 ? `<div class="bcard-pending-badge">⚡ ${pending} pending</div>` : ''}
      </div>
      <div class="bcard-body">
        <div class="bcard-price">${taka(flat.rent)} <span>/ month</span></div>
        <div class="bcard-title">${flat.title}</div>
        <div class="bcard-loc">📍 ${flat.location}</div>
        <div class="bcard-sep"></div>
        <div class="bcard-specs">
          <div class="bcard-spec"><div class="bcard-spec-val">${flat.beds}</div><div class="bcard-spec-key">Beds</div></div>
          <div class="bcard-spec"><div class="bcard-spec-val">${flat.baths}</div><div class="bcard-spec-key">Baths</div></div>
          <div class="bcard-spec"><div class="bcard-spec-val">${flat.area}</div><div class="bcard-spec-key">sq ft</div></div>
        </div>
        ${flat.facilities?.length ? `<div class="bcard-tags">${flat.facilities.slice(0,4).map(f=>`<span class="bcard-tag">${f}</span>`).join('')}</div>` : ''}
        <div class="bcard-footer">${footerHtml}</div>
      </div>
    </div>`;
}
