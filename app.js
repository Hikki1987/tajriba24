/**
 * TAJRIBA24.UZ — INTERACTIVE FINANCIAL SIMULATION & APP ENGINE
 * Vanilla JS ES6+ (No external dependencies required)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSimulator();
  initScheduleFilters();
  initFAQ();
  initBookingModal();
  initSoundEffects();
});

/* ==========================================================================
   1. NAVIGATION & SCROLL
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navDrawer = document.querySelector('.mobile-nav-drawer');
  const navOverlay = document.getElementById('mobileNavOverlay');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-drawer a');

  // Header scroll blur effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const closeDrawer = () => {
    if (navDrawer) navDrawer.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    if (mobileToggle) mobileToggle.innerHTML = '☰';
  };

  // Mobile menu toggle
  if (mobileToggle && navDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navDrawer.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('open', isOpen);
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', closeDrawer);
    }

    navLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // Active link spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   2. INTERACTIVE MINI-GAME SIMULATOR (MOLIYAVIY SIMULYATOR)
   ========================================================================== */
const simulatorData = {
  currentStage: 1,
  selectedCareer: null,
  selectedAsset: null,
  selectedCrisis: null,
  gameState: {
    salary: 0,
    expenses: 0,
    cash: 0,
    passiveIncome: 0,
    freedomIndex: 0,
    totalScore: 0
  },
  careers: [
    {
      id: 'dev',
      title: 'IT Dasturchi',
      badge: 'Yuqori daromad, o\'rtacha xarajat',
      salary: 18000000,
      expenses: 8000000,
      cash: 25000000,
      icon: '💻'
    },
    {
      id: 'doctor',
      title: 'Shifokor (Xususiy klinika)',
      badge: 'Barqaror oylik, qat\'iy jadval',
      salary: 12000000,
      expenses: 6500000,
      cash: 18000000,
      icon: '🩺'
    },
    {
      id: 'trader',
      title: 'Savdo va Chakana Biznes',
      badge: 'Katta naqd aylanma, o\'zgaruvchan foyda',
      salary: 15000000,
      expenses: 9000000,
      cash: 35000000,
      icon: '🏬'
    },
    {
      id: 'teacher',
      title: 'O\'qituvchi & Repetitor',
      badge: 'Kichik boshlang\'ich, tejamkor byudjet',
      salary: 7500000,
      expenses: 4200000,
      cash: 10000000,
      icon: '📚'
    }
  ],
  investments: [
    {
      id: 'real_estate',
      title: 'Toshkent yangi qurilish (Novostroyka)',
      badge: 'Kam xatar, barqaror passiv daromad',
      desc: 'Boshlang\'ich to\'lov bilan 1 xonali xonadon olib, ijaraga berish.',
      cost: 20000000,
      monthlyPassive: 3800000,
      risk: 'Past',
      scoreBonus: 35
    },
    {
      id: 'agri_orchard',
      title: 'Intensiv gilos bog\'iga ulushdorlik',
      badge: 'Eksportbop, yuqori rentabellik',
      desc: 'Farg\'ona vodiysidagi eksport fermeriga ulushdor sifatida kirish.',
      cost: 15000000,
      monthlyPassive: 4200000,
      risk: 'O\'rta',
      scoreBonus: 32
    },
    {
      id: 'franchise_coffee',
      title: 'Do\'stining Mini-Kofeshopiga sheriklik',
      badge: 'Tez aylanma, oylik dividend',
      desc: 'Universitet yonida yangi kofe nuqtasi ochishga 30% ulush bilan kirish.',
      cost: 12000000,
      monthlyPassive: 2600000,
      risk: 'O\'rta',
      scoreBonus: 28
    },
    {
      id: 'crypto_hype',
      title: 'Tez boyish Telegram kanallari & Kripto',
      badge: 'Yuqori xavf, va\'dalar katta',
      desc: '"Bir oyda 3 barobar" va\'da qilgan spekulyativ sxemaga tikish.',
      cost: 10000000,
      monthlyPassive: 0,
      risk: 'Juda yuqori (Xavfli)',
      scoreBonus: 5
    }
  ],
  crises: [
    {
      id: 'inflation',
      title: 'Valyuta kursi va Inflyatsiya tebranishi',
      desc: 'Xomashyo va ijara narxlari oshdi. Aktiv egalari narxni oshirdi, qarz egalari qiynaldi.',
      impact: 'Aktivlar qiymati oshdi! Passiv daromad +15% ga o\'sdi.'
    },
    {
      id: 'emergency',
      title: 'Kutilmagan shaxsiy xarajat (Avtomobil & To\'y)',
      desc: 'Kutilmaganda 6,000,000 so\'m favqulodda xarajat talab qilindi.',
      impact: 'Moliyaviy yostiqchadan pul yechildi.'
    },
    {
      id: 'market_boom',
      title: 'Bozorda talab portlashi (Ijobiy to\'lqin)',
      desc: 'Siz kiritgan sohada talab keskin oshib, kutilganidan 2 barobar ko\'p mijoz keldi.',
      impact: 'Bonus dividendi: +5,000,000 so\'m kutilmagan sof daromad!'
    }
  ]
};

function formatUzbekMoney(amount) {
  return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
}

function initSimulator() {
  renderCareerStage();
  renderInvestmentStage();
  renderCrisisStage();
  setupSimulatorControls();
}

function renderCareerStage() {
  const container = document.getElementById('career-options-grid');
  if (!container) return;

  container.innerHTML = simulatorData.careers.map(c => `
    <div class="sim-option-card" data-career="${c.id}" onclick="selectCareer('${c.id}')">
      <div>
        <span class="sim-opt-badge">${c.badge}</span>
        <h4 class="sim-opt-title">${c.icon} ${c.title}</h4>
      </div>
      <div class="sim-opt-stats">
        <span>Oylik maosh: <b>${formatUzbekMoney(c.salary)}</b></span>
        <span>Oylik xarajat: <b>${formatUzbekMoney(c.expenses)}</b></span>
        <span>Boshlang'ich kapital: <b>${formatUzbekMoney(c.cash)}</b></span>
      </div>
    </div>
  `).join('');
}

function renderInvestmentStage() {
  const container = document.getElementById('investment-options-grid');
  if (!container) return;

  container.innerHTML = simulatorData.investments.map(inv => `
    <div class="sim-option-card" data-investment="${inv.id}" onclick="selectInvestment('${inv.id}')">
      <div>
        <span class="sim-opt-badge">${inv.badge}</span>
        <h4 class="sim-opt-title">${inv.title}</h4>
        <p style="font-size:0.84rem; color:var(--text-muted); margin-top:0.4rem;">${inv.desc}</p>
      </div>
      <div class="sim-opt-stats">
        <span>Kerakli investitsiya: <b>${formatUzbekMoney(inv.cost)}</b></span>
        <span>Oylik passiv daromad: <b style="color:var(--emerald-light);">+${formatUzbekMoney(inv.monthlyPassive)}/oy</b></span>
        <span>Xatar darajasi: <b>${inv.risk}</b></span>
      </div>
    </div>
  `).join('');
}

function renderCrisisStage() {
  const container = document.getElementById('crisis-options-grid');
  if (!container) return;

  container.innerHTML = simulatorData.crises.map(crs => `
    <div class="sim-option-card" data-crisis="${crs.id}" onclick="selectCrisis('${crs.id}')">
      <div>
        <span class="sim-opt-badge" style="background:rgba(244,63,94,0.1); color:#FB7185;">Bozor ssenariysi</span>
        <h4 class="sim-opt-title">${crs.title}</h4>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.4rem;">${crs.desc}</p>
      </div>
      <div class="sim-opt-stats" style="border-top-color:rgba(244,63,94,0.2);">
        <span style="color:var(--gold-light);">Natija ta'siri: <b>${crs.impact}</b></span>
      </div>
    </div>
  `).join('');
}

window.selectCareer = function(id) {
  simulatorData.selectedCareer = simulatorData.careers.find(c => c.id === id);
  document.querySelectorAll('#career-options-grid .sim-option-card').forEach(el => {
    el.classList.toggle('selected', el.dataset.career === id);
  });
  document.getElementById('sim-btn-to-stage2').disabled = false;
  playAudioCue('select');
  updateLiveSimMetrics();
};

window.selectInvestment = function(id) {
  simulatorData.selectedAsset = simulatorData.investments.find(inv => inv.id === id);
  document.querySelectorAll('#investment-options-grid .sim-option-card').forEach(el => {
    el.classList.toggle('selected', el.dataset.investment === id);
  });
  document.getElementById('sim-btn-to-stage3').disabled = false;
  playAudioCue('select');
  updateLiveSimMetrics();
};

window.selectCrisis = function(id) {
  simulatorData.selectedCrisis = simulatorData.crises.find(crs => crs.id === id);
  document.querySelectorAll('#crisis-options-grid .sim-option-card').forEach(el => {
    el.classList.toggle('selected', el.dataset.crisis === id);
  });
  document.getElementById('sim-btn-to-result').disabled = false;
  playAudioCue('select');
  updateLiveSimMetrics();
};

function updateLiveSimMetrics() {
  let cash = 0;
  let passive = 0;
  let expenses = 0;

  if (simulatorData.selectedCareer) {
    cash = simulatorData.selectedCareer.cash;
    expenses = simulatorData.selectedCareer.expenses;
  }

  if (simulatorData.selectedAsset) {
    if (cash >= simulatorData.selectedAsset.cost) {
      cash -= simulatorData.selectedAsset.cost;
    }
    passive += simulatorData.selectedAsset.monthlyPassive;
  }

  document.getElementById('sim-live-cash').innerText = formatUzbekMoney(cash);
  document.getElementById('sim-live-passive').innerText = formatUzbekMoney(passive) + '/oy';
}

function setupSimulatorControls() {
  const btnStage2 = document.getElementById('sim-btn-to-stage2');
  const btnStage3 = document.getElementById('sim-btn-to-stage3');
  const btnResult = document.getElementById('sim-btn-to-result');
  const btnRestart = document.getElementById('sim-btn-restart');

  if (btnStage2) {
    btnStage2.addEventListener('click', () => switchStage(2));
  }
  if (btnStage3) {
    btnStage3.addEventListener('click', () => switchStage(3));
  }
  if (btnResult) {
    btnResult.addEventListener('click', () => calculateFinalResult());
  }
  if (btnRestart) {
    btnRestart.addEventListener('click', () => restartSimulator());
  }
}

function switchStage(stageNum) {
  simulatorData.currentStage = stageNum;

  // Toggle stage elements
  document.querySelectorAll('.sim-stage').forEach(stage => {
    stage.classList.remove('active');
  });
  const currentStageEl = document.getElementById(`sim-stage-${stageNum}`);
  if (currentStageEl) currentStageEl.classList.add('active');

  // Update step indicators
  for (let i = 1; i <= 3; i++) {
    const circle = document.getElementById(`step-circ-${i}`);
    if (circle) {
      circle.classList.remove('active', 'done');
      if (i < stageNum) circle.classList.add('done');
      if (i === stageNum) circle.classList.add('active');
    }
  }

  playAudioCue('step');
}

window.switchStage = switchStage;
window.calculateFinalResult = calculateFinalResult;

function calculateFinalResult() {
  const career = simulatorData.selectedCareer;
  const asset = simulatorData.selectedAsset;
  const crisis = simulatorData.selectedCrisis;

  if (!career || !asset || !crisis) return;

  let finalCash = career.cash - asset.cost;
  let finalPassive = asset.monthlyPassive;
  let score = 50 + asset.scoreBonus;

  // Crisis impact
  if (crisis.id === 'inflation') {
    if (asset.id === 'real_estate' || asset.id === 'agri_orchard') {
      finalPassive = Math.round(finalPassive * 1.15);
      score += 15;
    } else {
      score -= 5;
    }
  } else if (crisis.id === 'emergency') {
    finalCash -= 6000000;
    if (finalCash < 0) {
      score -= 20; // Overtaken by debt
    }
  } else if (crisis.id === 'market_boom') {
    finalCash += 5000000;
    score += 12;
  }

  if (asset.id === 'crypto_hype') {
    score = Math.max(25, score - 35);
  }

  score = Math.min(98, Math.max(20, score));

  const freedomPercentage = Math.round((finalPassive / career.expenses) * 100);

  // Render Result View
  document.getElementById('res-score-num').innerText = score;
  document.getElementById('res-passive-val').innerText = formatUzbekMoney(finalPassive);
  document.getElementById('res-freedom-val').innerText = `${freedomPercentage}%`;
  document.getElementById('res-cash-val').innerText = formatUzbekMoney(Math.max(0, finalCash));

  let verdict = '';
  let advice = '';

  if (freedomPercentage >= 50) {
    verdict = 'Ajoyib strategik tafakkur! Siz moliyaviy erkinlik ostonasidasiz.';
    advice = 'Siz pulni xavf-xatarlardan himoya qilgan holda to\'g\'ri aktivlarga yo\'naltirdingiz. Tajriba24.uz ning jonli VIP stolida siz yanada murakkab korporativ va xalqaro bitimlarni sinab ko\'rishingiz kerak!';
  } else if (freedomPercentage >= 25) {
    verdict = 'Yaxshi boshlanish, lekin xarajatlar va aktivlar mutanosibligi ustida ishlash lozim.';
    advice = 'Siz to\'g\'ri yo\'nalishda harakat qildingiz, biroq kutilmagan vaziyatlar byudjetingizga jiddiy zarba berishi mumkin. Tajriba24.uz stol o\'yinida passiv daromad oqimini 3 barobarga oshirish usullarini o\'rganasiz.';
  } else {
    verdict = 'Diqqat: Siz "kalamushlar poygasi" (oylikka qaramlik) xavfi ostidasiz!';
    advice = 'Ko\'p pul topish muhim emas, uni qanday ushlab qolish va ko\'paytirish muhim. Tajriba24.uz POYGA o\'yinidagi amaliyot sizga real hayotda millionlab so\'m yo\'qotmaslik kafolatini beradi.';
  }

  document.getElementById('res-verdict-title').innerText = verdict;
  document.getElementById('res-verdict-desc').innerText = advice;

  // Switch to result
  document.querySelectorAll('.sim-stage').forEach(s => s.classList.remove('active'));
  document.getElementById('sim-stage-result').classList.add('active');

  playAudioCue('celebrate');
  triggerConfetti();
}

function restartSimulator() {
  simulatorData.currentStage = 1;
  simulatorData.selectedCareer = null;
  simulatorData.selectedAsset = null;
  simulatorData.selectedCrisis = null;

  document.getElementById('sim-btn-to-stage2').disabled = true;
  document.getElementById('sim-btn-to-stage3').disabled = true;
  document.getElementById('sim-btn-to-result').disabled = true;

  document.querySelectorAll('.sim-option-card').forEach(el => el.classList.remove('selected'));
  updateLiveSimMetrics();
  switchStage(1);
}

/* ==========================================================================
   3. SCHEDULE FILTERING
   ========================================================================== */
function initScheduleFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.game-slot-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. FAQ ACCORDION
   ========================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
        playAudioCue('click');
      }
    });
  });
}

/* ==========================================================================
   5. BOOKING MODAL & TICKET SYSTEM
   ========================================================================== */
function initBookingModal() {
  const modalBackdrop = document.getElementById('booking-modal');
  const openBtns = document.querySelectorAll('[data-open-modal]');
  const closeBtn = document.querySelector('.modal-close-btn');
  const bookingForm = document.getElementById('booking-form');
  const formWrap = document.getElementById('modal-form-wrap');
  const ticketWrap = document.getElementById('modal-ticket-wrap');

  // Open modal
  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'Standart';
      const planSelect = document.getElementById('book-plan');
      if (planSelect) planSelect.value = plan;

      formWrap.style.display = 'block';
      ticketWrap.style.display = 'none';
      modalBackdrop.classList.add('is-open');
      playAudioCue('open');
    });
  });

  // Close modal
  function closeModal() {
    modalBackdrop.classList.remove('is-open');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Phone input formatting mask (+998 __ ___ __ __)
  const phoneInput = document.getElementById('book-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (!val.startsWith('998')) val = '998' + val;
      val = val.substring(0, 12);

      let formatted = '+998';
      if (val.length > 3) formatted += ' (' + val.substring(3, 5);
      if (val.length >= 5) formatted += ') ' + val.substring(5, 8);
      if (val.length >= 8) formatted += '-' + val.substring(8, 10);
      if (val.length >= 10) formatted += '-' + val.substring(10, 12);

      e.target.value = formatted;
    });
  }

  // Submit Booking Form
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('book-name').value.trim();
      const phone = document.getElementById('book-phone').value.trim();
      const plan = document.getElementById('book-plan').value;
      const date = document.getElementById('book-date').value;

      if (!name || phone.length < 17) {
        alert("Iltimos, ismingiz va to'liq telefon raqamingizni kiriting!");
        return;
      }

      // Generate Ticket
      const ticketId = 'TJ24-' + Math.floor(1000 + Math.random() * 9000);
      document.getElementById('ticket-user-name').innerText = name;
      document.getElementById('ticket-user-phone').innerText = phone;
      document.getElementById('ticket-plan-name').innerText = plan;
      document.getElementById('ticket-date-time').innerText = date;
      document.getElementById('ticket-code-id').innerText = ticketId;

      // Switch to ticket view
      formWrap.style.display = 'none';
      ticketWrap.style.display = 'block';

      playAudioCue('celebrate');
      triggerConfetti();
    });
  }
}

/* ==========================================================================
   6. SOUND EFFECTS (Web Audio API Synthesizer)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSoundEffects() {
  const toggleBtns = document.querySelectorAll('#sound-toggle-btn, .sound-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      toggleBtns.forEach(b => {
        b.innerText = soundEnabled ? '🔊 Ovoz: Yoqiq' : '🔇 Ovoz: O\'chiq';
      });
    });
  });
}

function playAudioCue(type) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'select') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'step') {
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'celebrate') {
      // 3-note victory arpeggio
      playNote(523.25, now, 0.1); // C5
      playNote(659.25, now + 0.1, 0.1); // E5
      playNote(783.99, now + 0.2, 0.25); // G5
      playNote(1046.50, now + 0.35, 0.4); // C6
    }
  } catch (err) {
    // Audio context may be restricted by browser policy
  }
}

function playNote(freq, startTime, duration) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, startTime);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.setValueAtTime(0.18, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

/* ==========================================================================
   7. CANVAS CONFETTI EFFECT (Pure Vanilla Canvas)
   ========================================================================== */
function triggerConfetti() {
  let canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const particles = [];
  const colors = ['#10B981', '#34D399', '#F59E0B', '#FBBF24', '#3B82F6', '#EC4899'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let animationFrame;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.rotation += p.rSpeed;
      p.opacity -= 0.012;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  update();
}

// Global helper to print only the ticket voucher
window.printTicket = function() {
  document.body.classList.add('print-ticket-only');
  window.print();
  setTimeout(() => {
    document.body.classList.remove('print-ticket-only');
  }, 1000);
};

// Global helper to export/save the complete website as a high-quality PDF
window.exportSitePDF = function() {
  document.body.classList.remove('print-ticket-only');
  window.print();
};
