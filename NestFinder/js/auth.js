// ══════════════════════════════════════
//  NestFinder — Auth Logic
// ══════════════════════════════════════

function selectRole(role) {
  STATE.selectedRole = role;
  document.querySelectorAll('.role-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.role === role);
  });
}

function toggleAuthMode() {
  STATE.authMode = STATE.authMode === 'login' ? 'register' : 'login';
  const isReg = STATE.authMode === 'register';
  document.getElementById('auth-title').textContent   = isReg ? 'Create Account' : 'Sign In';
  document.getElementById('auth-sub').textContent     = isReg ? 'Join thousands of owners and tenants' : 'Access your NestFinder dashboard';
  document.getElementById('auth-btn-text').textContent= isReg ? 'Create My Account →' : 'Sign In to Dashboard →';
  document.getElementById('auth-sw-text').textContent = isReg ? 'Already have an account?' : 'New to NestFinder?';
  document.getElementById('auth-sw-btn').textContent  = isReg ? 'Sign in' : 'Create account';
  document.getElementById('field-name').classList.toggle('hidden', !isReg);
  document.getElementById('field-phone').classList.toggle('hidden', !isReg);
  document.getElementById('demo-hint').classList.toggle('hidden', isReg);
  // clear inputs
  ['inp-name','inp-email','inp-phone','inp-password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function handleAuth() {
  const email    = document.getElementById('inp-email').value.trim();
  const password = document.getElementById('inp-password').value.trim();
  const role     = STATE.selectedRole;

  if (STATE.authMode === 'login') {
    const u = STATE.users.find(x => x.email===email && x.password===password && x.role===role);
    if (!u) { showToast('Invalid credentials. Check email, password & role.', 'error'); return; }
    loginSuccess(u);
  } else {
    const name  = document.getElementById('inp-name').value.trim();
    const phone = document.getElementById('inp-phone').value.trim();
    if (!name || !email || !password) { showToast('Please fill in all fields.', 'error'); return; }
    if (STATE.users.find(u => u.email===email)) { showToast('Email already registered.', 'error'); return; }
    const u = { id:uid(), name, email, phone, password, role };
    STATE.users.push(u);
    loginSuccess(u);
  }
}

function loginSuccess(u) {
  STATE.currentUser = u;
  STATE.currentPage = u.role==='admin' ? 'admin' : u.role==='owner' ? 'my-flats' : 'browse';
  document.getElementById('auth-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  setupNav();
  renderPage();
  showToast(`Welcome back, ${u.name}!`, 'success');
}

function logout() {
  STATE.currentUser = null;
  STATE.currentPage = 'browse';
  STATE.detailFlatId = null;
  if (STATE.heroInterval) { clearInterval(STATE.heroInterval); STATE.heroInterval = null; }
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('auth-page').classList.remove('hidden');
  // reset form
  STATE.authMode = 'login';
  document.getElementById('auth-title').textContent    = 'Sign In';
  document.getElementById('auth-sub').textContent      = 'Access your NestFinder dashboard';
  document.getElementById('auth-btn-text').textContent = 'Sign In to Dashboard →';
  document.getElementById('auth-sw-text').textContent  = 'New to NestFinder?';
  document.getElementById('auth-sw-btn').textContent   = 'Create account';
  document.getElementById('field-name').classList.add('hidden');
  document.getElementById('field-phone').classList.add('hidden');
  document.getElementById('demo-hint').classList.remove('hidden');
  ['inp-name','inp-email','inp-phone','inp-password'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  selectRole('owner');
}
