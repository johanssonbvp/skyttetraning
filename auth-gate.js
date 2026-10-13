// auth-gate.js – kräver inloggning på träningssidorna
//
// Ladda den allra först på varje sida (direkt efter <html>-taggen).
// Så här fungerar den:
//   1. Finns ingen sparad inloggning (pt_trainer_code) skickas besökaren
//      direkt till startsidan, där inloggningsrutan visas.
//   2. Finns en sparad inloggning får sidan visas direkt. Det gör att appen
//      fungerar offline och utan väntetid.
//   3. När Firebase har startat kontrolleras att inloggningen fortfarande
//      gäller. Om inte (och vi har nät) skickas besökaren till startsidan.
//   4. På localhost (vid testning på din egen dator) görs ingen kontroll.

function ptAuthGate(opts) {
  opts = opts || {};
  var host = opts.hostname !== undefined ? opts.hostname : location.hostname;
  var goTo = opts.redirect || function (url) { location.replace(url); };
  var HOME = 'index.html';

  // Lokal testning: ingen kontroll
  if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '') return;

  function isOnline() {
    return opts.online !== undefined ? opts.online : navigator.onLine !== false;
  }

  // Skickar till startsidan och glömmer en inloggning som inte längre gäller
  function toLogin() {
    try {
      localStorage.removeItem('pt_trainer_code');
      localStorage.removeItem('trainer-code');
    } catch (e) {}
    goTo(HOME);
  }

  // Steg 1: ingen inloggning sparad -> direkt till startsidan
  var code = null;
  try { code = localStorage.getItem('pt_trainer_code'); } catch (e) {}
  if (!code) {
    // Dölj sidan så att den inte blinkar till innan vi byter sida
    document.documentElement.style.visibility = 'hidden';
    goTo(HOME);
    return;
  }

  // Steg 3: kontrollera inloggningen när Firebase är redo.
  // Är Firebase aldrig tillgängligt (t.ex. offline) litar vi på den sparade inloggningen.
  var tries = 0;
  function waitForFirebase() {
    var fb = opts.firebase || window.firebase;
    if (fb && fb.auth && fb.apps && fb.apps.length) {
      verify(fb);
      return;
    }
    if (++tries > 40) return;          // ger upp efter ca 10 sekunder
    setTimeout(waitForFirebase, 250);
  }

  function verify(fb) {
    var auth;
    try { auth = fb.auth(); } catch (e) { return; }
    var stop = auth.onAuthStateChanged(function (user) {
      if (typeof stop === 'function') stop();
      if (user) return;                // inloggningen gäller
      if (!isOnline()) return;         // offline: vi kan inte avgöra, släpp in
      // Vänta en kort stund och kolla igen, ifall inloggningen hann läsas in
      setTimeout(function () {
        if (!auth.currentUser && isOnline()) toLogin();
      }, opts.recheckMs !== undefined ? opts.recheckMs : 1500);
    });
  }

  waitForFirebase();
}

// Körs direkt när filen laddas. Funktionen finns kvar så att den kan testas med låtsasvärden.
window.ptAuthGate = ptAuthGate;
ptAuthGate();
