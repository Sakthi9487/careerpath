document.addEventListener("DOMContentLoaded", () => {
  let typingTimer = null;

  const searchInput = document.getElementById("search");
  const searchBtn = document.getElementById("search-btn");
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  const chatIcon = document.getElementById("chatMsg");
  const chatWidget = document.getElementById("chat-widget");
  const chatClose = document.getElementById("chat-close");

  const COURSE_CONTAINER = document.getElementById("course-card");
  const BASE_URL = "http://localhost:8080/api/public";


  chatIcon.addEventListener("click", () => {
    chatWidget.classList.add("open");
  });

  chatClose.addEventListener("click", () => {
    chatWidget.classList.remove("open");
  });

  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });

  

  function loadFeaturedCourses() {
    fetch(`${BASE_URL}/featured-courses`)
      .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then(data => {
        renderCourses(data);
      })
      .catch(() => {
        COURSE_CONTAINER.innerHTML = `
          <div style="
            color:#ff6b6b;
            text-align:center;
            padding:40px;
            font-size:18px;">
            Failed to load courses. Check backend API.
          </div>
        `;
      });
  }

  function searchCourses() {
    const keyword = searchInput.value.trim();

    document.getElementById("Courses").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    if (!keyword) {
      loadFeaturedCourses();
      return;
    }

    fetch(`${BASE_URL}/search?keyword=${keyword}`)
      .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then(data => renderCourses(data))
      .catch(err => {
        console.error("Search API failed:", err);
      });
  }

  function renderCourses(courses) {
    COURSE_CONTAINER.innerHTML = "";

    if (!courses || courses.length === 0) {
      COURSE_CONTAINER.innerHTML = `
        <div style="
          color:#9AA4B2;
          text-align:center;
          padding:40px;
          font-size:18px;">
          No courses match your search.
        </div>
      `;
      return;
    }

    courses.forEach(course => {
      const card = document.createElement("div");
      card.className = "course-card";

      const short = course.title.substring(0, 2).toUpperCase();

      card.innerHTML = `
        <div class="card-head">
          <h3>${short}</h3>
        </div>
        <h4>${course.title}</h4>
        <p>${course.description}</p>
        <p class="level">${course.level} <span>.</span> ${course.type}</p>
      `;

      COURSE_CONTAINER.appendChild(card);
    });
  }



  searchBtn.addEventListener("click", searchCourses);

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchCourses();
  });

  searchInput.addEventListener("input", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      if (searchInput.value.trim() === "") {
        loadFeaturedCourses();
      } else {
        searchCourses();
      }
    }, 400);
  });

  // INITIAL LOAD
  loadFeaturedCourses();
});
