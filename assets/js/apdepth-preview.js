document.querySelectorAll('[data-apdepth-preview]').forEach(function (preview) {
  var toggle = preview.querySelector('.apdepth-preview__toggle');
  var icon = toggle.querySelector('span');

  preview.classList.add('is-enhanced');
  toggle.hidden = false;

  toggle.addEventListener('click', function () {
    var paused = preview.dataset.paused !== 'true';
    preview.dataset.paused = String(paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Play comparison slideshow' : 'Pause comparison slideshow');
    icon.textContent = paused ? '▶' : 'Ⅱ';
  });

  function updateVisibility() {
    preview.classList.toggle('is-page-hidden', document.hidden);
  }

  document.addEventListener('visibilitychange', updateVisibility);
  updateVisibility();
});
