const imgContainer = document.querySelector("[data-imgContainer]");
const inputFile = document.querySelector("[data-inputFile]");

inputFile.addEventListener("change", function (e) {
    e.preventDefault();
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const src = e.target.result;
            const img = new Image();
            img.onload = function () {
             

                inputFile.parentNode.classList.remove("invalid");
                if (imgContainer.querySelector(".img-item")) {
                    imgContainer.removeChild(imgContainer.querySelector(".img-item"));
                }

                const imgFoto = document.createElement("img");
                imgFoto.setAttribute("src", src);
                imgFoto.className = "img-item";
                imgContainer.appendChild(imgFoto);
            };
            img.src = src;
        };
        reader.readAsDataURL(file);
    } else {
        inputFile.parentNode.classList.add("invalid");
        inputFile.parentNode.querySelector(".invalid-msg").textContent = 'Escolha um arquivo do tipo Imagem!!';
        inputFile.value = "";
    }
});
