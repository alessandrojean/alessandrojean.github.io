/* eslint-env browser */
/* global DISQUS */

// Get the value stored locally.
const nightModeStorage = localStorage.getItem('nightMode');
const nightMode = document.querySelector('#night-mode');
const pageUrl = document.location.href;

// If the stored value exists.
if (nightModeStorage) {
  // Activate the night mode.
  document.documentElement.classList.add('is-night');
  // Check the input.
  nightMode.checked = true;
}

// Add the onclick event.
nightMode.addEventListener('click', () => {
  // Activate the night mode.
  document.documentElement.classList.toggle('is-night');
  // Reload disqus.
  DISQUS.reset({
    reload: true,
    config: function () {
      this.page.identifier = pageUrl;
      this.page.url = pageUrl;
    }
  });
  // If have is-night.
  if (document.documentElement.classList.contains('is-night')) {
    // Save the value locally.
    localStorage.setItem('nightMode', true);
    return;
  }
  // Otherwise, remove it.
  localStorage.removeItem('nightMode');
});
