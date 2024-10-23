// Modal principal e botão de criar carteirinha
var cardModal = document.getElementById("cardModal"); // Modal principal para criar carteirinhas
var createBtn = document.getElementById("createCardBtn");
var closeCreate = document.getElementsByClassName("close")[0]; // Botão de fechar (X) do modal principal

// Modal de opções da carteirinha (editar/excluir)
var petModal = document.getElementById("petOptionsModal"); // Modal de opções da carteirinha
var closePet = document.getElementsByClassName("close")[1]; // Botão de fechar (X) do modal de opções

// Função para abrir o modal principal (criar carteirinha)
createBtn.onclick = function() {
    cardModal.style.display = "flex";
}

// Fechar o modal principal ao clicar no "X"
closeCreate.onclick = function() {
    cardModal.style.display = "none";
}

// Função para abrir o modal da carteirinha específica
function openPetModal() {
    petModal.style.display = "flex";
}

// Fechar o modal de opções da carteirinha ao clicar no "X"
closePet.onclick = function() {
    petModal.style.display = "none";
}

// Fechar o modal ao clicar fora do conteúdo
window.onclick = function(event) {
    if (event.target == cardModal) {
        cardModal.style.display = "none";
    } else if (event.target == petModal) {
        petModal.style.display = "none";
    }
}

// Função para editar a carteirinha pet
function editPet() {
    alert("Função de editar carteirinha pet aqui.");
    petModal.style.display = "none"; // Fecha o modal após a edição
}

// Função para excluir a carteirinha pet
function deletePet() {
    const confirmation = confirm("Tem certeza que deseja excluir a carteirinha do pet?");
    if (confirmation) {
        alert("Carteirinha excluída.");
        petModal.style.display = "none"; // Fecha o modal após a exclusão
    }
}
