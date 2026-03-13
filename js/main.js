(() => {
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleText = themeToggle?.querySelector('.theme-toggle-text');
  const themeToggleIcon = themeToggle?.querySelector('.theme-toggle-icon');

  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const messageField = document.getElementById('mensaje');

  let gallery = [];
  let galleryIndex = 0;

  const THEME_KEY = 'lgm-theme';

  const normalizeCubanPhone = (raw) => {
    if (!raw) return '';
    let cleaned = raw.replace(/[^\d]/g, '');
    if (cleaned.startsWith('53')) cleaned = cleaned.slice(2);
    if (cleaned.length === 8 && cleaned[0] === '5') {
      return `+53 ${cleaned.slice(0,1)} ${cleaned.slice(1,4)} ${cleaned.slice(4)}`;
    }
    return raw;
  };

  const setupPhoneNormalization = () => {
    const phoneInputs = document.querySelectorAll('[data-normalize-phone]');
    phoneInputs.forEach((input) => {
      input.addEventListener('blur', () => {
        const normalized = normalizeCubanPhone(input.value);
        if (normalized !== input.value) {
          input.value = normalized;
        }
      });
      input.addEventListener('paste', (e) => {
        setTimeout(() => {
          const normalized = normalizeCubanPhone(input.value);
          if (normalized !== input.value) {
            input.value = normalized;
          }
        }, 10);
      });
    });
  };

  const applyTheme = (theme) => {
    const html = document.documentElement;

    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }

    if (themeToggleText) {
      themeToggleText.textContent = theme === 'light' ? 'Modo claro' : 'Modo oscuro';
    }

    if (themeToggleIcon) {
      themeToggleIcon.textContent = theme === 'light' ? '☀' : '☾';
    }
  };

  const getInitialTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  };

  if (themeToggle) {
    const initial = getInitialTheme();
    applyTheme(initial);

    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  const openModal = ({ src, title, images }) => {
    gallery = images && images.length ? images : [src];
    galleryIndex = 0;

    if (src) {
      galleryIndex = Math.max(0, gallery.indexOf(src));
    }

    modalTitle.textContent = title || '';
    modalImage.src = gallery[galleryIndex];
    modalImage.alt = title || 'Imagen del vestido';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    updateModalControls();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const updateModalControls = () => {
    const showControls = gallery.length > 1;
    prevBtn.disabled = !showControls;
    nextBtn.disabled = !showControls;
    prevBtn.style.opacity = showControls ? '1' : '0.4';
    nextBtn.style.opacity = showControls ? '1' : '0.4';
  };

  const showIndex = (idx) => {
    if (!gallery.length) return;
    galleryIndex = (idx + gallery.length) % gallery.length;
    modalImage.src = gallery[galleryIndex];
  };

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    siteNav.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement) {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.addEventListener('click', (e) => {
    const target = e.target;

    if (!(target instanceof Element)) return;

    const openModalBtn = target.closest('[data-open-modal]');
    if (openModalBtn) {
      const src = openModalBtn.getAttribute('data-src') || '';
      const title = openModalBtn.getAttribute('data-title') || '';
      openModal({ src, title, images: [src] });
      return;
    }

    const openGalleryBtn = target.closest('[data-open-gallery]');
    if (openGalleryBtn) {
      const title = openGalleryBtn.getAttribute('data-title') || '';
      const imagesAttr = openGalleryBtn.getAttribute('data-images') || '';
      const images = imagesAttr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const first = images[0] || '';
      openModal({ src: first, title, images });
      return;
    }

    const close = target.closest('[data-close-modal]');
    if (close) {
      closeModal();
      return;
    }

    const thumb = target.closest('[data-thumb]');
    if (thumb) {
      const card = thumb.closest('.card');
      if (!card) return;

      const img = card.querySelector('.card-media img');
      const btn = card.querySelector('.image-button');
      const targetSrc = thumb.getAttribute('data-target') || '';
      if (img && targetSrc) {
        img.src = targetSrc;
      }

      card.querySelectorAll('.thumb').forEach((t) => t.classList.remove('is-active'));
      thumb.classList.add('is-active');

      if (btn && btn.hasAttribute('data-images')) {
        const title = btn.getAttribute('data-title') || '';
        btn.setAttribute('data-open-gallery', '');
        btn.setAttribute('data-title', title);
      }

      return;
    }

    const prefillLink = target.closest('[data-prefill]');
    if (prefillLink) {
      const dress = prefillLink.getAttribute('data-prefill') || '';
      if (dress && messageField) {
        const base = messageField.value.trim();
        const prefix = `Hola, me interesa el ${dress}. `;
        messageField.value = base ? `${prefix}${base}` : prefix;
      }
    }
  });

  prevBtn?.addEventListener('click', () => showIndex(galleryIndex - 1));
  nextBtn?.addEventListener('click', () => showIndex(galleryIndex + 1));

  document.addEventListener('keydown', (e) => {
    const isOpen = modal.classList.contains('is-open');
    if (!isOpen) return;

    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showIndex(galleryIndex - 1);
    if (e.key === 'ArrowRight') showIndex(galleryIndex + 1);
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (formNote) {
        formNote.textContent = 'Mensaje listo. Copia y envíalo por WhatsApp o tu canal preferido.';
      }
    });
  }

  setupPhoneNormalization();
})();
