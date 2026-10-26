// lang-manager.js - Petanque Träning
//
// Gemensamt språksystem för hela appen. Alla sidor använder det här.
// Språk: svenska (sv), engelska (en), franska (fr) och tyska (de).
//
// Tyska är påbyggt men DOLT (inte i listan "enabled") tills alla sidor är översatta.
// När allt är klart läggs 'de' till i enabled nedan, så dyker det upp i menyn.

const langMgr = {
  // Alla språk som systemet känner till
  languages: ['sv', 'en', 'fr', 'de'],
  // Språk som användaren får välja just nu
  enabled: ['sv', 'en', 'fr'],

  names: { sv: 'Svenska', en: 'English', fr: 'Français', de: 'Deutsch' },
  locales: { sv: 'sv-SE', en: 'en-GB', fr: 'fr-FR', de: 'de-DE' },

  // Om en text saknas på valt språk provas nästa i listan (och sist svenska)
  fallback: {
    sv: ['sv'],
    en: ['en', 'sv'],
    fr: ['fr', 'en', 'sv'],
    de: ['de', 'en', 'sv']
  },

  lang: 'sv',

  // Läs sparat språk (flera nycklar finns kvar så att äldre sidor fungerar)
  load() {
    const saved = localStorage.getItem('petanque-lang')
      || localStorage.getItem('pt_lang')
      || localStorage.getItem('lang')
      || 'sv';
    this.lang = this.enabled.includes(saved) ? saved : 'sv';
    return this.lang;
  },

  // Välj ett text ur ett objekt, t.ex. langMgr.t({sv:'Hej', en:'Hello', fr:'Salut'})
  t(texts) {
    if (!texts || typeof texts !== 'object') return texts;
    const chain = this.fallback[this.lang] || ['sv'];
    for (const l of chain) {
      if (texts[l]) return texts[l];
    }
    return texts.sv || '';
  },

  // Språkkod för datum och tid, t.ex. 'sv-SE' eller 'de-DE'
  locale() {
    return this.locales[this.lang] || 'sv-SE';
  },

  // Hämta text/attribut på valt språk (med reservspråk) från ett element
  _pick(el, prefix, suffix) {
    const chain = this.fallback[this.lang] || ['sv'];
    for (const l of chain) {
      const value = el.getAttribute(prefix + l + suffix);
      if (value) return value;
    }
    return null;
  },

  // Uppdatera alla texter på sidan
  apply() {
    document.querySelectorAll('[data-sv]').forEach(el => {
      const text = this._pick(el, 'data-', '');
      if (text === null) return;
      // Fält med data-sv har texten som placeholder, andra element som vanlig text
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = text;
      else el.textContent = text;
    });

    // Placeholders: data-sv-placeholder="..." eller data-placeholder-sv="..."
    document.querySelectorAll('[data-sv-placeholder],[data-placeholder-sv]').forEach(el => {
      const ph = this._pick(el, 'data-', '-placeholder') || this._pick(el, 'data-placeholder-', '');
      if (ph) el.placeholder = ph;
    });

    document.documentElement.lang = this.lang;
  },

  // Byt språk: spara, uppdatera sidan och berätta för sidor som vill veta
  set(lang) {
    if (!this.enabled.includes(lang)) lang = 'sv';
    this.lang = lang;
    // Spara i alla nycklar för kompatibilitet
    localStorage.setItem('petanque-lang', lang);
    localStorage.setItem('pt_lang', lang);
    localStorage.setItem('lang', lang);
    this.apply();
    window.dispatchEvent(new CustomEvent('pt-lang-changed', { detail: { lang: lang } }));
  },

  // Gå till nästa språk i listan
  toggle() {
    const next = this.enabled[(this.enabled.indexOf(this.lang) + 1) % this.enabled.length];
    this.set(next);
  }
};

langMgr.load();
document.addEventListener('DOMContentLoaded', () => langMgr.apply());
