document.addEventListener('DOMContentLoaded', function () {
  // Get all "navbar-burgers" elements.
  const navbarBurgers = document.querySelectorAll('.navbar-burger');

  // Check if there are any navbar burgers.
  if (navbarBurgers.length) {
    // Add a click event on each of them.
    navbarBurgers.forEach(function (el) {
      el.addEventListener('click', function () {
        // Get the target from the "data-target" attribute.
        const target = el.dataset.target;
        const targetElement = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu".
        el.classList.toggle('is-active');
        targetElement.classList.toggle('is-active');
      })
    })
  }
});