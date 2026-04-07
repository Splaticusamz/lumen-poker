// ============================================
// TABLECAST — Elevated Interactive Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      if (hamburger) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      }
    });
  });

  // --- Scroll Reveal with Stagger ---
  const addRevealClasses = () => {
    const groups = document.querySelectorAll('.feature-grid, .steps-grid, .specs-grid, .usecase-grid, .stats-grid, .problem-grid');
    groups.forEach(group => {
      const children = group.querySelectorAll('.reveal');
      children.forEach((child, i) => {
        if (i > 0 && i <= 5) {
          child.classList.add(`reveal-delay-${i}`);
        }
      });
    });
  };

  addRevealClasses();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // --- Feature Card Glow Follow Mouse ---
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  // --- Scroll Effects ---
  const nav = document.getElementById('nav');
  const scrollHint = document.getElementById('scrollHint');
  const stickyCta = document.getElementById('stickyCta');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Nav border
    if (nav) {
      nav.style.borderBottomColor = scrollY > 50
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(255,255,255,0.06)';
    }

    // Hide scroll hint
    if (scrollHint) {
      scrollHint.style.opacity = Math.max(0, 1 - scrollY / 200);
    }

    // Show/hide sticky CTA bar (hidden at hero, visible once scrolled past)
    if (stickyCta) {
      if (scrollY > window.innerHeight * 0.5) {
        stickyCta.classList.remove('hidden');
      } else {
        stickyCta.classList.add('hidden');
      }
    }
  }, { passive: true });

  // Start hidden
  if (stickyCta) stickyCta.classList.add('hidden');

  // --- App Clock Timer ---
  const appClock = document.getElementById('appClock');
  if (appClock) {
    let min = 11, sec = 42;
    setInterval(() => {
      sec--;
      if (sec < 0) { sec = 59; min--; }
      if (min < 0) { min = 14; sec = 0; }
      appClock.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }, 1000);
  }

  // --- Animated Number Counters ---
  const counters = document.querySelectorAll('.stat-value[data-target]');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1500;
    const start = performance.now();

    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutExpo(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // --- Reserve Particles Canvas ---
  const particleCanvas = document.getElementById('reserveParticles');
  if (particleCanvas) {
    const pCtx = particleCanvas.getContext('2d');
    const particles = [];
    const PARTICLE_COUNT = 40;

    const resizeParticles = () => {
      particleCanvas.width = particleCanvas.offsetWidth;
      particleCanvas.height = particleCanvas.offsetHeight;
    };

    resizeParticles();
    window.addEventListener('resize', resizeParticles);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    let pAnimFrame;

    const drawParticles = () => {
      pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = particleCanvas.height + 10;
          p.x = Math.random() * particleCanvas.width;
        }
        if (p.x < -10) p.x = particleCanvas.width + 10;
        if (p.x > particleCanvas.width + 10) p.x = -10;

        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(0, 150, 255, ${p.alpha})`;
        pCtx.fill();
      });

      pAnimFrame = requestAnimationFrame(drawParticles);
    };

    const reserveObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!pAnimFrame) drawParticles();
      } else {
        cancelAnimationFrame(pAnimFrame);
        pAnimFrame = null;
      }
    });
    reserveObserver.observe(particleCanvas);
  }

  // --- Reserve Form ---
  const form = document.getElementById('reserveForm');
  const success = document.getElementById('reserveSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('emailInput').value;
      if (email) {
        form.style.display = 'none';
        success.classList.add('visible');
        console.log('Reservation:', email);
      }
    });
  }

});
