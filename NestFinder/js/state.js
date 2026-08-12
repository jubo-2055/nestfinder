// ══════════════════════════════════════
//  NestFinder — Global State & Helpers
// ══════════════════════════════════════

// Deep clone seed data so mutations don't affect originals
let STATE = {
  users:     JSON.parse(JSON.stringify(USERS_SEED)),
  flats:     JSON.parse(JSON.stringify(FLATS_SEED)),
  photoSets: JSON.parse(JSON.stringify(PHOTO_SETS_SEED)),
  requests:  JSON.parse(JSON.stringify(REQUESTS_SEED)),
  notifs:    JSON.parse(JSON.stringify(NOTIFS_SEED)),
  currentUser: null,
  currentPage: 'browse',
  detailFlatId: null,
  authMode: 'login',
  selectedRole: 'owner',
  heroInterval: null,
  heroIdx: 0,
  lbPhotos: [],
  lbIdx: 0,
};

// ── Helpers ──────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2,9); }
function nowStr() { return new Date().toISOString().slice(0,16).replace('T',' '); }
function todayStr() { return new Date().toISOString().slice(0,10); }
function taka(n) { return '৳' + Number(n).toLocaleString(); }
function initials(name='') { return (name||'').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase(); }
function chipHtml(status) {
  return `<span class="chip ${status}"><span class="chip-dot"></span>${status.charAt(0).toUpperCase()+status.slice(1)}</span>`;
}
function getFlat(id) { return STATE.flats.find(f=>f.id===id); }
function getUser(id) { return STATE.users.find(u=>u.id===id); }
function getPhotos(id) { return STATE.photoSets[id] || {building:null,interior:[],video:null}; }
function myRequests() { return STATE.requests.filter(r=>r.customerId===STATE.currentUser?.id); }
function ownerRequests() { return STATE.requests.filter(r=>{ const f=getFlat(r.flatId); return f?.ownerId===STATE.currentUser?.id; }); }
function myNotifs() { return STATE.notifs.filter(n=>n.userId===STATE.currentUser?.id); }
function pushNotif(userId, text, type) {
  STATE.notifs.push({ id:uid(), userId, text, type, time:nowStr() });
}

// ── Toast ─────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, type='default') {
  const el = document.getElementById('toast');
  el.className = 'toast ' + type;
  el.innerHTML = `<div class="toast-bar"></div><span>${type==='success'?'✓ ':type==='error'?'✕ ':''}${msg}</span>`;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 3200);
}
