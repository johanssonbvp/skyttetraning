// Sync Manager for Firebase
//
// Gemensamt datalager för alla träningssidor.
// Sidorna anropar som förut saveToFirebase('pt_...', data). Härifrån sköts:
//   1. Sparning lokalt (alltid först, så inget försvinner offline)
//   2. Översättning till rätt sökväg i databasen
//   3. Sammanslagning av telefonen och molnet (inga pass tappas)
//   4. Radering (markeringar för raderade poster, så de inte kommer tillbaka)
//   5. Ny sändning till molnet när nätet är tillbaka

// OBS: ingen egen variabel som heter firebase här, annars skuggas Firebase-biblioteket på startsidan
let database;
let trainerCode;

// ===== VILKA DATA SOM SYNKAS =====
// Nyckeln är namnet i telefonen (localStorage), path är platsen i databasen.
// type 'list'    = lista med poster (pass, matcher, inlägg)
// type 'records' = rekord (ett värde per övning, bästa värdet vinner)
// strip          = fält som INTE skickas till molnet (t.ex. foton, bara text sparas)
const SYNC_KEYS = {
  pt_h:            { path: 'shooting/history',    type: 'list' },
  pt_lagg_history: { path: 'pointing/history',    type: 'list' },
  pt_lagg_records: { path: 'pointing/records',    type: 'records' },
  pt_dagbok:       { path: 'diary',               type: 'list', strip: ['photo'] },
  pt_precision_v2: { path: 'precision/history',   type: 'list' },
  pt_matches_v2:   { path: 'competition/history', type: 'list' },
  pt_warmup_v1:    { path: 'warmup/history',      type: 'list' }
};

const SYNC_META_KEY = 'pt_sync_meta';   // raderade poster, rensningar, väntande synk
const SYNC_TIMEOUT_MS = 10000;          // så länge väntar vi på databasen innan vi ger upp
let syncStarted = false;

// ===== SMÅ HJÄLPFUNKTIONER =====
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('Kunde inte spara lokalt:', key, e);
    return false;
  }
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise(function(_, reject) {
      setTimeout(function() { reject(new Error('Tidsgräns nådd')); }, ms);
    })
  ]);
}

// Firebase-nycklar får inte innehålla . : $ # [ ] / så vi byter ut dem
function safeId(value) {
  return String(value).replace(/[^A-Za-z0-9_-]/g, '_');
}

// Vad som identifierar en post: id om det finns, annars datum
function recKey(r) {
  if (r.id !== undefined && r.id !== null) return r.id;
  if (r.date !== undefined && r.date !== null) return r.date;
  return JSON.stringify(r);
}

// Tidpunkt för en post i millisekunder (används för sortering och rensning)
function recTs(r) {
  if (typeof r.id === 'number') return r.id;
  if (typeof r.date === 'number') return r.date;
  const t = Date.parse(r.created || r.date);
  return isNaN(t) ? 0 : t;
}

function recScore(r) {
  return Number(r.pct !== undefined ? r.pct : r.val) || 0;
}

// Gör om det som kommer från databasen till en vanlig lista
function toList(value) {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : (typeof value === 'object' ? Object.values(value) : []);
  return arr.filter(function(r) { return r && typeof r === 'object'; });
}

function isEmptyData(data) {
  if (!data) return true;
  if (Array.isArray(data)) return data.length === 0;
  return typeof data === 'object' && Object.keys(data).length === 0;
}

function loadMeta() {
  const m = readJSON(SYNC_META_KEY, {});
  m.deleted = m.deleted || {};      // { nyckel: { postId: tidpunkt } }
  m.clearedAt = m.clearedAt || {};  // { nyckel: tidpunkt då allt rensades }
  m.dirty = m.dirty || {};          // { nyckel: true } = väntar på att skickas
  return m;
}

function saveMeta(meta) {
  writeJSON(SYNC_META_KEY, meta);
}

// ===== VILKA POSTER SIDAN "KÄNNER TILL" =====
// Tas direkt när filen laddas, innan sidan hunnit läsa sina data.
// Behövs för att veta vad användaren faktiskt har raderat (och inte bara
// poster från en annan telefon som sidan ännu inte har sett).
const knownKeys = {};

function setKnown(key, value) {
  knownKeys[key] = new Set(toList(value).map(function(r) { return safeId(recKey(r)); }));
}

Object.keys(SYNC_KEYS).forEach(function(key) {
  if (SYNC_KEYS[key].type === 'list') setKnown(key, readJSON(key, []));
});

// ===== SAMMANSLAGNING =====
// Lista: alla poster från telefonen och molnet, utan dubbletter.
// Raderade och rensade poster tas bort. Telefonens version vinner
// (den kan ha foton som aldrig skickas till molnet).
function mergeList(local, cloud, deleted, clearedAt) {
  const map = new Map();

  function add(r, preferThis) {
    const id = safeId(recKey(r));
    if (deleted[id]) return;
    if (clearedAt && recTs(r) <= clearedAt) return;
    if (!map.has(id) || preferThis) map.set(id, r);
  }

  toList(cloud).forEach(function(r) { add(r, false); });
  toList(local).forEach(function(r) { add(r, true); });

  return Array.from(map.values()).sort(function(a, b) { return recTs(b) - recTs(a); });
}

// Rekord: för varje övning behålls det bästa värdet
function mergeRecords(local, cloud, clearedAt) {
  const a = (local && typeof local === 'object') ? local : {};
  const b = (cloud && typeof cloud === 'object') ? cloud : {};
  const out = {};

  new Set(Object.keys(a).concat(Object.keys(b))).forEach(function(k) {
    const candidates = [a[k], b[k]].filter(function(r) {
      return r && typeof r === 'object' && !(clearedAt && recTs(r) <= clearedAt);
    });
    if (!candidates.length) return;
    out[k] = candidates.reduce(function(best, r) {
      if (recScore(r) > recScore(best)) return r;
      if (recScore(r) === recScore(best) && recTs(r) > recTs(best)) return r;
      return best;
    });
  });

  return out;
}

// Det som skickas till molnet: rensat från tomma värden och fält som inte ska med
function cleanForCloud(cfg, data) {
  const copy = JSON.parse(JSON.stringify(data));
  if (cfg && cfg.strip && Array.isArray(copy)) {
    copy.forEach(function(r) {
      cfg.strip.forEach(function(field) { delete r[field]; });
    });
  }
  return copy;
}

// ===== STARTA SYNK =====
function initSyncManager(firebaseConfig) {
  try {
    const fb = window.firebase;

    // Initiera bara om ingen app finns ännu
    if (!fb.apps || !fb.apps.length) {
      fb.initializeApp(firebaseConfig);
    }

    database = fb.database();
    trainerCode = localStorage.getItem('pt_trainer_code');

    if (trainerCode) {
      console.log('✅ Sync initialized:', trainerCode);
      updateSyncBadge(true);
      if (!syncStarted) {
        syncStarted = true;
        syncAllKeys();
      }
    } else {
      console.log('✅ Sync Manager ready (no trainer code yet)');
    }
  } catch (error) {
    console.error('Sync Manager error:', error);
  }
}

function syncAllKeys() {
  Object.keys(SYNC_KEYS).forEach(function(key) { syncKey(key); });
}

// ===== SPARA =====
function saveToFirebase(path, data) {
  // Spara ALLTID lokalt först, så att sidan har rätt data efter omladdning
  // och så att inget försvinner om du är offline. Molnet kommer efteråt.
  writeJSON(path, data);

  const cfg = SYNC_KEYS[path];

  // Okänd nyckel: gammalt beteende, skriv rakt till molnet under nyckelns namn
  if (!cfg) {
    if (database && trainerCode) {
      database.ref('coaches/' + trainerCode + '/' + path).set(cleanForCloud(null, data))
        .then(function() { updateSyncBadge(true); })
        .catch(function(error) { console.error('Error:', error); updateSyncBadge(false); });
    }
    return;
  }

  const meta = loadMeta();
  const now = Date.now();

  if (isEmptyData(data)) {
    // "Rensa allt": inget som skapats före nu ska komma tillbaka
    meta.clearedAt[path] = now;
  } else if (cfg.type === 'list') {
    // Poster som sidan kände till men som nu saknas har raderats
    const newKeys = new Set(toList(data).map(function(r) { return safeId(recKey(r)); }));
    const known = knownKeys[path] || new Set();
    meta.deleted[path] = meta.deleted[path] || {};
    known.forEach(function(id) {
      if (!newKeys.has(id)) meta.deleted[path][id] = now;
    });
  }

  if (cfg.type === 'list') setKnown(path, data);
  meta.dirty[path] = true;
  saveMeta(meta);

  syncKey(path);
}

// ===== SYNKA EN NYCKEL =====
// Körs en i taget per nyckel så att två sparningar inte krockar.
const syncChains = {};

function syncKey(key) {
  syncChains[key] = (syncChains[key] || Promise.resolve())
    .then(function() { return doSync(key); })
    .catch(function(error) {
      console.warn('Synk misslyckades (försöker igen senare):', key, error.message);
      updateSyncBadge(false);
      return false;
    });
  return syncChains[key];
}

// Ger true när nyckeln är helt synkad, annars false
async function doSync(key) {
  if (!database || !trainerCode) return false;   // inte inloggad: bara lokalt
  const cfg = SYNC_KEYS[key];
  if (!cfg) return false;

  const base = 'coaches/' + trainerCode + '/';
  const read = function(p) {
    return withTimeout(database.ref(base + p).once('value'), SYNC_TIMEOUT_MS).then(function(s) { return s.val(); });
  };

  // 1. Hämta molnets version samt raderingar och rensningar
  const results = await Promise.all([
    read(cfg.path),
    read('_sync/deleted/' + key),
    read('_sync/clearedAt/' + key)
  ]);
  const cloudData = results[0];
  const cloudDeleted = results[1] || {};
  const cloudCleared = Number(results[2]) || 0;

  // 2. Slå ihop med telefonens version
  const meta = loadMeta();
  const deleted = Object.assign({}, cloudDeleted, meta.deleted[key] || {});
  const clearedAt = Math.max(cloudCleared, meta.clearedAt[key] || 0);
  const isList = cfg.type === 'list';
  const local = readJSON(key, isList ? [] : {});

  const merged = isList
    ? mergeList(local, cloudData, deleted, clearedAt)
    : mergeRecords(local, cloudData, clearedAt);

  // 3. Uppdatera telefonen om något nytt kom från molnet
  if (JSON.stringify(merged) !== JSON.stringify(local)) {
    writeJSON(key, merged);
    if (isList) setKnown(key, merged);
    // Sidor som håller listan i minnet får veta att den ändrats
    window.dispatchEvent(new CustomEvent('pt-sync-updated', { detail: { key: key } }));
  }

  // 4. Uppdatera molnet om något skiljer
  const forCloud = cleanForCloud(cfg, merged);
  const cloudNormalized = isList ? toList(cloudData) : (cloudData || {});
  if (JSON.stringify(forCloud) !== JSON.stringify(cloudNormalized)) {
    await withTimeout(
      database.ref(base + cfg.path).set(isEmptyData(forCloud) ? null : forCloud),
      SYNC_TIMEOUT_MS
    );
  }

  // 5. Skicka raderingar och rensningar till molnet
  if (Object.keys(meta.deleted[key] || {}).length > 0) {
    await withTimeout(database.ref(base + '_sync/deleted/' + key).update(meta.deleted[key]), SYNC_TIMEOUT_MS);
  }
  if ((meta.clearedAt[key] || 0) > cloudCleared) {
    await withTimeout(database.ref(base + '_sync/clearedAt/' + key).set(meta.clearedAt[key]), SYNC_TIMEOUT_MS);
  }

  // 6. Klart: ta bort markeringen "väntar på synk"
  const after = loadMeta();
  delete after.dirty[key];
  saveMeta(after);
  updateSyncBadge(true);
  return true;
}

// ===== UTLOGGNING =====
// Skickar upp allt som väntar och talar om vilka nycklar som INTE hann synkas.
// Har telefonen inget nät vet vi att bara det som är markerat "väntar" saknas i molnet.
async function flushSync() {
  const keys = Object.keys(SYNC_KEYS);
  const hasData = function(key) { return !isEmptyData(readJSON(key, null)); };

  if (navigator.onLine === false) {
    const dirty = loadMeta().dirty;
    return { failed: keys.filter(function(k) { return dirty[k] && hasData(k); }), offline: true };
  }

  const results = await Promise.all(keys.map(function(k) {
    return syncKey(k).then(function(ok) { return { key: k, ok: ok === true }; });
  }));
  const failed = results.filter(function(r) { return !r.ok && hasData(r.key); })
    .map(function(r) { return r.key; });
  return { failed: failed, offline: false };
}

// Tar bort all användardata från telefonen (efter att den synkats till molnet).
// Används vid utloggning så att nästa person som loggar in inte får dina pass.
function clearLocalUserData() {
  Object.keys(SYNC_KEYS).forEach(function(key) { localStorage.removeItem(key); });
  localStorage.removeItem(SYNC_META_KEY);
  localStorage.removeItem('pt_s');   // pågående skjutpass (synkas inte)
  Object.keys(knownKeys).forEach(function(key) { delete knownKeys[key]; });
}

function readFromFirebase(path, callback) {
  if (!database || !trainerCode) {
    var data = localStorage.getItem(path);
    callback(data ? JSON.parse(data) : null);
    return;
  }

  database.ref('coaches/' + trainerCode + '/' + path).on('value', function(snapshot) {
    callback(snapshot.val());
  });
}

function updateSyncBadge(synced) {
  var badge = document.getElementById('sync-status-badge');
  if (!badge) return;

  if (synced) {
    badge.textContent = '☁️ Synkat';
  } else {
    badge.textContent = '📱 Offline';
  }
}

// När nätet kommer tillbaka skickas allt som väntat
window.addEventListener('online', function() {
  updateSyncBadge(true);
  syncAllKeys();
});
window.addEventListener('offline', function() { updateSyncBadge(false); });

console.log('✅ Sync Manager ready');
