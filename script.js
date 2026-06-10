let meals = [];
let state = {
  type: 'all',
  who: ['me', 'roommate'],
  effort: 5,
  hunger: ['snack', 'light', 'meal', 'outside'],
  tags: [],
  search: '',
  sort: 'score'
};

// Score formula
function score(m) {
  const effortScore = (m.effort <= state.effort) ? 50 : Math.max(0, 50 - (m.effort - state.effort) * 20);
  const hungerScore = state.hunger.includes(m.hunger) ? 20 : 0;
  const whoScore = (m.who === 'both' || state.who.includes(m.who)) ? 20 : 0;
  const popularity = (m.popularity / 10) * 10;
  return Math.round(effortScore + hungerScore + whoScore + popularity);
}

function isVisible(m) {
  if (state.type !== 'all' && m.type !== state.type) return false;
  if (state.who.length === 0) return false;
  if (m.who !== 'both' && !state.who.includes(m.who)) return false;
  if (m.effort > state.effort) return false;
  if (!state.hunger.includes(m.hunger)) return false;
  if (state.tags.length > 0 && !state.tags.some(t => m.tags.includes(t))) return false;
  if (state.search) {
    const q = state.search.toLowerCase();
    if (!m.name.toLowerCase().includes(q) &&
        !m.description.toLowerCase().includes(q) &&
        !m.ingredients.some(i => i.includes(q)) &&
        !m.tags.some(t => t.includes(q))) return false;
  }
  return true;
}

function sortMeals(list) {
  const s = state.sort || document.getElementById('sortSelect').value;
  return [...list].sort((a, b) => {
    if (s === 'score')      return score(b) - score(a);
    if (s === 'effort')     return a.effort - b.effort;
    if (s === 'time')       return a.time - b.time;
    if (s === 'cost')       return a.cost - b.cost;
    if (s === 'popularity') return b.popularity - a.popularity;
    return 0;
  });
}

function effortLabel(n) {
  return ['', '😴 Instant', '🚶 Easy', '🧑‍🍳 Medium', '💪 Effort', '🔥 Full Cook'][n];
}

function whoLabel(w) {
  return w === 'both' ? '👫 Both' : w === 'me' ? '🙋 Me' : '🤝 Roommate';
}

function whoClass(w) {
  return w === 'both' ? 'who-both' : w === 'me' ? 'who-me' : 'who-roommate';
}

function renderCard(m, rank) {
  const sc = score(m);
  const pct = sc;
  return `
  <div class="meal-card ${rank === 0 ? 'winner' : ''}" onclick="openMeal(${m.id})">
    ${rank === 0 ? '<div class="winner-badge">⭐ Best Pick</div>' : ''}
    <div class="card-top">
      <div class="card-emoji">${m.emoji}</div>
      <div class="card-info">
        <div class="card-name">${m.name}</div>
        <div class="card-desc">${m.description}</div>
      </div>
      <div class="veg-dot ${m.type}"></div>
    </div>
    <div class="card-meta">
      <span class="meta-chip effort">⚡ ${effortLabel(m.effort)}</span>
      <span class="meta-chip time">⏱ ${m.time}m</span>
      <span class="meta-chip ${whoClass(m.who)}">${whoLabel(m.who)}</span>
    </div>
    <div class="card-tags">
      ${m.tags.slice(0, 3).map(t => `<span class="tag">#${t}</span>`).join('')}
    </div>
    <div class="score-bar-wrap">
      <div class="score-bar-bg"><div class="score-bar-fill" style="width:${pct}%"></div></div>
      <span class="score-num">${sc}</span>
    </div>
  </div>`;
}

function applyFilters() {
  state.search = document.getElementById('searchInput').value;
  state.sort = document.getElementById('sortSelect').value;
  const grid = document.getElementById('cardsGrid');
  const visible = sortMeals(meals.filter(isVisible));
  document.getElementById('countNum').textContent = visible.length;
  if (visible.length === 0) {
    grid.innerHTML = `<div class="empty">
      <div class="empty-emoji">🤷</div>
      <div class="empty-title">No meals match</div>
      <div class="empty-sub">Try relaxing your filters — maybe increase effort or hunger level.</div>
    </div>`;
    return;
  }
  grid.innerHTML = visible.map((m, i) => renderCard(m, i)).join('');
  updateActiveFilters();
}

function buildTagBar() {
  const allTags = [...new Set(meals.flatMap(m => m.tags))].sort();
  const bar = document.getElementById('tagBar');
  bar.innerHTML = allTags.map(t =>
    `<span class="tag-chip ${state.tags.includes(t) ? 'active' : ''}" onclick="toggleTag('${t}')">#${t}</span>`
  ).join('');
}

function toggleTag(tag) {
  if (state.tags.includes(tag)) {
    state.tags = state.tags.filter(t => t !== tag);
  } else {
    state.tags.push(tag);
  }
  buildTagBar();
  applyFilters();
}

function setType(el, val) {
  state.type = val;
  document.querySelectorAll('[data-filter="type"]').forEach(p => {
    p.classList.remove('active', 'veg', 'nonveg');
    if (p === el) p.classList.add('active');
    if (p.dataset.val === 'veg') p.classList.add('veg');
    if (p.dataset.val === 'nonveg') p.classList.add('nonveg');
  });
  applyFilters();
}

function toggleWho(who) {
  const el = document.getElementById('check-' + who);
  if (state.who.includes(who)) {
    if (state.who.length > 1) {
      state.who = state.who.filter(w => w !== who);
      el.classList.remove('active');
      el.querySelector('.check-box').textContent = '';
    }
  } else {
    state.who.push(who);
    el.classList.add('active');
    el.querySelector('.check-box').textContent = '✓';
  }
  applyFilters();
}

function updateEffort(val) {
  state.effort = parseInt(val);
  document.getElementById('effortVal').textContent = `${val} / 5`;
  applyFilters();
}

function setHunger(el, val) {
  if (state.hunger.includes(val)) {
    if (state.hunger.length > 1) {
      state.hunger = state.hunger.filter(h => h !== val);
      el.classList.remove('active');
    }
  } else {
    state.hunger.push(val);
    el.classList.add('active');
  }
  applyFilters();
}

function updateActiveFilters() {
  const wrap = document.getElementById('activeFilters');
  const chips = [];
  if (state.type !== 'all') chips.push({
    label: state.type === 'veg' ? '🟢 Veg Only' : '🔴 Non-Veg Only',
    clear: () => { state.type = 'all'; document.querySelector('[data-val="all"]').click(); }
  });
  if (state.effort < 5) chips.push({
    label: `⚡ Max effort ${state.effort}`,
    clear: () => { document.getElementById('effortSlider').value = 5; updateEffort(5); }
  });
  state.tags.forEach(t => chips.push({ label: `#${t}`, clear: () => toggleTag(t) }));
  wrap.innerHTML = chips.map((c, i) =>
    `<div class="filter-pill" onclick="clearFilter(${i})">✕ ${c.label}</div>`
  ).join('');
  wrap._clearFns = chips.map(c => c.clear);
}

function clearFilter(i) {
  document.getElementById('activeFilters')._clearFns[i]();
}

function resetFilters() {
  state = { type: 'all', who: ['me', 'roommate'], effort: 5, hunger: ['snack', 'light', 'meal', 'outside'], tags: [], search: '', sort: 'score' };
  document.getElementById('effortSlider').value = 5;
  document.getElementById('effortVal').textContent = '5 / 5';
  document.getElementById('searchInput').value = '';
  document.getElementById('sortSelect').value = 'score';
  document.querySelector('[data-val="all"]').classList.add('active');
  document.querySelector('[data-val="veg"]').classList.remove('active');
  document.querySelector('[data-val="nonveg"]').classList.remove('active');
  ['me', 'roommate'].forEach(w => {
    document.getElementById('check-' + w).classList.add('active');
    document.getElementById('check-' + w).querySelector('.check-box').textContent = '✓';
  });
  document.querySelectorAll('.hunger-card').forEach(c => c.classList.add('active'));
  buildTagBar();
  applyFilters();
}

function decideForMe() {
  const visible = sortMeals(meals.filter(isVisible));
  if (visible.length === 0) { alert('No meals match your filters! Try relaxing them first.'); return; }
  const top5 = visible.slice(0, Math.min(5, visible.length));
  const pick = top5[Math.floor(Math.random() * top5.length)];
  const sc = score(pick);
  document.getElementById('diceEmoji').textContent = pick.emoji;
  document.getElementById('decidePick').textContent = pick.name;
  document.getElementById('decideScore').textContent = `Match Score: ${sc}/100 — ${pick.description}`;
  document.getElementById('decideCardWrap').innerHTML = renderCard(pick, -1).replace('onclick="openMeal(', 'style="cursor:default" onclick="void(0);//');
  document.getElementById('decideModal').classList.add('open');
}

function openMeal(id) {
  const m = meals.find(x => x.id === id);
  if (!m) return;
  document.getElementById('mEmoji').textContent = m.emoji;
  document.getElementById('mName').textContent = m.name;
  document.getElementById('mDesc').textContent = m.description;
  document.getElementById('mTime').textContent = m.time;
  document.getElementById('mCost').textContent = '₹' + m.cost;
  document.getElementById('mEffort').textContent = m.effort + '/5';
  document.getElementById('mIngredients').innerHTML = m.ingredients.map(i => `<span class="ingredient">${i}</span>`).join('');
  document.getElementById('mTags').innerHTML = m.tags.map(t => `<span class="tag">#${t}</span>`).join('');
  document.getElementById('mealModal').classList.add('open');
}

function closeModal(e) {
  if (e.target.classList.contains('modal-overlay')) closeAllModals();
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}

document.getElementById('sidebarOverlay').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
});

// Theme toggle
const themeBtn = document.getElementById('themeBtn');
let dark = true;
themeBtn.addEventListener('click', () => {
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeBtn.textContent = dark ? '🌙' : '☀️';
});

// Load meals from JSON
async function loadMeals() {
  try {
    const r = await fetch('meals.json');
    meals = await r.json();
  } catch {
    console.error('Could not load meals.json — make sure it is in the same folder as index.html');
    meals = [];
  }
  buildTagBar();
  applyFilters();
}

loadMeals();
