/* ==========================================================================
   WEBZY — Site behaviour
   No libraries. Progressive enhancement, no fake form success.
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const config = window.WEBZY_CONFIG || {};
  const $ = (selector, context = doc) => context.querySelector(selector);
  const $$ = (selector, context = doc) => Array.from(context.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  /* ---------- Header state ---------- */
  const header = $('[data-header]');
  const syncHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
  };
  syncHeader();

  /* ---------- Mobile menu ---------- */
  const menuToggle = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  let menuOpen = false;
  let lastFocused = null;

  const menuIsOpen = () => menuOpen;

  const setMenu = (open, returnFocus = true) => {
    if (!menu || !menuToggle) return;
    menuOpen = open;
    root.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Mbyll menunë' : 'Hap menunë');
    menu.toggleAttribute('inert', !open);
    menu.setAttribute('aria-hidden', String(!open));
    if (open) {
      lastFocused = doc.activeElement;
      window.setTimeout(() => {
        const first = $('a, button', menu);
        if (first) first.focus({ preventScroll: true });
      }, 60);
    } else if (returnFocus && lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus({ preventScroll: true });
    }
  };

  if (menu) {
    menu.setAttribute('inert', '');
    menu.setAttribute('aria-hidden', 'true');
  }

  menuToggle?.addEventListener('click', () => setMenu(!menuOpen));

  $$('a', menu || doc.createElement('div')).forEach((link) => {
    link.addEventListener('click', () => setMenu(false, false));
  });

  doc.addEventListener('keydown', (event) => {
    if (!menuOpen) return;
    if (event.key === 'Escape') {
      setMenu(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const focusables = [menuToggle, ...$$('a, button', menu)].filter(
      (element) => element && !element.hasAttribute('disabled')
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (menuOpen && window.innerWidth > 820) setMenu(false, false);
  });

  /* ---------- Scroll reveal ---------- */
  const revealItems = $$('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-in'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* ---------- Process progress ---------- */
  const processSection = $('[data-process]');
  const processFill = $('[data-process-fill]');
  const syncProcess = () => {
    if (!processSection || !processFill) return;
    if (reduceMotion) {
      processFill.style.transform = 'scaleX(1)';
      return;
    }
    const rect = processSection.getBoundingClientRect();
    const viewport = window.innerHeight;
    const travel = rect.height + viewport * 0.36;
    const progress = clamp((viewport * 0.72 - rect.top) / travel, 0, 1);
    processFill.style.transform = `scaleX(${progress.toFixed(3)})`;
  };

  /* ---------- One rAF-driven scroll handler ---------- */
  let scrollTicking = false;
  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      syncHeader();
      syncProcess();
      scrollTicking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  syncProcess();

  /* ---------- Hero pointer + scroll parallax ---------- */
  const hero = $('.hero');
  if (hero && !reduceMotion) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let heroRaf = 0;

    const animateHero = () => {
      currentX += (targetX - currentX) * 0.065;
      currentY += (targetY - currentY) * 0.065;
      hero.style.setProperty('--hx', currentX.toFixed(4));
      hero.style.setProperty('--hy', currentY.toFixed(4));
      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        heroRaf = window.requestAnimationFrame(animateHero);
      } else {
        heroRaf = 0;
      }
    };

    const startHeroAnim = () => {
      if (!heroRaf) heroRaf = window.requestAnimationFrame(animateHero);
    };

    if (finePointer) {
      hero.addEventListener(
        'pointermove',
        (event) => {
          const rect = hero.getBoundingClientRect();
          targetX = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
          targetY = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
          startHeroAnim();
        },
        { passive: true }
      );
      hero.addEventListener('pointerleave', () => {
        targetX = 0;
        targetY = 0;
        startHeroAnim();
      });
    }

    let lastHeroScroll = -1;
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > window.innerHeight * 1.2) return;
        const shift = Math.round(Math.min(window.scrollY * 0.045, 26));
        if (shift !== lastHeroScroll) {
          hero.style.setProperty('--hero-scroll', shift);
          lastHeroScroll = shift;
        }
      },
      { passive: true }
    );
  }

  /* ---------- Card spotlight ---------- */
  if (!reduceMotion && finePointer) {
    $$('.service-card').forEach((card) => {
      card.addEventListener(
        'pointermove',
        (event) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
          card.style.setProperty('--my', `${event.clientY - rect.top}px`);
        },
        { passive: true }
      );
    });
  }

  /* ---------- 3D tilt + glare ---------- */
  if (!reduceMotion && finePointer) {
    $$('.price-card, .service-card, .work-media, .portfolio-card__media').forEach((el) => {
      const max = el.classList.contains('service-card') ? 4 : 7;
      // Work cards are covered by a full-size link, so listen on the card itself.
      const host = el.closest('.work-card') || el;
      el.setAttribute('data-tilt', '');
      if (!el.classList.contains('service-card')) {
        const glare = doc.createElement('span');
        glare.className = 'tilt-glare';
        glare.setAttribute('aria-hidden', 'true');
        el.appendChild(glare);
      }
      let raf = 0;
      host.addEventListener(
        'pointermove',
        (event) => {
          const rect = el.getBoundingClientRect();
          const px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
          const py = clamp((event.clientY - rect.top) / rect.height, 0, 1);
          window.cancelAnimationFrame(raf);
          raf = window.requestAnimationFrame(() => {
            el.classList.add('is-tilting');
            el.style.setProperty('--ry', `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
            el.style.setProperty('--rx', `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
            el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
            el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
          });
        },
        { passive: true }
      );
      host.addEventListener('pointerleave', () => {
        window.cancelAnimationFrame(raf);
        el.classList.remove('is-tilting');
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });

    /* Magnetic buttons */
    $$('.btn--primary, .pay-btn, .wa-float').forEach((btn) => {
      btn.addEventListener(
        'pointermove',
        (event) => {
          const rect = btn.getBoundingClientRect();
          const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
          const y = (event.clientY - rect.top - rect.height / 2) * 0.26;
          btn.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
        },
        { passive: true }
      );
      btn.addEventListener('pointerleave', () => {
        btn.style.translate = '';
      });
    });
  }

  /* ---------- Price count-up ---------- */
  const amounts = $$('.price-card__amount');
  if (!reduceMotion && amounts.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          countObserver.unobserve(entry.target);
          const el = entry.target;
          const { end, suffix } = el.dataset;
          const startTime = performance.now();
          const duration = 1500;
          const tick = (now) => {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 4);
            el.textContent = `${Math.round(Number(end) * eased)}${suffix}`;
            if (t < 1) window.requestAnimationFrame(tick);
          };
          window.requestAnimationFrame(tick);
        });
      },
      { threshold: 0.6 }
    );
    amounts.forEach((el) => {
      const match = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!match) return;
      el.dataset.end = match[1];
      el.dataset.suffix = match[2];
      el.setAttribute('aria-label', el.textContent.trim());
      el.textContent = `0${match[2]}`;
      countObserver.observe(el);
    });
  }

  /* ---------- Scroll progress ---------- */
  if (!reduceMotion) {
    const progressBar = doc.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(progressBar);
    let progressRaf = 0;
    const syncProgress = () => {
      progressRaf = 0;
      const max = root.scrollHeight - window.innerHeight;
      const progress = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;
    };
    syncProgress();
    window.addEventListener(
      'scroll',
      () => {
        if (!progressRaf) progressRaf = window.requestAnimationFrame(syncProgress);
      },
      { passive: true }
    );
    window.addEventListener('resize', syncProgress, { passive: true });
  }

  /* ---------- Editable contact details ---------- */
  const contactEmail = String(config.contactEmail || config.email || '').trim();
  const emailIsPlaceholder =
    config.emailPlaceholder === true || /\.example$/i.test(contactEmail);
  const instagramIsPlaceholder =
    config.instagramPlaceholder === true ||
    /yourhandle/i.test(String(config.instagramHandle || ''));

  if (contactEmail) {
    $$('[data-email-link]').forEach((link) => {
      link.href = `mailto:${contactEmail}`;
      if (link.closest('.contact__detail')) link.textContent = contactEmail;
      if (emailIsPlaceholder) {
        link.title = 'Editable placeholder — set your business email in assets/js/config.js';
      }
    });
    $$('[data-email-text]').forEach((el) => {
      el.textContent = contactEmail;
    });
    $$('[data-email-placeholder]').forEach((el) => {
      el.hidden = !emailIsPlaceholder;
    });
  }

  if (config.instagramUrl) {
    $$('[data-instagram]').forEach((link) => {
      link.href = config.instagramUrl;
      if (instagramIsPlaceholder) {
        link.title = 'Editable placeholder — set your Instagram profile in assets/js/config.js';
      }
    });
  }
  if (config.instagramHandle) {
    $$('[data-instagram-handle]').forEach((el) => {
      el.textContent = config.instagramHandle;
    });
  }
  $$('[data-instagram-placeholder]').forEach((el) => {
    el.hidden = !instagramIsPlaceholder;
  });

  /* WhatsApp stays hidden until a number is set in config.js. */
  const whatsappNumber = String(config.whatsappNumber || '').replace(/\D/g, '');
  if (whatsappNumber) {
    const whatsappUrl =
      `https://wa.me/${whatsappNumber}` +
      (config.whatsappMessage ? `?text=${encodeURIComponent(config.whatsappMessage)}` : '');
    $$('[data-whatsapp]').forEach((link) => {
      link.href = whatsappUrl;
      link.hidden = false;
    });
    $$('[data-whatsapp-item]').forEach((el) => {
      el.hidden = false;
    });
    $$('[data-whatsapp-text]').forEach((el) => {
      el.textContent = `+${whatsappNumber}`;
    });
  }

  /* Hide developer-facing setup notes once the real details are connected. */
  const formEndpoint = String(config.formEndpoint || '').trim();
  const endpointConfigured = Boolean(formEndpoint);
  if (!emailIsPlaceholder && !instagramIsPlaceholder && endpointConfigured) {
    $$('[data-config-note]').forEach((el) => {
      el.hidden = true;
    });
  }

  /* ---------- Service pre-selection ---------- */
  const websiteType = $('#websiteType');
  const setService = (value) => {
    if (!websiteType || !value) return;
    const option = Array.from(websiteType.options).find(
      (item) => item.value === value || item.textContent.trim() === value
    );
    if (option) {
      websiteType.value = option.value;
      websiteType.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get('service');
  if (requestedService) {
    setService(requestedService);
    if (window.location.hash === '#contact') {
      window.setTimeout(() => {
        $('[data-inquiry-form]')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }, 180);
    }
  }

  $$('[data-service]').forEach((link) => {
    link.addEventListener('click', () => setService(link.dataset.service));
  });

  /* ---------- Inquiry form ---------- */
  const form = $('[data-inquiry-form]');
  if (form) {
    const status = $('[data-form-status]', form.parentElement || doc) || $('[data-form-status]');
    const setupNote = $('[data-form-setup]');
    const submit = $('[data-submit]', form);
    const submitLabel = $('[data-submit-label]', form);
    const spinner = $('[data-spinner]', form);
    const endpoint = formEndpoint;
    const fields = {
      name: $('#name', form),
      email: $('#email', form),
      websiteType: $('#websiteType', form),
      description: $('#description', form),
      consent: $('#consent', form)
    };

    if (setupNote) setupNote.hidden = endpoint.length > 0;

    const messages = {
      name: 'Shkruani emrin (së paku 2 shkronja).',
      email: 'Shkruani një adresë email-i të saktë.',
      websiteType: 'Zgjidhni llojin e faqes.',
      description: 'Na shkruani pak më shumë — së paku 20 shkronja.',
      consent: 'Konfirmoni që pajtoheni me informacionin për privatësinë.'
    };

    const fieldWrap = (field) => field?.closest('.field');
    const errorFor = (name) => $(`[data-error-for="${name}"]`, form);

    const setFieldError = (name, message) => {
      const field = fields[name];
      const wrap = fieldWrap(field);
      const error = errorFor(name);
      if (!field) return;
      if (message) {
        field.setAttribute('aria-invalid', 'true');
        wrap?.classList.add('has-error');
        if (error) {
          error.textContent = message;
          error.classList.add('is-visible');
        }
      } else {
        field.removeAttribute('aria-invalid');
        wrap?.classList.remove('has-error');
        if (error) {
          error.textContent = '';
          error.classList.remove('is-visible');
        }
      }
    };

    const validateField = (name) => {
      const field = fields[name];
      if (!field) return true;
      let message = '';
      const value = field.type === 'checkbox' ? field.checked : field.value.trim();

      if (name === 'name' && (typeof value !== 'string' || value.length < 2)) {
        message = messages.name;
      }
      if (name === 'email' && (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))) {
        message = messages.email;
      }
      if (name === 'websiteType' && !value) {
        message = messages.websiteType;
      }
      if (name === 'description' && (typeof value !== 'string' || value.length < 20)) {
        message = messages.description;
      }
      if (name === 'consent' && value !== true) {
        message = messages.consent;
      }

      setFieldError(name, message);
      return !message;
    };

    Object.entries(fields).forEach(([name, field]) => {
      if (!field) return;
      const eventName = field.tagName === 'SELECT' || field.type === 'checkbox' ? 'change' : 'input';
      field.addEventListener(eventName, () => {
        if (field.getAttribute('aria-invalid') === 'true') validateField(name);
      });
      field.addEventListener('blur', () => {
        if (field.value || field.checked) validateField(name);
      });
    });

    const setStatus = (state, title, message) => {
      if (!status) return;
      status.hidden = false;
      status.className = `form-status form-status--${state}`;
      status.replaceChildren();

      const dot = doc.createElement('span');
      dot.className = `status-dot status-dot--${
        state === 'success' ? 'green' : state === 'error' ? 'warm' : 'warm'
      }`;
      dot.setAttribute('aria-hidden', 'true');

      const copy = doc.createElement('div');
      const heading = doc.createElement('span');
      heading.className = 'form-status__title';
      heading.textContent = title;
      copy.appendChild(heading);
      copy.appendChild(doc.createTextNode(' '));
      copy.appendChild(doc.createTextNode(message));

      status.appendChild(dot);
      status.appendChild(copy);
      status.focus({ preventScroll: true });
    };

    const setSubmitting = (isSubmitting) => {
      if (!submit) return;
      submit.disabled = isSubmitting;
      submit.setAttribute('aria-busy', String(isSubmitting));
      if (submitLabel) submitLabel.textContent = isSubmitting ? 'Duke dërguar…' : 'Dërgo kërkesën';
      if (spinner) spinner.hidden = !isSubmitting;
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!status) return;

      const honeypot = $('[name="_gotcha"]', form);
      if (honeypot && honeypot.value) {
        setStatus('error', 'Dërgimi u bllokua', 'Kërkesa nuk u përpunua. Provoni përsëri pa plotësim automatik.');
        return;
      }

      const validity = Object.keys(fields).map((name) => validateField(name));
      if (validity.includes(false)) {
        setStatus('error', 'Kontrolloni fushat e shënuara', 'Disa të dhëna të detyrueshme mungojnë ose duhen rregulluar.');
        const firstInvalid = Object.entries(fields).find(([name]) => {
          const field = fields[name];
          return field && field.getAttribute('aria-invalid') === 'true';
        });
        if (firstInvalid) {
          const field = firstInvalid[1];
          field.focus({ preventScroll: false });
          field.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
        return;
      }

      if (!endpoint) {
        setStatus(
          'setup',
          'Formulari nuk është i lidhur',
          'Mesazhi nuk u dërgua. Na shkruani direkt në email.'
        );
        return;
      }

      setSubmitting(true);
      if (setupNote) setupNote.hidden = true;

      const payload = new FormData(form);
      payload.delete('_gotcha');
      payload.set('_subject', config.subject || 'Kërkesë e re për projekt — WEBZY');
      payload.set('page', window.location.href);
      payload.set('submittedAt', new Date().toISOString());

      try {
        let response;
        if (config.formFormat === 'json') {
          const object = {};
          payload.forEach((value, key) => {
            object[key] = value;
          });
          response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(object)
          });
        } else {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: payload
          });
        }

        const rawBody = await response.text();
        let result = null;
        if (rawBody) {
          try {
            result = JSON.parse(rawBody);
          } catch {
            result = null;
          }
        }

        if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`);

        let formsubmitEndpoint = false;
        try {
          formsubmitEndpoint = /(^|\.)formsubmit\.co$/i.test(new URL(endpoint, window.location.href).hostname);
        } catch {
          formsubmitEndpoint = false;
        }

        /* FormSubmit can answer HTTP 200 with success:"false". Require an
           explicit JSON confirmation from that provider so a non-JSON page
           can never be mistaken for a delivered inquiry. */
        if (formsubmitEndpoint && !result) {
          throw new Error('FormSubmit returned an unreadable response');
        }

        if (result) {
          const success = result.success;
          const rejected =
            success === false ||
            String(success).toLowerCase() === 'false' ||
            result.ok === false;
          if (rejected) {
            const providerMessage = String(result.message || result.error || 'Shërbimi i formularit e refuzoi kërkesën.');
            if (/activation/i.test(providerMessage)) {
              setStatus(
                'setup',
                'Formulari duhet aktivizuar',
                `Formulari ende nuk është aktivizuar. Na shkruani direkt në ${contactEmail}.`
              );
              return;
            }
            throw new Error(providerMessage);
          }
        }

        setStatus(
          'success',
          config.successTitle || 'Kërkesa u dërgua',
          config.successMessage || 'Kërkesa juaj u dërgua me sukses.'
        );
        form.reset();
        Object.keys(fields).forEach((name) => setFieldError(name, ''));
        if (setupNote) setupNote.hidden = true;
      } catch (error) {
        setStatus(
          'error',
          'Mesazhi nuk u dërgua',
          config.errorMessage ||
            'Diçka shkoi keq dhe mesazhi nuk u dërgua. Provoni përsëri.'
        );
        if (window.console && console.warn) {
          console.warn('WEBZY form submission failed:', error);
        }
      } finally {
        setSubmitting(false);
      }
    });
  }

  /* ---------- Current year ---------- */
  $$('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
