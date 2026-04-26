document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    let isAuthenticated = false;

    const views = {
        gallery: document.getElementById("view-gallery"),
        about: document.getElementById("view-about"),
        "my-dearest-friend": document.getElementById("view-my-dearest-friend")
    };

    function switchPage(pageId, skipScroll = false) {
        // 未授权拦截
        if (pageId === "my-dearest-friend" && !isAuthenticated) {
            console.warn("🚫 Unauthorized access blocked. Redirecting to Gallery.");
            pageId = "gallery"; 
            history.replaceState({ page: "gallery" }, "", `#gallery`);
        }

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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (pageId === "my-dearest-friend" && isAuthenticated) {
            loadSecretGallery();
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
        if (["gallery", "about", "my-dearest-friend"].includes(hash)) {
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

    const secretTrigger = document.getElementById("secret-trigger");
    const secretOverlay = document.getElementById("elegant-overlay");
    const secretPwdInput = document.getElementById("secret-pwd");

    function openSecretOverlay() {
        secretOverlay.style.display = "flex";
        void secretOverlay.offsetWidth;
        secretOverlay.classList.add("show");
        secretPwdInput.value = "";
        secretPwdInput.placeholder = "whisper the word...";
        secretPwdInput.focus();
    }

    function closeSecretOverlay() {
        secretOverlay.classList.remove("show");
        setTimeout(() => {
            secretOverlay.style.display = "none";
        }, 600); 
    }

    if (secretTrigger) {
        secretTrigger.addEventListener("click", openSecretOverlay);
    }

    if (secretOverlay) {
        secretOverlay.addEventListener("click", (e) => {
            if (e.target === secretOverlay || e.target.classList.contains("secret-input-container")) {
                closeSecretOverlay();
            }
        });
    }

    function handleSecretLogin() {
        const pwd = secretPwdInput.value;
        if (pwd === "ghj14174.") {
            isAuthenticated = true;
            closeSecretOverlay();
            history.pushState({ page: "my-dearest-friend" }, "", `#my-dearest-friend`);
            switchPage("my-dearest-friend");
        } else {
            secretPwdInput.classList.add("shake");
            secretPwdInput.placeholder = "incorrect...";
            secretPwdInput.value = "";
            setTimeout(() => {
                secretPwdInput.classList.remove("shake");
            }, 400);
        }
    }

    if (secretPwdInput) {
        secretPwdInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                handleSecretLogin();
            } else if (e.key === "Escape") {
                closeSecretOverlay();
            }
        });
    }

    function loadSecretGallery() {
        const secretGrid = document.getElementById("secretImageGrid");
        
        if (secretGrid.children.length > 0) return;

        console.log("🚀 Start fetching secret gallery...");

        fetch("./my-dearest-friend.json")
            .then(response => {
                if (!response.ok) throw new Error("HTTP error " + response.status);
                return response.json();
            })
            .then(data => {
                console.log("✅ Fetched JSON data successfully:", data);
                
                data.forEach((item, index) => {
                    const wrapper = document.createElement("div");
                    wrapper.className = "image-wrapper reveal-on-scroll";

                    const img = document.createElement("img");
                    img.src = item.url;
                    img.alt = `Secret Image ${index + 1}`;
                    img.loading = "lazy";
                    
                    img.onload = () => observer.observe(wrapper);
                    img.onerror = () => {
                        console.warn(`❌ Failed to load image: ${item.url}`);
                        observer.observe(wrapper); 
                    };

                    wrapper.appendChild(img);

                    if (item.isAI === 1) {
                        const badge = document.createElement("div");
                        badge.className = "ai-badge";
                        badge.textContent = "Generated by AI, fake but valuable";
                        wrapper.appendChild(badge);
                    }

                    secretGrid.appendChild(wrapper);
                });
            })
            .catch(error => console.error("❌ Error loading secret images:", error));
    }

    const hash = window.location.hash.replace("#", "");
    if (["gallery", "about", "my-dearest-friend"].includes(hash)) {
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
            const hrefAttr = a.getAttribute("href");
            if(hrefAttr && hrefAttr.startsWith("#")) {
                const id = hrefAttr.replace("#", "");
                history.pushState({}, "", `#${id}`);
                switchPage("about", true);
            }
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

    // Info Button
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
                    latestSection.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
                }
            })
            .catch(err => console.error("Error loading about data:", err));
    }
});