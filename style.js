// style.js
// Controls: mobile menu, theme toggle (light/dark), active nav link, reveal on scroll, top button

(function () {
  // Elements
  const menuBtn = document.getElementById('menu');
  const header = document.querySelector('header');
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.getElementById('themeIcon') || themeToggle.querySelector('i');
  const navLinks = document.querySelectorAll('.navbar a');
  const sections = document.querySelectorAll('section[id]');
  const topBtn = document.querySelector('.top');

  // ---- Mobile menu toggle ----
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      header.classList.toggle('toggle');
    });
  }

  // Close sidebar when clicking a nav link on mobile
  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 991) header.classList.remove('toggle');
    });
  });

  // ---- Theme toggle ----
  const root = document.documentElement;
  const stored = localStorage.getItem('site-theme');
  if (stored === 'light') {
    root.classList.add('light');
    if (themeIcon) themeIcon.className = 'fas fa-sun';
  } else {
    root.classList.remove('light');
    if (themeIcon) themeIcon.className = 'fas fa-moon';
  }

  themeToggle.addEventListener('click', () => {
    const isLight = root.classList.toggle('light');
    localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
    if (themeIcon) themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
  });

  // ---- Smooth scroll offset fix for fixed sidebar (for anchor clicks) ----
  // We'll adjust for the fixed sidebar by slightly offsetting the scroll position
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // default anchor behavior will be smooth because CSS 'scroll-behavior: smooth'
      // but we adjust the ending scroll to account for sidebar heights/padding
      // small timeout to allow default smooth scroll to do most of the work
      // then adjust
      setTimeout(() => {
        const targetId = this.getAttribute('href').slice(1);
        if (!targetId) return;
        const el = document.getElementById(targetId);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const absoluteTop = window.pageYOffset + rect.top - 28; // small top offset
        window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
      }, 10);
    });
  });

  // ---- Active nav link on scroll ----
  const updateActiveLink = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (pageYOffset >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').replace('#', '');
      if (href === current) link.classList.add('active');
    });
  };
  window.addEventListener('scroll', updateActiveLink);
  window.addEventListener('load', updateActiveLink);

  // ---- Reveal elements on scroll (fade-in) ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Add fade-in class to main blocks
  document.querySelectorAll('.heading, .about .row .info, .about .row .counter, .box, .contact .row form, .home h1, .home p, .home h3').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // ---- Top button show/hide ----
  const toggleTop = () => {
    if (window.pageYOffset > 400) {
      topBtn.classList.add('show');
    } else {
      topBtn.classList.remove('show');
    }
  };
  window.addEventListener('scroll', toggleTop);

  // top button click
  if (topBtn) {
    topBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Small fix: if header off-canvas open and user resizes to desktop, ensure it's visible ----
  window.addEventListener('resize', () => {
    if (window.innerWidth > 991) header.classList.remove('toggle');
  });

  // ---- Accessibility: keyboard close sidebar with ESC ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') header.classList.remove('toggle');
  });

})();

const modeToggle = document.querySelector('#mode'); // dark/light button
modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

