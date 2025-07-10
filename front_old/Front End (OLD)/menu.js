function loadMenu() {
    fetch('menu.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('menu-container').innerHTML = html;
        lucide.createIcons();
        highlightMenu();
    })
    .catch(error => console.error('Error loading menu: ', error));
}

function highlightMenu() {
    const currentPage = windows.location.pathname;
    const menuItems = [
        { page: 'index.html', elementId: 'home-link'},
        { page: 'about.html', elementId: 'info-link'},
        { page: 'contact.html', elementId: 'contact-link'},
    ];

    menuItems.forEach(item => {
        if (currentPage.includes(item.page)) {
            document.getElementById(item.elementId).classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', loadMenu);