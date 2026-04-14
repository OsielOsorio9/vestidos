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


  const filterButtons = document.querySelectorAll('[data-filter]');
  const catalogCards = document.querySelectorAll('.card[data-category]');

  let gallery = [];
  let galleryIndex = 0;

  const THEME_KEY = 'lgm-theme';

  // Lazy loading para imágenes
  const setupLazyLoading = () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback para navegadores antiguos
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      });
    }
  };


  const setupCatalogFilters = () => {
    if (!filterButtons.length || !catalogCards.length) return;

    const applyFilter = (filter) => {
      catalogCards.forEach((card) => {
        const category = card.getAttribute('data-category') || '';
        const show = filter === 'all' ? true : category === filter;
        card.classList.toggle('is-hidden', !show);
      });
    };

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'all';

        filterButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        applyFilter(filter);
      });
    });

    applyFilter('all');
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
    return 'dark'; // Por defecto modo oscuro
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

    const modalNav = target.closest('[data-modal-nav]');
    if (modalNav) {
      const dir = modalNav.getAttribute('data-modal-nav');
      if (dir === 'prev') showIndex(galleryIndex - 1);
      if (dir === 'next') showIndex(galleryIndex + 1);
      return;
    }

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
      const dressId = prefillLink.getAttribute('data-prefill') || '';
      if (dressId) {
        const message = `Hola, me interesa el vestido ${dressId}. ¿Está disponible para (fecha)?`;
        const waUrl = `https://wa.me/5356164805?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank', 'noreferrer');
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

  setupLazyLoading();
  setupCatalogFilters();
})();
