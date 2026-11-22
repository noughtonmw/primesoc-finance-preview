'use strict';
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
document.querySelectorAll('.mobile-nav').forEach(menu => {
  const summary = menu.querySelector('summary');
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) { menu.open = false; summary.focus(); }
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
  document.addEventListener('click', event => { if (menu.open && !menu.contains(event.target)) menu.open = false; });
  window.matchMedia('(min-width: 721px)').addEventListener('change', event => { if (event.matches) menu.open = false; });
});
