document.addEventListener("DOMContentLoaded", function () {
  const imageGrid = document.getElementById("imageGrid");

  // 加载 image.json
  fetch("./img/images.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load image.json");
      }
      return response.json();
    })
    .then(imagePaths => {
      // 清空容器（可选）
      imageGrid.innerHTML = "";

      // 遍历路径并创建 <img> 元素
      imagePaths.forEach(path => {
        const img = document.createElement("img");
        img.src = path; // 路径已经是 "img/xxx.jpg"
        img.alt = path.split("/").pop(); // 取文件名作为 alt
        img.loading = "lazy"; // 启用懒加载，提升性能
        imageGrid.appendChild(img);
      });
    })
    .catch(error => {
      console.error("Error loading images:", error);
      imageGrid.innerHTML = `<p style="text-align:center;color:#999;">无法加载图片列表，请检查 img/image.json 是否存在。</p>`;
    });

  // 为 "View More" 按钮添加平滑滚动到图库
  const viewMoreBtn = document.querySelector(".view-more-btn");
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener("click", function () {
      imageGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
});