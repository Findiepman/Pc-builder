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
let parts = null;
let activeCategory = null;
let selectedPart = null;
let configuration = {}; 
let levels = null;
let usedLevels = []
let currentBudget = null;

async function loadParts() {
    const response = await fetch('/api/parts') 
    if (!response.ok) {
        console.error('parts request failed', response.status)
        return;
    }
    const data = await response.json()
    parts = data
    activeCategory = Object.keys(parts)[0]
    renderParts(activeCategory)
    console.log(data)
}

async function loadLevels() {
    const reponse = await fetch('/api/levels')
    if (!reponse.ok) {
        console.error("Levels request failed", reponse.status)
        return;

    }
    const data = await reponse.json()
    levels = data.levels



    const index = pickLevel()
    const index1 = levels[index]
    currentBudget = Number(index1.Budget.replace('$', ''))
    goalText.textContent = index1.Goal
    budgetValue.textContent = index1.Budget
    levelValue.textContent = index1.Level

}

function pickLevel() {

    let chosenLevel = Math.floor(Math.random() * levels.length)
    while (usedLevels.includes(chosenLevel)) {
        chosenLevel = Math.floor(Math.random() * levels.length)
    }
    usedLevels.push(chosenLevel)
    return chosenLevel
}

function renderParts(category) {
    partsList.innerHTML = "";
    const displayList = parts[category]

    displayList.forEach(part => {
        const card = document.createElement("div");
        card.className = "part-card"
        card.innerHTML = `
            <div class="name">${part.name}</div>
            <div class="price">$${part.price}</div>
        `;
        card.addEventListener("click", () => {
            selectedPart = { category: category, part: part }
            showPartDetails(category, part)
        })
        partsList.appendChild(card)
    })

}
function selectCategory(category) {
    activeCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    renderParts(activeCategory)
}   

categoryButtons.addEventListener("click", (event) => {
    const button = event.target.closest(".category-btn");
    if (!button) return;
    selectCategory(button.dataset.category)
})
addPartBtn.addEventListener("click", () => {
    addToBuild()
})


function showPartDetails(category, part) {

    let html = `<div class="detail-row"><span class="k">Name</span><span class="v">${part.name}</span></div>`
    html += `<div class="detail-row"><span class="k">Price</span><span class="v">$${part.price}</span></div>`
    if (part.clock) html += `<div class="detail-row"><span class="k">Clock Speed</span><span class="v">${part.clock}</span></div>`
    if (part.cores) html += `<div class="detail-row"><span class="k">Cores</span><span class="v">${part.cores} Cores</span></div>`
    if (part.threads) html += `<div class="detail-row"><span class="k">Threads</span><span class="v">${part.threads} Threads</span></div>`
    if (part.socket) html += `<div class="detail-row"><span class="k">Socket</span><span class="v">${part.socket}</span></div>`
    if (part.form) html += `<div class="detail-row"><span class="k">Form</span><span class="v">${part.form}</span></div>`
    if (part.watt) html += `<div class="detail-row"><span class="k">Watt</span><span class="v">${part.watt}</span></div>`
    if (part.speed) html += `<div class="detail-row"><span class="k">Speed</span><span class="v">${part.speed}</span></div>`
    if (part.type) html += `<div class="detail-row"><span class="k">Type</span><span class="v">${part.type}</span></div>`
    if (part.memory) html += `<div class="detail-row"><span class="k">Vram</span><span class="v">${part.memory}</span></div>`
    if (part.read) html += `<div class="detail-row"><span class="k">Read Speed</span><span class="v">${part.read}</span></div>`
    if (part.write) html += `<div class="detail-row"><span class="k">Write Speed</span><span class="v">${part.write}</span></div>`
    if (part.rating) html += `<div class="detail-row"><span class="k">Rating</span><span class="v">${part.rating}</span></div>`
    if (part.rpm) html += `<div class="detail-row"><span class="k">RPM</span><span class="v">${part.rpm}</span></div>`


    if (part.img) {
        html += `<img src="${part.img}" alt="${part.name}" style="width:100%; margin-top:8px; border-radius:6px;">`
    }
    addPartBtn.style.display = "flex"
    partDetails.innerHTML = html;
}

function addToBuild() {
    if (!selectedPart) return;

    configuration[selectedPart.category] = selectedPart.part
    console.log(configuration)

    if (selectedPart.category !== "Case") {
        const target = buildSlots.querySelector(`.rig-part[data-category="${selectedPart.category}"]`)
        target.classList.add('filled')
        target.querySelector('.rig-label').textContent = selectedPart.part.name
    } else {
        buildSlots.classList.add('filled')
        caseTag.textContent = selectedPart.part.name
    }
    updateTotal()
}
buildSlots.addEventListener("click", (event) => {
    const button = event.target.closest(".remove")
    if (!button) return
    if (button.id === "caseRemoveBtn") {
        removeFromBuild("Case")
    } else {
        const part = button.closest(".rig-part")
        removeFromBuild(part.dataset.category)
    }
})


function removeFromBuild(category) {
    if (category !== "Case") {
        const target = buildSlots.querySelector(`.rig-part[data-category="${category}"]`)
        target.querySelector('.rig-label').textContent = category
        target.classList.remove('filled') 
        delete configuration[category]
    } else {
        buildSlots.classList.remove('filled')
        caseTag.textContent = "Case"
        delete configuration[category]
    }
    updateTotal()
}

// TODO: recalculate the total from `configuration`, update #totalValue,
// and toggle a class on #totalStat (e.g. "over" / "close") based on budget.
function updateTotal() {
    let price = 0
    Object.values(configuration).forEach(part => {
        price += part.price 
    })
    totalStat.classList.toggle('over', price > currentBudget)
    totalStat.classList.toggle('close', price >= currentBudget * 0.9 && price <= currentBudget)
    totalValue.textContent = `$${price}`

}

// TODO: sort button toggles #sortMenu open/closed; sortAsc/sortDesc re-sort
// the currently active category's parts and re-render.

// TODO: "check build" -> validate configuration against the budget and
// missing categories, same idea as the old checkConfiguration().

// TODO: reset / skip level -> same idea as the old game, adapted to whatever
// you decide levels look like here (still hardcoded client-side for now,
// GET /api/levels doesn't exist until phase 5).
loadLevels()
loadParts();