// Mobile navigation toggle. Progressive enhancement only: without this
// script the nav list is shown fully expanded (see `.no-js` rule in
// global.css), so navigation always works.
(function () {
  document.documentElement.classList.remove('no-js');

  var toggle = document.querySelector('.nav-toggle');
  var list = document.querySelector('.nav-list');
  if (!toggle || !list) return;

  toggle.addEventListener('click', function () {
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    list.classList.toggle('is-open', !expanded);
  });
})();
