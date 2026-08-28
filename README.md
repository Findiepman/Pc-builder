# PC part picker game
This is rewrite of my vibe coded pc part picker type game. It features 20 levels that get picked in a random order. You need to fit within the budget to pass the level. There are about 230 real parts with accurate prices and specs. Each part also has an image. You can sort parts by price from Ascending and Descending.

# File structure
```
Pc-builder/
├── .gitattributes
├── .gitignore
├── go.mod
├── levels.json
├── main.go
├── parts.json
├── README.md
└── static/
    ├── computer.png
    ├── index.html
    ├── index.js
    └── style.css
```

# How it works

## Backend (Go)
`main.go` spins up a plain `net/http` server, no framework. It registers three routes on one `ServeMux`:
- `GET /api/parts` reads `parts.json` off disk and writes it straight back as the response body.
- `GET /api/levels` does the exact same thing for `levels.json`.
- everything else (`/`) is handled by `http.FileServer`, which serves the `static/` folder, so `index.html`, `index.js`, `style.css` and `computer.png` all come from there.

There's no database yet, both JSON files are just read from disk on every request.

## Frontend (vanilla JS)
On load, `index.js` fetches both endpoints. Parts get grouped by category for the sidebar; levels get one picked at random (`pickLevel()` keeps track of which ones you've already had via `usedLevels`, so you don't get repeats until you've seen them all). Whatever level gets picked fills in the goal text, level number and budget in the top bar.

Clicking a category button re-renders the parts list for that category; clicking a part shows its full specs on the right and reveals the "Add to build" button. Adding a part writes it into a `configuration` object keyed by category, and highlights the matching slot in the case diagram in the middle, mother­board, CPU, cooler, RAM, GPU, storage cage, PSU, and the case outline itself. Storage is a bit special: NVMe drives light up one of the motherboard's M.2 slots instead of the drive cage, since that's where they'd physically go. Every filled slot gets a small "×" to remove it again.

The running total updates live as parts are added or removed, and turns amber when you're close to the level's budget or red when you're over it. "Check build" validates the current configuration against the budget and against which categories are still empty, and shows the result in a modal, missing parts get listed, and a passed build lets you advance straight to the next level from there. "Reset" clears the current build without touching the level. The sort button reorders the currently open category's parts list by price, ascending or descending.

