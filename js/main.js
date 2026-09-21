/**
 * KANALTEK - KANAL KAPLAMA ADWORDS LANDING PAGE INTERACTION ENGINE
 * Features: Interactive Calculator, Lead Validation, WhatsApp Deep-linking,
 * FAQ Accordion, Modal Controls, and Google Ads Conversion Tracking
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaqAccordion();
  initCalculator();
  initLeadForms();
  initModal();
  initConversionTracking();
});

/* ==========================================================================
   1. MOBILE NAVIGATION TOGGLE
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

  // Close when clicking nav links
  const drawerLinks = drawer.querySelectorAll('.nav-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !toggleBtn.contains(e.target) && drawer.classList.contains('active')) {
      drawer.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   2. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Auto-open first item
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    firstItem.classList.add('active');
    const firstAnswer = firstItem.querySelector('.faq-answer');
    if (firstAnswer) firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
  }
}

/* ==========================================================================
   3. INTERACTIVE QUOTE & METRAJ CALCULATOR
   ========================================================================== */
function initCalculator() {
  const pipeChips = document.querySelectorAll('.pipe-chip');
  const diameterChips = document.querySelectorAll('.diameter-chip');
  const problemChips = document.querySelectorAll('.problem-chip');
  const lengthSlider = document.getElementById('lengthSlider');
  const lengthDisplay = document.getElementById('lengthDisplay');

  // Summary Elements
  const sumPipe = document.getElementById('sumPipe');
  const sumDiameter = document.getElementById('sumDiameter');
  const sumLength = document.getElementById('sumLength');
  const sumTech = document.getElementById('sumTech');
  const sumDuration = document.getElementById('sumDuration');
  const calcWaBtn = document.getElementById('calcWhatsAppBtn');

  const activePipe = document.querySelector('.pipe-chip.active');
  const activeDiameter = document.querySelector('.diameter-chip.active');
  const activeProblem = document.querySelector('.problem-chip.active');

  let selectedPipe = activePipe ? (activePipe.getAttribute('data-value') || activePipe.textContent.trim()) : "Atıksu & Kanalizasyon Hatları";
  let selectedDiameter = activeDiameter ? (activeDiameter.getAttribute('data-value') || activeDiameter.textContent.trim()) : "DN200 – DN300 (Standart Şebeke)";
  let selectedProblem = activeProblem ? (activeProblem.getAttribute('data-value') || activeProblem.textContent.trim()) : "Çatlak / Kırık / Su Kaçağı";
  let selectedLength = lengthSlider ? Number(lengthSlider.value) : 50;

  function updateChips(chips, onSelect) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        onSelect(chip.getAttribute('data-value') || chip.textContent.trim());
        updateSummary();
      });
    });
  }

  updateChips(pipeChips, val => selectedPipe = val);
  updateChips(diameterChips, val => selectedDiameter = val);
  updateChips(problemChips, val => selectedProblem = val);

  if (lengthSlider && lengthDisplay) {
    lengthSlider.addEventListener('input', (e) => {
      selectedLength = e.target.value;
      lengthDisplay.textContent = `${selectedLength} Metre`;
      updateSummary();
    });
  }

  function updateSummary() {
    if (sumPipe) sumPipe.textContent = selectedPipe;
    if (sumDiameter) sumDiameter.textContent = selectedDiameter;
    if (sumLength) sumLength.textContent = `${selectedLength} m`;

    // Dynamic technology & duration deduction
    let techName = "UV CIPP Cam Elyaf (GRP) Kaplama";
    let durationText = "4 – 8 Saat (Aynı Gün Teslim)";

    if (selectedPipe.includes("Bina İçi")) {
      techName = "Bina İçi Dikey İniş / Epoksi Liner Kaplama";
      durationText = "1 İş Günü (Dairelere Zararsız)";
    } else if (selectedDiameter.includes("DN700") || selectedDiameter.includes("DN1200")) {
      techName = "Büyük Çap UV CIPP / Spiral Sargılı Kaplama";
      durationText = "12 – 24 Saat";
    } else if (selectedLength <= 15 && selectedProblem.includes("Çatlak")) {
      techName = "Noktasal (Parsiyel / Packer) CIPP Kaplama";
      durationText = "1 – 3 Saat";
    }

    if (sumTech) sumTech.textContent = techName;
    if (sumDuration) sumDuration.textContent = durationText;

    // WhatsApp Dynamic Link
    if (calcWaBtn) {
      const waText = encodeURIComponent(
        `Merhaba Kanaltek, Kanal Kaplama için ön teklif almak istiyorum.\n\n` +
        `• Hat Türü: ${selectedPipe}\n` +
        `• Boru Çapı: ${selectedDiameter}\n` +
        `• Tahmini Metraj: ${selectedLength} Metre\n` +
        `• Sorun Tipi: ${selectedProblem}\n` +
        `• Önerilen Sistem: ${techName}\n\n` +
        `Ücretsiz keşif ve net fiyat teklifi rica ediyorum.`
      );
      calcWaBtn.href = `https://wa.me/905364236630?text=${waText}`;
    }
  }

  // Initial calculation trigger
  updateSummary();
}

/* ==========================================================================
   4. LEAD FORMS HANDLING & VALIDATION
   ========================================================================== */
function initLeadForms() {
  const forms = document.querySelectorAll('.ajax-lead-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="full_name"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const submitBtn = form.querySelector('button[type="submit"]');

      if (!phoneInput || !phoneInput.value.trim()) {
        alert('Lütfen geçerli bir telefon numarası giriniz.');
        phoneInput && phoneInput.focus();
        return;
      }

      // Button loading state
      const originalText = submitBtn ? submitBtn.innerHTML : 'Gönder';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Lütfen Bekleyin...</span>`;
      }

      // Collect form data
      const formData = new FormData(form);
      const dataObj = Object.fromEntries(formData.entries());

      // Fire Google AdWords conversion events
      trackAdWordsConversion('lead_form_submission', {
        name: dataObj.full_name || '',
        phone: dataObj.phone || '',
        service: dataObj.service || 'Kanal Kaplama'
      });

      setTimeout(() => {
        // Show success state
        form.innerHTML = `
          <div style="text-align: center; padding: 25px 15px;">
            <div style="width: 54px; height: 54px; background: rgba(16, 185, 129, 0.15); color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 26px;">✓</div>
            <h4 style="font-size: 1.3rem; color: #0f3e8a; margin-bottom: 8px;">Talebiniz Başarıyla Alındı!</h4>
            <p style="font-size: 0.92rem; color: #475569; margin-bottom: 20px;">
              Uzman mühendis ekibimiz en geç <strong>15 dakika içinde</strong> sizi arayarak ücretsiz keşif ve fiyat detaylarını iletecektir.
            </p>
            <a href="https://wa.me/905364236630?text=${encodeURIComponent('Merhaba, az önce kanal kaplama teklif formu doldurdum. Ön keşif ve fiyat hakkında bilgi alabilir miyim?')}" class="btn btn-whatsapp" style="width: 100%;">
              WhatsApp'tan Hemen İletişime Geçin
            </a>
          </div>
        `;
      }, 700);
    });
  });
}

/* ==========================================================================
   5. MODAL WINDOW (HIZLI TEKLİF POPUP)
   ========================================================================== */
function initModal() {
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
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. GOOGLE ADWORDS & ANALYTICS CONVERSION TRACKING HOOKS
   ========================================================================== */
function initConversionTracking() {
  // Track direct phone clicks
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(link => {
    link.addEventListener('click', () => {
      trackAdWordsConversion('phone_call_click', {
        number: link.getAttribute('href')
      });
    });
  });

  // Track WhatsApp clicks
  const waLinks = document.querySelectorAll('a[href*="wa.me"]');
  waLinks.forEach(link => {
    link.addEventListener('click', () => {
      trackAdWordsConversion('whatsapp_chat_click', {
        destination: 'WhatsApp 0536 423 66 30'
      });
    });
  });
}

/**
 * Universal conversion trigger function
 * Supports Google Ads (gtag.js) and GTM dataLayer
 */
function trackAdWordsConversion(eventName, params = {}) {
  // Push to GTM dataLayer if present
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
    timestamp: new Date().toISOString()
  });

  // Trigger Google Ads gtag conversion if initialized
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }

  console.log(`[Google Ads Tracking Event]: ${eventName}`, params);
}
