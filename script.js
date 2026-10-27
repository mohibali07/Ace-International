/* =========================================
   Ace International — Enhanced Landing Page Logic
   - Responsive Navigation & Active Scroll Spy
   - Product Showcase Filtering & Quick View Modal
   - Interactive Herd Size & Parlour ROI Calculator
   - WhatsApp Quick Chat Drawer & Custom Message Builder
   - FAQ Accordion with Live Search
   - IntersectionObserver Scroll Reveal & Count-up
   ========================================= */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '923008998211';

  // ------------------------------------------------------------------
  // 1. Mobile Menu Toggle
  // ------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const backToTop = document.getElementById('backToTop');

  if (mobileMenuBtn && mobileMenu) {
    let menuOpen = false;
    mobileMenuBtn.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenuBtn.setAttribute('aria-expanded', String(menuOpen));
      mobileMenu.classList.toggle('hidden');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.className = menuOpen ? 'fas fa-times text-xl' : 'fas fa-bars text-xl';
      }
    });

    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuOpen = false;
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars text-xl';
      });
    });
  }

  // ------------------------------------------------------------------
  // 2. Navbar Scroll States & Active Spy
  // ------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrolled = window.scrollY > 30;
    if (navbar) {
      if (scrolled) {
        navbar.classList.add('shadow-md', 'bg-white/95');
        navbar.classList.remove('bg-white/80');
      } else {
        navbar.classList.remove('shadow-md', 'bg-white/95');
        navbar.classList.add('bg-white/80');
      }
    }

    if (backToTop) {
      if (window.scrollY > 450) {
        backToTop.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
        backToTop.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
      } else {
        backToTop.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
        backToTop.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
      }
    }

    // Section highlighting
    const fromTop = window.scrollY + 130;
    sections.forEach((section) => {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const links = document.querySelectorAll(`.nav-link[href="#${id}"]`);

      if (fromTop >= top && fromTop < bottom) {
        document.querySelectorAll('.nav-link').forEach((l) => {
          l.classList.remove('text-aceGreen', 'font-bold', 'border-b-2', 'border-aceYellow');
          l.classList.add('text-aceBlack/75');
        });
        links.forEach((l) => {
          l.classList.remove('text-aceBlack/75');
          l.classList.add('text-aceGreen', 'font-bold');
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ------------------------------------------------------------------
  // 3. Smooth scrolling for anchor links with offset
  // ------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ------------------------------------------------------------------
  // 4. Products Category Filter
  // ------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active', 'bg-aceBlack', 'text-white'));
      filterBtns.forEach((b) => b.classList.add('bg-white', 'text-aceBlack'));
      btn.classList.add('active', 'bg-aceBlack', 'text-white');
      btn.classList.remove('bg-white', 'text-aceBlack');

      const filter = btn.getAttribute('data-filter');
      productCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ------------------------------------------------------------------
  // 5. Product Quick View Modal
  // ------------------------------------------------------------------
  const modal = document.getElementById('quickViewModal');
  const modalClose = document.getElementById('modalClose');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');
  const modalSpecs = document.getElementById('modalSpecs');
  const modalWaBtn = document.getElementById('modalWaBtn');

  // Product specification database
  const productSpecsData = {
    'milking-machine': {
      title: 'Turkish Mobile Milking Machine',
      category: 'Direct Turkish Import',
      image: 'images/hero-machinery.jpg',
      desc: 'Heavy-duty Turkish electric/petrol mobile milking machine equipped with high-efficiency vacuum pump, food-grade AISI 304 stainless steel churn bucket, pneumatic pulsator (60/40 ratio) and gentle silicone teat cup liners for maximum udder health.',
      specs: [
        { label: 'Origin', value: 'Turkey (Official Import)' },
        { label: 'Bucket Capacity', value: '30L / 40L (AISI 304 Stainless Steel)' },
        { label: 'Pulsation Rate', value: '60/40 ratio, Pneumatic Precision' },
        { label: 'Vacuum Pump', value: '200 L/min Dry / Oil Type, 0.55 kW Motor' },
        { label: 'Teat Liners', value: 'Food-grade Turkish Silicone/Rubber' },
        { label: 'Warranty & Support', value: '1 Year Warranty + Nationwide Spares' }
      ],
      waMessage: 'Hello Ace International, I would like to get pricing and specifications for the Turkish Mobile Milking Machine.'
    },
    'milking-parlour': {
      title: 'Commercial Turkish Milking Parlour',
      category: 'Turnkey Solution',
      image: 'images/milking-parlour.jpg',
      desc: 'Turnkey Turkish herringbone (2x4 to 2x16) milking parlours designed for modern commercial dairy operations. Features automated stainless steel milk pipelines, digital milk flow metering, vacuum reserve tanks, and automated wash-in-place (CIP) sanitation.',
      specs: [
        { label: 'Configuration', value: '2x4, 2x6, 2x8 up to 2x16 Herringbone' },
        { label: 'Pipeline Material', value: 'Food-grade AISI 304 Seamless Stainless Steel' },
        { label: 'Milk Metering', value: 'Digital Flow Meters & Herd Management link' },
        { label: 'Vacuum System', value: 'Heavy-duty Turkish Rotary Blower Vacuum Unit' },
        { label: 'Washing System', value: 'Automated CIP (Clean-In-Place) Program' },
        { label: 'Turnkey Delivery', value: 'Design, Layout, Installation & Farm Training' }
      ],
      waMessage: 'Hello Ace International, I would like to request a turnkey consultation and quote for a Commercial Milking Parlour.'
    },
    'cow-brush': {
      title: 'Automatic Swinging Cow Comfort Brush',
      category: 'Animal Welfare & Yield Booster',
      image: 'images/cow-brush.jpg',
      desc: 'Microprocessor-controlled swinging grooming brush that automatically activates when cattle touch it. Gently cleans parasite-prone areas, stimulates blood circulation, relieves stress, and scientifically proven to boost milk yield by 10% to 15%.',
      specs: [
        { label: 'Motor Type', value: '0.12 kW Sealed High-Torque Turkish Gearmotor' },
        { label: 'Activation', value: 'Auto Touch-Sensor with Reverse Jam Protection' },
        { label: 'Bristles', value: 'Durable Anti-Static High-Density Polypropylene' },
        { label: 'Mounting', value: 'Universal Post / Wall Steel Clamping Kit' },
        { label: 'Capacity', value: 'Optimal for herds of 40 to 60 cows per brush' },
        { label: 'Yield Impact', value: '+10% to +15% recorded milk production increase' }
      ],
      waMessage: 'Hello Ace International, I want to order Automatic Cow Comfort Brushes. Please share pricing and delivery details.'
    },
    'spare-parts': {
      title: '100% Genuine Turkish Spare Parts',
      category: 'In Stock • 24h Dispatch',
      image: 'images/spare-parts.jpg',
      desc: 'Full inventory of genuine Turkish replacement parts in Faisalabad: pneumatic pulsators, vacuum regulators, transparent milk claws, food-grade silicone liners, vacuum gauges, non-return valves, gaskets, and food-grade milk delivery tubing.',
      specs: [
        { label: 'Compatibility', value: 'Universal fit for all Turkish & European machines' },
        { label: 'Key Spares in Stock', value: 'Pulsators, Liners, Claws, Gauges, Vane Sets' },
        { label: 'Teat Liner Material', value: 'Certified Medical/Food Grade Silicone & Rubber' },
        { label: 'Delivery Time', value: 'Same-day dispatch; 24-48h anywhere in Pakistan' },
        { label: 'Wholesale & Retail', value: 'Individual spares or bulk dealer packs available' }
      ],
      waMessage: 'Hello Ace International, I need genuine spare parts for my dairy equipment. Please share parts catalog and prices.'
    }
  };

  document.querySelectorAll('.open-quick-view').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productKey = btn.getAttribute('data-product');
      const data = productSpecsData[productKey];
      if (!data || !modal) return;

      modalImg.src = data.image;
      modalImg.alt = data.title;
      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalDesc.textContent = data.desc;

      // Build specs table
      modalSpecs.innerHTML = data.specs.map(s => `
        <div class="flex items-center justify-between py-2 border-b border-black/5 text-sm">
          <span class="text-aceBlack/60 font-medium">${s.label}</span>
          <span class="text-aceBlack font-bold text-right ml-4">${s.value}</span>
        </div>
      `).join('');

      modalWaBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(data.waMessage)}`;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ------------------------------------------------------------------
  // 6. Interactive Herd ROI & Setup Calculator
  // ------------------------------------------------------------------
  const herdSlider = document.getElementById('herdSlider');
  const herdValueDisplay = document.getElementById('herdValueDisplay');
  const calcTimeSaved = document.getElementById('calcTimeSaved');
  const calcYieldBoost = document.getElementById('calcYieldBoost');
  const calcConfigName = document.getElementById('calcConfigName');
  const calcConfigDesc = document.getElementById('calcConfigDesc');
  const calcWaBtn = document.getElementById('calcWaBtn');
  const herdPillBtns = document.querySelectorAll('.herd-preset-btn');

  function updateCalculator(cows) {
    if (!herdSlider) return;
    const count = parseInt(cows, 10);
    herdSlider.value = count;
    if (herdValueDisplay) herdValueDisplay.textContent = `${count} Cows`;

    // Milking time saved: ~7 minutes per cow manual vs ~2.5 mins machine
    const hoursSavedDaily = ((count * 4.5 * 2) / 60).toFixed(1);
    if (calcTimeSaved) calcTimeSaved.textContent = `${hoursSavedDaily} hrs/day`;

    // Approx extra daily yield (avg 1.5L extra per cow from comfort & proper pulsation)
    const extraLiters = Math.round(count * 1.8);
    if (calcYieldBoost) calcYieldBoost.textContent = `+${extraLiters} L / day`;

    let config = '';
    let desc = '';

    if (count <= 15) {
      config = 'Ace 1-Bucket Portable Machine (30L)';
      desc = 'Ideal for small progressive farms. Milks 1 cow in 4-5 mins. Quick setup, portable, low electrical consumption.';
    } else if (count <= 35) {
      config = 'Ace 2-Bucket High-Yield Mobile Trolley';
      desc = 'Milks 2 cows simultaneously. Reduces morning milking to under 45 mins. Equipped with dual Turkish pulsators.';
    } else if (count <= 70) {
      config = 'Ace 2x4 or 2x6 Herringbone Parlour System + 2 Cow Brushes';
      desc = 'Commercial pipeline parlour. Direct milk transfer to chiller, zero milk handling, automated pipeline washing.';
    } else {
      config = 'Ace 2x8 to 2x16 Turnkey Parlour + Automated Grooming Station';
      desc = 'High-throughput industrial dairy setup with digital milk measurement, rapid cow exit, and centralized vacuum system.';
    }

    if (calcConfigName) calcConfigName.textContent = config;
    if (calcConfigDesc) calcConfigDesc.textContent = desc;

    if (calcWaBtn) {
      const msg = `Hello Ace International, I have a herd of ${count} dairy cows. According to your calculator, the ${config} is recommended. Please send me a quote and delivery estimate.`;
      calcWaBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    }

    // Update active preset button
    herdPillBtns.forEach(btn => {
      if (parseInt(btn.getAttribute('data-value'), 10) === count) {
        btn.classList.add('bg-aceYellow', 'text-aceBlack', 'font-bold');
        btn.classList.remove('bg-white', 'text-aceBlack/80');
      } else {
        btn.classList.remove('bg-aceYellow', 'text-aceBlack', 'font-bold');
        btn.classList.add('bg-white', 'text-aceBlack/80');
      }
    });
  }

  if (herdSlider) {
    herdSlider.addEventListener('input', (e) => {
      updateCalculator(e.target.value);
    });

    herdPillBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        updateCalculator(btn.getAttribute('data-value'));
      });
    });

    // Initial calculation
    updateCalculator(herdSlider.value || 30);
  }

  // ------------------------------------------------------------------
  // 7. Floating WhatsApp Drawer
  // ------------------------------------------------------------------
  const floatingWaBtn = document.getElementById('floatingWaBtn');
  const floatingWaDrawer = document.getElementById('floatingWaDrawer');
  const closeWaDrawer = document.getElementById('closeWaDrawer');

  if (floatingWaBtn && floatingWaDrawer) {
    floatingWaBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      floatingWaDrawer.classList.toggle('hidden');
    });

    if (closeWaDrawer) {
      closeWaDrawer.addEventListener('click', (e) => {
        e.stopPropagation();
        floatingWaDrawer.classList.add('hidden');
      });
    }

    document.addEventListener('click', (e) => {
      if (!floatingWaDrawer.contains(e.target) && e.target !== floatingWaBtn) {
        floatingWaDrawer.classList.add('hidden');
      }
    });
  }

  // ------------------------------------------------------------------
  // 8. FAQ Accordion & Live Filter
  // ------------------------------------------------------------------
  const faqQuestions = document.querySelectorAll('.faq-question');
  const faqSearch = document.getElementById('faqSearch');
  const faqItems = document.querySelectorAll('.faq-item');

  faqQuestions.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const answerId = btn.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);
      const icon = btn.querySelector('.fa-chevron-down');

      // Close other accordions
      faqQuestions.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherAnswer = document.getElementById(otherBtn.getAttribute('aria-controls'));
          const otherIcon = otherBtn.querySelector('.fa-chevron-down');
          if (otherAnswer) otherAnswer.classList.remove('open');
          if (otherIcon) otherIcon.classList.remove('rotate');
        }
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen && answer) {
        answer.classList.add('open');
        if (icon) icon.classList.add('rotate');
      } else if (answer) {
        answer.classList.remove('open');
        if (icon) icon.classList.remove('rotate');
      }
    });
  });

  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      faqItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // ------------------------------------------------------------------
  // 9. Quote Form WhatsApp Generator
  // ------------------------------------------------------------------
  const quoteForm = document.getElementById('quoteForm');
  const submitBtn = document.getElementById('submitBtn');
  const formMsg = document.getElementById('formMsg');

  if (quoteForm && submitBtn) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = (document.getElementById('qName')?.value || '').trim();
      const phone = (document.getElementById('qPhone')?.value || '').trim();
      const city = (document.getElementById('qCity')?.value || '').trim();
      const interestEl = document.getElementById('qInterest');
      const interest = interestEl ? interestEl.options[interestEl.selectedIndex].text : 'General Inquiry';
      const herd = (document.getElementById('qHerd')?.value || '').trim();
      const timelineEl = document.getElementById('qTimeline');
      const timeline = timelineEl ? timelineEl.options[timelineEl.selectedIndex].text : 'As soon as possible';
      const message = (document.getElementById('qMessage')?.value || '').trim();

      if (!name || !phone) {
        if (formMsg) {
          formMsg.textContent = 'Please fill in your name and phone number.';
          formMsg.className = 'text-xs text-center text-red-600 font-semibold block';
        }
        return;
      }

      const textLines = [
        '🌟 *NEW INQUIRY — Ace International*',
        '',
        `👤 *Name:* ${name}`,
        `📞 *Phone/WhatsApp:* ${phone}`,
        `📍 *City / Area:* ${city || 'Not specified'}`,
        `🚜 *Product Interest:* ${interest}`,
        `🐄 *Herd Size:* ${herd ? herd + ' cows' : 'Not specified'}`,
        `⏱️ *Timeline:* ${timeline}`,
        '',
        `💬 *Message:* ${message || 'No additional note'}`,
        '',
        '_Sent via Ace International Official Website_'
      ];

      const whatsappText = encodeURIComponent(textLines.join('\n'));
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;

      submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Preparing WhatsApp...';
      submitBtn.disabled = true;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Send Quote Request on WhatsApp';
        submitBtn.disabled = false;
        if (formMsg) {
          formMsg.textContent = '✓ Redirecting to WhatsApp to send your request!';
          formMsg.className = 'text-xs text-center text-aceGreen font-bold block';
        }
        quoteForm.reset();
        setTimeout(() => {
          if (formMsg) formMsg.className = 'hidden';
        }, 6000);
      }, 500);
    });
  }

  // ------------------------------------------------------------------
  // 10. IntersectionObserver for Reveal & Count-up
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
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  const countUpObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1600;
          const startTime = performance.now();

          function updateCount(time) {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;

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
    { threshold: 0.3 }
  );

  document.querySelectorAll('.count-up').forEach((el) => {
    countUpObserver.observe(el);
  });

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
