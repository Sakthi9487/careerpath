const searchInput = document.getElementById("search");
const cards = document.querySelectorAll(".course-card");
const searchBtn = document.getElementById("search-btn");
const chat = document.getElementById("chatMsg");
const chatWidget = document.getElementById("chat-widget");
const chatClose = document.getElementById("chat-close");
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
const tutorial = document.getElementById("tutorials");

//  FILTER FUNCTION
function filterCourses(query) {
  cards.forEach((card) => {
    const keyword = card.dataset.keyword.toLowerCase();

    if (keyword.includes(query.toLowerCase())) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

//  SEARCH
function searchLogic() {
  const query = searchInput.value.toLowerCase().trim();
  if (query === "") {
    cards.forEach((card) => {
      card.style.display = "block";
    });
    return;
  }
  filterCourses(query);
}
//  EVENTS
searchInput.addEventListener("input", searchLogic);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchLogic();
  }
});
searchBtn.addEventListener("click", searchLogic);

// CHAT
chat.addEventListener("click", () => {
  chatWidget.classList.add("open");
});

chatClose.addEventListener("click", () => {
  chatWidget.classList.remove("open");
});

// HAMBURGER

hamburger.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
});

// HTML TUTORIALS

tutorial.addEventListener("change", function () {
  if (this.value === "html") {
    window.location.href = "./tutorial.html";
  }
});

function toggleProfileMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById("profileMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", () => {
  const menu = document.getElementById("profileMenu");
  if (menu) menu.style.display = "none";
});