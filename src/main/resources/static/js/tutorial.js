const pages = [
  'test.html',
  'subtopic/listhtml.html',
  'subtopic/tagshtml.html',
  'subtopic/iframehtml.html',
  'subtopic/tablehtml.html'
];

let currentPageIndex = 0;

const hamburger = document.getElementById("hamburger");
        const sidebar = document.getElementById("sidebar");
        const content = document.querySelector(".content");
        const overlay = document.getElementById("overlay");

        hamburger.addEventListener("click", ()=>{
            sidebar.classList.toggle("open");
            if (window.innerWidth > 768){
                content.classList.toggle("shift");
            }
            else{
                content.classList.toggle("show");
            }
        });
        overlay.addEventListener("click", () => {
            sidebar.classList.remove("open");
            overlay.classList.remove("show");
        });

    // function loadPage(file) {
    //   document.getElementById("content-frame").src = file;
    // }

//loadcontent
function loadContent(file, element) {
    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error("File not found");
            return response.text();
        })
        .then(html => {
            // Parse the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Extract only body content
            const bodyContent = doc.body.innerHTML;

            // Inject into .content area
            document.querySelector(".content").innerHTML = bodyContent;

            // Update current index
            currentPageIndex = pages.indexOf(file);

            // Highlight active link
            const sidebarLinks = document.querySelectorAll(".sidebar ul li a, .sidebar ul li button");
            sidebarLinks.forEach(l => l.classList.remove("active"));
            if (element) element.classList.add("active");

            // Auto-close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove("open");
                overlay.classList.remove("show");
            }
            // Reset scroll
                window.scrollTo(0, 0);

                // Inject nav buttons
                const navButtons = `
                    <div class="buttons">
                    <button id="prevBtn" class="trybtn">Previous</button>
                    <button id="nextBtn" class="trybtn">Next</button>
                    </div>
                `;
                document.querySelector(".content").insertAdjacentHTML('beforeend', navButtons);

                // Add button listeners
                document.getElementById("prevBtn").onclick = () => {
                    if (currentPageIndex > 0) {
                    loadContent(pages[currentPageIndex - 1]);
                    }
                };
                document.getElementById("nextBtn").onclick = () => {
                    if (currentPageIndex < pages.length - 1) {
                    loadContent(pages[currentPageIndex + 1]);
                    }
                };
        })
        .catch(error => {
            document.querySelector(".content").innerHTML = "<p>Error loading content.</p>";
            console.error("Fail to load content:", error);
        });
}
