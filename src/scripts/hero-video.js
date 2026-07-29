// Pauses the hero background video for users who prefer reduced motion.
// The site-wide prefers-reduced-motion rule in global.css zeroes out CSS
// animations/transitions, but that can't stop a native <video> autoplay
// loop, so it needs handling here instead.
(function () {
  var video = document.querySelector('.hero-visual video');
  if (!video) return;

  var query = window.matchMedia('(prefers-reduced-motion: reduce)');

  function apply() {
    if (query.matches) {
      video.pause();
    } else {
      video.play().catch(function () {
        /* autoplay blocked by the browser — poster frame stays visible */
      });
    }
  }

  apply();
  query.addEventListener('change', apply);
})();
