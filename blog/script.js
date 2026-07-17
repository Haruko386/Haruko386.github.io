(function () {
    "use strict";

    const timelineView = document.getElementById("timeline-view");
    const articleView = document.getElementById("article-view");
    const articleYear = document.getElementById("article-year");
    const articleStatus = document.getElementById("article-status");
    const articleContent = document.getElementById("markdown-content");
    const articleFooter = document.getElementById("article-footer");
    const backButton = document.getElementById("back-button");
    const themeToggle = document.getElementById("theme-toggle");
    const siteHeader = document.querySelector(".site-header");

    const documents = Array.from(document.querySelectorAll("[data-document]"))
        .map((item) => item.dataset.document);
    const VISITED_STORAGE_KEY = "annual-review:visited-documents";
    let currentRequest = 0;
    let berryElement = null;
    let berryFlightTimer = null;
    let berryLastX = 0;

    function readVisitedDocuments() {
        try {
            const saved = JSON.parse(localStorage.getItem(VISITED_STORAGE_KEY) || "[]");
            return new Set(Array.isArray(saved) ? saved : []);
        } catch (error) {
            return new Set();
        }
    }

    const visitedDocuments = readVisitedDocuments();

    function allDocumentsVisited() {
        return documents.length > 0 && documents.every((filename) => visitedDocuments.has(filename));
    }

    function chooseBerryDestination() {
        if (!berryElement) {
            return;
        }

        const bounds = berryElement.getBoundingClientRect();
        const padding = 14;
        const maxX = Math.max(padding, window.innerWidth - bounds.width - padding);
        const maxY = Math.max(padding, window.innerHeight - bounds.height - padding);
        const nextX = padding + Math.random() * Math.max(0, maxX - padding);
        const nextY = padding + Math.random() * Math.max(0, maxY - padding);
        const duration = 3600 + Math.random() * 4200;
        const direction = berryElement.querySelector(".flying-berry__direction");

        direction.style.transform = `scaleX(${nextX < berryLastX ? -1 : 1})`;
        berryElement.style.transitionDuration = `${Math.round(duration)}ms`;
        berryElement.style.transform = `translate3d(${Math.round(nextX)}px, ${Math.round(nextY)}px, 0)`;
        berryLastX = nextX;

        window.clearTimeout(berryFlightTimer);
        berryFlightTimer = window.setTimeout(chooseBerryDestination, duration);
    }

    function releaseFlyingBerry() {
        if (berryElement || !allDocumentsVisited()) {
            return;
        }

        berryElement = document.createElement("div");
        berryElement.className = "flying-berry";
        berryElement.setAttribute("aria-hidden", "true");
        berryElement.innerHTML = `
            <span class="flying-berry__direction">
                <img src="../images/Flying%20berry.gif" alt="">
            </span>
        `;
        document.body.appendChild(berryElement);

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            berryElement.style.transform = "translate3d(20px, 90px, 0)";
            return;
        }

        berryLastX = window.innerWidth / 2;
        window.setTimeout(chooseBerryDestination, 80);
    }

    function markDocumentVisited(filename) {
        visitedDocuments.add(filename);
        try {
            localStorage.setItem(VISITED_STORAGE_KEY, JSON.stringify([...visitedDocuments]));
        } catch (error) {
            console.info("The reading progress could not be saved.", error);
        }
        releaseFlyingBerry();
    }

    function showTimeline(options = {}) {
        currentRequest += 1;
        articleView.hidden = true;
        articleView.classList.remove("view--active");
        timelineView.hidden = false;
        timelineView.classList.remove("view--active");
        void timelineView.offsetWidth;
        timelineView.classList.add("view--active");
        document.title = "年终总结 | Haruko386";

        if (!options.keepHash && window.location.hash) {
            history.pushState(null, "", window.location.pathname + window.location.search);
        }

        window.scrollTo({ top: 0, behavior: options.instant ? "auto" : "smooth" });
    }

    function showArticleView(year) {
        timelineView.hidden = true;
        timelineView.classList.remove("view--active");
        articleView.hidden = false;
        articleView.classList.remove("view--active");
        void articleView.offsetWidth;
        articleView.classList.add("view--active");
        articleYear.textContent = year;
        document.title = `${year} 年终总结 | Haruko386`;
        window.scrollTo({ top: 0, behavior: "auto" });
    }

    function setArticleLoading() {
        articleContent.innerHTML = "";
        articleFooter.hidden = true;
        articleStatus.innerHTML = '<span class="timeline-loading__line" aria-hidden="true"></span> 正在翻开这一年';
    }

    function setArticleError(year) {
        articleContent.innerHTML = "";
        articleFooter.hidden = true;
        articleStatus.innerHTML = `
            <div class="article-status__error">未能打开 ${year}</div>
            <div>请确认 ${year}.md 已存在，然后刷新页面。</div>
        `;
    }

    function renderMarkdown(source) {
        if (!window.marked || !window.DOMPurify) {
            throw new Error("Markdown renderer failed to load.");
        }

        window.marked.setOptions({
            gfm: true,
            breaks: false
        });

        const parsed = window.marked.parse(
            source.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "")
        );

        return window.DOMPurify.sanitize(parsed, {
            USE_PROFILES: { html: true },
            ADD_TAGS: ["style"],
            ADD_ATTR: ["target"]
        });
    }

    function enhanceArticle() {
        articleContent.querySelectorAll("a[href]").forEach((link) => {
            const href = link.getAttribute("href");
            if (/^https?:\/\//i.test(href)) {
                link.target = "_blank";
                link.rel = "noopener noreferrer";
            }
        });

        articleContent.querySelectorAll("table").forEach((table) => {
            if (table.parentElement.classList.contains("table-wrap")) {
                return;
            }
            const wrapper = document.createElement("div");
            wrapper.className = "table-wrap";
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });

        if (window.hljs) {
            articleContent.querySelectorAll("pre code").forEach((block) => {
                window.hljs.highlightElement(block);
            });
        }
    }

    async function openArticle(year) {
        if (!/^(?:19|20)\d{2}$/.test(year)) {
            showTimeline({ keepHash: true, instant: true });
            return;
        }

        const filename = `${year}.md`;
        if (documents.length && !documents.includes(filename)) {
            showArticleView(year);
            setArticleError(year);
            return;
        }

        markDocumentVisited(filename);

        const requestId = ++currentRequest;
        showArticleView(year);
        setArticleLoading();

        try {
            const response = await fetch(`./${encodeURIComponent(filename)}`, { cache: "no-cache" });
            if (!response.ok) {
                throw new Error(`Article returned ${response.status}`);
            }

            const markdown = await response.text();
            const html = renderMarkdown(markdown);

            if (requestId !== currentRequest) {
                return;
            }

            articleStatus.textContent = "";
            articleContent.innerHTML = html;
            enhanceArticle();
            articleFooter.hidden = false;
        } catch (error) {
            console.error(`Unable to load ${filename}.`, error);
            if (requestId === currentRequest) {
                setArticleError(year);
            }
        }
    }

    function getRouteYear() {
        const match = window.location.hash.match(/^#\/(\d{4})\/?$/);
        return match ? match[1] : null;
    }

    function handleRoute(options = {}) {
        const year = getRouteYear();
        if (year) {
            openArticle(year);
        } else {
            showTimeline({ keepHash: true, instant: options.instant });
        }
    }

    function goBackToTimeline() {
        if (window.location.hash) {
            history.pushState(null, "", window.location.pathname + window.location.search);
        }
        showTimeline({ keepHash: true });
    }

    function updateThemeButton() {
        const isDark = document.documentElement.classList.contains("dark-mode");
        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.setAttribute("aria-label", isDark ? "切换浅色模式" : "切换深色模式");
    }

    themeToggle.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark-mode");
        const isDark = document.documentElement.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateThemeButton();
    });

    backButton.addEventListener("click", goBackToTimeline);
    document.querySelector("[data-back-to-timeline]").addEventListener("click", goBackToTimeline);

    window.addEventListener("hashchange", () => handleRoute());
    window.addEventListener("scroll", () => {
        siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
    }, { passive: true });

    function init() {
        updateThemeButton();
        releaseFlyingBerry();
        handleRoute({ instant: true });
    }

    init();
}());
