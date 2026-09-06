/**
 * ==========================================================================
 * INSEC interior | Luxury Architectural Landing Page Engine
 * Features:
 *  - Studio Freight Lenis Smooth Momentum Scrolling
 *  - GSAP & ScrollTrigger Integration with synced RAF ticker
 *  - Hero entrance timeline & scroll-driven parallax
 *  - Staggered card reveals & form slide-in animations
 *  - Magnetic button hover physics
 *  - Custom ambient luxury gold cursor
 *  - Interactive validated lead generation contact form
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. Lenis Smooth Momentum Scroll & GSAP ScrollTrigger Integration
  // ------------------------------------------------------------------------
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis with smooth momentum physics
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious deceleration
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 1.5,
  });

  // Synchronize Lenis scroll position with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Bind Lenis RAF loop to GSAP's internal ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Turn off lagSmoothing to avoid frame skipping during rapid scrolls
  gsap.ticker.lagSmoothing(0);

  // Smooth anchor scrolling handler
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          // Close mobile drawer if open
          closeMobileDrawer();

          // Smooth scroll to target with offset for sticky header
          lenis.scrollTo(targetElement, {
            offset: -80,
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    });
  });

  // ------------------------------------------------------------------------
  // 2. Custom Ambient Gold Cursor & Interactive States
  // ------------------------------------------------------------------------
  const customCursor = document.getElementById('customCursor');
  const cursorDot = document.getElementById('cursorDot');

  if (customCursor && cursorDot && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Position the small center dot instantly
      gsap.to(cursorDot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out',
      });
    });

    // Animate the larger trailing ring smoothly via GSAP ticker
    gsap.ticker.add(() => {
      const dt = 1.0 - Math.pow(1.0 - 0.2, gsap.ticker.deltaRatio());
      cursorX += (mouseX - cursorX) * dt;
      cursorY += (mouseY - cursorY) * dt;

      customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    });

    // Interactive element hover states
    const interactiveTargets = document.querySelectorAll(
      'a, button, input, textarea, select, .service-card, .pillar-item, .luxury-quote-card'
    );

    interactiveTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        customCursor.classList.add('active');
      });
      target.addEventListener('mouseleave', () => {
        customCursor.classList.remove('active');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 3. Magnetic Hover Physics on Buttons
  // ------------------------------------------------------------------------
  const magneticButtons = document.querySelectorAll('.magnetic-btn');

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    magneticButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const distanceX = e.clientX - btnCenterX;
        const distanceY = e.clientY - btnCenterY;

        // Attract button toward cursor slightly
        gsap.to(btn, {
          x: distanceX * 0.35,
          y: distanceY * 0.35,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      btn.addEventListener('mouseleave', () => {
        // Snap back smoothly
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.3)',
        });
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. Sticky Header Dynamic State on Scroll
  // ------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // Active navigation link tracking on scroll
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // ------------------------------------------------------------------------
  // 5. Mobile Navigation Drawer Controls
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta');

  function openMobileDrawer() {
    mobileToggle.classList.add('is-open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    lenis.stop(); // Pause body scrolling when drawer is active
  }

  function closeMobileDrawer() {
    mobileToggle.classList.remove('is-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    lenis.start(); // Resume smooth scrolling
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.contains('is-open');
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // ------------------------------------------------------------------------
  // 6. GSAP Hero Section Load Timeline Animation
  // ------------------------------------------------------------------------
  const heroTimeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
  });

  // Stagger reveal of hero elements on initial page entry
  heroTimeline
    .from('.site-header', {
      y: -60,
      opacity: 0,
      duration: 1.0,
      ease: 'power2.out',
    })
    .from(
      '#heroBadge',
      {
        y: 25,
        opacity: 0,
        duration: 0.8,
      },
      '-=0.5'
    )
    .from(
      '.title-line',
      {
        y: 60,
        opacity: 0,
        duration: 1.1,
        stagger: 0.2,
        ease: 'power4.out',
      },
      '-=0.6'
    )
    .from(
      '#heroDesc',
      {
        y: 30,
        opacity: 0,
        duration: 0.9,
      },
      '-=0.7'
    )
    .from(
      '#heroCtaGroup .btn',
      {
        y: 25,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      },
      '-=0.6'
    )
    .from(
      '.hero-visual-card',
      {
        scale: 0.92,
        opacity: 0,
        rotationY: -5,
        duration: 1.3,
        ease: 'power3.out',
      },
      '-=1.0'
    )
    .from(
      '.stat-item',
      {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      },
      '-=0.8'
    )
    .from(
      '#scrollIndicator',
      {
        opacity: 0,
        y: -15,
        duration: 0.8,
      },
      '-=0.4'
    );

  // ------------------------------------------------------------------------
  // 7. Hero Visual Scroll Parallax
  // ------------------------------------------------------------------------
  gsap.to('.hero-img', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // ------------------------------------------------------------------------
  // 8. Services Section Staggered ScrollTrigger Reveal
  // ------------------------------------------------------------------------
  gsap.from('.services-section .section-header > *', {
    scrollTrigger: {
      trigger: '.services-section',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    y: 35,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
  });

  // Feature cards staggered entrance with scaling & 3D tilt
  const serviceCards = gsap.utils.toArray('.service-card');
  gsap.from(serviceCards, {
    scrollTrigger: {
      trigger: '#servicesGrid',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
    y: 70,
    opacity: 0,
    scale: 0.94,
    duration: 1.1,
    stagger: 0.22,
    ease: 'power3.out',
  });

  // ------------------------------------------------------------------------
  // 9. Philosophy Section Reveal
  // ------------------------------------------------------------------------
  gsap.from('.philosophy-text-col > *', {
    scrollTrigger: {
      trigger: '#philosophy',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
    x: -40,
    opacity: 0,
    duration: 1,
    stagger: 0.18,
    ease: 'power3.out',
  });

  gsap.from('.luxury-quote-card', {
    scrollTrigger: {
      trigger: '#philosophy',
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
    scale: 0.9,
    opacity: 0,
    x: 40,
    duration: 1.2,
    ease: 'power3.out',
  });

  // ------------------------------------------------------------------------
  // 10. Contact Form Dynamic Slide-In Animation
  // ------------------------------------------------------------------------
  gsap.from('#contactInfo > *', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
    x: -35,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
  });

  gsap.from('#contactFormCol', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
    y: 60,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out',
  });

  // Animate individual form groups sliding in dynamically
  const formGroups = gsap.utils.toArray('#leadGenForm .form-group, #leadGenForm .form-row');
  gsap.from(formGroups, {
    scrollTrigger: {
      trigger: '#leadGenForm',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    y: 25,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power2.out',
  });

  // ------------------------------------------------------------------------
  // 11. Lead Generation Form Validation & Submission
  // ------------------------------------------------------------------------
  const leadGenForm = document.getElementById('leadGenForm');
  const submitBtn = document.getElementById('submitBtn');
  const formFeedback = document.getElementById('formFeedback');

  const fullNameInput = document.getElementById('fullName');
  const emailAddrInput = document.getElementById('emailAddr');
  const phoneNumInput = document.getElementById('phoneNum');
  const projectDetailsInput = document.getElementById('projectDetails');

  // Input validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  function validateField(inputElement, isValid) {
    const group = inputElement.closest('.form-group');
    if (!group) return;

    if (!isValid) {
      group.classList.add('has-error');
    } else {
      group.classList.remove('has-error');
    }
  }

  // Live input error removal on typing
  [fullNameInput, emailAddrInput, phoneNumInput].forEach((input) => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('has-error');
      if (formFeedback) formFeedback.style.display = 'none';
    });
  });

  if (leadGenForm) {
    leadGenForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasErrors = false;

      // Validate Name
      const nameVal = fullNameInput.value.trim();
      if (!nameVal || nameVal.length < 2) {
        validateField(fullNameInput, false);
        hasErrors = true;
      } else {
        validateField(fullNameInput, true);
      }

      // Validate Email
      const emailVal = emailAddrInput.value.trim();
      if (!emailVal || !emailRegex.test(emailVal)) {
        validateField(emailAddrInput, false);
        hasErrors = true;
      } else {
        validateField(emailAddrInput, true);
      }

      // Validate Phone
      const phoneVal = phoneNumInput.value.trim();
      if (!phoneVal || !phoneRegex.test(phoneVal)) {
        validateField(phoneNumInput, false);
        hasErrors = true;
      } else {
        validateField(phoneNumInput, true);
      }

      if (hasErrors) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please review the highlighted fields above before submitting.';
        formFeedback.style.display = 'block';
        return;
      }

      // UI Loading State during simulated consultation submission
      const originalText = submitBtn.querySelector('.btn-text').textContent;
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Transmitting Brief...';
      gsap.to(submitBtn, { scale: 0.98, duration: 0.2 });

      setTimeout(() => {
        // Success state
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = originalText;
        gsap.to(submitBtn, { scale: 1, duration: 0.2 });

        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
          <strong>Inquiry Successfully Received</strong><br>
          Thank you, <em>${nameVal}</em>. Our Design Principal has been briefed and will initiate direct contact via <em>${emailVal}</em> within 24 hours.
        `;
        formFeedback.style.display = 'block';

        // Reset form inputs
        leadGenForm.reset();

        // Staggered celebration flash on the form container
        gsap.fromTo(
          '.form-card-glass',
          { borderColor: '#d4af37', boxShadow: '0 0 50px rgba(212, 175, 55, 0.4)' },
          { borderColor: 'rgba(212, 175, 55, 0.25)', boxShadow: '0 20px 45px rgba(0, 0, 0, 0.65)', duration: 1.5 }
        );
      }, 1000);
    });
  }

  // ------------------------------------------------------------------------
  // 12. Current Year in Footer
  // ------------------------------------------------------------------------
  const yearElem = document.getElementById('currentYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

});
