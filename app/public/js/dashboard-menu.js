const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const sidebarItems = document.querySelectorAll('.container .menulateral .slidebar .item');

// Abrir e fechar o menu lateral
menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

// Marcar item como ativo
let activeItem = null; // Inicializa como null para garantir que não haja nenhum item ativo inicialmente

sidebarItems.forEach(element => {
    element.addEventListener('click', () => {
        if (activeItem) {
            activeItem.removeAttribute('id'); // Remove o 'id' do item anteriormente ativo
        }

        element.setAttribute('id', 'active'); // Define o novo 'id' ativo
        activeItem = element; // Atualiza o item ativo
    });
});
