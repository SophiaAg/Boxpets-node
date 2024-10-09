// Obtém o modal, botão, e container das carteirinhas
var modal = document.getElementById("cardModal");
var btn = document.getElementById("createCardBtn");
var span = document.getElementsByClassName("close")[0];
var cardContainer = document.getElementById("cardContainer");
var form = document.getElementById("cardForm");

// Função para abrir o modal
btn.onclick = function() {
    modal.style.display = "flex";
}

// Fechar o modal ao clicar no "X"
span.onclick = function() {
    modal.style.display = "none";
}

// Fechar o modal ao clicar fora do conteúdo
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Função para excluir uma carteirinha
function deleteCard(event) {
    var card = event.target.parentElement;
    cardContainer.removeChild(card);
}

// Adicionar nova carteirinha após o envio do formulário
form.onsubmit = function(event) {
    event.preventDefault();
    
    // Capturar os valores do formulário
    var nome = document.getElementById("nome").value;
    var role = document.getElementById("role").value;
    var img = document.getElementById("img").value || 'https://via.placeholder.com/100'; // Imagem padrão se não for fornecida

    // Criar o elemento da carteirinha
    var card = document.createElement("div");
    card.className = "card";
    
    card.innerHTML = `
        <button class="delete-btn">&times;</button>
        <img src="${img}" alt="${nome}">
        <h3>${nome}</h3>
        <p>${role}</p>
    `;

    // Adicionar o botão de excluir funcional à carteirinha
    card.querySelector('.delete-btn').onclick = deleteCard;

    // Adicionar a nova carteirinha ao container
    cardContainer.appendChild(card);

    // Limpar o formulário
    form.reset();

    // Fechar o modal
    modal.style.display = "none";
}
