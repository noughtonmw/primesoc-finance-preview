'use strict';
(() => {
  const section = document.querySelector('.m-process');
  const flow = document.querySelector('.m-process-flow');
  if (!section || !flow) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  function update() {
    frame = 0;
    if (reduced.matches) { flow.style.setProperty('--process-progress', '1'); return; }
    const box = flow.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (window.innerHeight * .78 - box.top) / (box.height + window.innerHeight * .14)));
    flow.style.setProperty('--process-progress', String(progress));
  }
  function schedule() { if (!frame) frame = window.requestAnimationFrame(update); }
  function preference() {
    window.removeEventListener('scroll', schedule);
    if (!reduced.matches) window.addEventListener('scroll', schedule, { passive: true });
    update();
  }
  reduced.addEventListener('change', preference);
  window.addEventListener('resize', schedule, { passive: true });
  preference();
})();
