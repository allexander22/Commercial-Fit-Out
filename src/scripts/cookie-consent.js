// Cookie preferences banner. Progressive enhancement only: without this
// script the banner stays hidden (see the `hidden` attribute in
// CookieConsent.astro), which is safe since no cookies are set without it.
(function () {
  var STORAGE_KEY = 'a2-cookie-consent';
  var banner = document.querySelector('.cookie-consent');
  if (!banner) return;

  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(analytics) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ necessary: true, analytics: analytics, savedAt: Date.now() }));
    } catch (e) {
      /* localStorage unavailable (private browsing etc) — banner will just reappear next visit */
    }
  }

  // Exposed for future analytics scripts to check before loading anything.
  window.a2CookieConsent = {
    hasAnalyticsConsent: function () {
      var consent = readConsent();
      return !!(consent && consent.analytics);
    },
  };

  var existing = readConsent();
  if (existing) return;

  banner.removeAttribute('hidden');

  var manageButton = banner.querySelector('[data-cookie-manage]');
  var managePanel = banner.querySelector('.cookie-consent-manage');
  var initialActions = banner.querySelector('.cookie-consent-actions');
  var saveButton = banner.querySelector('[data-cookie-save]');
  var analyticsToggle = banner.querySelector('#cookie-analytics-toggle');

  function hideBanner() {
    banner.setAttribute('hidden', '');
  }

  banner.querySelectorAll('[data-cookie-accept-all]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      writeConsent(true);
      hideBanner();
    });
  });

  if (manageButton && managePanel && initialActions) {
    manageButton.addEventListener('click', function () {
      manageButton.setAttribute('aria-expanded', 'true');
      initialActions.hidden = true;
      managePanel.hidden = false;
      if (analyticsToggle) analyticsToggle.focus();
    });
  }

  if (saveButton) {
    saveButton.addEventListener('click', function () {
      writeConsent(!!(analyticsToggle && analyticsToggle.checked));
      hideBanner();
    });
  }
})();
