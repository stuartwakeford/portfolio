document.addEventListener('DOMContentLoaded', function () {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;
    function toggleScrolled() {
        navbar.classList.toggle('scrolled', window.scrollY > 0);
    }
    toggleScrolled();
    window.addEventListener('scroll', toggleScrolled);
});
