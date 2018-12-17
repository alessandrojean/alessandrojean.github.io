/* eslint-env browser */

document.addEventListener('DOMContentLoaded', () => {
  const highlightBlocks = document.querySelectorAll('div.highlighter-rouge');

  highlightBlocks.forEach((el) => {
    const language = [...el.classList].filter(c => c.startsWith('language-'));

    if (language.length) {
      el.dataset.language = language[0].split('-')[1].replace(/cpp/gi, 'C++');
    }
  });
});
