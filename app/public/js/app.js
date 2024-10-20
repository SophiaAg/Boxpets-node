// previw de imagens

function previewImage(input, labelClass) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var labelElement = document.querySelector('.' + labelClass);
            labelElement.style.backgroundImage = 'url(' + e.target.result + ')';
            labelElement.classList.add('has-background'); // Adiciona uma classe para controle adicional
        };

        reader.readAsDataURL(input.files[0]); // converte para string base64
    }
}

// adicionar serviços/pessoas para o front end

let formCounts = { service: 0, people: 0 };

function addForm(type) {
    formCounts[type]++;
    const formSection = document.querySelector(`.${type}s`);

    let newForm = '';

    if (type === 'service') {
        newForm = `
        <section class="card">
            <section class="archive">
                <label for="${type}Banner${formCounts[type]}" class="labelFile ${type}Banner${formCounts[type]}">
                    <span><i class="bi bi-cloud-arrow-up"></i></span>
                    <p>drag and drop your file here or click to select a file!</p>
                </label>
                <input class="input" id="${type}Banner${formCounts[type]}" name="${type}Banner${formCounts[type]}" type="file" onchange="previewImage(this, '${type}Banner${formCounts[type]}')">
            </section>
            <section class="description">
                <section class="input-control">
                    <input type="text" name="${type}Name${formCounts[type]}" placeholder="Tosa">
                </section>
                <section class="input-control">
                    <span>R$</span>
                    <input type="text" name="${type}Price${formCounts[type]}" placeholder="??.??">
                </section>
            </section>
        </section>
        `;
    } else if (type === 'people') {
        newForm = `
        <section class="card">
            <section class="archive">
                <label for="${type}${formCounts[type]}" class="labelFile ${type}${formCounts[type]}">
                    <span><i class="bi bi-cloud-arrow-up"></i></span>
                    <p>drag and drop your file here or click to select a file!</p>
                </label>
                <input class="input" id="${type}${formCounts[type]}" name="${type}${formCounts[type]}" type="file" onchange="previewImage(this, '${type}${formCounts[type]}')">
            </section>
            <section class="description">
                <section class="input-control">
                    <input type="text" name="${type}Name${formCounts[type]}" placeholder="Alana">
                </section>
                <section class="input-control">
                    <input type="text" name="${type}Function${formCounts[type]}" placeholder="Developer">
                </section>
            </section>
        </section>
        `;
    }

    formSection.insertAdjacentHTML('beforeend', newForm);
}
