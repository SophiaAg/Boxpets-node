const fotoContainer = document.querySelector("[data-fotoContainer]");
const inputFileFoto = document.querySelector("[data-inputFoto]");

inputFileFoto.addEventListener("change", function (e) {
    e.preventDefault();
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const src = e.target.result;
            const img = new Image();
            img.onload = function () {
             

                inputFileFoto.parentNode.classList.remove("invalid");
                if (fotoContainer.querySelector(".foto__img")) {
                    fotoContainer.removeChild(fotoContainer.querySelector(".foto__img"));
                }

                const imgFoto = document.createElement("img");
                imgFoto.setAttribute("src", src);
                imgFoto.className = "foto__img";
                fotoContainer.appendChild(imgFoto);
            };
            img.src = src;
        };
        reader.readAsDataURL(file);
    } else {
        inputFileFoto.parentNode.classList.add("invalid");
        inputFileFoto.parentNode.querySelector(".invalid-msg").textContent = 'Escolha um arquivo do tipo Imagem!!';
        inputFileFoto.value = "";
    }
});
