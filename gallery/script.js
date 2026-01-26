document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const views = {
        gallery: document.getElementById("view-gallery"),
        about: document.getElementById("view-about")
    };

    // 切换页面的核心函数
    function switchPage(pageId, skipScroll = false) {
        Object.values(views).forEach(el => {
            el.classList.remove("active-view");
            setTimeout(() => {
                if (!el.classList.contains("active-view")) el.style.display = "none";
            }, 0);
        });

        const target = views[pageId] || views["gallery"];
        target.style.display = "block";
        void target.offsetWidth;
        target.classList.add("active-view");

        navLinks.forEach(link => {
            const targetAttr = link.getAttribute("data-target");
            link.classList.toggle("active", targetAttr === pageId);
        });

        if (!skipScroll) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute("data-target");
            history.pushState({ page: targetPage }, "", `#${targetPage}`);
            switchPage(targetPage, false);
        });
    });


    window.addEventListener("popstate", () => {
        const hash = window.location.hash.replace("#", "");

        if (["gallery", "about"].includes(hash)) {
            switchPage(hash);
        } else if (hash) {
            switchPage("about", true);
            setTimeout(() => {
                const el = document.getElementById(hash);
                if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 50);
        } else {
            switchPage("gallery");
        }
    });

    const hash = window.location.hash.replace("#", "");

    if (["gallery", "about"].includes(hash)) {
        switchPage(hash);
    } else if (hash) {
        // 锚点，默认进 about
        switchPage("about", true);
        setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
    } else {
        switchPage("gallery");
    }

    const themeToggleBtn = document.getElementById("theme-toggle");
    const iconSun = document.querySelector(".icon-sun");
    const iconMoon = document.querySelector(".icon-moon");

    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        updateIcon(true);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            updateIcon(isDark);
        });
    }

    function updateIcon(isDark) {
        if (isDark) {
            iconMoon.style.display = "none";
            iconSun.style.display = "block";
        } else {
            iconMoon.style.display = "block";
            iconSun.style.display = "none";
        }
    }

    document.querySelectorAll('.blog-nav a').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute("href").replace("#", "");
            history.pushState({}, "", `#${id}`);
            switchPage("about", true);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

    // 观察静态元素
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    const imageGrid = document.getElementById("imageGrid");
    if (imageGrid) {
        fetch("./images.json")
            .then(response => response.json())
            .then(imagePaths => {
                imageGrid.innerHTML = "";
                const shuffledPaths = shuffleArray(imagePaths);

                shuffledPaths.forEach((path, index) => {
                    const img = document.createElement("img");
                    img.src = path;
                    img.alt = `Gallery Image ${index + 1}`;
                    img.loading = "lazy";
                    img.classList.add("reveal-on-scroll");

                    img.onload = () => observer.observe(img);
                    imageGrid.appendChild(img);
                });
            })
            .catch(error => console.error("Error loading images:", error));
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Info Button 逻辑
    const infoBtn = document.getElementById("infoBtn");
    const infoPopup = document.getElementById("infoPopup");
    const lastUpdatedSpan = document.getElementById("lastUpdatedDate");

    if (lastUpdatedSpan) {
        const today = new Date();
        lastUpdatedSpan.textContent = today.toISOString().split('T')[0];
    }

    if (infoBtn && infoPopup) {
        infoBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            infoPopup.classList.toggle("show");
        });
        document.addEventListener("click", (e) => {
            if (!infoPopup.contains(e.target) && e.target !== infoBtn) {
                infoPopup.classList.remove("show");
            }
        });
    }

    const latestSection = document.getElementById("latest");
    if (latestSection) {
        fetch("./about.json")
            .then(response => response.json())
            .then(data => {
                if (data.latest) {
                    const { date, title, description } = data.latest;
                    let html = `
                        <h2 class="reveal-on-scroll">${title}</h2>
                        <p class="date reveal-on-scroll">${date}</p>
                    `;
                    description.forEach(para => {
                        html += `<p class="reveal-on-scroll">${para}</p>`;
                    });
                    latestSection.innerHTML = html;
                    latestSection.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
                }
            })
            .catch(err => console.error("Error loading about data:", err));
    }
});