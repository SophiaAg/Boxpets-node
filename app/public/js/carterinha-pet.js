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

