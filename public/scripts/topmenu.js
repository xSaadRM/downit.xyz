const menuToggle = document.querySelector('.menu-toggle');
const topMenu = document.querySelector('.top-menu ul');
const pageContent = document.querySelector('.container'); // Replace with your content container class
const darkIcon = document.getElementById('darkModeToggle')
menuToggle.addEventListener('click', () => {
    topMenu.classList.toggle('active');
    pageContent.classList.toggle('content-shifted');
    darkIcon.classList.toggle('content-shifted')
});