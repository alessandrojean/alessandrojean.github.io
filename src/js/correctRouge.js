document.addEventListener('DOMContentLoaded', function () {
  const pres = document.querySelectorAll('.content pre:not(.highlight)');

  if (pres.length) {
    pres.forEach(function (el) {
      el.classList.add('highlight');
      const language = el.querySelector('code').className;

      const divHighlight = document.createElement('div');
      divHighlight.classList.add('highlight');

      const divRouge = document.createElement('div');
      divRouge.classList.add('highlighter-rouge', language);

      divRouge.appendChild(divHighlight);
      el.parentNode.insertBefore(divRouge, el);
      divHighlight.appendChild(el);
    })
  }
});