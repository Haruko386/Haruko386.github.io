document.addEventListener('DOMContentLoaded', () => {
            const galleryImages = document.querySelectorAll('.photo-item img');
            const overlay = document.getElementById('lightboxOverlay');
            const lightboxImg = document.getElementById('lightboxImage');

            galleryImages.forEach(img => {
                img.addEventListener('click', () => {
                    lightboxImg.src = img.src;
                    overlay.style.display = 'flex';
                });
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.style.display = 'none';
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') overlay.style.display = 'none';
            });
        });