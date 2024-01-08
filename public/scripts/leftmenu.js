    //menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const leftMenu = document.querySelector('.left-menu');

    menuToggle.addEventListener('click', () => {
        leftMenu.classList.toggle('active');
    });