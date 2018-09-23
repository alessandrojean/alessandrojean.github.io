document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('posts')) {
    new AnimOnScroll(document.getElementById('posts'), {
      minDuration: 0.4,
      maxDuration: 0.7,
      viewportFactor: 0.2
    });
  }
});