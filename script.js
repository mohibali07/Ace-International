/* =========================================
   Ace International — Landing Page Scripts
   Features:
   1. Mobile menu toggle
   2. Sticky navbar on scroll + active link highlighting
   3. Back-to-top button
   4. Scroll reveal via IntersectionObserver
   5. Animated count-up timers
   6. FAQ accordion
   7. WhatsApp message builder for quote form
   ========================================= */

(function () {
  'use strict';

  // ------------------------------------------------------------------
  // DOM Elements
  // ------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const backToTop = document.getElementById('backToTop');
  const quoteForm = document.getElementById('quoteForm');
  const submitBtn = document.getElementById('submitBtn');
  const formMsg = document.getElementById('formMsg');

  const WHATSAPP_NUMBER = '923008998211';

  // ------------------------------------------------------------------
  // 1. Mobile Menu
  // ------------------------------------------------------------------
  let menuOpen = false;

  mobileMenuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenuBtn.setAttribute('aria-expanded', menuOpen);
    mobileMenu.classList.toggle('hidden');
    // Toggle icon
    const icon = mobileMenuBtn.querySelector('i');
    if (menuOpen) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuOpen = false;
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      const icon = mobileMenuBtn.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });

  // ------------------------------------------------------------------
  // 2. Navbar scroll state & active link
  // ------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrolled = window.scrollY > 20;
    if (scrolled) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }

    // Back to top visibility
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active section highlighting
    const fromTop = window.scrollY + 120;
    sections.forEach((section) => {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const link = document.querySelector(`.nav-link[href="#${id}"], .mobile-link[href="#${id}"]`);
      if (fromTop >= top && fromTop < bottom && link) {
        // Remove active from all
        document.querySelectorAll('.nav-link, .mobile-link').forEach((l) => {
          l.classList.remove('text-aceGreen', 'font-bold');
          l.classList.add('text-aceBlack/70');
        });
        link.classList.remove('text-aceBlack/70');
        link.classList.add('text-aceGreen', 'font-bold');
      }
    });
  }

  window.addEventListener('scroll', onScroll);
  // Run once on load
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ------------------------------------------------------------------
  // 3. Smooth scroll for anchor links (native scroll-smooth handles it,
  //    but we offset for fixed navbar)
  // ------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight - 10;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ------------------------------------------------------------------
  // 4. Scroll Reveal (IntersectionObserver)
  // ------------------------------------------------------------------
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('active');
          }, parseInt(delay, 10));
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  // ------------------------------------------------------------------
  // 5. Count-up Timers (IntersectionObserver)
  // ------------------------------------------------------------------
  const countUpObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1500; // ms
          const start = 0;
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const current = start + (target - start) * easeProgress;

            if (target === Math.floor(target)) {
              el.textContent = Math.floor(current) + suffix;
            } else {
              el.textContent = current.toFixed(1) + suffix;
            }

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            }
          }

          requestAnimationFrame(updateCount);
          countUpObserver.unobserve(el);
        }
      });
    },
    {
      threshold: 0.4,
      rootMargin: '0px 0px -80px 0px',
    }
  );

  document.querySelectorAll('.count-up').forEach((el) => {
    countUpObserver.observe(el);
  });

  // ------------------------------------------------------------------
  // 6. FAQ Accordion
  // ------------------------------------------------------------------
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const answerId = btn.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);
      const icon = btn.querySelector('.fa-chevron-down');

      // Close all other answers
      faqQuestions.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherAnswer = document.getElementById(otherBtn.getAttribute('aria-controls'));
          const otherIcon = otherBtn.querySelector('.fa-chevron-down');
          if (otherAnswer) otherAnswer.classList.remove('open');
          if (otherIcon) otherIcon.classList.remove('rotate');
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', !isOpen);
      if (!isOpen) {
        answer.classList.add('open');
        if (icon) icon.classList.add('rotate');
      } else {
        answer.classList.remove('open');
        if (icon) icon.classList.remove('rotate');
      }
    });
  });

  // ------------------------------------------------------------------
  // 7. WhatsApp Quote Form Builder
  // ------------------------------------------------------------------
  quoteForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Gather form data
    const name = document.getElementById('qName').value.trim();
    const phone = document.getElementById('qPhone').value.trim();
    const city = document.getElementById('qCity').value.trim();
    const interest = document.getElementById('qInterest').value;
    const herd = document.getElementById('qHerd').value.trim();
    const timeline = document.getElementById('qTimeline').value;
    const message = document.getElementById('qMessage').value.trim();

    // Build WhatsApp message
    const textLines = [
      'Hello Ace International,',
      '',
      '*Parlour Quote Request*',
      `Name: ${name || 'Not provided'}`,
      `Phone/WhatsApp: ${phone || 'Not provided'}`,
      `City: ${city || 'Not provided'}`,
      `Interested In: ${interest.replace('-', ' ')}`,
      `Herd Size: ${herd || 'Not specified'}`,
      `Timeline: ${timeline.replace('-', ' ')}`,
      '',
      `Message: ${message || 'No additional message'}`,
    ];

    const whatsappText = textLines.join('%0A');
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;

    // UI feedback
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Small delay to show spinner, then open WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Quote Request';
      submitBtn.disabled = false;
      formMsg.textContent = 'Opened WhatsApp to send your quote request.';
      formMsg.classList.add('show');

      quoteForm.reset();

      setTimeout(() => {
        formMsg.classList.remove('show');
      }, 5000);
    }, 600);
  });

  // ------------------------------------------------------------------
  // Init year in footer
  // ------------------------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
