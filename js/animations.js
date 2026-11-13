document.addEventListener('DOMContentLoaded', function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Page-load reveal: fades/slides in the nav, main content and staggered tiles.
    if (reduceMotion) {
        document.documentElement.classList.add('is-loaded');
    } else {
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.documentElement.classList.add('is-loaded');
            });
        });
    }

    // Scroll-reveal: case study images, testimonials, venture cards, more-button
    // links, services content blocks and more-work tiles subtly slide/zoom into
    // focus as they enter the viewport.
    var revealEls = document.querySelectorAll(
        '.case-img-reveal, .scroll-reveal, .testimonials .card, .about-page .mobile-card, ' +
        '.more-button, .service-block-card, .more-work-row .card'
    );
    if (revealEls.length) {
        if (reduceMotion || !('IntersectionObserver' in window)) {
            revealEls.forEach(function (el) {
                el.classList.add('in-view');
            });
        } else {
            var observer = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

            revealEls.forEach(function (el) {
                observer.observe(el);
            });
        }
    }
});
