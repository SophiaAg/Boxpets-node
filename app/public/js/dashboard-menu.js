const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const sidebarItems = document.querySelectorAll('.container .menulateral .slidebar .item');

// Abrir e fechar o menu lateral
menuBtn.addEventListener('click', () => {
    sideMenu.classList.add("menuAberto");
});

closeBtn.addEventListener('click', () => {
    sideMenu.classList.remove("menuAberto");
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 868) {
        // Voltar o menu para a posição original na visualização desktop
        sideMenu.classList.add("menuAberto");

    } else {
        // Esconde o menu novamente na visualização mobile
        sideMenu.classList.remove("menuAberto");
    }
});

// Marcar item como ativo
// let activeItem = null; // Inicializa como null para garantir que não haja nenhum item ativo inicialmente

// sidebarItems.forEach(element => {
//     element.addEventListener('click', () => {
//         if (activeItem) {
//             activeItem.removeAttribute('id'); // Remove o 'id' do item anteriormente ativo
//         }

//         element.setAttribute('id', 'active'); // Define o novo 'id' ativo
//         activeItem = element; // Atualiza o item ativo
//     });
// });
