document.addEventListener('DOMContentLoaded', function () {
    // --- START: ADDED FOR DYNAMIC CONTENT GENERATION ---

    // --- START: ADDED FOR DYNAMIC CONTENT GENERATION ---

    // Define image data for the 4:3 ratio carousel (3 items per row in HTML, so 3 columns in the carousel)
    const imageData4_3 = [
        {
            input: './image/test-image/inside-01.jpg',
            ours: './image/depth_train/inside-01_pred_colored.png',
            marigold: './image/depth_pretrain/inside-01_pred_colored.png'
        },
        {
            input: './image/test-image/inside-05.png',
            ours: './image/depth_train/inside-05_pred_colored.png',
            marigold: './image/depth_pretrain/inside-05_pred_colored.png'
        },
        {
            input: './image/test-image/inside-06.png',
            ours: './image/depth_train/inside-06_pred_colored.png',
            marigold: './image/depth_pretrain/inside-06_pred_colored.png'
        },
        {
            input: './image/test-image/inside-08.jpg',
            ours: './image/depth_train/inside-08_pred_colored.png',
            marigold: './image/depth_pretrain/inside-08_pred_colored.png'
        },
        {
            input: './image/test-image/inside-09.jpg',
            ours: './image/depth_train/inside-09_pred_colored.png',
            marigold: './image/depth_pretrain/inside-09_pred_colored.png'
        },
        {
            input: './image/test-image/outside-05.png',
            ours: './image/depth_train/outside-05_pred_colored.png',
            marigold: './image/depth_pretrain/outside-05_pred_colored.png'
        },
        {
            input: './image/test-image/outside-06.png',
            ours: './image/depth_train/outside-06_pred_colored.png',
            marigold: './image/depth_pretrain/outside-06_pred_colored.png'
        },
        {
            input: './image/test-image/outside-04.jpg',
            ours: './image/depth_train/outside-04_pred_colored.png',
            marigold: './image/depth_pretrain/outside-04_pred_colored.png'
        },
        {
            input: './image/test-image/synthetic-inside-01.jpg',
            ours: './image/depth_train/synthetic-inside-01_pred_colored.png',
            marigold: './image/depth_pretrain/synthetic-inside-01_pred_colored.png'
        },
        {
            input: './image/test-image/synthetic-inside-02.jpg',
            ours: './image/depth_train/synthetic-inside-02_pred_colored.png',
            marigold: './image/depth_pretrain/synthetic-inside-02_pred_colored.png'
        },
        {
            input: './image/test-image/synthetic-inside-03.jpg',
            ours: './image/depth_train/synthetic-inside-03_pred_colored.png',
            marigold: './image/depth_pretrain/synthetic-inside-03_pred_colored.png'
        },
        {
            input: './image/test-image/synthetic-outside-02.jpg',
            ours: './image/depth_train/synthetic-outside-02_pred_colored.png',
            marigold: './image/depth_pretrain/synthetic-outside-02_pred_colored.png'
        },
        {
            input: './image/test-image/synthetic-outside-03.jpg',
            ours: './image/depth_train/synthetic-outside-03_pred_colored.png',
            marigold: './image/depth_pretrain/synthetic-outside-03_pred_colored.png'
        }
    ];

    // Define image data for the 3:4 ratio carousel (5 items per row in HTML, so 5 columns in the carousel)
    const imageData3_4 = [
        {
            input: './image/test-image/inside-02.jpg',
            ours: './image/depth_train/inside-02_pred_colored.png',
            marigold: './image/depth_pretrain/inside-02_pred_colored.png'
        },
        {
            input: './image/test-image/inside-03.jpg',
            ours: './image/depth_train/inside-03_pred_colored.png',
            marigold: './image/depth_pretrain/inside-03_pred_colored.png'
        },
        {
            input: './image/test-image/outside-01.jpg',
            ours: './image/depth_train/outside-01_pred_colored.png',
            marigold: './image/depth_pretrain/outside-01_pred_colored.png'
        },
        {
            input: './image/test-image/outside-02.jpg',
            ours: './image/depth_train/outside-02_pred_colored.png',
            marigold: './image/depth_pretrain/outside-02_pred_colored.png'
        },
        {
            input: './image/test-image/outside-03.jpg',
            ours: './image/depth_train/outside-03_pred_colored.png',
            marigold: './image/depth_pretrain/outside-03_pred_colored.png'
        },
        {
            input: './image/test-image/outside-09.jpg',
            ours: './image/depth_train/outside-09_pred_colored.png',
            marigold: './image/depth_pretrain/outside-09_pred_colored.png'
        },
        {
            input: './image/test-image/inside-10.png',
            ours: './image/depth_train/inside-10_pred_colored.png',
            marigold: './image/depth_pretrain/inside-10_pred_colored.png'
        },
        {
            input: './image/test-image/inside-11.jpg',
            ours: './image/depth_train/inside-11_pred_colored.png',
            marigold: './image/depth_pretrain/inside-11_pred_colored.png'
        },
        {
            input: './image/test-image/inside-12.jpg',
            ours: './image/depth_train/inside-12_pred_colored.png',
            marigold: './image/depth_pretrain/inside-12_pred_colored.png'
        }
    ];


    function createImageComparisonHTML(inputPath, oursPath, marigoldPath) {
        return `
      <div class="image-box">
        <div class="image-comparison">
          <div class="image-container">
            <div class="image-before loading-placeholder" data-src="${inputPath}"></div>
            <div class="image-after loading-placeholder" data-src="${oursPath}"></div>
            <div class="image-label left">Input</div>
            <div class="image-label right">Ours</div>
          </div>
          <div class="divider"></div>
        </div>
      </div>
      <div class="image-box">
        <div class="image-comparison">
          <div class="image-container">
            <div class="image-before loading-placeholder" data-src="${marigoldPath}"></div>
            <div class="image-after loading-placeholder" data-src="${oursPath}"></div>
            <div class="image-label left">Marigold</div>
            <div class="image-label right">Ours</div>
          </div>
          <div class="divider"></div>
        </div>
      </div>
    `;
    }

    // 全局 IntersectionObserver 实例
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const column = entry.target;
                const index = parseInt(column.dataset.index);
                const carouselElement = column.parentElement;
                const data = carouselElement.id === 'carousel-3-4' ? imageData3_4 : imageData4_3;
                const visibleColumns = carouselElement.id === 'carousel-3-4' ? 5 : 3;

                // 懒加载图像
                const placeholders = column.querySelectorAll('.loading-placeholder');
                placeholders.forEach(placeholder => {
                    const img = new Image();
                    img.src = placeholder.dataset.src;
                    img.onload = () => {
                        placeholder.style.backgroundImage = `url(${img.src})`;
                        placeholder.classList.remove('loading-placeholder');
                    };
                });

                // 判断是否加载更多列
                if (
                    index + visibleColumns >= carouselElement.children.length - 1 &&
                    carouselElement.children.length < data.length
                ) {
                    loadMoreColumns(carouselElement, data, carouselElement.children.length);
                }
            }
        });
    }, { threshold: 0.1 });

    function loadMoreColumns(carouselElement, data, startIndex) {
        const visibleColumns = carouselElement.id === 'carousel-3-4' ? 5 : 3;
        const endIndex = Math.min(startIndex + 2, data.length);
        for (let i = startIndex; i < endIndex; i++) {
            const columnHTML = createImageComparisonHTML(data[i].input, data[i].ours, data[i].marigold);
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('column');
            columnDiv.innerHTML = columnHTML;
            columnDiv.dataset.index = i;
            carouselElement.appendChild(columnDiv);
            observer.observe(columnDiv); // 注册懒加载
        }
    }

    function populateCarousel(carouselElementId, data) {
        const carouselElement = document.getElementById(carouselElementId);
        if (!carouselElement) return;

        const visibleColumns = carouselElementId === 'carousel-3-4' ? 5 : 3;
        const initialItems = Math.min(visibleColumns + 2, data.length);

        for (let i = 0; i < initialItems; i++) {
            const columnHTML = createImageComparisonHTML(data[i].input, data[i].ours, data[i].marigold);
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('column');
            columnDiv.innerHTML = columnHTML;
            columnDiv.dataset.index = i;
            carouselElement.appendChild(columnDiv);
            observer.observe(columnDiv); // 注册懒加载
        }
    }

    populateCarousel('carousel-4-3', imageData4_3);
    populateCarousel('carousel-3-4', imageData3_4);

    class CarouselController {
        constructor(wrapper) {
            this.wrapper = wrapper;
            this.carousel = wrapper.querySelector('.carousel');
            this.prevBtn = wrapper.querySelector('.carousel-btn.prev');
            this.nextBtn = wrapper.querySelector('.carousel-btn.next');
            this.navDotsContainer = wrapper.querySelector('.carousel-nav');
            this.visibleColumns = wrapper.classList.contains('carousel-3-4') ? 5 : 3;
            this.currentIndex = 0;
            this.autoSlideInterval = null;
            this.resizeObserver = null;
            this.init();
        }

        init() {
            this.columns = Array.from(this.carousel.querySelectorAll('.column'));

            // ✅ 修复：我们现在使用全部图片数量作为 totalColumns
            this.totalColumns = this.wrapper.id.includes('3-4') ? imageData3_4.length : imageData4_3.length;

            this.initDots();
            this.initSliders();
            this.updateCarousel();
            this.setupEventListeners();
            this.startAutoSlide();

            this.resizeObserver = new ResizeObserver(() => {
                this.updateCarousel();
            });
            this.resizeObserver.observe(this.wrapper);
        }


        initDots() {
            this.navDotsContainer.innerHTML = '';
            const dotCount = this.totalColumns > this.visibleColumns
                ? this.totalColumns - this.visibleColumns + 1
                : 1;
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('nav-dot');
                if (i === 0) dot.classList.add('active');
                dot.dataset.index = i;
                dot.addEventListener('click', () => this.goToColumn(parseInt(dot.dataset.index)));
                this.navDotsContainer.appendChild(dot);
            }
            this.dots = this.navDotsContainer.querySelectorAll('.nav-dot');
        }

        updateCarousel() {
            const columnWidth = 100 / this.visibleColumns;
            const offset = -this.currentIndex * columnWidth;
            this.carousel.style.transform = `translateX(${offset}%)`;
            this.prevBtn.disabled = this.currentIndex === 0;
            this.nextBtn.disabled = this.currentIndex >= this.totalColumns - this.visibleColumns;
            this.dots?.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
            this.updateSliderLabels();
        }

        updateSliderLabels() {
            const sliders = this.wrapper.querySelectorAll('.image-comparison');
            sliders.forEach(slider => {
                const divider = slider.querySelector('.divider');
                const leftLabel = slider.querySelector('.image-label.left');
                const rightLabel = slider.querySelector('.image-label.right');
                if (!divider || !leftLabel || !rightLabel) return;
                const sliderRect = slider.getBoundingClientRect();
                const dividerRect = divider.getBoundingClientRect();
                const percent = (dividerRect.left - sliderRect.left) / sliderRect.width * 100;
                if (percent < 5) {
                    leftLabel.style.opacity = '0';
                    rightLabel.style.opacity = '1';
                } else if (percent > 95) {
                    leftLabel.style.opacity = '1';
                    rightLabel.style.opacity = '0';
                } else {
                    leftLabel.style.opacity = '1';
                    rightLabel.style.opacity = '1';
                }
            });
        }

        initSliders() {
            const sliders = this.wrapper.querySelectorAll('.image-comparison');
            sliders.forEach(slider => {
                const divider = slider.querySelector('.divider');
                const before = slider.querySelector('.image-before');
                const after = slider.querySelector('.image-after');
                let isDragging = false;
                const sliderWidth = slider.offsetWidth;
                const initialPos = sliderWidth / 2;
                divider.style.left = `${initialPos}px`;
                before.style.clipPath = `inset(0 ${sliderWidth - initialPos}px 0 0)`;
                after.style.clipPath = `inset(0 0 0 ${initialPos}px)`;

                const handleMove = (clientX) => {
                    if (!isDragging) return;
                    const rect = slider.getBoundingClientRect();
                    let x = clientX - rect.left;
                    x = Math.max(0, Math.min(x, rect.width));
                    before.style.clipPath = `inset(0 ${rect.width - x}px 0 0)`;
                    after.style.clipPath = `inset(0 0 0 ${x}px)`;
                    divider.style.left = `${x}px`;
                    this.updateSliderLabels();
                };

                divider.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    document.body.style.cursor = 'ew-resize';
                    e.preventDefault();
                });

                document.addEventListener('mousemove', (e) => handleMove(e.clientX));
                document.addEventListener('mouseup', () => {
                    isDragging = false;
                    document.body.style.cursor = '';
                });

                divider.addEventListener('touchstart', (e) => {
                    isDragging = true;
                    e.preventDefault();
                }, { passive: false });

                document.addEventListener('touchmove', (e) => handleMove(e.touches[0].clientX), { passive: false });
                document.addEventListener('touchend', () => { isDragging = false; });
            });
        }

        goToColumn(index) {
            this.currentIndex = index;
            this.updateCarousel();
        }

        nextColumn() {
            if (this.currentIndex < this.totalColumns - this.visibleColumns) {
                this.currentIndex++;
                this.updateCarousel();
            }
        }

        prevColumn() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.updateCarousel();
            }
        }

        startAutoSlide() {
            this.stopAutoSlide();
            this.autoSlideInterval = setInterval(() => {
                if (this.currentIndex < this.totalColumns - this.visibleColumns) {
                    this.currentIndex++;
                } else {
                    this.currentIndex = 0;
                }
                this.updateCarousel();
            }, 5000);
        }

        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }

        setupEventListeners() {
            this.prevBtn.addEventListener('click', () => this.prevColumn());
            this.nextBtn.addEventListener('click', () => this.nextColumn());
            this.wrapper.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.wrapper.addEventListener('mouseleave', () => this.startAutoSlide());

            let touchStartX = 0;
            let touchEndX = 0;
            this.carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            this.carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
        }

        handleSwipe() {
            const threshold = 50;
            if (touchEndX < touchStartX - threshold) this.nextColumn();
            else if (touchEndX > touchStartX + threshold) this.prevColumn();
        }

        destroy() {
            this.stopAutoSlide();
            this.resizeObserver?.disconnect();
        }
    }

    const carousels = document.querySelectorAll('.carousel-wrapper');
    const carouselInstances = [];
    carousels.forEach(wrapper => {
        carouselInstances.push(new CarouselController(wrapper));
    });

    window.addEventListener('beforeunload', () => {
        carouselInstances.forEach(instance => instance.destroy());
    });
});
