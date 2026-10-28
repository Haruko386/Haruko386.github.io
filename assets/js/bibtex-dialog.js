(function () {
  var link = document.querySelector('[data-bibtex-open]');
  var dialog = document.querySelector('[data-bibtex-dialog]');
  if (!link || !dialog || typeof dialog.showModal !== 'function') return;

  function outsideDialog(event) {
    var rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom;
  }

  var pressedOutside = false;
  link.addEventListener('click', function (event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    dialog.showModal();
  });
  dialog.querySelector('[data-bibtex-close]').addEventListener('click', function () {
    dialog.close();
  });
  dialog.addEventListener('pointerdown', function (event) {
    pressedOutside = outsideDialog(event);
  });
  dialog.addEventListener('click', function (event) {
    if (pressedOutside && outsideDialog(event)) dialog.close();
    pressedOutside = false;
  });
  dialog.querySelector('[data-bibtex-copy]').addEventListener('click', function () {
    var citation = dialog.querySelector('[data-bibtex-content]').textContent;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(citation).catch(function () { fallbackCopy(citation); });
    } else {
      fallbackCopy(citation);
    }
  });
  function fallbackCopy(value) {
    var input = document.createElement('textarea');
    input.value = value;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    dialog.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
  }
}());
