'use strict';
(() => {
  const main = document.querySelector('.marketing-main');
  const flow = document.querySelector('.m-process-flow');
  const dots = Array.from(document.querySelectorAll('.m-step-index'));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, dirty = true, geometry = null, revealObserver = null;
  const clamp = n => Math.min(1, Math.max(0, n));
  function measure() {
    if (!flow || dots.length < 2) return null;
    const box = flow.getBoundingClientRect();
    const centers = dots.map(dot => { const b = dot.getBoundingClientRect(); return {x:b.left+b.width/2-box.left,y:b.top+b.height/2-box.top}; });
    const first = centers[0], last = centers[centers.length-1];
    const vertical = Math.abs(last.y-first.y) > Math.abs(last.x-first.x);
    return {x:first.x,y:first.y,length:Math.max(0,vertical?last.y-first.y:last.x-first.x),vertical,docY:box.top+scrollY+first.y,span:Math.max(1,vertical?last.y-first.y:box.height-first.y)};
  }
  function tick() {
    frame = 0;
    if (dirty) {
      geometry = measure(); dirty = false;
      if (geometry) {
        flow.classList.toggle('is-vertical',geometry.vertical);
        flow.style.setProperty('--line-x',geometry.x+'px');
        flow.style.setProperty('--line-y',geometry.y+'px');
        flow.style.setProperty('--line-length',geometry.length+'px');
        flow.classList.add('geometry-ready');
      }
    }
    if (!geometry) return;
    const progress = reduced.matches ? 1 : clamp((scrollY+innerHeight*.74-geometry.docY)/geometry.span);
    flow.style.setProperty('--process-progress',String(progress));
    dots.forEach((dot,i) => {const passed=progress>=i/(dots.length-1);dot.parentElement.classList.toggle('is-past',passed);dot.parentElement.classList.toggle('is-current',passed && (i===dots.length-1 || progress<(i+1)/(dots.length-1)));});
  }
  function schedule(layout=false) {dirty=dirty||layout;if(!frame) frame=requestAnimationFrame(tick);}
  function showAll() {if(revealObserver)revealObserver.disconnect();document.querySelectorAll('.v8-reveal-pending').forEach(el=>{el.classList.remove('v8-reveal-pending');el.classList.add('v8-revealed');});}
  function setupReveal() {
    if (reduced.matches || !('IntersectionObserver' in window)) {showAll();return;}
    try {
      revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('v8-reveal-pending');entry.target.classList.add('v8-revealed');revealObserver.unobserve(entry.target);}});},{threshold:.06,rootMargin:'0px 0px -24px 0px'});
      main.querySelectorAll(':scope>section:not(.m-hero)').forEach(section=>{if(section.getBoundingClientRect().top>innerHeight && !section.classList.contains('v8-revealed')){section.classList.add('v8-reveal-pending');revealObserver.observe(section);}});
    } catch (_) {showAll();}
  }
  addEventListener('scroll',()=>schedule(),{passive:true});
  addEventListener('resize',()=>schedule(true),{passive:true});
  if ('ResizeObserver' in window) {const observer=new ResizeObserver(()=>schedule(true));if(main)observer.observe(main);if(flow)observer.observe(flow);}
  document.querySelectorAll('img').forEach(img=>{if(!img.complete)img.addEventListener('load',()=>schedule(true),{once:true});});
  if(document.fonts)document.fonts.ready.then(()=>schedule(true));
  if(main)main.addEventListener('transitionend',event=>{if(event.propertyName==='transform')schedule(true);});
  reduced.addEventListener('change',()=>{showAll();schedule(true);});
  setupReveal();schedule(true);
})();
