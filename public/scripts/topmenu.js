const menuToggle = document.querySelector('.menu-toggle');
const topMenu = document.querySelector('.top-menu ul');
const pageContent = document.querySelector('.container'); // Replace with your content container class

menuToggle.addEventListener('click', () => {
    topMenu.classList.toggle('active');
    pageContent.classList.toggle('content-shifted');
});