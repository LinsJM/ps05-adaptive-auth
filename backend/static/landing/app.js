/**
 * DIGNITAS PS05 Landing Page Controller
 * Interactive Hero Risk Calculator, Live Metric Gauges, and Gateway Deep Linking.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Hero Interactive Risk Calculator
  const toggleDevice = document.getElementById('calc-toggle-device');
  const toggleTor = document.getElementById('calc-toggle-tor');
  const toggleHours = document.getElementById('calc-toggle-hours');
  const toggleAttempts = document.getElementById('calc-toggle-attempts');
  const toggleHoney = document.getElementById('calc-toggle-honey');

  const heroCalcScore = document.getElementById('hero-calc-score');
  const heroCalcBadge = document.getElementById('hero-calc-badge');
  const heroCalcDesc = document.getElementById('hero-calc-desc');
  const heroCalcNeedle = document.getElementById('hero-calc-needle');
  const btnCalcGatewayLink = document.getElementById('btn-calc-gateway-link');

  let currentScore = 0;

  function calculateRisk() {
    let score = 0;

    // Check honeytoken trap first (instant critical threat)
    if (toggleHoney && toggleHoney.checked) {
      score = 100;
    } else {
      if (toggleDevice && toggleDevice.checked) score += 45;
      if (toggleTor && toggleTor.checked) score += 25;
      if (toggleHours && toggleHours.checked) score += 10;
      if (toggleAttempts && toggleAttempts.checked) score += 35;
    }

    score = Math.max(0, Math.min(100, score));
    animateScore(currentScore, score);
    currentScore = score;

    updateDecisionPolicy(score);
  }

  function animateScore(fromVal, toVal) {
    if (!heroCalcScore) return;
    const duration = 280;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(fromVal + (toVal - fromVal) * ease);
      heroCalcScore.textContent = val;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        heroCalcScore.textContent = toVal;
      }
    }
    requestAnimationFrame(step);

    // Update needle position
    if (heroCalcNeedle) {
      heroCalcNeedle.style.left = `${toVal}%`;
    }

    // Dynamic Colorize
    if (toVal < 30) {
      heroCalcScore.style.color = '#34D399';
    } else if (toVal < 45) {
      heroCalcScore.style.color = '#FBBF24';
    } else if (toVal < 61) {
      heroCalcScore.style.color = '#FB923C';
    } else if (toVal < 80) {
      heroCalcScore.style.color = '#FB7185';
    } else {
      heroCalcScore.style.color = '#F87171';
    }
  }

  function updateDecisionPolicy(score) {
    if (!heroCalcBadge || !heroCalcDesc) return;

    heroCalcBadge.className = 'calc-decision-badge';

    if (score >= 80) {
      heroCalcBadge.classList.add('badge-block');
      heroCalcBadge.textContent = 'BLOCK (80–100)';
      heroCalcDesc.textContent = 'Intrusion blocked • IP blacklisted & Breach alert sent';
      updateGatewayLink('block');
    } else if (score >= 60) {
      heroCalcBadge.classList.add('badge-quarantine');
      heroCalcBadge.textContent = 'QUARANTINE (60–79)';
      heroCalcDesc.textContent = 'Suspicious session • Out-of-band email approval';
      updateGatewayLink('quarantine');
    } else if (score >= 45) {
      heroCalcBadge.classList.add('badge-otp');
      heroCalcBadge.textContent = 'EMAIL OTP (45–59)';
      heroCalcDesc.textContent = 'Unrecognized hardware • Step-up OTP & Device Trust';
      updateGatewayLink('otp');
    } else if (score >= 30) {
      heroCalcBadge.classList.add('badge-captcha');
      heroCalcBadge.textContent = 'CAPTCHA (30–44)';
      heroCalcDesc.textContent = 'Bot shield • Cloudflare Turnstile verification';
      updateGatewayLink('captcha');
    } else {
      heroCalcBadge.classList.add('badge-allow');
      heroCalcBadge.textContent = 'ALLOW (0–29)';
      heroCalcDesc.textContent = 'Frictionless pass approved (<10 ms)';
      updateGatewayLink('allow');
    }
  }

  function updateGatewayLink(actionType) {
    if (!btnCalcGatewayLink) return;
    const scenarioMap = {
      'allow': 1,
      'otp': 2,
      'captcha': 4,
      'quarantine': 8,
      'reset': 8,
      'block': 3
    };
    const scen = scenarioMap[actionType] || 1;
    btnCalcGatewayLink.href = `../dashboard/index.html?scenario=${scen}`;
  }

  // Bind change listeners to all checkboxes
  [toggleDevice, toggleTor, toggleHours, toggleAttempts, toggleHoney].forEach(toggle => {
    if (toggle) {
      toggle.addEventListener('change', calculateRisk);
    }
  });

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==============================================================
  // 1. SMOOTH 3D SCROLL REVEAL SYSTEM (INTERSECTION OBSERVER)
  // ==============================================================
  const revealElements = document.querySelectorAll('.reveal-3d');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ==============================================================
  // 2. SCROLL READING PROGRESS & 3D PARALLAX AMBIENT ORBS
  // ==============================================================
  const navbar = document.getElementById('navbar');
  const scrollProgressLine = document.getElementById('scroll-progress-line');
  const ambientOrbs = document.querySelectorAll('.ambient-orb');
  const ambientGrid = document.getElementById('ambient-grid');
  let ticking = false;

  function onScrollUpdate() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Top reading progress indicator
    if (scrollProgressLine && docHeight > 0) {
      const scrollPercent = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      scrollProgressLine.style.width = `${scrollPercent}%`;
    }

    // Parallax depth shift on ambient 3D chromatic orbs
    if (ambientOrbs.length > 0) {
      ambientOrbs.forEach(orb => {
        const speed = parseFloat(orb.dataset.speed || 0.1);
        const yOffset = (scrollY * speed).toFixed(1);
        orb.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      });
    }

    // Subtle perspective tilt shift on grid
    if (ambientGrid) {
      const gridY = (scrollY * 0.06).toFixed(1);
      ambientGrid.style.transform = `perspective(600px) rotateX(60deg) translateZ(-80px) translateY(${gridY}px)`;
    }

    // Dynamic navbar elevation & blur
    if (navbar) {
      if (scrollY > 20) {
        navbar.style.background = 'rgba(7, 9, 14, 0.92)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
      } else {
        navbar.style.background = 'rgba(11, 15, 25, 0.75)';
        navbar.style.backdropFilter = 'blur(16px)';
        navbar.style.boxShadow = 'none';
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScrollUpdate);
      ticking = true;
    }
  }, { passive: true });

  // Initial trigger for orbs and progress
  onScrollUpdate();

  // ==============================================================
  // 3. INTERACTIVE 3D TILT WITH SPECULAR LIGHT SHEEN
  // ==============================================================
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    const isHeroLevitating = card.classList.contains('floating-3d');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update light sheen coordinates
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Calculate 3D tilt angles based on center offset
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (((y - centerY) / centerY) * -6).toFixed(2);
      const rotateY = (((x - centerX) / centerX) * 6).toFixed(2);

      if (isHeroLevitating) {
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale3d(1.01, 1.01, 1.01)`;
      } else {
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale3d(1.015, 1.015, 1.015)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (isHeroLevitating) {
        card.style.transform = '';
      } else {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
        setTimeout(() => {
          if (!card.matches(':hover')) {
            card.style.transform = '';
          }
        }, 220);
      }
    });
  });
});
