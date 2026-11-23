'use strict';
(() => {
  const header = document.querySelector('.site-menu');
  if (!header) return;
  const button = header.querySelector('#mobileMenuBtn');
  const menu = header.querySelector('#navMenu');
  const mobile = window.matchMedia('(max-width: 1240px)');
  const links = Array.from(menu.querySelectorAll('a'));
  function setOpen(open, returnFocus = false) {
    open = open && mobile.matches;
    menu.classList.toggle('active', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    button.innerHTML = open ? '<i class="fas fa-times" aria-hidden="true"></i>' : '<i class="fas fa-bars" aria-hidden="true"></i>';
    if (returnFocus) button.focus();
  }
  button.addEventListener('click', () => setOpen(!menu.classList.contains('active')));
  links.forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('click', event => { if (!event.composedPath().includes(header)) setOpen(false); });
  header.addEventListener('keydown', event => {
    if (!menu.classList.contains('active') || !mobile.matches) return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false, true); }
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); button.focus(); }
      else if (!event.shiftKey && document.activeElement === button) { event.preventDefault(); links[0].focus(); }
      else if (event.shiftKey && document.activeElement === button) { event.preventDefault(); links[links.length - 1].focus(); }
    }
  });
  mobile.addEventListener('change', () => setOpen(false));
  setOpen(false);
})();
