(() => {
  const buttons = document.querySelectorAll('[data-copy-link]');
  buttons.forEach((button) => {
    const defaultLabel = button.textContent;
    button.addEventListener('click', async () => {
      const anchor = button.getAttribute('data-copy-link');
      const url = `${location.origin}${location.pathname}${anchor ? `#${anchor}` : ''}`;
      try {
        await navigator.clipboard.writeText(url);
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Copy failed';
      }
      setTimeout(() => {
        button.textContent = defaultLabel;
      }, 1800);
    });
  });
})();
