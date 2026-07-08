// autoMoTIVe-X Lab — shared interactions
document.addEventListener('DOMContentLoaded', () => {
  // scroll reveal
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => io.observe(el));
  }

  // stagger children inside .stagger groups
  document.querySelectorAll('.stagger').forEach(group => {
    [...group.children].forEach((child, i) => {
      child.style.transitionDelay = (i * 90) + 'ms';
    });
  });

  // animate the trust-chain pulse along its path, if present
  const pulse = document.querySelector('.chain-pulse');
  const chainPath = document.querySelector('.chain-trace');
  if (!prefersReduced && pulse && chainPath && chainPath.getPointAtLength) {
    const len = chainPath.getTotalLength();
    const duration = 3200;
    let start = null;
    function animateChain(ts) {
      if (!start) start = ts;
      const t = ((ts - start) % duration) / duration;
      const pt = chainPath.getPointAtLength(t * len);
      pulse.setAttribute('cx', pt.x);
      pulse.setAttribute('cy', pt.y);
      requestAnimationFrame(animateChain);
    }
    requestAnimationFrame(animateChain);
  }
});
