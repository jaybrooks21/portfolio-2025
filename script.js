document.addEventListener('DOMContentLoaded', () => {
  const navItems = [
    { key: 'home', label: 'Home', href: 'index.html' },
    { key: 'case-studies', label: 'Case Studies', href: 'case-studies.html' },
    { key: 'creative-lab', label: 'Creative Lab', href: 'creative-lab.html' },
    { key: 'photography', label: 'Photography', href: 'photography.html' },
    { key: 'collab', label: "Let's Collab", href: 'collab.html' },
  ];

  const navLinksMarkup = navItems
    .map(item => `<a href="${item.href}" data-nav-item="${item.key}">${item.label}</a>`)
    .join('');

  const headerMarkup = `
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="index.html">
          <span class="brand-text">
            Jaylynn Brooks
            <small>Digital Experience & Web Coordination</small>
          </span>
        </a>
        <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-label="Toggle navigation">Menu</button>
        <div class="nav-links" data-nav-links>
          ${navLinksMarkup}
        </div>
      </div>
    </header>
  `.trim();

  const footerMarkup = `
    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-block">
          <h4>Jaylynn Brooks</h4>
          <h5>Digital Experience & Web Coordination</h5>
          <h5>Work rooted in care, clarity, and respect</h5>
        </div>

        <div class="footer-block">
          <h4>Navigation</h4>
          <p><a href="case-studies.html">Projects</a></p>
          <p><a href="index.html#impact">About</a></p>
          <p><a href="collab.html">Contact</a></p>
        </div>

        <div class="footer-block">
          <h4>Contact</h4>
          <p>Email address</p>
          <p>LinkedIn</p>
        </div>

        <div class="footer-block">
          <h4>Location</h4>
          <p>Based in Canada</p>
        </div>
      </div>

    </footer>
  `.trim();

  const headerSlot = document.querySelector('[data-site-header]');
  if (headerSlot) {
    headerSlot.outerHTML = headerMarkup;
  }

  const footerSlot = document.querySelector('[data-site-footer]');
  if (footerSlot) {
    footerSlot.outerHTML = footerMarkup;
  }

  const resolveActiveKey = () => {
    const explicit = document.body.getAttribute('data-nav-active');
    if (explicit) return explicit;
    const path = window.location.pathname.split('/').pop();
    if (!path || path === 'index.html') return 'home';
    if (path === 'case-studies.html') return 'case-studies';
    if (path === 'creative-lab.html') return 'creative-lab';
    if (path === 'photography.html') return 'photography';
    if (path === 'collab.html') return 'collab';
    if (path.startsWith('case-study-')) return 'case-studies';
    const caseStudyPages = new Set([
      'ai-travel-agent.html',
      'peak-pursuits.html',
      'sustainable-sparks.html',
      'wavemakers.html',
    ]);
    if (caseStudyPages.has(path)) return 'case-studies';
    return null;
  };

  const activeKey = resolveActiveKey();
  if (activeKey) {
    const activeLink = document.querySelector(`.nav-links [data-nav-item="${activeKey}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
      activeLink.setAttribute('aria-current', 'page');
    }
  }

  // Header scroll effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const targetId = anchor.getAttribute('href');
      const target = targetId ? document.querySelector(targetId) : null;
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.querySelectorAll('[data-accordion]').forEach(accordion => {
    accordion.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const panel = trigger.nextElementSibling;
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!expanded));
        if (panel) {
          if (expanded) {
            panel.style.maxHeight = '0px';
            panel.classList.remove('open');
          } else {
            panel.classList.add('open');
            panel.style.maxHeight = panel.scrollHeight + 'px';
          }
        }
      });
    });
  });

  document.querySelectorAll('form[data-contact]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      form.querySelectorAll('input[required], textarea[required]').forEach(field => {
        if (!field.value.trim()) {
          field.focus();
        }
      });
      alert('Form placeholder – connect via email while I set this up.');
    });
  });

  // Masonry layout for photo gallery
  const initMasonry = (grid) => {
    const rowHeight = Number(grid.dataset.rowHeight) || 12;
    const gap = Number(grid.dataset.gap) || 12;
    grid.style.setProperty('--masonry-row', `${rowHeight}px`);
    grid.style.setProperty('--masonry-gap', `${gap}px`);

    const resizeItem = (item) => {
      if (!item.complete) {
        item.addEventListener('load', () => resizeItem(item), { once: true });
        return;
      }
      const itemHeight = item.getBoundingClientRect().height;
      const span = Math.ceil((itemHeight + gap) / (rowHeight + gap));
      item.style.gridRowEnd = `span ${span}`;
    };

    const refresh = () => {
      grid.querySelectorAll('.masonry-item').forEach(resizeItem);
    };

    refresh();
    window.addEventListener('resize', refresh);
  };

  document.querySelectorAll('[data-masonry]').forEach(initMasonry);

  // Lightbox for photography
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-nav.prev') : null;
  const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-nav.next') : null;
  let lightboxGroup = [];
  let lightboxIndex = -1;

  const renderLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    const current = lightboxGroup[lightboxIndex];
    if (!current) return;
    lightboxImg.src = current.src;
    lightboxImg.alt = current.alt || '';
    lightbox.classList.add('open');
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    lightboxImg.alt = '';
    lightboxGroup = [];
    lightboxIndex = -1;
  };

  const openLightbox = (groupItems, index) => {
    lightboxGroup = groupItems;
    lightboxIndex = index;
    renderLightbox();
  };

  const goPrev = () => {
    if (!lightboxGroup.length) return;
    lightboxIndex = (lightboxIndex - 1 + lightboxGroup.length) % lightboxGroup.length;
    renderLightbox();
  };

  const goNext = () => {
    if (!lightboxGroup.length) return;
    lightboxIndex = (lightboxIndex + 1) % lightboxGroup.length;
    renderLightbox();
  };

  document.querySelectorAll('[data-lightbox-img]').forEach((img, idx, all) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const groupName = img.getAttribute('data-lightbox-group');
      const groupItems = groupName
        ? Array.from(document.querySelectorAll(`[data-lightbox-img][data-lightbox-group=\"${groupName}\"]`))
        : Array.from(all);
      const startIndex = groupItems.indexOf(img);
      openLightbox(groupItems.map(el => ({ src: el.src, alt: el.alt })), startIndex >= 0 ? startIndex : 0);
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', goPrev);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', goNext);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') goPrev();
    if (event.key === 'ArrowRight') goNext();
  });
});
