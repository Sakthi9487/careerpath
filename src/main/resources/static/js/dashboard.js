
function authFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json"
    }
  });
}


authFetch("/api/dashboard/summary")
  .then(res => {
    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }
    return res.json();
  })
  .then(data => {
    if (!data) return;

    document.getElementById("heroUsername").innerText = data.username;
    document.getElementById("profileName").innerText = data.username;
    document.getElementById("profileAvatar").innerText =
      data.username.charAt(0).toUpperCase();

    document.getElementById("kpi-streak").innerText =
      data.learningStreak + " Days";
    document.getElementById("kpi-courses").innerText =
      data.coursesCompleted;
    document.getElementById("kpi-jobs").innerText =
      data.jobsApplied;
    document.getElementById("kpi-level").innerText =
      data.skillLevel;

    document.getElementById("overallSkillPercent").innerText =
      data.overallSkillProgress + "%";
  });


authFetch("/api/user/profile")
  .then(res => {
    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }
    return res.json();
  })
  .then(profile => {
    if (!profile) return;

    document.getElementById("fullName").value = profile.fullName || "";
    document.getElementById("email").value = profile.email || "";
    document.getElementById("phone").value = profile.phone || "";
    document.getElementById("dob").value = profile.dob || "";
    document.getElementById("gender").value = profile.gender || "";
    document.getElementById("location").value = profile.location || "";

    document.getElementById("saveBtn").disabled = false;
  });

authFetch("/api/dashboard/skills")
  .then(res => res.json())
  .then(skills => {
    const skillsContainer = document.getElementById("skills-container");
    skillsContainer.innerHTML = "";

    skills.forEach(skill => {
      skillsContainer.innerHTML += `
        <div class="skill">
          <span>${skill.skillName}</span>
          <div class="skill-bar">
            <div class="skill-progress" style="width:${skill.progress}%">
              ${skill.progress}%
            </div>
          </div>
        </div>
      `;
    });
  });


authFetch("/api/dashboard/activities")
  .then(res => res.json())
  .then(activities => {
    const activityList = document.getElementById("activity-list");
    activityList.innerHTML = "";

    activities.forEach(act => {
      activityList.innerHTML += `
        <li class="activity-item">
          <div class="activity-text">${act.description}</div>
          <div class="activity-time">
            ${new Date(act.createdAt).toLocaleString()}
          </div>
        </li>
      `;
    });
  });


authFetch("/api/dashboard/achievements")
  .then(res => res.json())
  .then(badges => {
    const box = document.getElementById("achievement-box");
    box.innerHTML = "";

    badges.forEach(b => {
      box.innerHTML += `
        <div class="badge">
          <img src="/assets/badges/${b.icon}" />
          <p>${b.title}</p>
        </div>
      `;
    });
  });


document.getElementById("profile-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const payload = {
    fullName: document.getElementById("fullName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    dob: document.getElementById("dob").value,
    gender: document.getElementById("gender").value,
    location: document.getElementById("location").value
  };

  authFetch("/api/user/profile", {
    method: "PUT",
    body: JSON.stringify(payload)
  })
  .then(res => {
    if (!res.ok) throw new Error();
    alert("Profile updated successfully");
    location.reload();
  })
  .catch(() => alert("Profile update failed"));
});


document.getElementById("passwordForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    document.getElementById("passwordError").innerText =
      "Passwords do not match";
    return;
  }

  authFetch("/api/user/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword })
  })
  .then(res => {
    if (!res.ok) throw new Error();
    alert("Password updated. Please login again.");
    window.location.href = "login.html";
  })
  .catch(() => {
    document.getElementById("passwordError").innerText =
      "Password change failed";
  });
});


document.getElementById("logout").addEventListener("click", () => {
  if (!confirm("Are you sure you want to logout?")) return;

  authFetch("/api/user/logout-all", { method: "POST" })
    .finally(() => window.location.href = "login.html");
});


function toggleProfileMenu(e) {
  e.stopPropagation();
  document.getElementById("profileMenu").classList.toggle("open");
}

document.addEventListener("click", () => {
  document.getElementById("profileMenu").classList.remove("open");
});

document.getElementById("personal-details").onclick = (e) => {
  e.preventDefault();
  document.querySelector(".personal").classList.add("show");
  document.getElementById("overlay").classList.add("show");
};

document.getElementById("account-settings").onclick = (e) => {
  e.preventDefault();
  document.querySelector(".account").classList.add("shows");
  document.getElementById("account-overlay").classList.add("shows");
};

document.getElementById("change-password").onclick = (e) => {
  e.preventDefault();
  document.getElementById("changePassword").classList.add("shows");
  document.getElementById("passwordOverlay").classList.add("shows");
};

document.getElementById("details-close").onclick = () => {
  document.querySelector(".personal").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
};

document.getElementById("accounts-close").onclick = () => {
  document.querySelector(".account").classList.remove("shows");
  document.getElementById("account-overlay").classList.remove("shows");
};

document.getElementById("passwordClose").onclick = () => {
  document.getElementById("changePassword").classList.remove("shows");
  document.getElementById("passwordOverlay").classList.remove("shows");
};
