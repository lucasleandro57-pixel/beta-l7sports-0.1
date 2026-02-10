// firebase-sync.js
// Sincroniza o banco local (localStorage) com o Firebase Realtime Database.
// Objetivo: adicionar salvamento em nuvem SEM alterar layout/fluxos atuais.

(function () {
  const PATIENTS_KEY = 'l7_treino_pacientes';
  const UPDATED_AT_KEY = 'l7_treino_lastUpdated';

  // ====== CONFIG DO FIREBASE (fornecida pelo usuário) ======
  const firebaseConfig = {
    apiKey: "AIzaSyAMsRMDNjE869n8GrwAnX2hmaL1r7qFp0A",
    authDomain: "l7sports.firebaseapp.com",
    databaseURL: "https://l7sports-default-rtdb.firebaseio.com",
    projectId: "l7sports",
    storageBucket: "l7sports.firebasestorage.app",
    messagingSenderId: "729669720710",
    appId: "1:729669720710:web:69d2c799769d63705e4f07"
  };

  // Se o Firebase CDN não carregou, aborta silenciosamente (mantém site funcionando offline)
  if (typeof window.firebase === 'undefined') {
    console.warn('[L7 Cloud] Firebase não carregou. Rodando apenas com localStorage.');
    return;
  }

  // Evita dupla inicialização
  try {
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
  } catch (e) {
    console.warn('[L7 Cloud] Erro ao inicializar Firebase (provavelmente já inicializado):', e);
  }

  const auth = firebase.auth();
  const db = firebase.database();

  // Estado interno
  let uid = null;
  let attemptedAnon = false;
  let readyResolve;
  const ready = new Promise((res) => (readyResolve = res));
  let applyingRemote = false; // evita loop de escrita quando aplicar atualização remota
  let saveTimer = null;

  function getLocalUpdatedAt() {
    const v = Number(localStorage.getItem(UPDATED_AT_KEY) || 0);
    return Number.isFinite(v) ? v : 0;
  }

  function setLocalUpdatedAt(ts) {
    try { localStorage.setItem(UPDATED_AT_KEY, String(ts || Date.now())); } catch (_) {}
  }

  function safeParsePatients(raw) {
    try {
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function getLocalPatients() {
    return safeParsePatients(localStorage.getItem(PATIENTS_KEY));
  }

  function setLocalPatients(patients, updatedAt) {
    applyingRemote = true;
    try {
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(Array.isArray(patients) ? patients : []));
      setLocalUpdatedAt(updatedAt || Date.now());
    } finally {
      applyingRemote = false;
    }
  }

  function userRef() {
    return db.ref('users').child(uid).child('patients');
  }

  async function pushLocalToCloud() {
    if (!uid) return;
    const patients = getLocalPatients();
    const updatedAt = getLocalUpdatedAt() || Date.now();
    try {
      await userRef().set({ patients, updatedAt });
    } catch (e) {
      console.warn('[L7 Cloud] Falha ao salvar no Firebase:', e);
    }
  }

  async function applyInitialSync() {
    if (!uid) return;
    try {
      const snap = await userRef().get();
      const remote = snap.exists() ? snap.val() : null;

      const localUpdatedAt = getLocalUpdatedAt();
      const localPatients = getLocalPatients();

      if (remote && typeof remote === 'object') {
        const remoteUpdatedAt = Number(remote.updatedAt || 0) || 0;
        const remotePatients = Array.isArray(remote.patients) ? remote.patients : [];

        // Regra simples de conflito: vence quem tem updatedAt maior
        if (!localUpdatedAt && localPatients.length === 0 && remotePatients.length > 0) {
          setLocalPatients(remotePatients, remoteUpdatedAt);
        } else if (remoteUpdatedAt > localUpdatedAt) {
          setLocalPatients(remotePatients, remoteUpdatedAt);
        } else if (localUpdatedAt > remoteUpdatedAt) {
          await pushLocalToCloud();
        }
      } else {
        // Se não existe nada na nuvem, sobe o que já tem no local
        if (localPatients.length > 0) {
          await pushLocalToCloud();
        }
      }

      // Listener de mudanças remotas (multi-dispositivo)
      userRef().on('value', (s) => {
        const val = s.val();
        if (!val || typeof val !== 'object') return;

        const remoteUpdatedAt = Number(val.updatedAt || 0) || 0;
        const localUpdatedAtNow = getLocalUpdatedAt();
        if (remoteUpdatedAt && remoteUpdatedAt > localUpdatedAtNow) {
          const remotePatients = Array.isArray(val.patients) ? val.patients : [];
          setLocalPatients(remotePatients, remoteUpdatedAt);
          // Tenta atualizar a tela da página atual sem recarregar o layout
          refreshCurrentPage();
        }
      });
    } catch (e) {
      console.warn('[L7 Cloud] Falha ao sincronizar com Firebase:', e);
    }
  }

  function refreshCurrentPage() {
    // Chamadas seguras: só executa se a função existir
    try {
      if (typeof window.loadHomePatients === 'function') window.loadHomePatients();
      if (typeof window.loadPatients === 'function') window.loadPatients();
      if (typeof window.initializeWorkoutPage === 'function') window.initializeWorkoutPage();
      if (typeof window.renderHomeList === 'function') window.renderHomeList();
      if (typeof window.renderPatientList === 'function') window.renderPatientList();
    } catch (_) {
      // não atrapalha o site
    }
  }

  // ====== Patch: intercepta setItem do localStorage para espelhar no Firebase ======
  const originalSetItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (key, value) {
    originalSetItem(key, value);

    if (key !== PATIENTS_KEY) return;
    if (applyingRemote) return; // não sobe mudanças que vieram da nuvem

    // Marca timestamp local e faz upload com debounce
    const now = Date.now();
    try { originalSetItem(UPDATED_AT_KEY, String(now)); } catch (_) {}

    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (!uid) return;
      const patients = safeParsePatients(value);
      userRef().set({ patients, updatedAt: now }).catch((e) => {
        console.warn('[L7 Cloud] Falha ao salvar no Firebase:', e);
      });
    }, 600);
  };

  // ====== Auth + sync ======
  // Estratégia:
  // - Se o usuário já estiver logado (Email/Senha), usamos esse UID (sincroniza entre dispositivos).
  // - Se não estiver, fazemos login anônimo automaticamente para manter o fluxo atual (sem exigir login).
  // - O auth-ui.js permite "vincular" o anônimo a uma conta (linkWithCredential), preservando UID/dados.
  auth.onAuthStateChanged(async (user) => {
    if (user && user.uid) {
      uid = user.uid;
      await applyInitialSync();
      readyResolve(true);
      refreshCurrentPage();
      return;
    }

    // Sem usuário: entra anonimamente uma vez para manter o site funcionando.
    if (!attemptedAnon) {
      attemptedAnon = true;
      auth.signInAnonymously().catch((e) => {
        console.warn('[L7 Cloud] Não foi possível autenticar anonimamente:', e);
      });
    }
  });

  // Expondo um pequeno API global (útil para debug)
  window.L7Cloud = {
    ready,
    getUid: () => uid,
    pushLocalToCloud,
  };
})();
