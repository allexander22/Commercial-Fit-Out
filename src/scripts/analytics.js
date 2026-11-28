// Google Analytics 4. Loads gtag.js only once the visitor has given
// analytics consent via the cookie banner — either on a previous visit
// (read from localStorage) or during this one (the banner dispatches
// `a2:consent-change`). Nothing is requested from Google before that.
// Kept as an external file (not Google's inline snippet) so the strict
// script-src CSP in BaseLayout.astro needs no 'unsafe-inline'.
(function () {
  var meta = document.querySelector('meta[name="a2-ga-measurement-id"]');
  var measurementId = meta && meta.getAttribute('content');
  if (!measurementId) return;

  var loaded = false;

  function hasConsent() {
    if (window.a2CookieConsent) return window.a2CookieConsent.hasAnalyticsConsent();
    // cookie-consent.js may not have run yet — read its stored value directly.
    try {
      var consent = JSON.parse(localStorage.getItem('a2-cookie-consent') || 'null');
      return !!(consent && consent.analytics);
    } catch (e) {
      return false;
    }
  }

  function loadGa() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  if (hasConsent()) loadGa();
  window.addEventListener('a2:consent-change', function (event) {
    if (event.detail && event.detail.analytics) loadGa();
  });
})();
