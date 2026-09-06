/**
 * ==========================================================================
 * Main Application Script: Lenis Smooth Scrolling, Themes, & Interactivity
 * Task 1: Professional Portfolio Website
 * ==========================================================================
 */

(function () {
  'use strict';

  /* --- 1. Theme Management (Light / Dark Mode) --- */
  const THEME_STORAGE_KEY = 'portfolio-theme-preference';
  const htmlElement = document.documentElement;
  const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return 'dark';
  }

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    themeToggleButtons.forEach((btn) => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    });
  }

  // Initialize theme
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  // Attach theme toggle handlers
  themeToggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const activeTheme = htmlElement.getAttribute('data-theme') || 'light';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });

  // Listen for system theme changes if user has not manually set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* --- 2. Lenis Smooth Scroll Engine (Spring Physics & Extended Delay) --- */
  let lenis = null;
  // Damped harmonic spring oscillator easing: x(t) = 1 - e^(-5.5t) * cos(3.8t)
  // Delivers initial acceleration, a gentle 2.4% spring overshoot, and an elastic settling rebound
  const springEasing = (t) => {
    if (t >= 1) return 1;
    return 1 - Math.exp(-5.5 * t) * Math.cos(3.8 * t);
  };

  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      autoRaf: true,           // Native internal 120 FPS rAF loop managed directly by Lenis
      duration: 1.85,          // Extended delay (1.85s) for a weighted spring-loaded momentum feel
      easing: springEasing,    // Damped harmonic spring curve
      smoothWheel: true,       // Fluid wheel inertia
      wheelMultiplier: 1.18,   // Amplified momentum for spring travel
      touchMultiplier: 1.5,    // Snappy touch response
      autoResize: true,
    });

    window.__lenis = lenis;
    window.__springEasing = springEasing;

    // Synchronize anchor links with Lenis scrollTo using spring easing
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            e.preventDefault();
            lenis.scrollTo(targetElement, {
              offset: -80,
              duration: 1.85,
              easing: springEasing,
            });
            // Also close mobile drawer if open
            closeMobileDrawer();
          }
        }
      });
    });
  } else {
    console.warn('Lenis smooth scroll library not found. Falling back to native scrolling.');
  }

  /* --- 3. Mobile Navigation Drawer --- */
  const mobileToggle = document.querySelector('.mobile-toggle-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  function openMobileDrawer() {
    if (!mobileToggle || !mobileDrawer) return;
    mobileToggle.classList.add('is-active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-open');
    if (lenis) lenis.stop();
  }

  function closeMobileDrawer() {
    if (!mobileToggle || !mobileDrawer) return;
    mobileToggle.classList.remove('is-active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-open');
    if (lenis) lenis.start();
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    // Close on link click inside drawer
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileDrawer();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        closeMobileDrawer();
      }
    });
  }

  /* --- 4. Active Navigation Link Detection --- */
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute('href');
    if (!linkHref) return;

    // Check exact or relative match
    if (
      (currentPath.endsWith(linkHref) && linkHref !== 'index.html') ||
      (currentPath.endsWith('/') && linkHref === 'index.html') ||
      (currentPath.includes(linkHref) && linkHref !== 'index.html' && !linkHref.startsWith('#'))
    ) {
      link.classList.add('active');
    }
  });

  /* --- 5. Scroll Reveal System (IntersectionObserver) --- */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-scale');
  const skillBars = document.querySelectorAll('.skill-bar-progress');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');

            // If entry contains skill bars, animate their width
            if (entry.target.classList.contains('skill-bar-progress')) {
              const targetWidth = entry.target.getAttribute('data-progress') || '85%';
              entry.target.style.width = targetWidth;
            }

            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
    skillBars.forEach((bar) => revealObserver.observe(bar));
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach((el) => el.classList.add('is-revealed'));
    skillBars.forEach((bar) => {
      bar.style.width = bar.getAttribute('data-progress') || '85%';
    });
  }

  /* --- 6. Project Category Filtering --- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');

        // Update active class
        filterButtons.forEach((btn) => btn.classList.remove('is-active'));
        button.classList.add('is-active');

        // Filter projects
        projectCards.forEach((card) => {
          const cardCategories = (card.getAttribute('data-category') || '').split(' ');
          
          if (filterValue === 'all' || cardCategories.includes(filterValue)) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px) scale(0.96)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });

        // Trigger Lenis resize calculation
        if (lenis) {
          setTimeout(() => lenis.resize(), 320);
        }
      });
    });
  }

  /* --- 7. Toast Notification Utility --- */
  function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconSvg =
      type === 'success'
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

    toast.innerHTML = `
      <div class="toast-icon ${type}">${iconSvg}</div>
      <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    // Trigger reveal
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }

  /* --- 8. Contact Form Client-Side Validation --- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.querySelector('#contact-name');
      const emailInput = document.querySelector('#contact-email');
      const subjectInput = document.querySelector('#contact-subject');
      const messageInput = document.querySelector('#contact-message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      // Helper to set error
      function setError(input, message) {
        isValid = false;
        const group = input.closest('.form-group');
        if (group) {
          group.classList.add('has-error');
          let errorEl = group.querySelector('.form-error');
          if (errorEl) errorEl.textContent = message;
        }
      }

      function clearError(input) {
        const group = input.closest('.form-group');
        if (group) {
          group.classList.remove('has-error');
        }
      }

      // Reset errors
      [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
        if (input) clearError(input);
      });

      // Name validation
      if (!nameInput || nameInput.value.trim().length < 2) {
        setError(nameInput, 'Please provide your name (at least 2 characters).');
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailPattern.test(emailInput.value.trim())) {
        setError(emailInput, 'Please provide a valid email address.');
      }

      // Subject validation
      if (subjectInput && subjectInput.value.trim().length === 0) {
        setError(subjectInput, 'Please select or enter a subject.');
      }

      // Message validation
      if (!messageInput || messageInput.value.trim().length < 10) {
        setError(messageInput, 'Message must be at least 10 characters long.');
      }

      if (isValid) {
        // Show loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin" style="width: 18px; height: 18px; animation: spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sending Message...
        `;

        // Simulate successful submission
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          contactForm.reset();
          showToast('Thank you! Your message has been sent successfully. I will get back to you soon.', 'success');
        }, 1200);
      } else {
        showToast('Please correct the errors in the form before submitting.', 'error');
      }
    });

    // Real-time error clearance on input
    contactForm.querySelectorAll('input, textarea, select').forEach((field) => {
      field.addEventListener('input', () => {
        const group = field.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          group.classList.remove('has-error');
        }
      });
    });
  }

  // Spinner animation style helper
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);

  /* --- 9. Live Performance & Display Diagnostics Inspector --- */
  (function initFpsMonitor() {
    let frameCount = 0;
    let lastTime = performance.now();
    let detectedHz = 60;

    // Create floating badge
    const badge = document.createElement('div');
    badge.className = 'fps-monitor-badge';
    badge.innerHTML = `
      <div class="fps-pill" id="fps-toggle" title="Click to open Display & Motion Diagnostics">
        <span class="fps-dot"></span>
        <span class="fps-value" id="fps-val">--</span> FPS
        <span class="fps-hz" id="fps-hz"></span>
      </div>
      <div class="fps-modal" id="fps-modal" style="display:none;">
        <div class="fps-modal-header">
          <strong>Display &amp; Motion Diagnostics</strong>
          <button id="fps-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="fps-modal-body">
          <div class="diag-row"><span>Live Rendering:</span> <strong id="diag-fps">-- FPS</strong></div>
          <div class="diag-row"><span>Monitor Refresh (V-Sync):</span> <strong id="diag-hz">Detecting...</strong></div>
          <div class="diag-row"><span>Frame Budget:</span> <strong id="diag-budget">-- ms</strong></div>
          <div class="diag-status" id="diag-status">Analyzing hardware display pipeline...</div>
          <div class="spring-controls" style="margin-top:0.75rem; padding-top:0.5rem; border-top:1px solid var(--border-color);">
            <div style="font-weight:700; margin-bottom:0.4rem; color:var(--accent-primary);">Spring Physics Preset:</div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.4rem;">
              <button class="spring-btn active" data-preset="spring">Spring Elastic</button>
              <button class="spring-btn" data-preset="deep">Deep Float</button>
              <button class="spring-btn" data-preset="bouncy">Bouncy Spring</button>
              <button class="spring-btn" data-preset="snappy">Crisp Direct</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(badge);

    // Measurement loop
    function measure(now) {
      frameCount++;
      const delta = now - lastTime;

      if (delta >= 400) {
        const currentFps = Math.round((frameCount * 1000) / delta);
        frameCount = 0;
        lastTime = now;

        const fpsVal = document.getElementById('fps-val');
        const fpsHz = document.getElementById('fps-hz');
        const diagFps = document.getElementById('diag-fps');
        const diagHz = document.getElementById('diag-hz');
        const diagBudget = document.getElementById('diag-budget');
        const diagStatus = document.getElementById('diag-status');

        if (fpsVal) fpsVal.textContent = currentFps;
        if (diagFps) diagFps.textContent = `${currentFps} FPS`;

        // Estimate screen refresh rate
        if (currentFps > 105) detectedHz = 120;
        else if (currentFps > 80) detectedHz = 90;
        else if (currentFps > 45) detectedHz = 60;
        else detectedHz = 30;

        if (fpsHz) fpsHz.textContent = `(${detectedHz}Hz)`;
        if (diagHz) diagHz.textContent = `${detectedHz}Hz Display`;
        if (diagBudget) diagBudget.textContent = `${(1000 / Math.max(1, currentFps)).toFixed(1)} ms / frame`;

        if (diagStatus) {
          if (detectedHz >= 120) {
            diagStatus.innerHTML = `<span style="color:var(--success); font-weight:600;">✔ 120 FPS High-Refresh: Running at full 120Hz ProMotion speed with Lenis spring inertia.</span>`;
          } else if (detectedHz === 60) {
            diagStatus.innerHTML = `<span>Display is running at standard 60Hz. If your monitor supports 120Hz/144Hz, enable it in <strong>Windows Settings &gt; System &gt; Display &gt; Advanced display</strong>.</span>`;
          } else {
            diagStatus.innerHTML = `<span style="color:var(--warning); font-weight:600;">⚠️ 30 FPS Cap Detected.<br>Common causes:</span><ul style="margin: 0.3rem 0 0 1rem; list-style:disc; font-size: 0.72rem;"><li>Windows Battery Saver is active</li><li>HDMI cable/port limited to 4K @ 30Hz</li><li>Browser Hardware Acceleration disabled in Settings</li></ul>`;
          }
        }
      }

      requestAnimationFrame(measure);
    }
    requestAnimationFrame(measure);

    // Modal click handling
    const toggle = document.getElementById('fps-toggle');
    const modal = document.getElementById('fps-modal');
    const closeBtn = document.getElementById('fps-close');

    if (toggle && modal) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        modal.style.display = 'none';
      });
    }

    document.addEventListener('click', (e) => {
      if (modal && modal.style.display === 'block' && !badge.contains(e.target)) {
        modal.style.display = 'none';
      }
    });

    // Spring preset switcher
    badge.querySelectorAll('.spring-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        badge.querySelectorAll('.spring-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const preset = btn.getAttribute('data-preset');
        if (!lenis) return;

        if (preset === 'spring') {
          // Default: 1.85s delay with damped harmonic spring
          lenis.options.duration = 1.85;
          lenis.options.lerp = undefined;
          lenis.options.easing = (t) => (t >= 1 ? 1 : 1 - Math.exp(-5.5 * t) * Math.cos(3.8 * t));
          lenis.options.wheelMultiplier = 1.18;
        } else if (preset === 'deep') {
          // Heavy floating liquid drag (ultra delay)
          lenis.options.duration = undefined;
          lenis.options.lerp = 0.045;
          lenis.options.wheelMultiplier = 1.25;
        } else if (preset === 'bouncy') {
          // More pronounced elastic bounce
          lenis.options.duration = 2.1;
          lenis.options.lerp = undefined;
          lenis.options.easing = (t) => (t >= 1 ? 1 : 1 - Math.exp(-4.5 * t) * Math.cos(4.5 * t));
          lenis.options.wheelMultiplier = 1.22;
        } else if (preset === 'snappy') {
          // Direct, crisp response
          lenis.options.duration = undefined;
          lenis.options.lerp = 0.1;
          lenis.options.wheelMultiplier = 1.0;
        }
      });
    });
  })();

  /* --- 9. Custom Cyber Cursor & Magnetic Hover Engine --- */
  (function initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let cursorDot = document.querySelector('.cursor-dot');
    let cursorGlow = document.querySelector('.cursor-glow');
    if (!cursorDot) {
      cursorDot = document.createElement('div');
      cursorDot.className = 'cursor-dot';
      cursorDot.id = 'cursor-dot';
      document.body.appendChild(cursorDot);
    }
    if (!cursorGlow) {
      cursorGlow = document.createElement('div');
      cursorGlow.className = 'cursor-glow';
      cursorGlow.id = 'cursor-glow';
      document.body.appendChild(cursorGlow);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth lerp loop for the glow ring
    function renderCursor() {
      glowX += (mouseX - glowX) * 0.16;
      glowY += (mouseY - glowY) * 0.16;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover Elements (links, buttons, cards, tags)
    function attachHoverHandlers() {
      const hoverTargets = document.querySelectorAll(
        'a, button, input, textarea, select, .project-card, .skill-category-card, .hero-card, .tech-tag, .status-pill, .filter-btn, .metric-item, .profile-avatar-box, .avatar-holographic-ring'
      );

      hoverTargets.forEach((target) => {
        target.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-active');
        });
        target.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-active');
        });
      });
    }
    attachHoverHandlers();

    // Mouse down / up click feedback
    window.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    window.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

    // Magnetic pull effect for buttons
    document.querySelectorAll('.btn, .social-icon-btn, .theme-toggle-btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  })();

  /* --- 10. 3D Card Parallax Tilt & Dynamic Colorful Holographic Glare --- */
  (function init3DCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const tiltCards = document.querySelectorAll(
      '.tilt-card, [data-tilt], .cyber-portrait-card, .hero-card, .project-card, .skill-category-card, .about-card'
    );

    tiltCards.forEach((card) => {
      // Ensure specular glare element exists
      if (!card.querySelector('.tilt-glare')) {
        const glare = document.createElement('div');
        glare.className = 'tilt-glare';
        card.appendChild(glare);
      }

      card.addEventListener('mouseenter', () => {
        card.classList.add('is-tilting');
        card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
      });

      card.addEventListener('mousemove', (e) => {
        card.classList.add('is-tilting');
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const normX = Math.max(-1, Math.min(1, (x - centerX) / centerX));
        const normY = Math.max(-1, Math.min(1, (y - centerY) / centerY));

        const rotateX = normY * -4.5; // Max 4.5 deg pitch - subtle, professional Apple/Linear grade
        const rotateY = normX * 4.5;  // Max 4.5 deg yaw

        card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
        card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
        card.style.setProperty('--norm-x', normX.toFixed(3));
        card.style.setProperty('--norm-y', normY.toFixed(3));
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`;
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-tilting');
        card.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.setProperty('--norm-x', '0');
        card.style.setProperty('--norm-y', '0');
      });
    });
  })();

  /* --- 11. Hero Floating Badges 3D Mouse Parallax --- */
  (function initHeroParallax() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const heroSection = document.querySelector('.hero-section');
    const badges = document.querySelectorAll('.floating-badge, .orbit-badge');
    const heroContent = document.querySelector('.hero-content');

    if (!heroSection) return;

    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth - 0.5) * 2;
      const yPercent = (clientY / window.innerHeight - 0.5) * 2;

      badges.forEach((badge, index) => {
        const factor = (index + 1) * 14;
        badge.style.transform = `translate(${xPercent * factor}px, ${yPercent * factor}px)`;
      });

      if (heroContent) {
        heroContent.style.transform = `translate(${xPercent * 5}px, ${yPercent * 5}px)`;
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      badges.forEach((badge) => {
        badge.style.transform = '';
      });
      if (heroContent) {
        heroContent.style.transform = '';
      }
    });
  })();

  /* --- 12. Interactive Ambient Particle Net Canvas --- */
  (function initParticleCanvas() {
    let canvas = document.getElementById('bg-particles');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'bg-particles';
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -1000, y: -1000, radius: 140 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    // Particle pool
    const count = Math.min(Math.floor(window.innerWidth / 26), 55);
    const particles = [];

    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.size = Math.random() * 2 + 1;
        this.baseSize = this.size;
        this.color = Math.random() > 0.4 ? '#a855f7' : '#06b6d4';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse proximity interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 3;
          this.y -= Math.sin(angle) * force * 3;
          this.size = this.baseSize * 1.5;
        } else {
          this.size = this.baseSize;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles within distance
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const alpha = (1 - dist / 115) * (isDark() ? 0.35 : 0.18);
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  })();

  /* --- 13. Top Neon Scroll Progress Bar --- */
  (function initScrollProgressBar() {
    let progressBar = document.getElementById('scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scroll-progress';
      progressBar.className = 'scroll-progress-bar';
      document.body.prepend(progressBar);
    }

    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    if (window.__lenis) {
      window.__lenis.on('scroll', updateProgress);
    }
    updateProgress();
  })();

  /* --- 14. Metric Number Counter Animation on Scroll --- */
  (function initNumberCounters() {
    const metrics = document.querySelectorAll('.metric-number');
    if (metrics.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const originalText = el.textContent.trim();

            if (originalText.includes('8.7')) {
              animateValue(el, 0, 8.7, 1400, 1, '');
            } else if (originalText.includes('4+')) {
              animateValue(el, 0, 4, 1200, 0, '+');
            }
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    metrics.forEach((m) => observer.observe(m));

    function animateValue(obj, start, end, duration, decimals, suffix) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = start + (end - start) * ease;
        obj.textContent = `${current.toFixed(decimals)}${suffix}`;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  })();

})();

