// PC Builder — frontend logic
// This file is intentionally empty of real logic. It's just the wiring:
// the DOM references you'll need, and a TODO per piece of behavior,
// in roughly the order you'll want to build them. Write the actual
// bodies yourself.

// ── DOM references, one per element the HTML already has ──
const categoryButtons = document.getElementById('categoryButtons');
const partsList = document.getElementById('partsList');
const buildSlots = document.getElementById('buildSlots');
const partDetails = document.getElementById('partDetails');
const addPartBtn = document.getElementById('addPartBtn');

const goalText = document.getElementById('goalText');
const levelValue = document.getElementById('levelValue');
const budgetValue = document.getElementById('budgetValue');
const totalValue = document.getElementById('totalValue');
const totalStat = document.getElementById('totalStat');

const sortBtn = document.getElementById('sortBtn');
const sortMenu = document.getElementById('sortMenu');
const sortAsc = document.getElementById('sortAsc');
const sortDesc = document.getElementById('sortDesc');

const checkBuildBtn = document.getElementById('checkBuildBtn');
const resetBtn = document.getElementById('resetBtn');
const skipLevelBtn = document.getElementById('skipLevelBtn');

// ── state you'll need to track somewhere ──
let parts = null;        // filled in once GET /api/parts resolves
let activeCategory = null;
let selectedPart = null; // { category, part } currently shown in the details panel
let configuration = {};  // { CPU: {...}, GPU: {...}, ... } — the actual build

// TODO: on page load, fetch('/api/parts'), parse the JSON, store it in `parts`,
// then render the first category's list. This is the one real GET this phase needs.
async function loadParts() {}

// TODO: given a category name, render its parts into #partsList as clickable cards.
// Look at how the old game's renderCategoryParts() did this if you want a reference
// for what data each part object carries (name, price, and category-specific specs).
function renderParts(category) {}

// TODO: category button click -> set activeCategory, toggle .active class,
// call renderParts() for the new category.
function selectCategory(category) {}

// TODO: part card click -> set selectedPart, fill in #partDetails, show #addPartBtn.
function showPartDetails(category, part) {}

// TODO: "add to build" click -> put selectedPart into configuration[category],
// then re-render the matching .rig-part inside #buildSlots (add .filled, set its
// --cat custom property if you want per-category coloring beyond CSS defaults,
// update .rig-label text, and wire up its remove button). If category is "Case",
// also toggle .filled on #buildSlots itself and update #caseTag's text.
function addToBuild() {}

// TODO: remove button on a filled slot -> delete configuration[category],
// re-render that slot back to empty.
function removeFromBuild(category) {}

// TODO: recalculate the total from `configuration`, update #totalValue,
// and toggle a class on #totalStat (e.g. "over" / "close") based on budget.
function updateTotal() {}

// TODO: sort button toggles #sortMenu open/closed; sortAsc/sortDesc re-sort
// the currently active category's parts and re-render.

// TODO: "check build" -> validate configuration against the budget and
// missing categories, same idea as the old checkConfiguration().

// TODO: reset / skip level -> same idea as the old game, adapted to whatever
// you decide levels look like here (still hardcoded client-side for now,
// GET /api/levels doesn't exist until phase 5).

loadParts();