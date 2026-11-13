document.addEventListener('DOMContentLoaded', function () {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;
    function toggleScrolled() {
        navbar.classList.toggle('scrolled', window.scrollY > 0);
    }
    toggleScrolled();
    window.addEventListener('scroll', toggleScrolled);

    // Mobile nav menu: lock background scroll while open, and reset the
    // toggler button's focus/selected state once it closes.
    var navCollapse = document.getElementById('navbarNav');
    var toggler = document.querySelector('.navbar-toggler');
    if (navCollapse) {
        navCollapse.addEventListener('show.bs.collapse', function () {
            document.body.classList.add('nav-open');
        });
        navCollapse.addEventListener('hidden.bs.collapse', function () {
            document.body.classList.remove('nav-open');
            if (toggler) {
                toggler.blur();
            }
        });
    }
});
