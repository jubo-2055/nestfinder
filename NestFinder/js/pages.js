// ══════════════════════════════════════
//  NestFinder — Page Renderers
// ══════════════════════════════════════

function renderPage() {
  const container = document.getElementById('page-container');
  container.innerHTML = '';
  container.style.animation = 'none';
  requestAnimationFrame(() => { container.style.animation = ''; });

  if (STATE.detailFlatId) { renderDetailPage(container); return; }

  const p = STATE.currentPage;
  if (p==='browse')        renderBrowse(container);
  else if (p==='my-flats') renderMyFlats(container);
  else if (p==='requests') renderOwnerRequests(container);
  else if (p==='my-requests') renderMyRequests(container);
  else if (p==='notifications') renderNotifications(container);
  else if (p==='admin')       renderAdminDashboard(container);
  else if (p==='admin-flats') renderAdminFlats(container);
  else if (p==='admin-users') renderAdminUsers(container);
}

// ── BROWSE ────────────────────────────────────────────────
function renderBrowse(container) {
  const locVal  = document.getElementById('srch-loc')  ? document.getElementById('srch-loc').value  : '';
  const minVal  = document.getElementById('srch-min')  ? document.getElementById('srch-min').value  : '';
  const maxVal  = document.getElementById('srch-max')  ? document.getElementById('srch-max').value  : '';
  const bedsVal = document.getElementById('srch-beds') ? document.getElementById('srch-beds').value : '';

  let flats = STATE.flats.filter(f => {
    if (f.status!=='available') return false;
    if (locVal  && !f.location.toLowerCase().includes(locVal.toLowerCase())) return false;
    if (minVal  && f.rent < +minVal)  return false;
    if (maxVal  && f.rent > +maxVal)  return false;
    if (bedsVal && f.beds < +bedsVal) return false;
    return true;
  });

  container.innerHTML = `
    <div class="page-head">
      <div>
        <h2 class="page-title">Available <span>Properties</span></h2>
        <p class="page-sub" id="browse-count">${flats.length} listing${flats.length!==1?'s':''} available</p>
      </div>
    </div>
    <div class="search-bar">
      <div class="search-field" style="flex:2">
        <label>Location</label>
        <input class="nf-input" id="srch-loc" placeholder="Gulshan, Banani, Dhanmondi…" value="${locVal}" oninput="filterBrowse()" />
      </div>
      <div class="search-field">
        <label>Min Rent (৳)</label>
        <input class="nf-input" id="srch-min" type="number" placeholder="0" value="${minVal}" oninput="filterBrowse()" />
      </div>
      <div class="search-field">
        <label>Max Rent (৳)</label>
        <input class="nf-input" id="srch-max" type="number" placeholder="Any" value="${maxVal}" oninput="filterBrowse()" />
      </div>
      <div class="search-field">
        <label>Bedrooms</label>
        <select class="nf-input" id="srch-beds" onchange="filterBrowse()">
          <option value="">Any</option>
          <option value="1"${bedsVal==='1'?' selected':''}>1+</option>
          <option value="2"${bedsVal==='2'?' selected':''}>2+</option>
          <option value="3"${bedsVal==='3'?' selected':''}>3+</option>
        </select>
      </div>
    </div>
    <div id="browse-grid" class="prop-grid">
      ${flats.length===0 ? emptyHtml('🏠','No properties found','Try adjusting your search filters') :
        flats.map(f => {
          const myReq = STATE.requests.find(r=>r.flatId===f.id&&r.customerId===STATE.currentUser.id);
          return buildingCardHtml(f, getPhotos(f.id), myReq);
        }).join('')
      }
    </div>`;
}

function filterBrowse() {
  const locVal  = document.getElementById('srch-loc').value;
  const minVal  = document.getElementById('srch-min').value;
  const maxVal  = document.getElementById('srch-max').value;
  const bedsVal = document.getElementById('srch-beds').value;

  let flats = STATE.flats.filter(f => {
    if (f.status!=='available') return false;
    if (locVal  && !f.location.toLowerCase().includes(locVal.toLowerCase())) return false;
    if (minVal  && f.rent < +minVal)  return false;
    if (maxVal  && f.rent > +maxVal)  return false;
    if (bedsVal && f.beds < +bedsVal) return false;
    return true;
  });
  document.getElementById('browse-count').textContent = `${flats.length} listing${flats.length!==1?'s':''} available`;
  document.getElementById('browse-grid').innerHTML = flats.length===0
    ? emptyHtml('🏠','No properties found','Try adjusting your search filters')
    : flats.map(f => {
        const myReq = STATE.requests.find(r=>r.flatId===f.id&&r.customerId===STATE.currentUser.id);
        return buildingCardHtml(f, getPhotos(f.id), myReq);
      }).join('');
}

// ── MY FLATS ──────────────────────────────────────────────
function renderMyFlats(container) {
  const flats = STATE.flats.filter(f=>f.ownerId===STATE.currentUser.id);
  const pendingTotal = STATE.requests.filter(r=>flats.some(f=>f.id===r.flatId)&&r.status==='pending').length;
  container.innerHTML = `
    <div class="page-head">
      <div><h2 class="page-title">My <span>Properties</span></h2><p class="page-sub">Manage your rental listings</p></div>
      <button class="btn btn-gold" onclick="openFlatModal(null)">＋ Add Property</button>
    </div>
    <div class="stats-row">
      ${statCardHtml(flats.length,'Total','🏢')}
      ${statCardHtml(flats.filter(f=>f.status==='available').length,'Available','✅','green')}
      ${statCardHtml(flats.filter(f=>f.status==='rented').length,'Rented','🔑','blue')}
      ${statCardHtml(pendingTotal,'Pending Requests','📋','warn')}
    </div>
    ${flats.length===0 ? emptyHtml('🏢','No properties listed yet',"Click 'Add Property' to create your first listing") :
      `<div class="prop-grid">${flats.map(f=>buildingCardHtml(f,getPhotos(f.id),null,true)).join('')}</div>`
    }`;
}

// ── OWNER REQUESTS ────────────────────────────────────────
function renderOwnerRequests(container) {
  const reqs    = ownerRequests();
  const pending = reqs.filter(r=>r.status==='pending');
  const resolved= reqs.filter(r=>r.status!=='pending');
  container.innerHTML = `
    <div class="page-head">
      <div><h2 class="page-title">Booking <span>Requests</span></h2><p class="page-sub">Review and respond to tenant enquiries</p></div>
    </div>
    <div class="stats-row">
      ${statCardHtml(reqs.length,'Total','📋')}
      ${statCardHtml(pending.length,'Awaiting','⏳','warn')}
      ${statCardHtml(reqs.filter(r=>r.status==='accepted').length,'Accepted','✅','green')}
      ${statCardHtml(reqs.filter(r=>r.status==='rejected').length,'Declined','✕','red')}
    </div>
    ${reqs.length===0 ? emptyHtml('📭','No requests yet','Booking requests will appear here') : `
      ${pending.length>0 ? `
        <div class="sec-head"><h3 class="sec-title">Pending <span class="sec-cnt">(${pending.length})</span></h3></div>
        ${reqTableHtml(pending)}` : ''}
      ${resolved.length>0 ? `
        <div class="sec-head" style="margin-top:28px"><h3 class="sec-title">Resolved <span class="sec-cnt">(${resolved.length})</span></h3></div>
        ${reqTableHtml(resolved)}` : ''}
    `}`;
}

function reqTableHtml(reqs) {
  return `<div class="table-wrap"><table class="nf-table">
    <thead><tr><th>Tenant</th><th>Property</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
    <tbody>${reqs.map(req=>{
      const flat=getFlat(req.flatId);
      const actions = req.status==='pending'
        ? `<div class="td-actions">
            <button class="btn btn-success btn-sm" onclick="handleRequest('${req.id}','accepted')">Accept</button>
            <button class="btn btn-danger btn-sm"  onclick="handleRequest('${req.id}','rejected')">Decline</button>
           </div>`
        : `<span style="font-size:.75rem;color:var(--tm);font-style:italic">Resolved</span>`;
      return `<tr>
        <td><strong style="color:#fff">${req.customerName}</strong>${req.message?`<div style="font-size:.75rem;color:var(--tm);font-style:italic;margin-top:2px">${req.message}</div>`:''}</td>
        <td style="color:var(--td)">${flat?.title||'—'}</td>
        <td style="color:var(--tm);font-size:.8rem">${req.date}</td>
        <td>${chipHtml(req.status)}</td>
        <td>${actions}</td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;
}

// ── MY REQUESTS ───────────────────────────────────────────
function renderMyRequests(container) {
  const reqs = myRequests();
  container.innerHTML = `
    <div class="page-head">
      <div><h2 class="page-title">My <span>Applications</span></h2><p class="page-sub">Track your booking requests</p></div>
    </div>
    <div class="stats-row">
      ${statCardHtml(reqs.length,'Total','📝')}
      ${statCardHtml(reqs.filter(r=>r.status==='pending').length,'Pending','⏳','warn')}
      ${statCardHtml(reqs.filter(r=>r.status==='accepted').length,'Accepted','✅','green')}
      ${statCardHtml(reqs.filter(r=>r.status==='rejected').length,'Declined','✕','red')}
    </div>
    ${reqs.length===0 ? emptyHtml('📝','No applications yet','Browse properties and send your first request') : `
      <div class="table-wrap"><table class="nf-table">
        <thead><tr><th>Property</th><th>Location</th><th>Rent</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>${reqs.map(req=>{
          const f=getFlat(req.flatId);
          const note = req.status==='accepted'?'🎉 Contact owner' : req.status==='rejected'?'Explore others':'Waiting…';
          return `<tr style="cursor:pointer" onclick="openDetail('${req.flatId}')">
            <td><strong style="color:#fff">${f?.title||'—'}</strong></td>
            <td style="color:var(--tm);font-size:.8rem">${f?.location||''}</td>
            <td style="color:var(--gold);font-weight:600">${f?taka(f.rent):'—'}</td>
            <td style="color:var(--tm);font-size:.8rem">${req.date}</td>
            <td>${chipHtml(req.status)}</td>
          </tr>`;
        }).join('')}</tbody>
      </table></div>`}`;
}

// ── NOTIFICATIONS ─────────────────────────────────────────
function renderNotifications(container) {
  const notifs = [...myNotifs()].reverse();
  const icons  = {info:'ℹ️',success:'✅',warn:'⚠️',error:'❌'};
  container.innerHTML = `
    <div class="page-head">
      <div><h2 class="page-title">Notifications</h2><p class="page-sub">${notifs.length} notification${notifs.length!==1?'s':''}</p></div>
    </div>
    ${notifs.length===0 ? emptyHtml('🔔','All caught up!','No notifications yet') : `
      <div class="notif-list">${notifs.map(n=>`
        <div class="notif-item ${n.type}">
          <span style="font-size:1.2rem;flex-shrink:0">${icons[n.type]||'ℹ️'}</span>
          <div><div class="notif-txt">${n.text}</div><div class="notif-time">${n.time}</div></div>
        </div>`).join('')}
      </div>`}`;
}

// ── ADMIN DASHBOARD ───────────────────────────────────────
function renderAdminDashboard(container) {
  const reqs = STATE.requests;
  container.innerHTML = `
    <div class="page-head">
      <div><h2 class="page-title">Admin <span>Dashboard</span></h2><p class="page-sub">System-wide overview</p></div>
    </div>
    <div class="stats-row">
      ${statCardHtml(STATE.users.length,'Total Users','👥')}
      ${statCardHtml(STATE.users.filter(u=>u.role==='owner').length,'Owners','🏢','blue')}
      ${statCardHtml(STATE.users.filter(u=>u.role==='customer').length,'Tenants','🔍','green')}
      ${statCardHtml(STATE.flats.length,'Listings','🏠')}
      ${statCardHtml(STATE.flats.filter(f=>f.status==='available').length,'Available','✅','green')}
      ${statCardHtml(reqs.filter(r=>r.status==='pending').length,'Pending Requests','⏳','warn')}
    </div>
    <div class="sec-head"><h3 class="sec-title">Recent Requests</h3></div>
    <div class="table-wrap"><table class="nf-table">
      <thead><tr><th>Tenant</th><th>Property</th><th>Owner</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>${[...reqs].reverse().slice(0,10).map(req=>{
        const f=getFlat(req.flatId); const o=getUser(f?.ownerId);
        return `<tr>
          <td style="color:#fff;font-weight:600">${req.customerName}</td>
          <td style="color:var(--td)">${f?.title||'—'}</td>
          <td style="color:var(--tm)">${o?.name||'—'}</td>
          <td style="color:var(--tm);font-size:.8rem">${req.date}</td>
          <td>${chipHtml(req.status)}</td>
        </tr>`;
      }).join('')}</tbody>
    </table></div>`;
}

// ── ADMIN FLATS ───────────────────────────────────────────
function renderAdminFlats(container) {
  container.innerHTML = `
    <div class="page-head">
      <div><h2 class="page-title">All <span>Listings</span></h2><p class="page-sub">${STATE.flats.length} properties</p></div>
    </div>
    <div class="table-wrap"><table class="nf-table">
      <thead><tr><th>Property</th><th>Owner</th><th>Location</th><th>Rent</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${STATE.flats.map(f=>{
        const o=getUser(f.ownerId);
        return `<tr>
          <td style="color:#fff;font-weight:600">${f.title}</td>
          <td style="color:var(--td)">${o?.name}</td>
          <td style="color:var(--tm);font-size:.8rem">${f.location}</td>
          <td style="color:var(--gold);font-weight:600">${taka(f.rent)}</td>
          <td>${chipHtml(f.status)}</td>
          <td><button class="btn btn-danger btn-sm" onclick="deleteFlat('${f.id}')">Remove</button></td>
        </tr>`;
      }).join('')}</tbody>
    </table></div>`;
}

// ── ADMIN USERS ───────────────────────────────────────────
function renderAdminUsers(container) {
  container.innerHTML = `
    <div class="page-head">
      <div><h2 class="page-title">Registered <span>Users</span></h2><p class="page-sub">${STATE.users.length} accounts</p></div>
    </div>
    <div class="table-wrap"><table class="nf-table">
      <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr></thead>
      <tbody>${STATE.users.map(u=>`<tr>
        <td><div style="display:flex;align-items:center;gap:10px">
          <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;color:var(--navy);font-weight:700;font-size:.75rem;flex-shrink:0">${initials(u.name)}</div>
          <strong style="color:#fff">${u.name}</strong>
        </div></td>
        <td style="color:var(--td)">${u.email}</td>
        <td style="color:var(--tm)">${u.phone}</td>
        <td><span class="rbadge ${u.role}">${u.role}</span></td>
      </tr>`).join('')}</tbody>
    </table></div>`;
}

// ── PROPERTY DETAIL ───────────────────────────────────────
function openDetail(flatId) {
  if (STATE.heroInterval) { clearInterval(STATE.heroInterval); STATE.heroInterval = null; }
  STATE.detailFlatId = flatId;
  STATE.heroIdx = 0;
  renderNavLinks();
  renderDetailPage(document.getElementById('page-container'));
  window.scrollTo(0,0);
}

function closeDetail() {
  if (STATE.heroInterval) { clearInterval(STATE.heroInterval); STATE.heroInterval = null; }
  STATE.detailFlatId = null;
  renderNavLinks();
  renderPage();
}

function renderDetailPage(container) {
  const flat   = getFlat(STATE.detailFlatId);
  if (!flat) { closeDetail(); return; }
  const photos = getPhotos(flat.id);
  const owner  = getUser(flat.ownerId);
  const allPhotos = photos.interior || [];
  const heroImages= photos.building ? [photos.building, ...allPhotos.map(p=>p.url)] : allPhotos.map(p=>p.url);
  const myReq  = myRequests().find(r=>r.flatId===flat.id);
  const oReqs  = STATE.requests.filter(r=>r.flatId===flat.id && getFlat(r.flatId)?.ownerId===STATE.currentUser.id);

  // Carousel HTML
  const carouselHtml = allPhotos.length>0 ? `
    <div class="carousel-wrap">
      <div class="carousel-label">Interior Photos</div>
      <div class="carousel">${allPhotos.map((p,i)=>`
        <div class="carousel-item" onclick="openLightbox(${i})">
          <img src="${p.url}" alt="${p.label}" />
          <div class="carousel-item-label">${p.label}</div>
        </div>`).join('')}
      </div>
    </div>` : '';

  // Video HTML
  const videoHtml = `
    <div class="video-wrap">
      <div class="video-label">Video Tour</div>
      ${photos.video
        ? `<div class="video-player"><video src="${photos.video}" controls ${photos.building?`poster="${photos.building}"`:''} ></video></div>`
        : `<div class="video-placeholder"><div class="video-placeholder-ico">🎬</div><div style="font-size:.82rem;color:var(--tm)">No video tour uploaded yet</div></div>`
      }
    </div>`;

  // Owner requests table
  const oReqsHtml = (STATE.currentUser.role==='owner' && oReqs.length>0) ? `
    <div class="detail-section">
      <h4 class="detail-sec-title">Booking Requests</h4>
      ${reqTableHtml(oReqs)}
    </div>` : '';

  // Booking sidebar
  let bookingAction = '';
  if (STATE.currentUser.role==='customer') {
    if (myReq) {
      const msgs = {pending:'⏳ Request Under Review', accepted:'🎉 Booking Accepted — Contact Owner', rejected:'✕ Request Not Accepted'};
      bookingAction = `<div class="req-status-box ${myReq.status}">${msgs[myReq.status]}</div>`;
    } else if (flat.status==='available') {
      bookingAction = `<button class="btn btn-gold" style="width:100%;justify-content:center;padding:14px;margin-bottom:8px" onclick="openRequestModal('${flat.id}')">Request Booking →</button>`;
    } else {
      bookingAction = `<div style="text-align:center;padding:12px;font-size:.82rem;color:var(--tm);font-style:italic">This property is currently rented</div>`;
    }
  }

  container.innerHTML = `
    <div class="detail-page">
      <button class="detail-back" onclick="closeDetail()">← Back to listings</button>

      <!-- HERO -->
      <div class="hero" id="hero-wrap">
        ${heroImages.length>0
          ? `<img id="hero-img" src="${heroImages[0]}" alt="${flat.title}" />`
          : `<div class="hero-fallback">🏢</div>`}
        <div class="hero-overlay"></div>
        <span class="hero-status ${flat.status}">${flat.status}</span>
        ${heroImages.length>1 ? `<div class="hero-dots" id="hero-dots">${heroImages.map((_,i)=>`<div class="hero-dot${i===0?' active':''}" onclick="setHeroIdx(${i})"></div>`).join('')}</div>` : ''}
        <div class="hero-info">
          <div><h2 class="hero-title">${flat.title}</h2><div class="hero-loc">📍 ${flat.location}</div></div>
          <div class="hero-price">${taka(flat.rent)} <span>/ month</span></div>
        </div>
      </div>

      <!-- DETAIL GRID -->
      <div class="detail-grid">
        <div>
          ${carouselHtml}
          ${videoHtml}
          <div class="detail-section">
            <h4 class="detail-sec-title">Property Details</h4>
            <div class="specs-grid">
              <div class="spec-item"><div class="spec-val">${flat.beds}</div><div class="spec-key">Bedrooms</div></div>
              <div class="spec-item"><div class="spec-val">${flat.baths}</div><div class="spec-key">Bathrooms</div></div>
              <div class="spec-item"><div class="spec-val">${flat.area} sqft</div><div class="spec-key">Floor Area</div></div>
              <div class="spec-item"><div class="spec-val">${taka(flat.rent)}</div><div class="spec-key">Monthly Rent</div></div>
            </div>
          </div>
          ${flat.description ? `<div class="detail-section"><h4 class="detail-sec-title">Description</h4><p class="desc-text">${flat.description}</p></div>` : ''}
          ${flat.facilities?.length ? `
            <div class="detail-section">
              <h4 class="detail-sec-title">Amenities & Facilities</h4>
              <div class="facilities">${flat.facilities.map(f=>`<span class="facility">✓ ${f}</span>`).join('')}</div>
            </div>` : ''}
          ${oReqsHtml}
        </div>

        <!-- SIDEBAR -->
        <div>
          <div class="booking-card">
            <div class="booking-price">${taka(flat.rent)} <span>/ month</span></div>
            <div style="margin-top:6px">${chipHtml(flat.status)}</div>
            <div class="booking-owner">
              <div class="booking-owner-av">${initials(owner?.name||'O')}</div>
              <div>
                <div class="booking-owner-name">${owner?.name||'Owner'}</div>
                <div class="booking-owner-lbl">Property Owner</div>
              </div>
            </div>
            ${bookingAction}
            <div class="sidebar-info">
              <div class="sidebar-info-row"><span>📐</span><span>${flat.area} sq ft</span></div>
              <div class="sidebar-info-row"><span>🛏</span><span>${flat.beds} Bedroom${flat.beds>1?'s':''}</span></div>
              <div class="sidebar-info-row"><span>🚿</span><span>${flat.baths} Bathroom${flat.baths>1?'s':''}</span></div>
              <div class="sidebar-info-row"><span>📍</span><span>${flat.location}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  // Start hero auto-rotate
  if (heroImages.length > 1) {
    STATE.heroIdx = 0;
    STATE.heroInterval = setInterval(() => {
      STATE.heroIdx = (STATE.heroIdx + 1) % heroImages.length;
      setHeroIdx(STATE.heroIdx, heroImages);
    }, 4500);
  }

  // Setup lightbox photos
  STATE.lbPhotos = allPhotos;
}

function setHeroIdx(idx, heroImages) {
  const flat   = getFlat(STATE.detailFlatId);
  const photos = getPhotos(flat.id);
  const all    = photos.building ? [photos.building, ...photos.interior.map(p=>p.url)] : photos.interior.map(p=>p.url);
  STATE.heroIdx = idx;
  const img = document.getElementById('hero-img');
  if (img) img.src = all[idx];
  document.querySelectorAll('.hero-dot').forEach((d,i) => d.classList.toggle('active', i===idx));
}

// ── LIGHTBOX ──────────────────────────────────────────────
function openLightbox(idx) {
  STATE.lbIdx = idx;
  updateLightbox();
  document.getElementById('lightbox').classList.remove('hidden');
}
function closeLightbox() { document.getElementById('lightbox').classList.add('hidden'); }
function updateLightbox() {
  const p = STATE.lbPhotos[STATE.lbIdx];
  document.getElementById('lb-img').src = p.url;
  document.getElementById('lb-counter').textContent = `${p.label} — ${STATE.lbIdx+1} / ${STATE.lbPhotos.length}`;
}
function lbPrev() { STATE.lbIdx = (STATE.lbIdx - 1 + STATE.lbPhotos.length) % STATE.lbPhotos.length; updateLightbox(); }
function lbNext() { STATE.lbIdx = (STATE.lbIdx + 1) % STATE.lbPhotos.length; updateLightbox(); }

// ── REQUEST / FLAT ACTIONS ────────────────────────────────
function handleRequest(reqId, action) {
  const req  = STATE.requests.find(r=>r.id===reqId);
  const flat = getFlat(req.flatId);
  req.status = action;
  if (action==='accepted') {
    flat.status = 'rented';
    pushNotif(req.customerId, `🎉 Your booking for "${flat.title}" was accepted! Contact the owner to proceed.`, 'success');
    showToast('Request accepted. Flat marked as rented.', 'success');
  } else {
    pushNotif(req.customerId, `Your booking for "${flat.title}" was not accepted. Please explore other listings.`, 'warn');
    showToast('Request declined.', 'error');
  }
  renderNavLinks();
  renderPage();
}

function deleteFlat(id) {
  STATE.flats    = STATE.flats.filter(f=>f.id!==id);
  STATE.requests = STATE.requests.filter(r=>r.flatId!==id);
  showToast('Listing removed.');
  renderNavLinks();
  renderPage();
}
