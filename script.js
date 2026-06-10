/**
 * KhanaKya? - Advanced Architecture Script File
 * Core Features: Real-time State Parsing, Dynamic Category Aggregation, Roulette Engine
 */

let mealsData = [];
let appState = {
  type: 'all',          // veg, nonveg, all
  who: ['me', 'roommate'],
  maxEffort: 3,
  hunger: ['snack', 'light', 'meal', 'outside'],
  selectedTags: [],
  searchQuery: '',
  sortCriteria: 'score'
};

// Labels map config
const effortLabels = {
  1: '😴 Instant (1/5)',
  2: '🚶 Easy (2/5)',
  3: '🧑‍🍳 Medium (3/5)',
  4: '💪 High Effort (4/5)',
  5: '🔥 Advanced Cook (5/5)'
};

const audienceLabels = {
  'me': '🙋 Me',
  'roommate': '🤝 Roommate',
  'both': '👫 Both'
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  setupEventBindings();
  loadStateFromURL();
  fetchAndRenderMeals();
});

// Sync Interface with state object
function syncUIFromState() {
  // 1. Dietary Preference Pills
  document.querySelectorAll('.diet-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === appState.type);
  });

  // 2. Audience checks
  document.getElementById('chk-me').checked = appState.who.includes('me');
  document.getElementById('chk-roommate').checked = appState.who.includes('roommate');

  // 3. Slider Setup
  const slider = document.getElementById('effortSlider');
  slider.value = appState.maxEffort;
  document.getElementById('effortValue').textContent = effortLabels[appState.maxEffort];

  // 4. Hunger selection grids
  document.querySelectorAll('.hunger-btn').forEach(btn => {
    btn.classList.toggle('active', appState.hunger.includes(btn.dataset.hunger));
  });

  // 5. Query Inputs
  document.getElementById('searchInput').value = appState.searchQuery;
  document.getElementById('sortSelect').value = appState.sortCriteria;
}

// Deep State Synchronization via window url parameter encoding
function updateURLParameters() {
  const serializedState = btoa(encodeURIComponent(JSON.stringify(appState)));
  window.location.hash = `menu-state=${serializedState}`;
}

function loadStateFromURL() {
  try {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#menu-state=')) {
      const base64Str = hash.replace('#menu-state=', '');
      const parsedState = JSON.parse(decodeURIComponent(atob(base64Str)));
      appState = { ...appState, ...parsedState };
      syncUIFromState();
    }
  } catch (err) {
    console.warn("Could not parse shared link state parameter configuration:", err);
  }
}

// Algorithmic Scoring Engine Matrix Formula Calculation
function computeRecommendationScore(meal) {
  let finalScore = 0;

  // Criterion A: Cooking Effort Constraint Affinity (Max 40 Pts)
  if (meal.effort <= appState.maxEffort) {
    finalScore += 40; 
  } else {
    // Penalty calculation for crossing target cooking threshold
    finalScore += Math.max(0, 40 - (meal.effort - appState.maxEffort) * 15);
  }

  // Criterion B: Multi-User Dietary Compatibility Matrix (Max 30 Pts)
  if (meal.who === 'both') {
    finalScore += 30;
  } else if (appState.who.includes(meal.who)) {
    finalScore += 25;
  } else {
    finalScore += 5; // Low score if it target someone who isn't eating
  }

  // Criterion C: Current Hunger Alignment Index (Max 20 Pts)
  if (appState.hunger.includes(meal.hunger)) {
    finalScore += 20;
  }

  // Criterion D: Metadata Platform Base Popularity Ratio (Max 10 Pts)
  finalScore += Math.min(10, meal.popularity || 5);

  return Math.round(finalScore);
}

// Master Validation Filtering Logic 
function evaluateVisibility(meal) {
  // Diet Filter Check
  if (appState.type !== 'all' && meal.type !== appState.type) return false;

  // Participant Filter Check
  if (appState.who.length > 0) {
    if (meal.who !== 'both' && !appState.who.includes(meal.who)) return false;
  }

  // Hunger Filter Check
  if (!appState.hunger.includes(meal.hunger)) return false;

  // Selected Tags Cloud Filter Check
  if (appState.selectedTags.length > 0) {
    const matchingTag = appState.selectedTags.some(tag => meal.tags.includes(tag));
    if (!matchingTag) return false;
  }

  // Fuzzy Search Processing
  if (appState.searchQuery) {
    const normalizedQuery = appState.searchQuery.toLowerCase();
    const matchName = meal.name.toLowerCase().includes(normalizedQuery);
    const matchDesc = meal.description.toLowerCase().includes(normalizedQuery);
    const matchIngredients = meal.ingredients.some(i => i.toLowerCase().includes(normalizedQuery));
    
    if (!matchName && !matchDesc && !matchIngredients) return false;
  }

  return true;
}

// Async Data Acquisition Pipeline
async function fetchAndRenderMeals() {
  const container = document.getElementById('mealsGrid');
  try {
    if (mealsData.length === 0) {
      const response = await fetch('meals.json');
      mealsData = await response.json();
      aggregateDynamicTags(mealsData);
    }

    // Processing filters and calculations
    let eligibleMeals = mealsData.filter(evaluateVisibility);

    // Apply Sorting logic routines
    eligibleMeals.sort((alpha, beta) => {
      if (appState.sortCriteria === 'score') return computeRecommendationScore(beta) - computeRecommendationScore(alpha);
      if (appState.sortCriteria === 'effort') return alpha.effort - beta.effort;
      if (appState.sortCriteria === 'time') return alpha.time - beta.time;
      if (appState.sortCriteria === 'cost') return alpha.cost - beta.cost;
      if (appState.sortCriteria === 'popularity') return (beta.popularity || 0) - (alpha.popularity || 0);
      return 0;
    });

    // Clean loaders and build UI layout view
    container.classList.remove('skeleton-loading');
    container.innerHTML = '';

    if (eligibleMeals.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-muted);">
          <p style="font-size: 48px;">🍽️</p>
          <h3 style="margin-top: 16px;">No Meals Found matching filters</h3>
          <p style="font-size: 13px;">Try adjusting sliders or selecting additional options.</p>
        </div>`;
      document.getElementById('resultsCount').textContent = "0 Options found";
      return;
    }

    document.getElementById('resultsCount').textContent = `${eligibleMeals.length} Options Available`;

    eligibleMeals.forEach((meal, rank) => {
      const card = document.createElement('div');
      const scoreMetric = computeRecommendationScore(meal);
      const isTopMatch = appState.sortCriteria === 'score' && rank === 0;

      card.className = `meal-card ${isTopMatch ? 'top-match' : ''}`;
      card.innerHTML = `
        <div class="card-header-row">
          <span class="card-emoji">${meal.emoji}</span>
          <span class="score-badge">${scoreMetric}% Match</span>
        </div>
        <div>
          <h3 class="meal-title">
            <span class="diet-indicator ${meal.type}"></span>
            ${meal.name}
          </h3>
          <p class="meal-desc">${meal.description}</p>
        </div>
        <div class="meal-meta-row">
          <span class="meta-tag">⚡ Effort: ${meal.effort}/5</span>
          <span class="meta-tag">⏱️ ${meal.time}m</span>
          <span class="meta-tag">💰 ₹${meal.cost}</span>
          <span class="meta-tag">${audienceLabels[meal.who] || meal.who}</span>
        </div>
      `;
      card.addEventListener('click', () => openMealDetails(meal));
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Data ingestion pipeline fault:", error);
    container.innerHTML = `<div style="grid-column:1/-1; color:var(--red);">Error parsing meals database configuration resource.</div>`;
  }
}

// Dynamic Tag Aggregator Pipeline Routine 
function aggregateDynamicTags(data) {
  const dynamicTagMap = new Set();
  data.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(t => dynamicTagMap.add(t));
    }
  });

  const tagContainer = document.getElementById('dynamicTags');
  tagContainer.innerHTML = '';

  Array.from(dynamicTagMap).sort().forEach(tag => {
    const chip = document.createElement('span');
    chip.className = `tag-chip ${appState.selectedTags.includes(tag) ? 'selected' : ''}`;
    chip.textContent = `#${tag}`;
    chip.addEventListener('click', () => {
      if (appState.selectedTags.includes(tag)) {
        appState.selectedTags = appState.selectedTags.filter(item => item !== tag);
      } else {
        appState.selectedTags.push(tag);
      }
      chip.classList.toggle('selected');
      updateURLParameters();
      fetchAndRenderMeals();
    });
    tagContainer.appendChild(chip);
  });
}

// Interactive Cinematic Casino Roulette Decide Engine Routine
function executeRouletteDecide() {
  const eligibleChoices = mealsData.filter(evaluateVisibility);
  if (eligibleChoices.length === 0) {
    showToast("No options available under current filters!");
    return;
  }

  const overlay = document.getElementById('rouletteModal');
  const strip = document.getElementById('rouletteStrip');
  overlay.classList.add('open');
  strip.innerHTML = '';

  // Generate continuous layout items array list loop options
  const animationPool = [];
  for (let cycle = 0; cycle < 6; cycle++) {
    eligibleChoices.forEach(dish => animationPool.push(dish));
  }

  // Shuffle pick selection index target final index choice target position
  const chosenIndex = Math.floor(Math.random() * eligibleChoices.length) + (eligibleChoices.length * 4);
  const targetWinner = animationPool[chosenIndex];

  // Render nodes list inside timeline track strip
  animationPool.forEach(dish => {
    const node = document.createElement('div');
    node.className = 'roulette-item';
    node.innerHTML = `<span>${dish.emoji}</span><small>${dish.name}</small>`;
    strip.appendChild(node);
  });

  // Calculate pixel displacement position target calculation offset values
  const stepHeight = 120; 
  strip.style.transition = 'none';
  strip.style.transform = 'translateY(0)';

  // Enforce engine rendering recalculation step cycle
  setTimeout(() => {
    strip.style.transition = 'transform 3.5s cubic-bezier(0.1, 1, 0.1, 1)';
    const travelDistance = chosenIndex * stepHeight;
    strip.style.transform = `translateY(-${travelDistance}px)`;
  }, 50);

  // Spotlight display execution routine step termination event callback
  setTimeout(() => {
    overlay.classList.remove('open');
    openMealDetails(targetWinner);
  }, 3900);
}

// Modal management routines
function openMealDetails(meal) {
  document.getElementById('mEmoji').textContent = meal.emoji;
  document.getElementById('mName').textContent = meal.name;
  document.getElementById('mDescription').textContent = meal.description;
  document.getElementById('mEffort').textContent = `${meal.effort}/5`;
  document.getElementById('mTime').textContent = `${meal.time} mins`;
  document.getElementById('mCost').textContent = `₹${meal.cost}`;
  document.getElementById('mWho').textContent = audienceLabels[meal.who] || meal.who;

  const dot = document.getElementById('mTypeBadge');
  dot.className = `veg-dot ${meal.type}`;

  // Ingredients rendering
  const ingContainer = document.getElementById('mIngredients');
  ingContainer.innerHTML = meal.ingredients.map(i => `<span class="ingredient-chip">${i}</span>`).join('');

  // Tags rendering
  const tagsContainer = document.getElementById('mTags');
  tagsContainer.innerHTML = meal.tags.map(t => `<span class="tag-chip">#${t}</span>`).join('');

  document.getElementById('mealModal').classList.add('open');
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
}

function showToast(msg) {
  const element = document.getElementById('toast');
  element.textContent = msg;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2500);
}

// Event Bindings and Interactive Subsystems Hooks
function setupEventBindings() {
  // 1. Diet Selection Switches
  document.querySelectorAll('.diet-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      appState.type = e.target.dataset.type;
      document.querySelectorAll('.diet-pill').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      updateURLParameters();
      fetchAndRenderMeals();
    });
  });

  // 2. Audience checks changes hooks
  const updateAudienceState = () => {
    const list = [];
    if (document.getElementById('chk-me').checked) list.push('me');
    if (document.getElementById('chk-roommate').checked) list.push('roommate');
    appState.who = list;
    updateURLParameters();
    fetchAndRenderMeals();
  };
  document.getElementById('chk-me').addEventListener('change', updateAudienceState);
  document.getElementById('chk-roommate').addEventListener('change', updateAudienceState);

  // 3. Slider Hooks
  const rangeInput = document.getElementById('effortSlider');
  rangeInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    appState.maxEffort = val;
    document.getElementById('effortValue').textContent = effortLabels[val];
    updateURLParameters();
    fetchAndRenderMeals();
  });

  // 4. Hunger Level Buttons
  document.querySelectorAll('.hunger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetCard = e.currentTarget;
      const type = targetCard.dataset.hunger;
      if (appState.hunger.includes(type)) {
        appState.hunger = appState.hunger.filter(item => item !== type);
      } else {
        appState.hunger.push(type);
      }
      targetCard.classList.toggle('active');
      updateURLParameters();
      fetchAndRenderMeals();
    });
  });

  // 5. Query Search processing field hooks
  let searchDebounceTimer;
  document.getElementById('searchInput').addEventListener('input', (e) => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      appState.searchQuery = e.target.value;
      updateURLParameters();
      fetchAndRenderMeals();
    }, 250);
  });

  // 6. Selection sort change events hook
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    appState.sortCriteria = e.target.value;
    updateURLParameters();
    fetchAndRenderMeals();
  });

  // 7. Decide button hook
  document.getElementById('decideBtn').addEventListener('click', executeRouletteDecide);

  // 8. Reset Button action
  document.getElementById('resetFilters').addEventListener('click', () => {
    appState = {
      type: 'all', who: ['me', 'roommate'], maxEffort: 3,
      hunger: ['snack', 'light', 'meal', 'outside'], selectedTags: [], searchQuery: '', sortCriteria: 'score'
    };
    syncUIFromState();
    if (mealsData.length > 0) aggregateDynamicTags(mealsData);
    updateURLParameters();
    fetchAndRenderMeals();
  });

  // 9. Mobile Sidebar Drawer Toggles Hooks
  const toggleSidebar = () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
  };
  document.getElementById('mobileFilterToggle').addEventListener('click', toggleSidebar);
  document.getElementById('sidebarOverlay').addEventListener('click', toggleSidebar);

  // 10. Global Link Share Engine Clipboard Routine hook
  document.getElementById('shareBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => showToast("🔗 Shareable layout parameters copied to clipboard!"))
      .catch(() => showToast("Failed to copy link automatically."));
  });

  // 11. Theme Switcher Routine Node click hook
  const themeToggle = document.getElementById('themeBtn');
  themeToggle.addEventListener('click', () => {
    const docRoot = document.documentElement;
    const currentTheme = docRoot.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    docRoot.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
  });

  // 12. Modal backdrop close handler click
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) closeAllModals();
    });
  });
}
