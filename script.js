/**
 * KhanaKya? — Meal Planner
 */

const MEALS_DATA = [
  {"id":1, "name":"Bread Omelette",    "type":"nonveg","effort":2,"hunger":"light","who":"both",     "time":20,"cost":58, "description":"Crispy edges, soft inside. Breakfast anytime."},
  {"id":2, "name":"Bread Jam",         "type":"veg",   "effort":1,"hunger":"snack","who":"both",     "time":5, "cost":45, "description":"No effort, no mess. The laziest morning fix."},
  {"id":3, "name":"Aloo Sandwich",     "type":"veg",   "effort":3,"hunger":"light","who":"both",     "time":25,"cost":30, "description":"Spiced potato stuffed between toasty bread slices."},
  {"id":4, "name":"Poha",              "type":"veg",   "effort":2,"hunger":"light","who":"both",     "time":20,"cost":25, "description":"Fluffy and tangy. The ideal lazy morning."},
  {"id":5, "name":"Jau / Seviyan",     "type":"veg",   "effort":2,"hunger":"snack","who":"both",     "time":20,"cost":20, "description":"Light and warm. Old-school breakfast comfort."},
  {"id":6, "name":"Halwa",             "type":"veg",   "effort":1,"hunger":"snack","who":"himanshu", "time":25,"cost":20, "description":"Ghee-roasted suji with a touch of sweetness."},
  {"id":7, "name":"Boiled Eggs",       "type":"nonveg","effort":1,"hunger":"snack","who":"both",     "time":15,"cost":28, "description":"Minimal effort, maximum protein. No excuses."},
  {"id":8, "name":"Egg Bhurji",        "type":"nonveg","effort":1,"hunger":"snack","who":"both",     "time":10,"cost":28, "description":"Spiced scrambled eggs. Street food favourite."},
  {"id":9, "name":"Paneer Bhurji",     "type":"veg",   "effort":2,"hunger":"snack","who":"both",     "time":15,"cost":100,"description":"Scrambled paneer with masala. Rich and filling."},
  {"id":10,"name":"Half Egg Fry",      "type":"nonveg","effort":1,"hunger":"snack","who":"both",     "time":9, "cost":14, "description":"Sunny side up. The simplest egg story."},
  {"id":11,"name":"Paneer Sandwich",   "type":"veg",   "effort":2,"hunger":"light","who":"both",     "time":20,"cost":100,"description":"Grilled paneer packed between toasted bread."},
  {"id":12,"name":"Veg Sandwich",      "type":"veg",   "effort":1,"hunger":"light","who":"both",     "time":8, "cost":30, "description":"Stacked with veggies. No fire needed."},
  {"id":13,"name":"Maggie",            "type":"veg",   "effort":1,"hunger":"snack","who":"himanshu", "time":13,"cost":30, "description":"The classic dorm saviour. Two-minute miracle. Cheese for more."},
  {"id":14,"name":"Chocos Milk",       "type":"veg",   "effort":1,"hunger":"snack","who":"himanshu", "time":5, "cost":50, "description":"Just Milk and Chocos, Be Lazy."},
  {"id":15,"name":"Daliya",            "type":"veg",   "effort":1,"hunger":"light","who":"both",     "time":25,"cost":30, "description":"Wholesome broken wheat. Healthy comfort in a bowl."},
  {"id":16,"name":"Chura-Milk",        "type":"veg",   "effort":1,"hunger":"light","who":"himanshu", "time":10,"cost":30, "description":"Cold poha soaked in milk. The no-cook breakfast."},
  {"id":17,"name":"Egg Fried Rice",    "type":"nonveg","effort":3,"hunger":"meal", "who":"both",     "time":45,"cost":28, "description":"Wok-tossed rice with egg. Quick and satisfying."},
  {"id":18,"name":"Dal Chawal",        "type":"veg",   "effort":3,"hunger":"meal", "who":"both",     "time":45,"cost":50, "description":"Desi soul food. Gets you through anything."},
  {"id":19,"name":"Bhindi Roti",       "type":"veg",   "effort":5,"hunger":"meal", "who":"both",     "time":80,"cost":55, "description":"Crispy okra with soft rotis. Simple and satisfying."},
  {"id":20,"name":"Rajma Rice",        "type":"veg",   "effort":3,"hunger":"meal", "who":"both",     "time":45,"cost":60, "description":"The ultimate desi comfort meal. Worth the wait."},
  {"id":21,"name":"Egg Curry Rice",    "type":"nonveg","effort":4,"hunger":"meal", "who":"both",     "time":55,"cost":28, "description":"Boiled eggs in rich masala curry. Weekend energy."},
  {"id":22,"name":"Fish Fry",          "type":"nonveg","effort":3,"hunger":"meal", "who":"both",     "time":30,"cost":150,"description":"Crispy fried fish with spiced coating. Treat yourself."},
  {"id":23,"name":"Omelette Rice",     "type":"nonveg","effort":2,"hunger":"meal", "who":"both",     "time":20,"cost":50, "description":"Fluffy omelette over warm rice. Simple wins."},
  {"id":24,"name":"Soya Bean Rice",    "type":"veg",   "effort":2,"hunger":"meal", "who":"both",     "time":25,"cost":45, "description":"High-protein soya in spiced rice. Underrated gem."},
  {"id":25,"name":"Rice Pulao",        "type":"veg",   "effort":2,"hunger":"meal", "who":"both",     "time":25,"cost":50, "description":"Fragrant spiced rice. Light yet filling."},
  {"id":26,"name":"Paneer Rice",       "type":"veg",   "effort":2,"hunger":"meal", "who":"both",     "time":25,"cost":90, "description":"Paneer chunks in flavoured rice. Rich and filling."},
  {"id":27,"name":"Curd Rice",         "type":"veg",   "effort":1,"hunger":"light","who":"both",     "time":10,"cost":30, "description":"Cool and tangy. Summer's best comfort food."},
  {"id":28,"name":"Dahi Aloo",         "type":"veg",   "effort":2,"hunger":"meal", "who":"both",     "time":25,"cost":45, "description":"Potatoes in a tangy curd gravy. Simple pleasure."},
  {"id":29,"name":"Chole Rice",        "type":"veg",   "effort":3,"hunger":"meal", "who":"both",     "time":35,"cost":60, "description":"Spiced chickpea curry on steamed rice."},
  {"id":30,"name":"Chole Chana Rice",  "type":"veg",   "effort":3,"hunger":"meal", "who":"both",     "time":40,"cost":65, "description":"Double legume power. Protein-packed desi bowl."},
  {"id":31,"name":"Aloo Rice",         "type":"veg",   "effort":2,"hunger":"meal", "who":"both",     "time":20,"cost":35, "description":"Spiced potato rice. The simplest satisfying meal."},
  {"id":32,"name":"Chicken Rice",      "type":"nonveg","effort":3,"hunger":"meal", "who":"both",     "time":40,"cost":130,"description":"Tender chicken pieces on flavoured rice."},
  {"id":33,"name":"Kadi Rice",         "type":"veg",   "effort":3,"hunger":"meal", "who":"both",     "time":35,"cost":45, "description":"Tangy curd gravy with pakodas over rice. Homely gold."}
];

// ─── State ───────────────────────────────────────────
const appState = {
  type: 'all',
  who: ['himanshu', 'swapnil'],
  maxEffort: 3,
};

const EFFORT_LABELS = { 1:'Instant', 2:'Easy', 3:'Medium', 4:'High', 5:'Advanced' };

const CATEGORY_MAP  = { snack:'grid-snacks', light:'grid-light', meal:'grid-proper', outside:'grid-outside' };
const COUNT_MAP     = {
  snack: '#category-snacks .item-count',
  light: '#category-light .item-count',
  meal:  '#category-proper .item-count',
  outside: '#category-outside .item-count',
};

// ─── Audio ───────────────────────────────────────────
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTap(type = 'soft') {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'soft') {
      // Light UI tap — short click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.09);
    } else if (type === 'toggle') {
      // Toggle on/off — two-tone pop
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.11);
    } else if (type === 'random') {
      // Random pick — satisfying ascending blip
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'reset') {
      // Reset — descending sweep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.21);
    }
  } catch (e) { /* audio not critical */ }
}

// ─── Scoring ──────────────────────────────────────────
const _maxCost = Math.max(...MEALS_DATA.map(m => m.cost));
const _maxTime = Math.max(...MEALS_DATA.map(m => m.time));

function mealScore(meal) {
  const effortScore = 1 - (meal.effort - 1) / 4;
  const timeScore   = 1 - meal.time / _maxTime;
  const costScore   = 1 - meal.cost / (_maxCost * 1.2);
  return (effortScore * 0.4) + (timeScore * 0.35) + (costScore * 0.25);
}

// ─── SVG icons ────────────────────────────────────────
const VEG_SVG = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="1.5" y="1.5" width="17" height="17" rx="2" stroke="#2D8B3A" stroke-width="2"/>
  <circle cx="10" cy="10" r="5.5" fill="#2D8B3A"/>
</svg>`;

const NONVEG_SVG = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="1.5" y="1.5" width="17" height="17" rx="2" stroke="#C0302A" stroke-width="2"/>
  <circle cx="10" cy="10" r="5.5" fill="#C0302A"/>
</svg>`;

// ─── Boot ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  bindFilters();
  initScrollProgress();
  renderAll();
});

// ─── Render ───────────────────────────────────────────
function renderAll() {
  const buckets = { snack: [], light: [], meal: [], outside: [] };
  MEALS_DATA.forEach(meal => {
    if (passesFilter(meal) && buckets[meal.hunger]) buckets[meal.hunger].push(meal);
  });

  Object.entries(buckets).forEach(([hunger, meals]) => {
    const gridEl  = document.getElementById(CATEGORY_MAP[hunger]);
    const countEl = document.querySelector(COUNT_MAP[hunger]);
    const section = gridEl?.closest('.meal-category');
    if (!gridEl) return;

    if (meals.length === 0) {
      gridEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🍽</div>
          <h3>Nothing matches</h3>
          <p>Try loosening the filters above</p>
        </div>`;
      if (countEl) countEl.textContent = '0 items';
      if (section) section.style.opacity = '0.4';
      return;
    }

    meals.sort((a, b) => mealScore(b) - mealScore(a));
    gridEl.innerHTML = '';
    meals.forEach((meal, i) => gridEl.appendChild(buildCard(meal, i)));
    if (countEl) countEl.textContent = `${meals.length} item${meals.length !== 1 ? 's' : ''}`;
    if (section) section.style.opacity = '1';
  });
}

// ─── Card Builder ─────────────────────────────────────
function buildCard(meal, rank) {
  const card = document.createElement('div');
  card.className = 'meal-card';
  card.dataset.id = meal.id;

  const effortBar = buildEffortBar(meal.effort);
  const indicator = meal.type === 'veg' ? VEG_SVG : NONVEG_SVG;

  card.innerHTML = `
    ${rank === 0 ? '<div class="top-badge">Top Pick</div>' : ''}
    <div class="meal-image-wrapper">
      <img src="images/${meal.id}.jpg" alt="${meal.name}">
    </div>
    <div class="meal-card-content">
      <div class="meal-card-header">
        <h3 class="meal-title">${meal.name}</h3>
        <span class="veg-indicator" title="${meal.type === 'veg' ? 'Veg' : 'Non-Veg'}">${indicator}</span>
      </div>
      <p class="meal-desc">${meal.description}</p>
      <div class="meal-meta">
        <span class="meta-chip price">₹${meal.cost}</span>
        <span class="meta-chip">⏱ ${meal.time} min</span>
        <span class="meta-chip effort-chip">${effortBar}</span>
      </div>
    </div>
  `;

  card.addEventListener('click', () => {
    playTap('soft');
    highlightCard(card);
  });
  return card;
}

function buildEffortBar(level) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="effort-dot ${i <= level ? 'filled' : ''}"></span>`;
  }
  return html;
}

// ─── Highlight ────────────────────────────────────────
function highlightCard(card) {
  document.querySelectorAll('.highlight-card').forEach(c => c.classList.remove('highlight-card'));
  card.classList.add('highlight-card');
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => card.classList.remove('highlight-card'), 2500);
}

// ─── Filter ───────────────────────────────────────────
function passesFilter(meal) {
  if (appState.type !== 'all' && meal.type !== appState.type) return false;
  if (appState.who.length > 0 && meal.who !== 'both' && !appState.who.includes(meal.who)) return false;
  if (meal.effort > appState.maxEffort) return false;
  return true;
}

// ─── Random ───────────────────────────────────────────
function pickRandom() {
  playTap('random');
  const pool = MEALS_DATA.filter(passesFilter);
  if (!pool.length) return;
  const pick   = pool[Math.floor(Math.random() * pool.length)];
  const cardEl = document.querySelector(`[data-id="${pick.id}"]`);
  if (cardEl) highlightCard(cardEl);
}

// ─── Reset ────────────────────────────────────────────
function resetFilters() {
  playTap('reset');
  appState.type      = 'all';
  appState.who       = ['himanshu', 'swapnil'];
  appState.maxEffort = 3;
  syncUI();
  renderAll();
}

// ─── Sync UI state ────────────────────────────────────
function syncUI() {
  // Name options in dropdown
  ['himanshu','swapnil'].forEach(name => {
    document.getElementById(`option-${name}`)
      ?.classList.toggle('selected', appState.who.includes(name));
  });
  updateNameLabel();

  const vegBtn    = document.getElementById('diet-veg');
  const nonvegBtn = document.getElementById('diet-nonveg');
  const body      = document.body;

  // Remove all theme classes first
  body.classList.remove('theme-veg', 'theme-nonveg', 'theme-both');

  if (appState.type === 'veg') {
    vegBtn?.classList.add('active');
    nonvegBtn?.classList.remove('active');
    body.classList.add('theme-veg');
  } else if (appState.type === 'nonveg') {
    nonvegBtn?.classList.add('active');
    vegBtn?.classList.remove('active');
    body.classList.add('theme-nonveg');
  } else {
    vegBtn?.classList.add('active');
    nonvegBtn?.classList.add('active');
    body.classList.add('theme-both');
  }

  const slider = document.getElementById('effortSlider');
  const label  = document.getElementById('effortLabel');
  if (slider) { slider.value = appState.maxEffort; updateSliderTrack(slider); }
  if (label)  label.textContent = EFFORT_LABELS[appState.maxEffort];
}

function updateNameLabel() {
  const labelEl = document.getElementById('nameLabel');
  const trigger = document.getElementById('nameDropdownTrigger');
  if (!labelEl) return;
  const both = appState.who.includes('himanshu') && appState.who.includes('swapnil');
  if (both) {
    labelEl.textContent = 'Both';
    trigger?.classList.add('has-active');
  } else if (appState.who.length === 0) {
    labelEl.textContent = 'Nobody';
    trigger?.classList.remove('has-active');
  } else {
    // Capitalize first letter
    labelEl.textContent = appState.who[0].charAt(0).toUpperCase() + appState.who[0].slice(1);
    trigger?.classList.add('has-active');
  }
}

function updateSliderTrack(slider) {
  const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.setProperty('--pct', pct + '%');
}

// ─── Bindings ─────────────────────────────────────────
function bindFilters() {
  // ── Name dropdown: toggle open/close ──
  const trigger = document.getElementById('nameDropdownTrigger');
  const panel   = document.getElementById('nameDropdownPanel');

  trigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    playTap('soft');
    panel?.classList.toggle('open');
    trigger?.classList.toggle('open');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    panel?.classList.remove('open');
    trigger?.classList.remove('open');
  });
  panel?.addEventListener('click', e => e.stopPropagation());

  // ── Name options inside dropdown ──
  ['himanshu','swapnil'].forEach(name => {
    document.getElementById(`option-${name}`)?.addEventListener('click', () => {
      playTap('toggle');
      if (appState.who.includes(name)) {
        if (appState.who.length > 1) appState.who = appState.who.filter(n => n !== name);
      } else {
        appState.who.push(name);
      }
      syncUI();
      renderAll();
    });
  });

  // ── Diet buttons ──
  document.getElementById('diet-veg')?.addEventListener('click', () => {
    playTap('toggle');
    appState.type = appState.type === 'veg' ? 'all' : 'veg';
    syncUI();
    renderAll();
  });

  document.getElementById('diet-nonveg')?.addEventListener('click', () => {
    playTap('toggle');
    appState.type = appState.type === 'nonveg' ? 'all' : 'nonveg';
    syncUI();
    renderAll();
  });

  // ── Effort slider ──
  const slider = document.getElementById('effortSlider');
  slider?.addEventListener('input', e => {
    playTap('soft');
    appState.maxEffort = parseInt(e.target.value);
    const label = document.getElementById('effortLabel');
    if (label) label.textContent = EFFORT_LABELS[appState.maxEffort];
    updateSliderTrack(e.target);
    renderAll();
  });
  if (slider) updateSliderTrack(slider);

  // ── Buttons ──
  document.getElementById('btn-random')?.addEventListener('click', pickRandom);
  document.getElementById('btn-clear')?.addEventListener('click', resetFilters);
}

// ─── Scroll Progress Ring ─────────────────────────────
function initScrollProgress() {
  const wrap = document.getElementById('progressWrap');
  const pathEl = document.getElementById('progressPath');
  if (!wrap || !pathEl) return;

  const pathLength = pathEl.getTotalLength();

  // Init dasharray
  pathEl.style.transition = 'none';
  pathEl.style.strokeDasharray  = `${pathLength} ${pathLength}`;
  pathEl.style.strokeDashoffset = pathLength;
  // Force reflow
  pathEl.getBoundingClientRect();
  pathEl.style.transition = 'stroke-dashoffset 80ms linear';

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = pathLength - (scrollTop * pathLength / docHeight);
    pathEl.style.strokeDashoffset = Math.max(0, progress);

    if (scrollTop > 80) {
      wrap.classList.add('active-progress');
    } else {
      wrap.classList.remove('active-progress');
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  wrap.addEventListener('click', () => {
    playTap('reset');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}