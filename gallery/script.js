document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");

    const views = {
        gallery: document.getElementById("view-gallery"),
        archive: document.getElementById("view-archive"),
        about: document.getElementById("view-about")
    };
    const archiveGrid = document.getElementById("archiveGrid");
    const archiveDetail = document.getElementById("archiveDetail");
    const archiveTitle = document.getElementById("archiveTitle");
    const archiveImageGrid = document.getElementById("archiveImageGrid");
    let archiveCollections = null;

    function switchPage(pageId, skipScroll = false) {
        Object.values(views).forEach(el => {
            if (el) {
                el.classList.remove("active-view");
                setTimeout(() => {
                    if (!el.classList.contains("active-view")) el.style.display = "none";
                }, 0);
            }
        });

        const target = views[pageId] || views["gallery"];
        if (target) {
            target.style.display = "block";
            void target.offsetWidth;
            target.classList.add("active-view");
        }

        navLinks.forEach(link => {
            const targetAttr = link.getAttribute("data-target");
            link.classList.toggle("active", targetAttr === pageId);
        });

        if (!skipScroll) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute("data-target");
            history.pushState({ page: targetPage }, "", `#${targetPage}`);
            showCurrentRoute();
        });
    });

    window.addEventListener("popstate", showCurrentRoute);
    window.addEventListener("hashchange", showCurrentRoute);

    function showCurrentRoute() {
        const hash = window.location.hash.replace("#", "");
        if (hash === "archive" || hash.startsWith("archive/")) {
            renderArchiveRoute(hash);
            switchPage("archive");
        } else if (["gallery", "about"].includes(hash)) {
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
    }

    showCurrentRoute();

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

    document.querySelectorAll(".blog-nav a").forEach(a => {
        a.addEventListener("click", () => {
            const hrefAttr = a.getAttribute("href");
            if (hrefAttr && hrefAttr.startsWith("#")) {
                const id = hrefAttr.replace("#", "");
                history.pushState({}, "", `#${id}`);
                showCurrentRoute();
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

    document.querySelectorAll(".reveal-on-scroll").forEach(el => observer.observe(el));

    const imageGrid = document.getElementById("imageGrid");
    const galleryEnd = document.querySelector(".gallery-end");
    let galleryEndPlayed = false;

    function showGalleryEndAtBottom() {
        if (galleryEndPlayed || !galleryEnd || !views.gallery.classList.contains("active-view") ||
            !imageGrid || imageGrid.children.length === 0) return;

        const page = document.scrollingElement || document.documentElement;
        if (page.scrollTop === 0 || page.scrollTop + window.innerHeight < page.scrollHeight - 2) return;

        galleryEndPlayed = true;
        galleryEnd.classList.add("is-visible");
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            requestAnimationFrame(() => {
                const animation = galleryEnd.querySelector("img[data-src]");
                animation.src = animation.dataset.src;
            });
        }
    }

    window.addEventListener("scroll", showGalleryEndAtBottom, { passive: true });

    if (imageGrid) {
        fetch("./images.json")
            .then(response => response.json())
            .then(imagePaths => {
                const shuffledPaths = shuffleArray(imagePaths);
                renderImages(imageGrid, shuffledPaths);
            })
            .catch(error => console.error("Error loading images:", error));
    }

    fetch("./archive.json")
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(collections => {
            archiveCollections = collections;
            renderArchiveCards();
            renderArchiveRoute(window.location.hash.slice(1));
        })
        .catch(error => {
            archiveGrid.textContent = "Unable to load archive.";
            console.error("Error loading archive:", error);
        });

    function renderArchiveCards() {
        const fragment = document.createDocumentFragment();
        Object.entries(archiveCollections).forEach(([title, collection]) => {
            if (!collection || typeof collection.cover !== "string" || !collection.cover.trim() ||
                !Array.isArray(collection.images) || collection.images.length === 0) return;

            const card = document.createElement("a");
            card.className = "archive-card";
            card.href = `#archive/${encodeURIComponent(title)}`;

            const cover = document.createElement("img");
            cover.src = resolveImageSource(collection.cover);
            cover.alt = "";
            cover.loading = "lazy";

            const caption = document.createElement("span");
            caption.textContent = title;
            card.append(cover, caption);
            fragment.appendChild(card);
        });
        archiveGrid.replaceChildren(fragment);
    }

    function renderArchiveRoute(hash) {
        let title = null;
        if (hash.startsWith("archive/")) {
            try {
                title = decodeURIComponent(hash.slice("archive/".length));
            } catch {
                title = null;
            }
        }

        const collection = title && archiveCollections && archiveCollections[title];
        const paths = collection && collection.images;
        if (Array.isArray(paths) && paths.length > 0) {
            archiveGrid.hidden = true;
            archiveDetail.hidden = false;
            archiveTitle.textContent = title;
            renderImages(archiveImageGrid, paths);
        } else {
            archiveGrid.hidden = false;
            archiveDetail.hidden = true;
        }
    }

    function renderImages(container, paths) {
        const fragment = document.createDocumentFragment();
        paths.forEach((path, index) => {
            const img = document.createElement("img");
            img.src = resolveImageSource(path);
            img.alt = `Gallery Image ${index + 1}`;
            img.loading = "lazy";
            img.classList.add("reveal-on-scroll");
            img.onload = () => observer.observe(img);
            fragment.appendChild(img);
        });
        container.replaceChildren(fragment);
    }

    function resolveImageSource(path) {
        try {
            const url = new URL(path);
            if (url.hostname === "github.com") {
                const parts = url.pathname.split("/").filter(Boolean);
                if (parts.length >= 5 && parts[2] === "blob") {
                    return `https://raw.githubusercontent.com/${parts[0]}/${parts[1]}/${parts.slice(3).join("/")}`;
                }
            }
        } catch {
            // Relative paths in images.json already work as image sources.
        }
        return path;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const infoBtn = document.getElementById("infoBtn");
    const infoPopup = document.getElementById("infoPopup");

    fetch("/gallery/update.json")
        .then(res => res.json())
        .then(data => {
            document.getElementById("lastUpdatedDate").textContent = data.lastUpdated;
        })
        .catch(() => {
            console.log("failed to load update time");
        });

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
                    latestSection.querySelectorAll(".reveal-on-scroll").forEach(el => observer.observe(el));
                }
            })
            .catch(err => console.error("Error loading about data:", err));
    }
});
