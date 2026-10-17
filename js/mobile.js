/**
 * KANALTEK MOBİL SÜRÜM MOTORU (js/mobile.js)
 * Mobil cihazlar için hafif, sıfır hata, akıcı etkileşim scripti.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initMobileProcessTabs();
  initMobileGallery();
  initMobileReferences();
  initMobileVideoPlayer();
  initMobileModals();
  initMobileForms();
});

/* 1. MOBİL MENÜ / DRAWER */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mMenuToggle');
  const drawer = document.getElementById('mDrawer');
  const links = document.querySelectorAll('.m-drawer-link');

  if (!toggleBtn || !drawer) return;

  function toggle() {
    toggleBtn.classList.toggle('active');
    drawer.classList.toggle('active');
    document.body.style.overflow = drawer.classList.contains('active') ? 'hidden' : '';
  }

  function close() {
    toggleBtn.classList.remove('active');
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', toggle);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) close();
  });

  links.forEach(link => {
    link.addEventListener('click', close);
  });
}

/* 2. SÜREÇ SEKME DEĞİŞİMİ (CIPP UV vs FOLD & FORM) */
function initMobileProcessTabs() {
  const tabBtns = document.querySelectorAll('.m-process-tab-btn');
  const tabCipp = document.getElementById('mTabCipp');
  const tabFold = document.getElementById('mTabFold');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (target === 'cipp') {
        if (tabCipp) tabCipp.style.display = 'block';
        if (tabFold) tabFold.style.display = 'none';
      } else {
        if (tabCipp) tabCipp.style.display = 'none';
        if (tabFold) tabFold.style.display = 'block';
      }
    });
  });
}

/* 3. GALERİ FİLTRELEME */
function initMobileGallery() {
  const filterBtns = document.querySelectorAll('.m-gal-filter-btn');
  const cards = document.querySelectorAll('.m-gallery-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const cat = card.getAttribute('data-cat') || '';
        const cats = cat.split(' ');
        if (filter === 'all' || cat === filter || cats.includes(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 4. REFERANSLAR FİLTRELEME */
function initMobileReferences() {
  const refBtns = document.querySelectorAll('.m-ref-filter-btn');
  const refCards = document.querySelectorAll('.m-ref-card');

  if (!refBtns.length) return;

  refBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat');
      refBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      refCards.forEach(card => {
        const itemCat = card.getAttribute('data-cat') || '';
        if (cat === 'all' || itemCat === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 5. YOUTUBE VİDEO ENTEGRASYONU (KART İÇİ & MODAL) */
function initMobileVideoPlayer() {
  const wrapper = document.getElementById('mYtWrapper');
  const videoId = 'UBNCFEpf95U';
  const openModalBtns = document.querySelectorAll('.open-m-video');
  const videoModal = document.getElementById('mVideoModal');
  const videoIframe = document.getElementById('mVideoIframe');

  function playInline() {
    if (!wrapper || wrapper.classList.contains('playing')) return;
    wrapper.classList.add('playing');
    wrapper.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
        title="Kanaltek Saha Uygulaması" 
        style="width: 100%; height: 100%; border: 0;" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;
  }

  if (wrapper) {
    wrapper.addEventListener('click', playInline);
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (videoModal && videoIframe) {
        videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

/* 6. MODALLAR (PDF, TEKLİF, VİDEO) */
function initMobileModals() {
  const modals = document.querySelectorAll('.m-modal');
  const closeBtns = document.querySelectorAll('.m-modal-close');
  
  // PDF Modal
  const pdfModal = document.getElementById('mPdfModal');
  const pdfIframe = document.getElementById('mPdfIframe');
  const openPdfBtns = document.querySelectorAll('.open-m-pdf');
  const pdfTabs = document.querySelectorAll('.m-pdf-tab-btn');

  const pdfFiles = {
    ref: { title: 'Resmi Referans Dokümanı (2026)', url: 'assets/docs/KANALTEK_Referanslar_2026.pdf' },
    cipp: { title: 'CIPP UV Sistem Sunumu', url: 'assets/docs/KANALTEK_CIPP_UV_Katalog.pdf' },
    fold: { title: 'Fold & Form PVC Sunumu', url: 'assets/docs/KANALTEK_Fold_and_Form_Katalog.pdf' }
  };

  function setPdf(key) {
    const doc = pdfFiles[key] || pdfFiles.ref;
    const titleEl = document.getElementById('mPdfTitle');
    if (titleEl) titleEl.textContent = doc.title;
    if (pdfIframe) pdfIframe.src = doc.url + '#toolbar=0&navpanes=0';

    pdfTabs.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-pdf') === key);
    });
  }

  openPdfBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-pdf') || 'ref';
      setPdf(key);
      if (pdfModal) {
        pdfModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  pdfTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-pdf');
      setPdf(key);
    });
  });

  // Quote Modal
  const quoteModal = document.getElementById('mQuoteModal');
  const openQuoteBtns = document.querySelectorAll('.open-m-quote');

  openQuoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (quoteModal) {
        quoteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close handlers
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modals.forEach(m => m.classList.remove('active'));
      const videoIframe = document.getElementById('mVideoIframe');
      if (videoIframe) videoIframe.src = '';
      document.body.style.overflow = '';
    });
  });

  modals.forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) {
        m.classList.remove('active');
        const videoIframe = document.getElementById('mVideoIframe');
        if (videoIframe) videoIframe.src = '';
        document.body.style.overflow = '';
      }
    });
  });
}

/* 7. FORM GÖNDERİMİ & GERİ BİLDİRİM */
function initMobileForms() {
  const forms = document.querySelectorAll('.m-ajax-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = form.querySelector('input[name="phone"]');
      if (!phone || !phone.value.trim()) {
        alert('Lütfen geçerli bir telefon numarası giriniz.');
        phone && phone.focus();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Gönderiliyor...';
      }

      setTimeout(() => {
        form.innerHTML = `
          <div style="text-align: center; padding: 24px 10px;">
            <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.15); color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px;">✓</div>
            <h4 style="font-size: 1.15rem; color: #0a2540; margin-bottom: 6px;">Talebiniz Alındı!</h4>
            <p style="font-size: 0.85rem; color: #475569; margin-bottom: 16px;">
              Mühendislik ekibimiz <strong>15 dakika içinde</strong> sizinle iletişime geçecektir.
            </p>
            <a href="https://wa.me/905364236630?text=${encodeURIComponent('Merhaba, az önce web siteniz üzerinden iletişim formu doldurdum.')}" class="m-btn m-btn-whatsapp">
              WhatsApp'tan Hemen Yazın
            </a>
          </div>
        `;
      }, 500);
    });
  });
}
