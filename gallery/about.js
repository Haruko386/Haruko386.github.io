document.addEventListener("DOMContentLoaded", function () {
    const themeToggleBtn = document.getElementById("theme-toggle");
    const iconSun = document.querySelector(".icon-sun");
    const iconMoon = document.querySelector(".icon-moon");
  
    // ==========================================
    // 1. 夜间模式逻辑 (复用)
    // ==========================================
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
      document.body.classList.add("dark-mode");
      updateIcon(true);
    }
  
    if(themeToggleBtn){
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
  
    // ==========================================
    // 2. 滚动显现动画 (Observer)
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 选取所有带有 .reveal-on-scroll 类的元素进行观察
    // 初始静态元素
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    // ==========================================
    // 3. 加载 Latest Work 数据
    // ==========================================
    const latestSection = document.getElementById("latest");
    
    fetch("./about.json")
        .then(response => response.json())
        .then(data => {
            if (data.latest) {
                const { date, title, description } = data.latest;
                
                // 构建 HTML
                let html = `
                    <h2 class="reveal-on-scroll">${title}</h2>
                    <p class="date reveal-on-scroll">${date}</p>
                `;
                
                description.forEach(para => {
                    html += `<p class="reveal-on-scroll">${para}</p>`;
                });

                latestSection.innerHTML = html;

                // 重新选取新加入的元素并添加到观察器
                latestSection.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
            }
        })
        .catch(err => console.error("Error loading about data:", err));
});