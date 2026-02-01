// 1. 滚动动画 Observer (更新选择器)
const sections = document.querySelectorAll('.setup-section, .steam-section, .game-archive-section, .gallery-section');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.1 }); // 稍微降低阈值以便更容易触发

sections.forEach(sec => observer.observe(sec));

// 滚动函数
function scrollToSetup() {
    const target = document.querySelector('.setup-section');
    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// 2. 游戏档案 Tab 切换逻辑
const tabs = document.querySelectorAll('.game-tab');
const contents = document.querySelectorAll('.game-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 移除所有激活状态
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // 激活当前点击的 Tab
        tab.classList.add('active');

        // 找到对应的 Content 并激活
        const targetId = tab.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// 3. 加载图片库 (JSON fetch)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 3. 加载图片库 (乱序 + 提取游戏名)
async function loadGallery() {
    const galleryContainer = document.getElementById('cyber-gallery');

    galleryContainer.innerHTML = '';

    try {
        const response = await fetch('./images.json?t=' + new Date().getTime());
        if (!response.ok) throw new Error('Network response was not ok');
        
        let images = await response.json();

        images = shuffleArray(images);

        images.forEach(imgSrc => {
            // 1. 创建容器
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            // 2. 创建图片
            const img = document.createElement('img');
            img.src = imgSrc;
            img.loading = "lazy"; 
            img.alt = "Archive Visual";
            // 3. 提取游戏名
            let gameName = 'System Data';
            const pathParts = imgSrc.split('/');
          
            if (pathParts.length >= 3) {
                gameName = pathParts[1]; 
            }

            const caption = document.createElement('div');
            caption.className = 'gallery-caption';
            caption.innerHTML = ` ${gameName}`;

            // 5. 组装
            item.appendChild(img);
            item.appendChild(caption);
            galleryContainer.appendChild(item);
        });

    } catch (error) {
        console.error('Failed to load images:', error);
        galleryContainer.innerHTML = '<p style="color:#f00; font-family:Orbitron; text-align:center; font-size:20px; margin-top:50px;">[ERROR] IMAGE LINK DISCONNECTED</p>';
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadGallery);