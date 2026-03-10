// ==========================================
// LANDING PAGE JS
// (navbar logic removed - handled by navbar.js)
// ==========================================

const cards = document.querySelectorAll(".course-card");
const reveals = document.querySelectorAll(".reveal");

// Chat
const chat = document.getElementById("chatMsg");
const chatWidget = document.getElementById("chat-widget");
const chatClose = document.getElementById("chat-close");

// ==========================================
// REVEAL ON SCROLL
// ==========================================
window.addEventListener("scroll", () => {
  reveals.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});

// ==========================================
// FILTER FUNCTION (for Featured Courses)
// ==========================================
function filterCourses(query) {
  cards.forEach((card) => {
    const keyword = card.dataset.keyword ? card.dataset.keyword.toLowerCase() : '';
    if (keyword.includes(query.toLowerCase())) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// ==========================================
// CHAT WIDGET
// ==========================================
if (chat) {
  chat.addEventListener("click", () => {
    chatWidget.classList.add("open");
  });
}

if (chatClose) {
  chatClose.addEventListener("click", () => {
    chatWidget.classList.remove("open");
  });
}

// ==========================================
// CODE EDITOR (frontend/backend toggle)
// ==========================================
const frontendCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; background: #f0f0f0; text-align: center; }
    h1 { color: #22c55e; }
  </style>
</head>
<body>
  <h1>Hello Frontend!</h1>
  <p>This is a sample HTML snippet.</p>
</body>
</html>`;

const backendCode = `// Backend Example (Node.js)
// Run this in a Node.js environment
const express = require('express');
const app = express();
app.get('/', (req,res)=> res.send('Hello Backend!'));
app.listen(3000);`;

function loadCode(type) {
  const editor = document.getElementById("code-editor");
  const output = document.getElementById("output-box");

  document
    .querySelectorAll(".editor-tabs button")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(`btn-${type}`).classList.add("active");

  if (type === "frontend") {
    editor.value = frontendCode;
    output.srcdoc = frontendCode;
  } else {
    editor.value = backendCode;
    output.srcdoc = `
      <style>
        body { font-family: Arial; background: #111; color: #0f0; padding: 1rem; }
        .console { background:#000; padding:1rem; border-radius:8px; }
      </style>
      <div class="console">
        <p>Server running on <strong>http://localhost:3000</strong></p>
        <p>GET / → Hello Backend!</p>
      </div>
    `;
  }
}

function runCode() {
  const code = document.getElementById("code-editor").value;
  const output = document.getElementById("output-box");

  if (code.includes("<html>")) {
    output.srcdoc = code;
  } else {
    output.srcdoc = `
      <style>
        body { font-family: Arial; background: #111; color: #0f0; padding: 1rem; }
        .console { background:#000; padding:1rem; border-radius:8px; }
      </style>
      <div class="console">
        <p>Server running on <strong>http://localhost:3000</strong></p>
        <p>GET / → Hello Backend!</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btnFrontend = document.getElementById("btn-frontend");
  const btnBackend = document.getElementById("btn-backend");

  if (btnFrontend) btnFrontend.addEventListener("click", () => loadCode("frontend"));
  if (btnBackend) btnBackend.addEventListener("click", () => loadCode("backend"));

  loadCode("frontend");

  // ==========================================
  // TUTORIALS SHOWCASE - Dynamic Card Grid
  // ==========================================
  loadTutorialShowcase();
});

// ==========================================
// TUTORIALS SHOWCASE
// ==========================================
async function loadTutorialShowcase() {
  const grid = document.getElementById("tutorials-grid");
  const filterContainer = document.getElementById("tutorials-filter");
  if (!grid || !filterContainer) return;

  try {
    const resp = await fetch("./assets/data/tutorials-config.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const config = await resp.json();
    const tutorials = config.tutorials;

    // Build filter tabs
    const categories = [...new Set(tutorials.map(t => t.category))];
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "filter-tab";
      btn.dataset.filter = cat;
      btn.textContent = cat;
      filterContainer.appendChild(btn);
    });

    // Build cards
    renderTutorialCards(tutorials, grid);

    // Filter logic
    filterContainer.addEventListener("click", (e) => {
      if (!e.target.classList.contains("filter-tab")) return;

      filterContainer.querySelectorAll(".filter-tab").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      const filter = e.target.dataset.filter;
      const filtered = filter === "all" ? tutorials : tutorials.filter(t => t.category === filter);
      renderTutorialCards(filtered, grid);
    });

  } catch (err) {
    console.warn("Could not load tutorials showcase:", err);
  }
}

function renderTutorialCards(tutorials, container) {
  container.innerHTML = tutorials.map(t => {
    const href = `./pages/tutorial.html?course=${t.file}`;
    return `
      <a href="${href}" class="tutorial-card-item">
        <div class="tutorial-card-icon">${t.icon}</div>
        <div class="tutorial-card-body">
          <h3>${t.name}</h3>
          <p>${t.desc}</p>
          <span class="tutorial-card-badge">${t.category}</span>
        </div>
        <div class="tutorial-card-arrow">→</div>
      </a>`;
  }).join('');
}
