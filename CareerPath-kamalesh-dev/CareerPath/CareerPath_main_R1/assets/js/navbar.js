/**
 * Shared Navbar Component
 * Dynamically injects header, mobile nav, course nav bar,
 * tutorials popup, and references popup into any page.
 * Supports pages at: root, /pages/, /pages/references/, /pages/roadmaps/, etc.
 */
(function () {
    'use strict';

    // ==========================================
    // PATH DETECTION — supports multiple depths
    // ==========================================
    const pathname = window.location.pathname.replace(/\\/g, '/');

    // Calculate depth: how many /subfolders/ are between project root and this page
    // Root (index.html)             → ROOT = './', PAGES = './pages/', REFS = './pages/references/'
    // pages/ (tutorial.html)        → ROOT = '../', PAGES = './',      REFS = './references/'
    // pages/references/ (html*.html)→ ROOT = '../../', PAGES = '../',  REFS = './'
    // pages/roadmaps/               → ROOT = '../../', PAGES = '../',  REFS = '../references/'

    let ROOT, PAGES, REFS, AUTH;

    if (pathname.includes('/pages/auth/')) {
        ROOT = '../../';
        PAGES = '../';
        REFS = '../references/';
        AUTH = './';
    } else if (pathname.includes('/pages/references/')) {
        ROOT = '../../';
        PAGES = '../';
        REFS = './';
        AUTH = '../auth/';
    } else if (pathname.includes('/pages/roadmaps/')) {
        ROOT = '../../';
        PAGES = '../';
        REFS = '../references/';
        AUTH = '../auth/';
    } else if (pathname.includes('/pages/')) {
        ROOT = '../';
        PAGES = './';
        REFS = './references/';
        AUTH = './auth/';
    } else {
        ROOT = './';
        PAGES = './pages/';
        REFS = './pages/references/';
        AUTH = './pages/auth/';
    }

    // ==========================================
    // REFERENCES DATA
    // ==========================================
    const REFERENCE_DATA = [
        {
            category: 'Front-end',
            icon: '🖥️',
            items: [
                { name: 'HTML', file: 'htmlreference.html', icon: '🌐', desc: 'Complete HTML tag reference with examples' },
                { name: 'CSS', file: 'cssreference.html', icon: '🎨', desc: 'CSS properties, selectors, and values' },
                { name: 'JavaScript', file: 'jsreference.html', icon: '⚡', desc: 'JS methods, objects, and built-in functions' },
                { name: 'Icons', file: 'iconrefer.html', icon: '🎯', desc: 'Icon library codes and usage guide' },
                { name: 'UTF-8', file: 'utf-8refer.html', icon: '🔤', desc: 'Character encoding reference table' },
                { name: 'Color Names', file: 'colors.html', icon: '🎨', desc: 'Named colors and hex values' }
            ]
        },
        {
            category: 'Back-end',
            icon: '⚙️',
            items: [
                { name: 'Python', file: 'pythonrefer.html', icon: '🐍', desc: 'Python syntax, methods, and modules' },
                { name: 'Java', file: null, icon: '☕', desc: 'Coming soon' },
                { name: 'C', file: null, icon: '💻', desc: 'Coming soon' },
                { name: 'C++', file: null, icon: '⚙️', desc: 'Coming soon' }
            ]
        }
    ];

    // ==========================================
    // BUILD HTML
    // ==========================================
    // Encode current page URL for redirect after login
    const CURRENT_URL = encodeURIComponent(window.location.href);

    function buildNavbarHTML() {
        return `
        <!-- NAVBAR HEADER -->
        <header class="navbar-header" id="navbarHeader">
            <div class="header-container">
                <!-- Hamburger -->
                <div class="navbar-hamburger" id="navbarHamburger">☰</div>

                <!-- Logo + Tutorials + References -->
                <div class="navbar-logo">
                    <a href="${ROOT}index.html" class="navbar-logo-link">
                        <div class="navbar-logo-icon">CP</div>
                        <h3>CareerPath</h3>
                    </a>
                    <a href="#" class="navbar-tutor-btn navbar-desk-only" id="navbarTutorBtn">Tutorials</a>
                    <a href="#" class="navbar-refer-btn navbar-desk-only" id="navbarReferBtn">References</a>
                </div>

                <!-- Search -->
                <div class="navbar-search">
                    <input type="text" placeholder="Search skills, courses, roles..." id="navbarSearchInput">
                    <button class="navbar-search-icon" id="navbarSearchBtn">🔍</button>
                </div>

                <!-- Desktop Nav -->
                <ul class="navbar-nav-items">
                    <li><a href="#">Jobs</a></li>
                    <li><a href="#">Resume Builder</a></li>
                    <li><a href="${PAGES}bootcamp.html">Boot Camp</a></li>
                    <li id="navbarAuthLi">
                        <button class="navbar-auth-btn" id="navbarAuthBtn">
                            <a href="${AUTH}login.html?redirect=${CURRENT_URL}">Login /</a>
                            <a href="${AUTH}register.html">SignUp</a>
                        </button>
                    </li>
                </ul>

                <!-- Profile (shown when logged in) -->
                <div class="navbar-profile" id="navbarProfile" style="display:none;">
                    <div class="navbar-avatar" id="navbarAvatar">U</div>
                    <span id="navbarUsername">User</span>
                </div>
            </div>
        </header>

        <!-- MOBILE NAV -->
        <div class="navbar-mobile-nav" id="navbarMobileNav">
            <a href="#" class="navbar-tutor-btn" id="navbarMobileTutorBtn">Tutorials</a>
            <a href="#" class="navbar-refer-btn" id="navbarMobileReferBtn">References</a>
            <a href="#">Jobs</a>
            <a href="#">Resume Builder</a>
            <a href="${PAGES}bootcamp.html">Boot Camp</a>
            <a href="${AUTH}login.html?redirect=${CURRENT_URL}" id="navbarMobileLogin">Login</a>
            <a href="${AUTH}register.html" id="navbarMobileSignup">Sign Up</a>
        </div>

        <!-- COURSE NAV STRIP -->
        <nav class="navbar-course-strip" id="navbarCourseStrip">
            <div class="strip-inner" id="navbarStripInner">
                <!-- Populated dynamically -->
            </div>
        </nav>

        <!-- PROFILE MENU (auth-aware dropdown) -->
        <div class="navbar-profile-menu" id="navbarProfileMenu">
            <!-- Guest links -->
            <a href="${AUTH}register.html" id="navbarSignup" class="navbar-guest-link">Sign Up</a>
            <a href="${AUTH}login.html?redirect=${CURRENT_URL}" id="navbarLogin" class="navbar-guest-link">Login</a>
            <!-- Logged-in links (hidden by default) -->
            <a href="${AUTH}dashboard.html" id="navbarDashboard" class="navbar-user-link" style="display:none;">📊 Dashboard</a>
            <a href="#" id="navbarProfileLink" class="navbar-user-link" style="display:none;">👤 My Profile</a>
            <a href="#" id="navbarSettingsLink" class="navbar-user-link" style="display:none;">⚙️ Settings</a>
            <hr id="navbarMenuDivider" style="display:none;">
            <a href="#" id="navbarLogout" class="navbar-user-link" style="display:none;">🚪 Logout</a>
        </div>

        <!-- TUTORIALS POPUP -->
        <div class="navbar-tutor-popup" id="navbarTutorPopup">
            <div class="navbar-tutor-popup-inner">
                <button class="navbar-tutor-close" id="navbarTutorClose">✕</button>
                <h2 class="navbar-tutor-title">Tutorials</h2>
                <div id="navbarTutorContent">
                    <!-- Populated dynamically -->
                </div>
            </div>
        </div>

        <!-- REFERENCES POPUP -->
        <div class="navbar-refer-popup" id="navbarReferPopup">
            <div class="navbar-refer-popup-inner">
                <button class="navbar-refer-close" id="navbarReferClose">✕</button>
                <h2 class="navbar-refer-title">📖 References</h2>
                <p class="navbar-refer-subtitle">Quick-access documentation and cheat sheets</p>
                <div id="navbarReferContent">
                    <!-- Populated dynamically -->
                </div>
            </div>
        </div>

        <!-- Spacer -->
        <div class="navbar-spacer"></div>
        `;
    }

    // ==========================================
    // INJECT INTO PAGE
    // ==========================================
    function injectNavbar() {
        const root = document.getElementById('navbar-root');
        if (!root) {
            document.body.insertAdjacentHTML('afterbegin', buildNavbarHTML());
        } else {
            root.innerHTML = buildNavbarHTML();
        }
    }

    // ==========================================
    // FETCH TUTORIALS CONFIG & POPULATE
    // ==========================================
    async function loadTutorialsConfig() {
        try {
            const resp = await fetch(`${ROOT}assets/data/tutorials-config.json`);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const config = await resp.json();
            populateCourseStrip(config.tutorials);
            populateTutorPopup(config.tutorials);
        } catch (err) {
            console.warn('Navbar: Could not load tutorials config:', err);
        }
    }

    function populateCourseStrip(tutorials) {
        const strip = document.getElementById('navbarStripInner');
        if (!strip) return;

        strip.innerHTML = tutorials.map(t => {
            const href = `${PAGES}tutorial.html?course=${t.file}`;
            return `<a href="${href}">${t.name.toUpperCase()}</a>`;
        }).join('');
    }

    function populateTutorPopup(tutorials) {
        const container = document.getElementById('navbarTutorContent');
        if (!container) return;

        const groups = {};
        tutorials.forEach(t => {
            if (!groups[t.category]) groups[t.category] = [];
            groups[t.category].push(t);
        });

        let html = '';
        const categoryOrder = ['Frontend', 'Backend', 'Framework', 'Database', 'Data Science', 'Tools', 'Computer Science'];

        categoryOrder.forEach(cat => {
            if (!groups[cat]) return;
            html += `<div class="navbar-tutor-category">${cat}</div>`;
            html += `<div class="navbar-tutor-grid">`;
            groups[cat].forEach(t => {
                const href = `${PAGES}tutorial.html?course=${t.file}`;
                html += `
                    <a href="${href}" class="navbar-tutor-item">
                        <span class="navbar-tutor-item-icon">${t.icon}</span>
                        ${t.name}
                    </a>`;
            });
            html += `</div>`;
        });

        container.innerHTML = html;
    }

    // ==========================================
    // POPULATE REFERENCES POPUP
    // ==========================================
    function populateReferencesPopup() {
        const container = document.getElementById('navbarReferContent');
        if (!container) return;

        let html = '';

        REFERENCE_DATA.forEach(group => {
            html += `
            <div class="navbar-ref-section">
                <div class="navbar-ref-section-header">
                    <span class="navbar-ref-section-icon">${group.icon}</span>
                    <h3>${group.category}</h3>
                </div>
                <div class="navbar-ref-list">`;

            group.items.forEach(item => {
                const href = item.file ? `${REFS}${item.file}` : '#';
                const comingSoon = !item.file;
                html += `
                    <a href="${href}" class="navbar-ref-card${comingSoon ? ' coming-soon' : ''}">
                        <div class="navbar-ref-card-icon">${item.icon}</div>
                        <div class="navbar-ref-card-info">
                            <h4>${item.name}</h4>
                            <p>${item.desc}</p>
                        </div>
                        <div class="navbar-ref-card-arrow">${comingSoon ? '🔒' : '→'}</div>
                    </a>`;
            });

            html += `
                </div>
            </div>`;
        });

        container.innerHTML = html;
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    function attachEvents() {
        // Hamburger
        const hamburger = document.getElementById('navbarHamburger');
        const mobileNav = document.getElementById('navbarMobileNav');
        if (hamburger && mobileNav) {
            hamburger.addEventListener('click', () => {
                mobileNav.classList.toggle('open');
                hamburger.classList.toggle('active');
            });
        }

        // Profile
        const profile = document.getElementById('navbarProfile');
        const profileMenu = document.getElementById('navbarProfileMenu');
        if (profile && profileMenu) {
            profile.addEventListener('click', (e) => {
                e.stopPropagation();
                profileMenu.classList.toggle('open');
            });
            document.addEventListener('click', () => {
                profileMenu.classList.remove('open');
            });
        }

        // Tutorials popup
        const tutorPopup = document.getElementById('navbarTutorPopup');
        const tutorClose = document.getElementById('navbarTutorClose');

        document.querySelectorAll('#navbarTutorBtn, #navbarMobileTutorBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (tutorPopup) tutorPopup.classList.add('open');
                if (mobileNav) mobileNav.classList.remove('open');
                if (hamburger) hamburger.classList.remove('active');
            });
        });

        if (tutorClose && tutorPopup) {
            tutorClose.addEventListener('click', () => tutorPopup.classList.remove('open'));
            tutorPopup.addEventListener('click', (e) => {
                if (e.target === tutorPopup) tutorPopup.classList.remove('open');
            });
        }

        // References popup
        const referPopup = document.getElementById('navbarReferPopup');
        const referClose = document.getElementById('navbarReferClose');

        document.querySelectorAll('#navbarReferBtn, #navbarMobileReferBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (referPopup) referPopup.classList.add('open');
                if (mobileNav) mobileNav.classList.remove('open');
                if (hamburger) hamburger.classList.remove('active');
            });
        });

        if (referClose && referPopup) {
            referClose.addEventListener('click', () => referPopup.classList.remove('open'));
            referPopup.addEventListener('click', (e) => {
                if (e.target === referPopup) referPopup.classList.remove('open');
            });
        }
    }

    // ==========================================
    // AUTH STATE — check if user is logged in
    // ==========================================
    function checkAuthState() {
        const API_BASE = 'http://localhost:8080';
        const token = localStorage.getItem('AUTH_TOKEN');

        // No token in localStorage → user is guest
        if (!token) return;

        // Token exists → fetch profile to get username
        fetch(API_BASE + '/api/v1/user/profile', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.ok) return res.json();
                // Token expired or invalid — clear it
                localStorage.removeItem('AUTH_TOKEN');
                throw new Error('Token invalid');
            })
            .then(profile => {
                // User IS logged in — show profile, hide auth buttons
                const name = profile.fullName || profile.username || 'User';
                const initial = name.charAt(0).toUpperCase();

                const authLi = document.getElementById('navbarAuthLi');
                const profileEl = document.getElementById('navbarProfile');
                const avatarEl = document.getElementById('navbarAvatar');
                const usernameEl = document.getElementById('navbarUsername');

                if (authLi) authLi.style.display = 'none';
                if (profileEl) profileEl.style.display = 'flex';
                if (avatarEl) avatarEl.textContent = initial;
                if (usernameEl) usernameEl.textContent = name;

                // Show logged-in menu items, hide guest items
                document.querySelectorAll('.navbar-guest-link').forEach(el => el.style.display = 'none');
                document.querySelectorAll('.navbar-user-link').forEach(el => el.style.display = 'block');
                const divider = document.getElementById('navbarMenuDivider');
                if (divider) divider.style.display = 'block';

                // Hide mobile login/signup
                const mobileLogin = document.getElementById('navbarMobileLogin');
                const mobileSignup = document.getElementById('navbarMobileSignup');
                if (mobileLogin) mobileLogin.style.display = 'none';
                if (mobileSignup) mobileSignup.style.display = 'none';

                // Attach logout handler
                const logoutBtn = document.getElementById('navbarLogout');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        // Clear localStorage
                        localStorage.removeItem('AUTH_TOKEN');
                        // Also clear backend session
                        fetch(API_BASE + '/api/v1/auth/logout', {
                            method: 'POST',
                            headers: { 'Authorization': 'Bearer ' + token },
                            credentials: 'include'
                        }).finally(() => {
                            // Reload same page — navbar will reset to guest state
                            window.location.reload();
                        });
                    });
                }

                // Profile link opens dashboard
                const profileLink = document.getElementById('navbarProfileLink');
                if (profileLink) {
                    profileLink.href = AUTH + 'dashboard.html';
                }

                const settingsLink = document.getElementById('navbarSettingsLink');
                if (settingsLink) {
                    settingsLink.href = AUTH + 'dashboard.html';
                }
            })
            .catch(() => {
                // User is NOT logged in — default guest state (already showing)
            });
    }

    // ==========================================
    // INIT
    // ==========================================
    function init() {
        injectNavbar();
        attachEvents();
        loadTutorialsConfig();
        populateReferencesPopup();
        checkAuthState();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
