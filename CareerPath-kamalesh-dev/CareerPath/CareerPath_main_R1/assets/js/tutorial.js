document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // CONFIG
    // ==========================================
    const API_BASE = "http://localhost:8080";

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    let currentPageIndex = 0;
    let tutorialPages = [];

    // Read course from URL param ?course=, fallback to localStorage, then default
    const urlParams = new URLSearchParams(window.location.search);
    let currentCourseFile =
        urlParams.get('course') ||
        localStorage.getItem('careerPathCourse') ||
        'htmlPages.json';

    // Skill-completion tracking (from skills.html)
    const _skillId = urlParams.get('skillId');
    const _moduleId = urlParams.get('moduleId');

    const contentArea = document.querySelector('.content-area');
    const sidebar = document.querySelector('.sidebar-menu');
    const courseLinks = document.querySelectorAll('.course-link');

    // ==========================================
    // AUTH HELPER
    // ==========================================
    function getAuthToken() {
        // Try cookie first
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'AUTH_TOKEN') return value;
        }
        // Fallback to localStorage
        return localStorage.getItem('AUTH_TOKEN') || localStorage.getItem('token');
    }

    // ==========================================
    // LOAD COURSE (SAFE FETCH)
    // ==========================================
    async function loadCourse(fileName, isSwitchingCourse = false) {

        try {
            currentCourseFile = fileName;

            const response = await fetch(`../assets/data/tutorials/${fileName}`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Invalid JSON structure");
            }

            tutorialPages = data;

            localStorage.setItem('careerPathCourse', fileName);

            buildSidebar();

            const savedPage = parseInt(
                localStorage.getItem(`careerPathSavedPage_${fileName}`)
            );

            if (!isSwitchingCourse &&
                !isNaN(savedPage) &&
                savedPage < tutorialPages.length) {

                renderPage(savedPage);
            } else {
                renderPage(0);
            }

        } catch (error) {
            console.error("Course loading error:", error);
            if (contentArea) {
                contentArea.innerHTML =
                    `<h2 style="color:#ff4757; padding:40px;">
                        Error loading course data.<br>
                        Check file path & ensure Live Server is running.
                    </h2>`;
            }
        }

    }

    // ==========================================
    // BUILD SIDEBAR
    // ==========================================
    function buildSidebar() {
        if (!sidebar) return;

        sidebar.innerHTML = '';

        tutorialPages.forEach((page, index) => {
            const li = document.createElement('li');
            li.textContent = page.title;
            li.dataset.index = index;
            sidebar.appendChild(li);
        });

        updateSidebarActive();
    }

    // ==========================================
    // RENDER PAGE (SAFE)
    // ==========================================
    function renderPage(index) {

        if (!tutorialPages.length) return;

        if (index < 0 || index >= tutorialPages.length) {
            index = 0;
        }

        currentPageIndex = index;

        if (contentArea) {
            contentArea.innerHTML =
                tutorialPages[currentPageIndex].content;
            contentArea.scrollTo(0, 0);

            // If on the last page AND came from a skill, replace next-btn with "Mark as Completed"
            if (_skillId && _moduleId && currentPageIndex === tutorialPages.length - 1) {
                replaceNextWithComplete();
            }
        }

        updateSidebarActive();

        // Save page index per course
        localStorage.setItem(
            `careerPathSavedPage_${currentCourseFile}`,
            currentPageIndex
        );
    }

    // ==========================================
    // REPLACE NEXT BTN WITH MARK AS COMPLETED
    // ==========================================
    function replaceNextWithComplete() {
        if (!contentArea) return;

        // Find all next-btn elements on the current page and replace with "Mark as Completed"
        const nextBtns = contentArea.querySelectorAll('.next-btn');
        nextBtns.forEach(btn => {
            const completeBtn = document.createElement('button');
            completeBtn.className = 'btn-primary complete-btn';
            completeBtn.innerHTML = '✅ Mark as Completed';
            completeBtn.style.cssText = `
                background: linear-gradient(135deg, #00c853, #00e676);
                color: #fff;
                border: none;
                padding: 10px 24px;
                border-radius: 8px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0,200,83,0.3);
            `;
            completeBtn.addEventListener('mouseenter', () => {
                completeBtn.style.transform = 'translateY(-1px)';
                completeBtn.style.boxShadow = '0 4px 12px rgba(0,200,83,0.4)';
            });
            completeBtn.addEventListener('mouseleave', () => {
                completeBtn.style.transform = '';
                completeBtn.style.boxShadow = '0 2px 8px rgba(0,200,83,0.3)';
            });
            btn.replaceWith(completeBtn);
        });
    }

    // ==========================================
    // MARK AS COMPLETED (API CALL)
    // ==========================================
    async function markTutorialCompleted() {
        const token = getAuthToken();

        if (!token) {
            alert('Please log in to mark this tutorial as completed.');
            window.location.href = '../pages/login.html';
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/v1/tutorials/complete/${_skillId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 401 || res.status === 403) {
                alert('Session expired. Please log in again.');
                window.location.href = '../pages/login.html';
                return;
            }

            if (!res.ok) {
                throw new Error(`Failed: ${res.status}`);
            }

            // Also update localStorage for backward compatibility
            localStorage.setItem(`skill_completed_${_moduleId}_${_skillId}`, 'true');

            // Show success feedback
            showCompletionToast();

            // Redirect back to skills page after a short delay
            setTimeout(() => {
                window.location.href = `./roadmaps/skills.html?courseId=${_moduleId}`;
            }, 1500);

        } catch (err) {
            console.error('Error marking completed:', err);
            alert('Failed to mark tutorial as completed. Please try again.');
        }
    }

    // ==========================================
    // SUCCESS TOAST
    // ==========================================
    function showCompletionToast() {
        const toast = document.createElement('div');
        toast.innerHTML = '🎉 Tutorial Completed!';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00c853, #00e676);
            color: #fff;
            padding: 16px 28px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,200,83,0.4);
            animation: slideIn 0.4s ease-out;
        `;
        document.body.appendChild(toast);

        // Add animation keyframes
        if (!document.getElementById('toast-anim-style')) {
            const style = document.createElement('style');
            style.id = 'toast-anim-style';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ==========================================
    // SIDEBAR ACTIVE STYLE
    // ==========================================
    function updateSidebarActive() {
        if (!sidebar) return;

        const items = sidebar.querySelectorAll('li');

        items.forEach((li, i) => {
            li.style = '';

            if (i === currentPageIndex) {
                li.style.color = '#ffffff';
                li.style.fontWeight = 'bold';
                li.style.borderLeft = '3px solid #00ffb3';
                li.style.paddingLeft = '21px';
                li.style.backgroundColor = 'rgba(0,255,179,0.05)';
            } else {
                li.style.color = '#cbd5e1';
                li.style.paddingLeft = '24px';
            }
        });
    }

    // ==========================================
    // TOP COURSE SWITCHING
    // ==========================================
    courseLinks.forEach(link => {

        link.addEventListener('click', (e) => {
            e.preventDefault();

            courseLinks.forEach(l => l.style.color = '');
            link.style.color = '#00ffb3';

            const fileToLoad =
                link.getAttribute('data-course');

            if (fileToLoad) {
                loadCourse(fileToLoad, true);
            }
        });

        // Highlight current course on load
        if (link.getAttribute('data-course') === currentCourseFile) {
            link.style.color = '#00ffb3';
        }
    });

    // ==========================================
    // SIDEBAR CLICK (EVENT DELEGATION)
    // ==========================================
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                renderPage(parseInt(e.target.dataset.index));
            }
        });
    }

    // ==========================================
    // NEXT / PREV / TRY IT / COMPLETE BUTTONS
    // ==========================================
    if (contentArea) {
        contentArea.addEventListener('click', (e) => {

            if (e.target.classList.contains('next-btn') &&
                !e.target.disabled) {

                renderPage(currentPageIndex + 1);
            }

            else if (e.target.classList.contains('prev-btn') &&
                !e.target.disabled) {

                renderPage(currentPageIndex - 1);
            }

            // Handle "Mark as Completed" button
            else if (e.target.classList.contains('complete-btn')) {
                e.target.disabled = true;
                e.target.innerHTML = '⏳ Saving...';
                markTutorialCompleted();
            }

            else if (e.target.classList.contains('btn-try-it')) {

                const wrapper =
                    e.target.closest('.syntax-wrapper');

                if (!wrapper) return;

                const pre = wrapper.querySelector('pre');
                if (!pre) return;

                const code = pre.textContent.trim();

                if (currentCourseFile === 'sqlPages.json') {
                    // Open the SQL Editor
                    localStorage.setItem('careerPathTempCode', code);
                    window.open("./editors/sql-editor.html", '_blank');

                } else if (currentCourseFile === 'cssPages.json') {
                    // Open the CSS Editor
                    localStorage.setItem('careerPathCssCode', code);
                    window.open("./editors/css-editor.html", '_blank');

                } else if (currentCourseFile === 'jsPages.json') {
                    // Open the JavaScript Editor
                    localStorage.setItem('careerPathJsCode', code);
                    window.open("./editors/js-editor.html", '_blank');

                } else if (currentCourseFile === 'javaPages.json') {
                    // Open the Java Editor
                    localStorage.setItem('careerPathJavaCode', code);
                    window.open("./editors/java-editor.html", '_blank');

                } else if (['pythonPages.json', 'numpyPages.json', 'pandasPages.json'].includes(currentCourseFile)) {
                    localStorage.setItem('careerPathPythonCode', code);
                    window.open("./editors/python-editor.html", '_blank');

                } else if (['jsPages.json', 'jqueryPages.json', 'nodejsPages.json'].includes(currentCourseFile)) {
                    localStorage.setItem('careerPathJsCode', code);
                    window.open("./editors/js-editor.html", '_blank');
                } else if (['htmlPages.json', 'xmlPages.json', 'bootstrapPages.json'].includes(currentCourseFile)) {
                    localStorage.setItem('careerPathHtmlCode', code);
                    window.open("./editors/html-editor.html", '_blank');
                } else if (currentCourseFile === 'reactPages.json') {
                    localStorage.setItem('careerPathReactCode', code);
                    window.open("./editors/react-editor.html", '_blank');

                } else {
                    localStorage.setItem('careerPathHtmlCode', code);
                    window.open("./editors/html-editor.html", '_blank');
                }
            }
        });
    }

    // ==========================================
    // MOBILE MENU
    // ==========================================
    const menuToggle =
        document.getElementById('menuToggle');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // ==========================================
    // START APP
    // ==========================================
    loadCourse(currentCourseFile);

});