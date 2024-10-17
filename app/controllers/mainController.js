const connection = require("../schemas/connection.js");

module.exports = class MainController {
    static async first(req, res) {

        const query = `
        SELECT share.*, enterprise.name AS enterprise
        FROM share
        INNER JOIN enterprise ON share.onwer = enterprise.id;
        `

        const [sharePosts] = await connection.query(query);

        res.status(200).render("layouts/main.ejs", { router: "../pages/home/home.ejs", sharePosts : sharePosts });

    }

    static async sharePost(req, res) {

        // façam a validação para dados vazios etc, não sei fazer com o metodo usado por vocês :)

        // banner principal

        let bannerShare;

        req.files.forEach(file => {
            if (file.fieldname.startsWith('bannerShare')) {
                bannerShare = file.buffer;
            }
        });

        // textos iniciais

        const { title, description } = req.body;

        // serviços

        let servicePrices = [];
        let serviceNames = [];
        let serviceBanners = [];

        // imagem de mais sobre

        let moreImage;

        req.files.forEach(file => {
            if (file.fieldname.startsWith('moreImage')) {
                moreImage = file.buffer;
            }
        });

        // textos de mais sobre

        const { moreText } = req.body;

        // pessoas
        let peopleNames = [];
        let peopleFunctions = [];
        let peopleBanners = [];

        // percorre os campos enviados no req.body

        // retorna uma array com as chaves do req.body(um objeto)
        // chave no caso é o item respectivo para ser chamado
        // objeto.nome é um exemplo de chave
        // faço um loop para verificar cada chave, buscando pelas chaves que quero acessar
        // busco todas as chaves que começam com o texto que quero, tornando irrelevante se é servicePrice1...2...3, por exemplo
        // faço um push, ou seja, adiciono os dados no ultimo indice da variavel acima
        Object.keys(req.body).forEach(key => {

            if (key.startsWith('servicePrice')) {
                servicePrices.push(req.body[key]);
            }
            if (key.startsWith('serviceName')) {
                serviceNames.push(req.body[key]);
            }
            if (key.startsWith('peopleName')) {
                peopleNames.push(req.body[key]);
            }
            if (key.startsWith('peopleFunction')) {
                peopleFunctions.push(req.body[key]);
            }

        })

        // Percorre pelos arquivos de images

        req.files.forEach(file => {
            if (file.fieldname.startsWith('serviceBanner')) {
                serviceBanners.push({
                    filename: file.originalname,
                    buffer: file.buffer, // dados em string da imagem (converter no front-end em imagem)
                    mimetype: file.mimetype
                });
            }
            if (file.fieldname.startsWith('people')) {
                peopleBanners.push({
                    filename: file.originalname,
                    buffer: file.buffer,
                    mimetype: file.mimetype
                });
            }
        });

        // guardar no banco de dados:

        const services = serviceNames.map((name, index) => ({
            name: name,
            price: servicePrices[index],
            banner: serviceBanners[index]
        }));

        const peoples = peopleNames.map((name, index) => ({
            name: name,
            function: peopleFunctions[index],
            banner: peopleBanners[index]
        }));

        // console.log('Serviços recebidos:', services);
        // console.log('Pessoas recebidas:', peoples);

        // to com preguiça, então não adicionei o sistema de associar a empresa respectiva a lading page dela
        // mas basta trocar o id que eu coloquei estaticamente pelo id da empresa, e chamar na query com INNER JOIN
        // como? coloca o id pelo req.session ou com um input Hidden pelo front-end

        // Inserindo dados na tabela share
        const query = `
        INSERT INTO share (banner ,title, description, services, moreImage, moreText, peoples, onwer, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        // Preparar os dados para serem inseridos na tabela
        const servicesJSON = JSON.stringify(services);
        const peoplesJSON = JSON.stringify(peoples);
        const ownerId = 1;

        // console.log('Valores a serem inseridos:');
        // console.log('Title:', title);
        // console.log('Description:', description);
        // console.log('Services JSON:', servicesJSON);
        // console.log('More Image:', moreImage);
        // console.log('More Text:', moreText);
        // console.log('Peoples JSON:', peoplesJSON);
        // console.log('Owner ID:', ownerId);

       const item = await connection.query(query, [bannerShare, title, description, servicesJSON, moreImage, moreText, peoplesJSON, ownerId]);
        
       res.status(200).redirect('/share/'+item[0].insertId)
    }

    static async viewPost(req, res) {
        const { id } = req.params;

        const query = `SELECT * FROM share WHERE ID = ? LIMIT 1`

        const [share] = await connection.query(query, [id]);

        // console.log(share[0].services)

        res.status(200).render("layouts/main.ejs", { router: "../pages/home/share.ejs", share: share[0] });
    }
}