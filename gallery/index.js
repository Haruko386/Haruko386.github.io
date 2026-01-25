document.addEventListener("DOMContentLoaded", function () {
  const imageGrid = document.getElementById("imageGrid");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const iconSun = document.querySelector(".icon-sun");
  const iconMoon = document.querySelector(".icon-moon");
  const infoBtn = document.getElementById("infoBtn");
  const infoPopup = document.getElementById("infoPopup");
  const lastUpdatedSpan = document.getElementById("lastUpdatedDate");

  // ==========================================
  // 1. 夜间模式逻辑 (Dark Mode)
  // ==========================================

  // 检查本地存储是否已有设置
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    updateIcon(true);
  }

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    // 保存偏好
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateIcon(isDark);
  });

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
  // 2. 图片加载与随机排序 (Random Image Grid)
  // ==========================================

  fetch("./images.json")
    .then(response => response.json())
    .then(imagePaths => {
      imageGrid.innerHTML = "";
      const shuffledPaths = shuffleArray(imagePaths);

      // 创建观察器 (Observer)
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 当图片进入视口时，添加显示类名
            entry.target.classList.add('is-visible');
            // 动画完成后取消观察，节省性能
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1, // 图片露出10%时触发
        rootMargin: "0px 0px -50px 0px" // 稍微提前一点触发
      });

      shuffledPaths.forEach((path, index) => {
        const img = document.createElement("img");
        img.src = path;
        img.alt = `Gallery Image ${index + 1}`;
        img.loading = "lazy";

        // 【核心修改】添加动画初始类名
        img.classList.add("reveal-on-scroll");

        // 图片加载完成后再开始观察，防止布局抖动
        img.onload = () => {
          observer.observe(img);
        };

        imageGrid.appendChild(img);
      });
    })
    .catch(error => {
      console.error("Error loading images:", error);
      imageGrid.innerHTML = `<p style="text-align:center;color:var(--accent-color);">Unable to load gallery.</p>`;
    });

  // 洗牌算法函数
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // ==========================================
  // 3. 底部信息弹窗 (Info Button)
  // ==========================================

  // 设置更新日期 (这里获取当前日期，或者你可以硬编码一个日期)
  const today = new Date();
  lastUpdatedSpan.textContent = today.toISOString().split('T')[0]; // 显示格式 YYYY-MM-DD

  // 点击切换显示
  infoBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // 防止冒泡
    infoPopup.classList.toggle("show");
  });

  // 点击页面其他地方关闭弹窗
  document.addEventListener("click", (e) => {
    if (!infoPopup.contains(e.target) && e.target !== infoBtn) {
      infoPopup.classList.remove("show");
    }
  });
});