import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVLZoN43sOvKG1oBZJD_z3H6tLC3fThgM",
  authDomain: "sisters-birthday-site.firebaseapp.com",
  projectId: "sisters-birthday-site",
  storageBucket: "sisters-birthday-site.firebasestorage.app",
  messagingSenderId: "545636768227",
  appId: "1:545636768227:web:5d4a849bfe8e454af7e8d6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//  HIGH IMPACT FIREWORKS & CONFETTI ENGINE 
class FireworkEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationFrameId = null;
    this.colors = ['#d4af37', '#f0ead6', '#aa8416', '#ffffff', '#ff9800', '#ffd54f'];
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createBurst(x, y, count = 80, isFirework = true) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = isFirework ? (Math.random() * 7 + 4) : (Math.random() * 4 + 2);
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 1.5,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01,
        gravity: isFirework ? 0.12 : 0.06,
        drag: 0.96
      });
    }
    if (!this.animationFrameId) this.loop();
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.y + p.vy > window.innerHeight && p.gravity > 0 ? 0 : p.vy; // stop at bottom bounds slightly smoothly
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationFrameId = requestAnimationFrame(() => this.loop());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animationFrameId = null;
    }
  }
}

const mainFX = new FireworkEngine('confetti-canvas');
const cakeFX = new FireworkEngine('cake-confetti-canvas');
const puzzleFX = new FireworkEngine('puzzle-confetti-canvas');

//  INITIAL APP TRANSITION STATES 
const openGiftBtn = document.getElementById('open-gift-btn');
const screenLanding = document.getElementById('screen-landing');
const mainContent = document.getElementById('main-content');
const sideDots = document.getElementById('side-dots');

openGiftBtn.addEventListener('click', () => {
  screenLanding.classList.add('slide-out');
  mainContent.classList.add('visible');
  sideDots.classList.add('visible');
  
  // Launch initial massive celebratory fireworks shower
  setTimeout(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    mainFX.createBurst(w * 0.25, h * 0.4, 100, true);
    mainFX.createBurst(w * 0.75, h * 0.3, 100, true);
    mainFX.createBurst(w * 0.5, h * 0.5, 120, true);
  }, 400);
});

//  SIDE NAVIGATION DOT CONTROLLER 
const sections = document.querySelectorAll('.timeline-section');
const dots = document.querySelectorAll('.dot');

const updateActiveNavDot = () => {
  let index = 0;
  let minDiff = Infinity;
  sections.forEach((sec, i) => {
    const rect = sec.getBoundingClientRect();
    const diff = Math.abs(rect.top);
    if (diff < minDiff) {
      minDiff = diff;
      index = i;
    }
  });
  dots.forEach(d => d.classList.remove('active'));
  const targetDot = document.querySelector(`.dot[data-section="${index}"]`);
  if (targetDot) targetDot.classList.add('active');
};

window.addEventListener('scroll', updateActiveNavDot);
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const sIdx = dot.getAttribute('data-section');
    sections[sIdx].scrollIntoView({ behavior: 'smooth' });
  });
});

// Scroll Reveal Management
const revealElements = document.querySelectorAll('.reveal');
const checkReveal = () => {
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.82) {
      el.classList.add('revealed');
    }
  });
};
window.addEventListener('scroll', checkReveal);
window.addEventListener('load', checkReveal);

document.getElementById('begin-journey-btn').addEventListener('click', () => {
  sections[1].scrollIntoView({ behavior: 'smooth' });
});

//  INTERACTIVE CANDLE CAKE ENGINE 
const candlesRow = document.getElementById('candles-row');
const cakeStatus = document.getElementById('cake-status');
let litCandlesCount = 5;

// Dynamically inject the 5 interactive candles directly on top tier bounds
for (let i = 0; i < 5; i++) {
  const candle = document.createElement('div');
  candle.className = 'candle';
  candle.innerHTML = `
    <div class="candle-flame" id="flame-${i}">
      <div class="flame-outer"></div>
      <div class="flame-inner"></div>
    </div>
    <div class="candle-stick"></div>
  `;
  
  // Interactive individual toggle blowouts
  candle.addEventListener('click', (e) => {
    e.stopPropagation();
    const flame = candle.querySelector('.candle-flame');
    if (!flame.classList.contains('extinguished')) {
      flame.classList.add('extinguished');
      litCandlesCount--;
      
      // Calculate coordinates dynamically for accurate localized particle explosion
      const rect = flame.getBoundingClientRect();
      cakeFX.createBurst(rect.left + window.scrollX + 7, rect.top + window.scrollY + 10, 30, false);
      
      if (litCandlesCount === 0) {
        cakeStatus.innerHTML = "✨ Your wish is granted, Director Bee! ✨";
        cakeStatus.style.color = "var(--accent)";
        document.getElementById('cake-instruction-text').innerText = "All candles blown out! 🥳";
        
        // Blow up screen with a massive synchronized firework burst finale
        const cRect = candlesRow.getBoundingClientRect();
        setTimeout(() => cakeFX.createBurst(cRect.left + (cRect.width/2), cRect.top + window.scrollY, 140, true), 150);
      } else {
        cakeStatus.innerText = `🕯️ ${litCandlesCount} candles remaining...`;
      }
    }
  });
  candlesRow.appendChild(candle);
}

// ─── REALTIME STACKED LIVE FEED SUMMARY (OLDEST FIRST + LIMIT 10) 
const feedList = document.getElementById('feed-list');
const feedLoading = document.getElementById('feed-loading');
const feedEmpty = document.getElementById('feed-empty');

// FIX: Changed order direction to "asc" for oldest first, and extended limit to 10
const qSummary = query(collection(db, "wishes"), orderBy("timestamp", "asc"), limit(10));

onSnapshot(qSummary, snapshot => {
  feedLoading.style.display = 'none';
  feedList.innerHTML = '';
  
  if (snapshot.empty) {
    feedEmpty.style.display = 'block';
    return;
  }
  
  feedEmpty.style.display = 'none';
  snapshot.forEach(doc => {
    const data = doc.data();
    
    const block = document.createElement('div');
    block.className = 'wish-card';
    block.style.padding = '14px 20px';
    block.style.margin = '0';
    
    let avHtml = `<div class="wish-avatar-fallback" style="width:36px; height:36px;"><svg width="18" height="18" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="9" r="5" fill="#d4af37" opacity="0.6"/><path d="M2 24c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/></svg></div>`;
    if (data.avatarUrl && data.avatarUrl.trim() !== '') {
      avHtml = `<img src="${data.avatarUrl}" class="wish-avatar" style="width:36px; height:36px;" alt="User profile item" onerror="this.style.display='none'" />`;
    }
    
    const safeName = document.createElement('div').appendChild(document.createTextNode(data.name || "Anonymous")).parentNode.textContent;
    
    block.innerHTML = `
      <div class="wish-header" style="margin-bottom: 0; gap:12px;">
        ${avHtml}
        <div>
          <div class="wish-name" style="font-size:15px; font-weight:500;">${safeName}</div>
          <div class="wish-time" style="font-size:11px; color:var(--accent-dim);">Sent a birthday blessing ✦</div>
        </div>
      </div>
    `;
    feedList.appendChild(block);
  });
}, err => {
  console.error("Firebase fetch error: ", err);
  feedLoading.style.display = 'none';
  feedEmpty.style.display = 'block';
});

// ─── POLAROID CAROUSEL & LIGHTBOX MODULE 
const track = document.getElementById('carousel-track');
const dotsContainer = document.getElementById('carousel-dots');
const cDots = document.querySelectorAll('.carousel-dot');
let currentCarouselIndex = 0;

const updateCarouselView = () => {
  const cardWidth = 260 + 32; // Width + Gap dimensions
  track.style.transform = `translateX(${-currentCarouselIndex * cardWidth}px)`;
  cDots.forEach((d, i) => d.classList.toggle('active', i === currentCarouselIndex));
};

document.getElementById('carousel-next').addEventListener('click', () => {
  currentCarouselIndex = (currentCarouselIndex + 1) % 4;
  updateCarouselView();
});
document.getElementById('carousel-prev').addEventListener('click', () => {
  currentCarouselIndex = (currentCarouselIndex - 1 + 4) % 4;
  updateCarouselView();
});
cDots.forEach(dot => {
  dot.addEventListener('click', () => {
    currentCarouselIndex = parseInt(dot.getAttribute('data-ci'));
    updateCarouselView();
  });
});

// Lightbox triggers for Carousel previews
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
document.querySelectorAll('.polaroid img').forEach(img => {
  img.addEventListener('click', () => {
    lbImg.src = img.src;
    lb.classList.add('open');
  });
});
const closeLightbox = () => { lb.classList.remove('open'); lbImg.src=''; };
document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
lb.addEventListener('click', (e) => { if(e.target === lb) closeLightbox(); });

// ─── OVERHAULED DRAG & CLICK FLUID WORD SEARCH PUZZLE 
const PUZZLE_GRID = [
  ['F', 'A', 'A', 'G', 'I', 'X'],
  ['B', 'L', 'E', 'B', 'L', 'E'],
  ['S', 'A', 'R', 'A', 'H', 'P'],
  ['M', 'U', 'M', 'M', 'Y', 'O'],
  ['W', 'Q', 'V', 'Z', 'K', 'R'],
  ['O', 'R', 'B', 'Y', 'M', 'T']
];

const TARGET_WORDS = ["FAAGI", "BLEBLE", "SARAH", "MUMMY"];
let foundWords = [];

const gridEl = document.getElementById('puzzle-grid');
const statusEl = document.getElementById('puzzle-status');

let isSelecting = false;
let selectedCells = []; // Stores objects: { row, col, id, char }

// Initialize and draw grid architecture perfectly
function initPuzzleGrid() {
  gridEl.innerHTML = '';
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.innerText = PUZZLE_GRID[r][c];
      const cellId = `cell-${r}-${c}`;
      cell.setAttribute('id', cellId);
      cell.setAttribute('data-row', r);
      cell.setAttribute('data-col', c);
      
      // Desktop Mouse Interactivity
      cell.addEventListener('mousedown', (e) => startSelection(r, c, cellId, cell));
      cell.addEventListener('mouseenter', () => extendSelection(r, c, cellId, cell));
      
      // Mobile Touch Interactivity overrides
      cell.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startSelection(r, c, cellId, cell);
      }, { passive: false });

      gridEl.appendChild(cell);
    }
  }
}

// Global window pointer lift handles to finalize selection string validation smoothly
window.addEventListener('mouseup', () => endSelection());
gridEl.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  if (target && target.classList.contains('cell') && target.parentElement === gridEl) {
    const r = parseInt(target.getAttribute('data-row'));
    const c = parseInt(target.getAttribute('data-col'));
    const cellId = target.getAttribute('id');
    extendSelection(r, c, cellId, target);
  }
}, { passive: false });
gridEl.addEventListener('touchend', (e) => { e.preventDefault(); endSelection(); }, { passive: false });

function startSelection(r, c, id, el) {
  if (el.classList.contains('found-perm')) return;
  isSelecting = true;
  selectedCells = [{ row: r, col: c, id: id, char: PUZZLE_GRID[r][c] }];
  el.classList.add('selected');
}

function extendSelection(r, c, id, el) {
  if (!isSelecting || el.classList.contains('found-perm')) return;
  // Prevent duplicate additions sequentially
  if (selectedCells.some(cell => cell.id === id)) return;
  
  selectedCells.push({ row: r, col: c, id: id, char: PUZZLE_GRID[r][c] });
  el.classList.add('selected');
}

function endSelection() {
  if (!isSelecting) return;
  isSelecting = false;
  
  const wordSpelled = selectedCells.map(cell => cell.char).join('');
  const reverseWordSpelled = wordSpelled.split('').reverse().join('');
  
  let matchFound = null;
  if (TARGET_WORDS.includes(wordSpelled) && !foundWords.includes(wordSpelled)) {
    matchFound = wordSpelled;
  } else if (TARGET_WORDS.includes(reverseWordSpelled) && !foundWords.includes(reverseWordSpelled)) {
    matchFound = reverseWordSpelled;
  }

  if (matchFound) {
    foundWords.push(matchFound);
    
    // Apply permanent success state highlights layout
    selectedCells.forEach(cell => {
      const el = document.getElementById(cell.id);
      el.classList.remove('selected');
      el.classList.add('found-perm');
    });
    
    // Style hint chips
    const chip = document.querySelector(`.word-chip[data-word="${matchFound}"]`);
    if (chip) chip.classList.add('found');
    
    // Fire dynamic localized success feedback bursts over the interactive grid
    const gridRect = gridEl.getBoundingClientRect();
    puzzleFX.createBurst(gridRect.left + (gridRect.width / 2), gridRect.top + window.scrollY + (gridRect.height / 2), 40, false);
    
    statusEl.innerText = `🎉 Found "${matchFound}"! Awesome!`;
    statusEl.style.color = "var(--accent)";
    
    checkPuzzleCompletion();
  } else {
    // Revert selection states softly if invalid
    selectedCells.forEach(cell => {
      const el = document.getElementById(cell.id);
      if (el && !el.classList.contains('found-perm')) el.classList.remove('selected');
    });
  }
  selectedCells = [];
}

function checkPuzzleCompletion() {
  if (foundWords.length === TARGET_WORDS.length) {
    statusEl.className = "puzzle-status success";
    statusEl.innerText = "🔓 UNLOCKED! The Secret Archive is open below! 🥳";
    
    // Reveal Secret Content Archive Layers natively
    document.getElementById('locked-placeholder').classList.add('hidden');
    document.getElementById('reward-content').classList.add('unlocked');
    
    // Fire final major fireworks display
    const gRect = gridEl.getBoundingClientRect();
    setTimeout(() => puzzleFX.createBurst(gRect.left + (gRect.width/2), gRect.top + window.scrollY, 100, true), 200);
  }
}

// Instantiate puzzle on load
initPuzzleGrid();