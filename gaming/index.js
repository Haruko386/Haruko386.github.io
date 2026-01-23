const sections = document.querySelectorAll('.game, .setup-section, .steam-section');

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(sec => observer.observe(sec));