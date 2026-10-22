/**
 * KANALTEK - KAZISIZ KANAL REHABİLİTASYONU & BORU KAPLAMA
 * Etkileşim Motoru: Süreç Tabları, Galeri Filtreleme, Referans Filtreleme,
 * PDF Görüntüleyici Modalı, İletişim Formları ve WhatsApp Yönlendirmeleri
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initProcessTabs();
  initGalleryFilter();
  initReferenceFilter();
  initPdfModal();
  initQuoteModal();
  initVideoPlayer();
  initLeadForms();
});

/* ==========================================================================
   1. MOBİL MENÜ YÖNETİMİ
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileNavDrawer');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    drawer.classList.toggle('active');
    const isExpanded = drawer.classList.contains('active');
    toggleBtn.setAttribute('aria-expanded', isExpanded);
  });

  const drawerLinks = drawer.querySelectorAll('.nav-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !toggleBtn.contains(e.target) && drawer.classList.contains('active')) {
      drawer.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   2. NASIL UYGULUYORUZ? SÜREÇ TABLARI (CIPP UV vs FOLD & FORM)
   ========================================================================== */
function initProcessTabs() {
  const tabButtons = document.querySelectorAll('.process-tab-btn');
  const tabContents = document.querySelectorAll('.process-tab-content');

  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   3. SAHA & CCTV GALERİ FİLTRELEME
   ========================================================================== */
function initGalleryFilter() {
  const filterButtons = document.querySelectorAll('.gallery-tab-btn');
  const items = document.querySelectorAll('.gallery-item-card');

  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      items.forEach(item => {
        const itemCat = item.getAttribute('data-cat') || '';
        const cats = itemCat.split(' ');
        if (filter === 'all' || itemCat === filter || cats.includes(filter)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. REFERANSLAR KATEGORİ FİLTRELEME
   ========================================================================== */
function initReferenceFilter() {
  const refButtons = document.querySelectorAll('.ref-filter-btn');
  const refCards = document.querySelectorAll('.ref-card');

  if (!refButtons.length) return;

  refButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-ref');

      refButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      refCards.forEach(card => {
        const cardCat = card.getAttribute('data-ref-cat');
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. PDF DOKÜMAN GÖRÜNTÜLEYİCİ MODAL
   (Referans Listesi, CIPP UV Sunumu, Fold & Form Sunumu)
   ========================================================================== */
function initPdfModal() {
  const modal = document.getElementById('pdfModal');
  const closeBtn = document.getElementById('closePdfModal');
  const openButtons = document.querySelectorAll('.open-pdf-viewer');
  const iframe = document.getElementById('pdfIframe');
  const modalTitle = document.getElementById('pdfModalTitle');
  const downloadLink = document.getElementById('pdfDownloadLink');
  const tabButtons = modal ? modal.querySelectorAll('.pdf-tab-btn') : [];

  if (!modal || !iframe) return;

  const docMap = {
    'sunum-tr': {
      url: 'assets/docs/KANALTEK_Sunum_TR.pdf',
      title: 'KANALTEK Kazısız Kanal Kaplama ve Boru Rehabilitasyon Sunumu (TR - 34 Sayfa)',
      filename: 'KANALTEK_Sunum_TR.pdf'
    },
    'cipp': {
      url: 'assets/docs/CIPP_UV_Presentation_EN.pdf',
      title: 'CIPP UV Cured-in-Place Pipe Rehabilitation Presentation (ENG - 21 Sayfa)',
      filename: 'CIPP_UV_Presentation_EN.pdf'
    },
    'fold': {
      url: 'assets/docs/FOLD_AND_FORM_EN.pdf',
      title: 'Fold & Form PVC Pipe Lining Presentation (ENG - 13 Sayfa)',
      filename: 'FOLD_AND_FORM_EN.pdf'
    },
    'hose': {
      url: 'assets/docs/HOSE_LINER_EN.pdf',
      title: 'Hose Liner Flexible CIPP System Presentation (ENG - 12 Sayfa)',
      filename: 'HOSE_LINER_EN.pdf'
    },
    'ref': {
      url: 'assets/docs/KANALTEK_Referanslar_2026.pdf',
      title: 'KANALTEK Resmi Referanslar ve İdari Kabul Belgeleri Listesi 2026 (4 Sayfa)',
      filename: 'KANALTEK_Referanslar_2026.pdf'
    },
    'iso-9001': {
      url: 'assets/docs/ISO_9001.pdf',
      title: 'ISO 9001:2015 Kalite Yönetim Sistemi Sertifikası',
      filename: 'ISO_9001.pdf'
    },
    'iso-14001': {
      url: 'assets/docs/ISO_14001.pdf',
      title: 'ISO 14001:2015 Çevre Yönetim Sistemi Sertifikası',
      filename: 'ISO_14001.pdf'
    },
    'iso-45001': {
      url: 'assets/docs/ISO_45001.pdf',
      title: 'ISO 45001:2018 İş Sağlığı ve Güvenliği Yönetim Sistemi Sertifikası',
      filename: 'ISO_45001.pdf'
    },
    'iso-10002': {
      url: 'assets/docs/ISO_10002.pdf',
      title: 'ISO 10002:2018 Müşteri Memnuniyeti ve Şikayet Yönetim Sertifikası',
      filename: 'ISO_10002.pdf'
    }
  };

  // Aliases for compatibility
  docMap['cipp-en'] = docMap['cipp'];
  docMap['fold-en'] = docMap['fold'];
  docMap['hose-en'] = docMap['hose'];
  docMap['sunum'] = docMap['sunum-tr'];
  docMap['iso9001'] = docMap['iso-9001'];
  docMap['iso14001'] = docMap['iso-14001'];
  docMap['iso45001'] = docMap['iso-45001'];
  docMap['iso10002'] = docMap['iso-10002'];

  function setDocument(key) {
    const doc = docMap[key] || docMap['sunum-tr'];
    iframe.src = doc.url + '#toolbar=1&navpanes=0';
    if (modalTitle) modalTitle.textContent = doc.title;
    if (downloadLink) {
      downloadLink.href = doc.url;
      downloadLink.setAttribute('download', doc.filename);
    }

    tabButtons.forEach(tab => {
      const tabKey = tab.getAttribute('data-pdf');
      const tabDoc = tab.getAttribute('data-doc');
      if (tabKey === key || (docMap[tabKey] && docMap[tabKey].url === doc.url) || tabDoc === doc.url) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  function openModal(defaultKey = 'sunum-tr') {
    setDocument(defaultKey);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Pause iframe
    iframe.src = 'about:blank';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pdfKey = btn.getAttribute('data-pdf') || 'sunum-tr';
      openModal(pdfKey);
    });
  });

  tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
      const pdfKey = tab.getAttribute('data-pdf');
      if (pdfKey && docMap[pdfKey]) {
        setDocument(pdfKey);
      } else {
        const docUrl = tab.getAttribute('data-doc');
        let foundKey = 'sunum-tr';
        for (const [key, value] of Object.entries(docMap)) {
          if (value.url === docUrl) {
            foundKey = key;
            break;
          }
        }
        setDocument(foundKey);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   6. HIZLI İLETİŞİME GEÇİN / TEKLİF MODALI
   ========================================================================== */
function initQuoteModal() {
  const modal = document.getElementById('quoteModal');
  const openButtons = document.querySelectorAll('.open-quote-modal');
  const closeButton = document.getElementById('closeQuoteModal');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   7. İLETİŞİM FORMLARI YÖNETİMİ
   ========================================================================== */
function initLeadForms() {
  const forms = document.querySelectorAll('.ajax-lead-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const phoneInput = form.querySelector('[name="phone"]');
      const submitBtn = form.querySelector('button[type="submit"]');

      if (!phoneInput || !phoneInput.value.trim()) {
        alert('Lütfen geçerli bir telefon numarası giriniz.');
        phoneInput && phoneInput.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Lütfen Bekleyin...</span>`;
      }

      setTimeout(() => {
        form.innerHTML = `
          <div style="text-align: center; padding: 25px 15px;">
            <div style="width: 54px; height: 54px; background: rgba(16, 185, 129, 0.15); color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 26px;">✓</div>
            <h4 style="font-size: 1.3rem; color: #0a2540; margin-bottom: 8px;">Talebiniz Başarıyla Alındı!</h4>
            <p style="font-size: 0.92rem; color: #475569; margin-bottom: 20px;">
              Uzman mühendislik ekibimiz <strong>15 dakika içinde</strong> sizinle iletişime geçecektir.
            </p>
            <a href="https://wa.me/905364236630?text=${encodeURIComponent('Merhaba, az önce web siteniz üzerinden iletişim formu doldurdum. Bilgi alabilir miyim?')}" class="btn btn-whatsapp" style="width: 100%;">
              WhatsApp'tan Hemen İletişime Geçin
            </a>
          </div>
        `;
      }, 600);
    });
  });
}

/* ==========================================================================
   7. YOUTUBE VİDEO OYNATICI (KART İÇİ & MODAL OYNATMA)
   ========================================================================== */
function initVideoPlayer() {
  const videoWrapper = document.getElementById('ytVideoWrapper');
  const videoModal = document.getElementById('videoModal');
  const videoModalIframe = document.getElementById('videoModalIframe');
  const closeVideoBtn = document.getElementById('closeVideoModal');
  const heroVideoBtns = document.querySelectorAll('.open-video-modal');

  const videoId = 'UBNCFEpf95U';

  function playInline() {
    if (!videoWrapper || videoWrapper.classList.contains('playing')) return;
    videoWrapper.classList.add('playing');
    videoWrapper.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
        title="Kanaltek Saha Uygulaması" 
        style="width: 100%; height: 100%; border: 0;" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;
    videoWrapper.style.cursor = 'default';
  }

  function openModal() {
    if (!videoModal || !videoModalIframe) return;
    videoModalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    videoModal.classList.add('active');
  }

  function closeModal() {
    if (!videoModal || !videoModalIframe) return;
    videoModal.classList.remove('active');
    videoModalIframe.src = '';
  }

  if (videoWrapper) {
    videoWrapper.addEventListener('click', (e) => {
      if (!videoWrapper.classList.contains('playing')) {
        playInline();
      }
    });
  }

  heroVideoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', closeModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeModal();
    }
  });
}

