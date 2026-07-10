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

  // publications: pillar filter pills + date sort
  const pubFilters = document.querySelectorAll('.pub-filters .pill');
  const pubTableBody = document.getElementById('pub-table-body');
  const pubEmptyState = document.getElementById('pub-empty-state');
  if (pubFilters.length && pubTableBody) {
    const rows = [...pubTableBody.querySelectorAll('tr')];
    rows.sort((a, b) => (b.dataset.date || '').localeCompare(a.dataset.date || ''));
    rows.forEach(row => pubTableBody.appendChild(row));

    function applyPubFilter(filter) {
      let visible = 0;
      rows.forEach(row => {
        const match = filter === 'all' || row.dataset.pillar === filter;
        row.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      if (pubEmptyState) pubEmptyState.style.display = visible === 0 ? '' : 'none';
    }

    pubFilters.forEach(pill => {
      pill.addEventListener('click', () => {
        pubFilters.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        applyPubFilter(pill.dataset.filter);
      });
    });

    applyPubFilter('all');
  }

  // news: category filter pills + date sort
  const newsFilters = document.querySelectorAll('.news-filters .pill');
  const newsList = document.getElementById('news-all-list');
  const newsEmptyState = document.getElementById('news-empty-state');
  if (newsFilters.length && newsList) {
    const cards = [...newsList.children];
    cards.sort((a, b) => (b.dataset.date || '').localeCompare(a.dataset.date || ''));
    cards.forEach(card => newsList.appendChild(card));

    cards.forEach(card => {
      const codeEl = card.querySelector('.code');
      if (codeEl) codeEl.dataset.original = codeEl.textContent;
    });

    function applyNewsFilter(filter) {
      let visible = 0;
      let seq = 0;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
        const codeEl = card.querySelector('.code');
        if (match) {
          visible++;
          seq++;
          if (codeEl) {
            if (filter === 'all') {
              codeEl.textContent = codeEl.dataset.original;
            } else {
              const label = codeEl.dataset.original.split('·')[1].trim();
              codeEl.textContent = seq + ' · ' + label;
            }
          }
        }
      });
      if (newsEmptyState) newsEmptyState.style.display = visible === 0 ? '' : 'none';
    }

    newsFilters.forEach(pill => {
      pill.addEventListener('click', () => {
        newsFilters.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        applyNewsFilter(pill.dataset.filter);
      });
    });

    applyNewsFilter('all');
  }
});
