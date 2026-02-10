// auth-ui.js
// UI mínimo (injetado via JS) para login Email/Senha no Firebase Auth.
// Mantém o layout atual: elementos com position:fixed, sem alterar HTML/CSS existentes.

(function () {
  if (typeof window.firebase === 'undefined') {
    console.warn('[L7 Auth] Firebase não carregou.');
    return;
  }

  // Espera o firebase-sync inicializar o app; se não inicializou, seguimos assim mesmo.
  const auth = firebase.auth();

  // --------- Estilos (inline, sem depender de CSS do site) ---------
  const style = document.createElement('style');
  style.textContent = `
    .l7-auth-fab{position:fixed;right:14px;bottom:14px;z-index:99999;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
    .l7-auth-fab button{border:0;border-radius:999px;padding:10px 12px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.18);font-size:13px;line-height:1;}
    .l7-auth-fab .l7-auth-primary{background:#111827;color:#fff;}
    .l7-auth-fab .l7-auth-secondary{background:#ffffff;color:#111827;border:1px solid rgba(0,0,0,.08);margin-left:8px;}

    .l7-auth-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:99998;display:none;align-items:center;justify-content:center;padding:18px;}
    .l7-auth-modal{width:min(420px, 100%);background:#0b1220;color:#e5e7eb;border-radius:16px;box-shadow:0 24px 64px rgba(0,0,0,.45);overflow:hidden;}
    .l7-auth-head{padding:16px 16px 10px;border-bottom:1px solid rgba(255,255,255,.08)}
    .l7-auth-title{font-size:16px;font-weight:700;margin:0 0 4px;}
    .l7-auth-sub{font-size:12px;opacity:.85;margin:0;}
    .l7-auth-body{padding:14px 16px 16px;}
    .l7-auth-row{display:flex;gap:10px;margin:10px 0;}
    .l7-auth-row input{flex:1;min-width:0;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#fff;padding:10px 12px;outline:none;font-size:14px;}
    .l7-auth-tabs{display:flex;gap:8px;margin:10px 0 12px;}
    .l7-auth-tab{flex:1;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#e5e7eb;padding:9px 10px;cursor:pointer;font-size:13px;}
    .l7-auth-tab.active{background:#ffffff;color:#111827;border-color:rgba(255,255,255,.0)}
    .l7-auth-actions{display:flex;gap:10px;margin-top:12px;}
    .l7-auth-actions button{flex:1;border:0;border-radius:12px;padding:10px 12px;cursor:pointer;font-size:14px;}
    .l7-auth-actions .ok{background:#22c55e;color:#07110a;font-weight:700;}
    .l7-auth-actions .cancel{background:rgba(255,255,255,.08);color:#e5e7eb;}
    .l7-auth-msg{font-size:12px;margin-top:10px;min-height:16px;opacity:.92;}
    .l7-auth-link{color:#93c5fd;text-decoration:underline;cursor:pointer}
  `;
  document.head.appendChild(style);

  // --------- UI ---------
  const fab = document.createElement('div');
  fab.className = 'l7-auth-fab';

  const btnMain = document.createElement('button');
  btnMain.className = 'l7-auth-primary';
  btnMain.type = 'button';
  btnMain.textContent = '☁ Conta / Sync';

  const btnOut = document.createElement('button');
  btnOut.className = 'l7-auth-secondary';
  btnOut.type = 'button';
  btnOut.textContent = 'Sair';
  btnOut.style.display = 'none';

  fab.appendChild(btnMain);
  fab.appendChild(btnOut);
  document.body.appendChild(fab);

  const backdrop = document.createElement('div');
  backdrop.className = 'l7-auth-backdrop';

  const modal = document.createElement('div');
  modal.className = 'l7-auth-modal';
  modal.innerHTML = `
    <div class="l7-auth-head">
      <p class="l7-auth-title">Sincronizar entre PC e celular</p>
      <p class="l7-auth-sub">Entre com a mesma conta nos dois dispositivos.</p>
    </div>
    <div class="l7-auth-body">
      <div class="l7-auth-tabs">
        <button class="l7-auth-tab active" data-mode="login" type="button">Entrar</button>
        <button class="l7-auth-tab" data-mode="signup" type="button">Criar conta</button>
      </div>

      <div class="l7-auth-row">
        <input id="l7-auth-email" type="email" placeholder="Email" autocomplete="email" />
      </div>
      <div class="l7-auth-row">
        <input id="l7-auth-pass" type="password" placeholder="Senha" autocomplete="current-password" />
      </div>

      <div class="l7-auth-actions">
        <button class="ok" id="l7-auth-go" type="button">Continuar</button>
        <button class="cancel" id="l7-auth-cancel" type="button">Fechar</button>
      </div>

      <div class="l7-auth-msg" id="l7-auth-msg"></div>
      <div class="l7-auth-msg" style="opacity:.8">
        Dica: se você já usou o site sem login, criar conta vai manter seus dados (vincula sua sessão atual).
      </div>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  const emailEl = modal.querySelector('#l7-auth-email');
  const passEl = modal.querySelector('#l7-auth-pass');
  const msgEl = modal.querySelector('#l7-auth-msg');
  const goEl = modal.querySelector('#l7-auth-go');
  const cancelEl = modal.querySelector('#l7-auth-cancel');
  const tabs = Array.from(modal.querySelectorAll('.l7-auth-tab'));

  let mode = 'login';

  function setMode(m) {
    mode = m;
    tabs.forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
    msgEl.textContent = '';
    goEl.textContent = mode === 'signup' ? 'Criar' : 'Entrar';
    passEl.autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
  }

  tabs.forEach(t => t.addEventListener('click', () => setMode(t.dataset.mode)));

  function open() {
    backdrop.style.display = 'flex';
    setTimeout(() => emailEl && emailEl.focus(), 50);
  }
  function close() {
    backdrop.style.display = 'none';
    msgEl.textContent = '';
  }

  btnMain.addEventListener('click', open);
  cancelEl.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

  function humanError(err) {
    const code = (err && err.code) ? String(err.code) : '';
    if (code.includes('auth/invalid-email')) return 'Email inválido.';
    if (code.includes('auth/user-not-found')) return 'Conta não encontrada.';
    if (code.includes('auth/wrong-password')) return 'Senha incorreta.';
    if (code.includes('auth/weak-password')) return 'Senha fraca (mínimo 6 caracteres).';
    if (code.includes('auth/email-already-in-use')) return 'Esse email já está em uso.';
    if (code.includes('auth/too-many-requests')) return 'Muitas tentativas. Aguarde e tente novamente.';
    return (err && err.message) ? err.message : 'Erro ao autenticar.';
  }

  async function doAuth() {
    const email = (emailEl.value || '').trim();
    const pass = (passEl.value || '').trim();

    if (!email || !pass) {
      msgEl.textContent = 'Preencha email e senha.';
      return;
    }

    goEl.disabled = true;
    msgEl.textContent = 'Processando...';

    try {
      if (mode === 'login') {
        await auth.signInWithEmailAndPassword(email, pass);
      } else {
        // Criar conta: se estiver anonimo, tenta vincular (mantém UID e dados)
        const user = auth.currentUser;
        if (user && user.isAnonymous) {
          const cred = firebase.auth.EmailAuthProvider.credential(email, pass);
          await user.linkWithCredential(cred);
        } else {
          await auth.createUserWithEmailAndPassword(email, pass);
        }
      }

      msgEl.textContent = 'OK! Logado. Agora entre com a mesma conta no outro dispositivo.';
      setTimeout(close, 650);
    } catch (err) {
      msgEl.textContent = humanError(err);
    } finally {
      goEl.disabled = false;
    }
  }

  goEl.addEventListener('click', doAuth);
  passEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doAuth();
  });

  btnOut.addEventListener('click', async () => {
    try {
      await auth.signOut();
      // Ao sair, o firebase-sync pode voltar pro anônimo (dependendo da lógica).
    } catch (e) {
      console.warn('[L7 Auth] Erro ao sair:', e);
    }
  });

  // Atualiza estado do botão
  auth.onAuthStateChanged((user) => {
    if (user && !user.isAnonymous) {
      btnMain.textContent = '☁ ' + (user.email || 'Logado');
      btnOut.style.display = '';
    } else {
      btnMain.textContent = '☁ Conta / Sync';
      btnOut.style.display = 'none';
    }
  });
})();
