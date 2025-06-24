document.addEventListener('DOMContentLoaded', function () {
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

  // Generates the HTML for a single pair of image comparison boxes (Input vs Ours, Marigold vs Ours)
  function createImageComparisonHTML(inputPath, oursPath, marigoldPath) {
    return `
            <div class="image-box">
                <div class="image-comparison">
                    <div class="image-container">
                        <div class="image-before" style="background-image: url(${inputPath});"></div>
                        <div class="image-after" style="background-image: url(${oursPath});"></div>
                        <div class="image-label left">Input</div>
                        <div class="image-label right">Ours</div>
                    </div>
                    <div class="divider"></div>
                </div>
            </div>
            <div class="image-box">
                <div class="image-comparison">
                    <div class="image-container">
                        <div class="image-before" style="background-image: url(${marigoldPath});"></div>
                        <div class="image-after" style="background-image: url(${oursPath});"></div>
                        <div class="image-label left">Marigold</div>
                        <div class="image-label right">Ours</div>
                    </div>
                    <div class="divider"></div>
                </div>
            </div>
        `;
  }

  // Populates a carousel with content based on provided data
  // This function will create 'column' elements, each containing 'itemsPerColumn' image-box pairs.
  function populateCarousel(carouselElementId, data, itemsPerColumn) {
    const carouselElement = document.getElementById(carouselElementId);
    if (!carouselElement) {
      console.error(`Carousel element with ID '${carouselElementId}' not found.`);
      return;
    }

    let currentColumnHTML = '';
    data.forEach((item, index) => {
      currentColumnHTML += createImageComparisonHTML(item.input, item.ours, item.marigold);

      // Create a new column after 'itemsPerColumn' image-box pairs (or if it's the last item)
      // In your original HTML, each 'column' contains two image-box divs.
      // So, for each item in the data array, we generate two image-boxes.
      // Therefore, if itemsPerColumn is 2, it means we want 2 image-boxes per column, which comes from 1 item in the data array.
      // We need to adjust 'itemsPerColumn' here to refer to the number of *data items* per column.
      // Since each data item creates 2 image-boxes, if you want 2 image-boxes per column, you need 1 data item per column.
      // If you wanted 4 image-boxes per column, you'd set itemsPerColumn to 2.
      const actualItemsPerColumn = 1; // Each data item forms one "set" of comparison images for a column segment.

      if ((index + 1) % actualItemsPerColumn === 0 || (index + 1) === data.length) {
        if (currentColumnHTML !== '') {
          const columnDiv = document.createElement('div');
          columnDiv.classList.add('column');
          columnDiv.innerHTML = currentColumnHTML;
          carouselElement.appendChild(columnDiv);
        }
        currentColumnHTML = ''; // Reset for the next column
      }
    });
  }

  // Populate carousels before initializing their JS
  populateCarousel('carousel-4-3', imageData4_3, 1); // Each data item makes one column in this setup
  populateCarousel('carousel-3-4', imageData3_4, 1); // Each data item makes one column in this setup

  // --- END: ADDED FOR DYNAMIC CONTENT GENERATION ---


  // Initialize all carousels (this loop will now process the dynamically generated content)
  const carousels = document.querySelectorAll('.carousel-wrapper');

  carousels.forEach(wrapper => {
    const carousel = wrapper.querySelector('.carousel');
    // Re-query 'columns' as they are now dynamically added
    const columns = wrapper.querySelectorAll('.column');
    const prevBtn = wrapper.querySelector('.carousel-btn.prev');
    const nextBtn = wrapper.querySelector('.carousel-btn.next');
    const navDotsContainer = wrapper.querySelector('.carousel-nav');
    // Re-query 'allLabels' as they are now dynamically added
    const allLabels = wrapper.querySelectorAll('.image-label');

    let currentIndex = 0;
    // visibleColumns will still be correctly determined based on the wrapper class
    const visibleColumns = wrapper.classList.contains('carousel-3-4') ? 5 : 3;
    const totalColumns = columns.length; // This will now be correct after population

    // Initialize navigation dots
    function initDots() {
      navDotsContainer.innerHTML = '';
      // The number of dots should correspond to the number of possible "slides" or views
      // If visibleColumns is 3, and you have 5 columns, you can slide 5 - 3 + 1 = 3 times (0, 1, 2)
      const dotCount = totalColumns > visibleColumns ? totalColumns - visibleColumns + 1 : 1; // Ensure at least 1 dot if fewer columns than visible

      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('nav-dot');
        if (i === 0) dot.classList.add('active');
        dot.dataset.index = i;
        navDotsContainer.appendChild(dot);
      }
    }

    initDots();
    // Re-query 'dots' after they are initialized
    const dots = wrapper.querySelectorAll('.nav-dot');

    // Update carousel position
    function updateCarousel() {
      const columnWidth = 100 / visibleColumns;
      const offset = -currentIndex * columnWidth;
      carousel.style.transform = `translateX(${offset}%)`;

      // Update button status
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= totalColumns - visibleColumns;

      // Update active dot
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });

      // Update slider label visibility
      updateSliderLabels();
    }

    // Automatic carousel (every 3 seconds)
    let autoSlide = setInterval(() => {
      if (currentIndex < totalColumns - visibleColumns) {
        currentIndex++;
      } else {
        currentIndex = 0; // Go back to the beginning
      }
      updateCarousel();
    }, 3000);

    // Stop on mouse enter, resume on mouse leave
    wrapper.addEventListener('mouseenter', () => clearInterval(autoSlide));
    wrapper.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => {
        if (currentIndex < totalColumns - visibleColumns) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
        updateCarousel();
      }, 3000);
    });


    function updateSliderLabels() {
      // Re-query sliders inside the current wrapper
      const sliders = wrapper.querySelectorAll('.image-comparison');

      sliders.forEach(slider => {
        const divider = slider.querySelector('.divider');
        const leftLabel = slider.querySelector('.image-label.left');
        const rightLabel = slider.querySelector('.image-label.right');
        const sliderRect = slider.getBoundingClientRect();
        const dividerRect = divider.getBoundingClientRect();

        const sliderWidth = sliderRect.width;
        const dividerPos = dividerRect.left - sliderRect.left;
        const percent = (dividerPos / sliderWidth) * 100;

        // Show/hide labels based on divider position
        if (percent < 5) { // Near left edge
          leftLabel.style.opacity = '0';
          rightLabel.style.opacity = '1';
        } else if (percent >= 95) { // Near right edge
          leftLabel.style.opacity = '1';
          rightLabel.style.opacity = '0';
        } else {
          leftLabel.style.opacity = '1';
          rightLabel.style.opacity = '1';
        }
      });
    }


    // Go to a specific column
    function goToColumn(index) {
      currentIndex = index;
      updateCarousel();
    }

    // Next column
    function nextColumn() {
      if (currentIndex < totalColumns - visibleColumns) {
        currentIndex++;
        updateCarousel();
      }
    }

    // Previous column
    function prevColumn() {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    }

    // Initialize sliders (now includes touch events)
    function initSliders() {
      // Re-query sliders inside the current wrapper
      const sliders = wrapper.querySelectorAll('.image-comparison');

      sliders.forEach(slider => {
        const divider = slider.querySelector('.divider');
        const before = slider.querySelector('.image-before');
        const after = slider.querySelector('.image-after');
        let isDragging = false;

        // Set initial divider position (center)
        const sliderWidth = slider.offsetWidth;
        const initialPos = sliderWidth / 2;
        divider.style.left = `${initialPos}px`;
        before.style.clipPath = `inset(0 ${sliderWidth - initialPos}px 0 0)`;
        after.style.clipPath = `inset(0 0 0 ${initialPos}px)`;

        // Mouse events
        divider.addEventListener('mousedown', function (e) {
          isDragging = true;
          document.body.style.cursor = 'ew-resize';
          e.preventDefault();
        });

        function handleMove(clientX) {
          if (!isDragging) return;

          const sliderRect = slider.getBoundingClientRect();
          let x = clientX - sliderRect.left;

          x = Math.max(0, Math.min(x, sliderRect.width));

          before.style.clipPath = `inset(0 ${sliderRect.width - x}px 0 0)`;
          after.style.clipPath = `inset(0 0 0 ${x}px)`;
          divider.style.left = `${x}px`;

          // Update label visibility while dragging
          updateSliderLabels();
        }

        document.addEventListener('mousemove', function (e) {
          handleMove(e.clientX);
        });

        document.addEventListener('mouseup', function () {
          isDragging = false;
          document.body.style.cursor = '';
        });

        // Touch events
        divider.addEventListener('touchstart', function (e) {
          isDragging = true;
          e.preventDefault();
        });

        document.addEventListener('touchmove', function (e) {
          handleMove(e.touches[0].clientX);
        });

        document.addEventListener('touchend', function () {
          isDragging = false;
        });
      });
    }

    // Event listeners
    prevBtn.addEventListener('click', prevColumn);
    nextBtn.addEventListener('click', nextColumn);

    // Re-attach event listeners to dots after they are initialized
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToColumn(parseInt(dot.dataset.index));
      });
    });

    // Re-initialize on window resize
    window.addEventListener('resize', function () {
      // Recalculate totalColumns if content changes or layout shifts significantly
      // For now, we'll just re-init sliders and update labels
      initSliders();
      updateSliderLabels();
      // You might need to re-run initDots and updateCarousel here if totalColumns changes dynamically with resize
      // For example, if you have a responsive design that changes visibleColumns based on screen size.
      // If totalColumns does NOT change on resize, then re-initializing initDots is not strictly necessary.
    });

    // Initial setup for each carousel
    initSliders();
    updateCarousel();
  });
});