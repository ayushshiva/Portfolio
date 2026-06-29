(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // --- Theme (dark/light) ---
  const themeKey = 'portfolio-theme';
  const root = document.documentElement;
  const themeToggle = $('#theme-toggle');

  function setTheme(theme) {
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    try { localStorage.setItem(themeKey, theme); } catch (_) {}
    if (themeToggle) themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
  }

  function initTheme() {
    let stored = null;
    try { stored = localStorage.getItem(themeKey); } catch (_) {}
    if (stored === 'light') setTheme('light');
    else setTheme('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      setTheme(isLight ? 'dark' : 'light');
    });
  }

  initTheme();

  // --- Active section highlighting + smooth scroll (native handles smooth) ---
  const nav = $('#site-nav');
  const navLinks = $$('#nav a[data-nav]');
  const sectionIds = navLinks.map(a => a.getAttribute('href').replace('#', '')).filter(Boolean);

  function setActive(id) {
    navLinks.forEach(a => {
      const hrefId = a.getAttribute('href').replace('#', '');
      const current = hrefId === id;
      if (current) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  const observer = new IntersectionObserver((entries) => {
    // pick entry with largest intersection ratio
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible && visible.target && visible.target.id) setActive(visible.target.id);
  }, { root: null, threshold: [0.15, 0.25, 0.35, 0.5] });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // --- Mobile hamburger ---
  const hamburger = $('#hamburger');
  const drawer = $('#mobile-drawer');
  const drawerClose = $('#drawer-close');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawer) drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  // Close drawer when clicking a link
  $$('#mobile-drawer a[href^="#"], #mobile-drawer a[data-nav]').forEach(a => {
    a.addEventListener('click', () => closeDrawer());
  });

  // --- Typing effect ---
  const typingEl = $('#typing-role');
  const roles = ['Android Developer', 'Full Stack Developer'];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typingEl && !prefersReduced) {
    const typeSpeed = 70;
    const deleteSpeed = 40;
    const pause = 900;

    function tick() {
      const role = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typingEl.textContent = role.slice(0, charIndex);
        if (charIndex >= role.length) {
          deleting = true;
          setTimeout(tick, pause);
          return;
        }
        setTimeout(tick, typeSpeed);
      } else {
        charIndex--;
        typingEl.textContent = role.slice(0, Math.max(0, charIndex));
        if (charIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
        setTimeout(tick, deleteSpeed);
      }
    }

    // init
    typingEl.textContent = '';
    tick();
  } else if (typingEl) {
    typingEl.textContent = 'Android Developer';
  }

  // --- Scroll reveal ---
  const revealEls = $$('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  // --- Lazy load images (native via loading="lazy") + add decoding ---
  $$('img[loading="lazy"]').forEach(img => {
    if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
  });
})();

