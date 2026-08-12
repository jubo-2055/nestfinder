// ══════════════════════════════════════
//  NestFinder — Modals (fixed image loading)
// ══════════════════════════════════════

function openModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-content').innerHTML = '';
}
function closeModalIfOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

// ── FLAT MODAL (Add / Edit) ───────────────────────────────
let modalInteriorPhotos = [];

function openFlatModal(flatId) {
  const flat   = flatId ? getFlat(flatId) : null;
  const photos = flatId ? getPhotos(flatId) : {building:null, interior:[], video:null};
  modalInteriorPhotos = photos.interior ? [...photos.interior] : [];

  const buildingVal = photos.building || '';

  openModal(`
    <h3 class="modal-title">${flat ? 'Edit Property' : 'List a Property'}</h3>
    <p class="modal-sub">${flat ? 'Update your listing details' : 'Add a new rental to NestFinder'}</p>

    <div class="field"><label class="field-label">Property Title *</label>
      <input class="nf-input" id="m-title" value="${flat?.title||''}" placeholder="e.g. Spacious 3-Bedroom Apartment" /></div>
    <div class="field"><label class="field-label">Location *</label>
      <input class="nf-input" id="m-loc" value="${flat?.location||''}" placeholder="e.g. Gulshan-2, Dhaka" /></div>
    <div class="field"><label class="field-label">Monthly Rent (৳) *</label>
      <input class="nf-input" id="m-rent" type="number" value="${flat?.rent||''}" placeholder="35000" /></div>
    <div class="grid-3">
      <div class="field"><label class="field-label">Bedrooms</label>
        <input class="nf-input" id="m-beds" type="number" min="1" value="${flat?.beds||2}" /></div>
      <div class="field"><label class="field-label">Bathrooms</label>
        <input class="nf-input" id="m-baths" type="number" min="1" value="${flat?.baths||1}" /></div>
      <div class="field"><label class="field-label">Area (sqft)</label>
        <input class="nf-input" id="m-area" type="number" value="${flat?.area||''}" placeholder="1200" /></div>
    </div>
    <div class="field"><label class="field-label">Facilities (comma separated)</label>
      <input class="nf-input" id="m-fac" value="${flat?.facilities?.join(', ')||''}" placeholder="AC, Parking, Generator…" /></div>
    <div class="field"><label class="field-label">Description</label>
      <textarea class="nf-input" id="m-desc" rows="2" style="resize:vertical">${flat?.description||''}</textarea></div>

    <!-- MEDIA SECTION -->
    <div class="media-section">
      <div class="media-section-title">📸 Property Media</div>

      <!-- IMPORTANT TIP -->
      <div style="background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.25);border-radius:8px;padding:11px 14px;margin-bottom:16px;font-size:.76rem;line-height:1.65;color:var(--td);">
        <div style="color:var(--gold);font-weight:700;margin-bottom:4px;">⚠️ How to add photos correctly</div>
        Only <strong style="color:#fff">direct image URLs</strong> work (ending in <code style="color:var(--gold)">.jpg</code> <code style="color:var(--gold)">.png</code> <code style="color:var(--gold)">.webp</code>).<br/>
        ❌ <span style="color:var(--danger)">Pinterest, Facebook, Instagram</span> links will NOT load — they block embedding.<br/>
        ✅ Use free sites:
        <a href="https://unsplash.com" target="_blank" style="color:var(--gold);text-decoration:underline">Unsplash.com</a> →
        open any photo → right-click → <em>Copy image address</em><br/>
        ✅ Or upload your photo to
        <a href="https://imgbb.com" target="_blank" style="color:var(--gold);text-decoration:underline">imgbb.com</a>
        and copy the <strong style="color:#fff">Direct link</strong>.
      </div>

      <!-- BUILDING URL -->
      <div class="field">
        <label class="field-label">Building / Exterior Photo URL</label>
        <input class="nf-input" id="m-building"
          value="${buildingVal}"
          placeholder="https://images.unsplash.com/photo-…?w=900&q=80"
          oninput="previewBuilding(this.value)" />
      </div>
      <!-- Preview area -->
      <div id="m-building-preview-wrap" style="margin-bottom:14px">
        ${buildingVal
          ? `<img id="m-building-preview" style="width:100%;height:120px;object-fit:cover;border-radius:6px;display:block;border:1px solid var(--borderl)"
               src="${buildingVal}" alt="Building Preview"
               onerror="showImgError('m-building-preview-wrap')" />`
          : ''
        }
      </div>

      <!-- INTERIOR PHOTOS -->
      <label class="field-label" style="display:block;margin-bottom:8px">Interior Photos</label>
      <div class="add-photo-row">
        <input class="nf-input" id="m-photo-url"   placeholder="https://images.unsplash.com/…" />
        <input class="nf-input label-inp" id="m-photo-lbl" placeholder="Label (Living Room…)" />
        <button class="btn btn-gold btn-sm" onclick="addInteriorPhoto()">Add</button>
      </div>
      <div id="m-thumbs" class="thumb-list">${renderModalThumbs()}</div>

      <!-- VIDEO -->
      <div class="field" style="margin-top:14px">
        <label class="field-label">🎬 Video Tour URL (direct MP4 link)</label>
        <input class="nf-input" id="m-video" value="${photos.video||''}" placeholder="https://… (optional)" />
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn-gold" onclick="saveFlat('${flatId||''}')">${flat ? 'Save Changes' : 'Publish Listing'}</button>
    </div>
  `);
}

// Show error when image fails to load
function showImgError(wrapId) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  wrap.innerHTML = `
    <div style="
      background:rgba(224,92,92,.1);border:1px dashed rgba(224,92,92,.4);
      border-radius:8px;padding:14px;text-align:center;
      font-size:.78rem;color:var(--danger);margin-bottom:14px">
      ❌ <strong>Image could not load.</strong><br/>
      <span style="color:var(--td)">This URL is blocked or not a direct image link.<br/>
      Try right-clicking an image on Unsplash → <em>Copy image address</em>.</span>
    </div>`;
}

// Preview building photo as user types — with error handling
function previewBuilding(url) {
  const wrap = document.getElementById('m-building-preview-wrap');
  if (!wrap) return;
  const trimmed = url.trim();
  if (!trimmed) { wrap.innerHTML = ''; return; }

  wrap.innerHTML = `
    <img id="m-building-preview"
      style="width:100%;height:120px;object-fit:cover;border-radius:6px;display:block;border:1px solid var(--borderl);margin-bottom:4px"
      src="${trimmed}" alt="Building Preview"
      onerror="showImgError('m-building-preview-wrap')" />`;
}

// Render interior photo thumbnails
function renderModalThumbs() {
  if (modalInteriorPhotos.length === 0) return '';
  return modalInteriorPhotos.map((p, i) => `
    <div class="thumb" title="${p.label}">
      <img src="${p.url}" alt="${p.label}"
        onerror="this.style.background='var(--navy)';this.style.opacity='.3'" />
      <button class="thumb-del" onclick="removeInteriorPhoto(${i})">✕</button>
    </div>`).join('');
}

function addInteriorPhoto() {
  const url = document.getElementById('m-photo-url').value.trim();
  const lbl = document.getElementById('m-photo-lbl').value.trim();
  if (!url) { showToast('Please enter a photo URL first.', 'error'); return; }
  modalInteriorPhotos.push({ url, label: lbl || `Photo ${modalInteriorPhotos.length + 1}` });
  document.getElementById('m-thumbs').innerHTML = renderModalThumbs();
  document.getElementById('m-photo-url').value = '';
  document.getElementById('m-photo-lbl').value = '';
}

function removeInteriorPhoto(idx) {
  modalInteriorPhotos.splice(idx, 1);
  document.getElementById('m-thumbs').innerHTML = renderModalThumbs();
}

function saveFlat(flatId) {
  const title = document.getElementById('m-title').value.trim();
  const loc   = document.getElementById('m-loc').value.trim();
  const rent  = document.getElementById('m-rent').value.trim();
  if (!title || !loc || !rent) { showToast('Please fill in Title, Location and Rent.', 'error'); return; }

  const data = {
    title, location: loc, rent: +rent,
    beds:  +document.getElementById('m-beds').value  || 1,
    baths: +document.getElementById('m-baths').value || 1,
    area:  +document.getElementById('m-area').value  || 0,
    facilities:  document.getElementById('m-fac').value.split(',').map(s => s.trim()).filter(Boolean),
    description: document.getElementById('m-desc').value.trim(),
  };
  const media = {
    building: document.getElementById('m-building').value.trim() || null,
    interior: [...modalInteriorPhotos],
    video:    document.getElementById('m-video').value.trim() || null,
  };

  if (flatId) {
    const flat = getFlat(flatId);
    Object.assign(flat, data);
    STATE.photoSets[flatId] = media;
    showToast('Property updated successfully.', 'success');
  } else {
    const id = uid();
    STATE.flats.push({ ...data, id, ownerId: STATE.currentUser.id, status: 'available' });
    STATE.photoSets[id] = media;
    showToast('Property listed on NestFinder!', 'success');
  }
  closeModal();
  renderNavLinks();
  renderPage();
}

// ── REQUEST MODAL ─────────────────────────────────────────
function openRequestModal(flatId) {
  const flat = getFlat(flatId);
  if (!flat) return;
  openModal(`
    <h3 class="modal-title">Send Booking Request</h3>
    <p class="modal-sub">Your request will be reviewed by the property owner</p>
    <div style="background:var(--navy3);border:1px solid var(--borderl);border-radius:var(--r-sm);padding:14px 16px;margin-bottom:20px">
      <div style="font-weight:600;color:#fff;margin-bottom:4px">${flat.title}</div>
      <div style="font-size:.8rem;color:var(--tm);margin-bottom:6px">📍 ${flat.location}</div>
      <div style="color:var(--gold);font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700">
        ${taka(flat.rent)} <span style="font-size:.75rem;font-family:'Jost',sans-serif;color:var(--tm);font-weight:300">/month</span>
      </div>
    </div>
    <div class="field"><label class="field-label">Message to Owner (optional)</label>
      <textarea class="nf-input" id="req-msg" rows="4" style="resize:vertical"
        placeholder="Introduce yourself, mention move-in date, duration of stay…"></textarea></div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn-gold" onclick="submitRequest('${flatId}')">Send Request →</button>
    </div>
  `);
}

function submitRequest(flatId) {
  const flat = getFlat(flatId);
  const u    = STATE.currentUser;
  if (STATE.requests.find(r => r.flatId === flatId && r.customerId === u.id)) {
    showToast('You already sent a request for this property.', 'error');
    closeModal(); return;
  }
  const msg = document.getElementById('req-msg').value.trim();
  STATE.requests.push({ id:uid(), flatId, customerId:u.id, customerName:u.name, message:msg, status:'pending', date:todayStr() });
  pushNotif(flat.ownerId, `New booking request from ${u.name} for "${flat.title}".`, 'warn');
  pushNotif(u.id, `Your request for "${flat.title}" has been submitted.`, 'info');
  closeModal();
  showToast('Booking request sent successfully!', 'success');
  renderNavLinks();
  renderPage();
}
