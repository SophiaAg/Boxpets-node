const connection = require("../../config/pool-conexao.js");

module.exports = class MainController {
    static async first(req, res) {

        const query = `
        SELECT share.*, enterprise.name AS enterprise
        FROM share
        INNER JOIN enterprise ON share.onwer = enterprise.id;
        `

        const [sharePosts] = await connection.query(query);

        res.status(200).render("pages/template-dashboard", { page: "../pages/home.ejs", sharePosts: sharePosts, classePagina: "paginaComercial" });

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
            id: index,
            name: name,
            price: servicePrices[index],
            banner: serviceBanners[index]
        }));

        const peoples = peopleNames.map((name, index) => ({ 
            id: index,
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

        res.status(200).redirect('/share/' + item[0].insertId)
    }

    static async viewPost(req, res) {
        const { id } = req.params;
        const userid = 1 // simulado, para fazer uma situação real, pegue o id do req.session

        const query = `SELECT * FROM share WHERE ID = ? LIMIT 1`

        const [share] = await connection.query(query, [id]);

        res.status(200).render("pages/template-dashboard", { page: "../pages/home.ejs", share: share[0], userid: userid, classePagina: '', sharePosts: ''});
    }

    static async edit(req, res) {
        const { id } = req.params;
        const userid = 1 // simulado, para fazer uma situação real, pegue o id do req.session

        const query = `SELECT * FROM share WHERE ID = ? LIMIT 1`

        const [share] = await connection.query(query, [id]);

        //  verifica se o usuario é o mesmo que o criador da lading page
        if (share[0].onwer !== userid) {
            // erro
            return res.redirect(`/share/${id}`);
        }

        res.status(200).render("layouts/main.ejs", { router: "../pages/home/edit.ejs", share: share[0] });
    }

    static async makeEdit(req, res) {
        //  em resumo esta função é quase que a mesma que a que faz o envio dos dados
        //  essa verifica se os dados são os mesmos, se for, não os altera, se for, altera
        //  a troca da tabela toda será feita, mas os dados permanecerão os mesmos
        //  como é verificado se o item foi alterado ou não?
        //  com uma comparação simples de if else
        //  as variáveis são setadas vazias, após essa verificação se o dado foi ou não alterado ela receberá o dado já do banco de dados ou o dado enviado do usuário.

        //  validação dos dados não feitas, faça-as
        // lembre as validações são necessárias

        // Recupera o ID do item a ser editado
        const { id } = req.body;

        // Consulta o item a ser editado
        const query = "SELECT * FROM SHARE WHERE id = ? LIMIT 1";
        const [share] = await connection.query(query, [id]);

        // Banner
        let bannerShare;

        req.files.forEach(file => {
            if (file.fieldname.startsWith('bannerShare')) {
                bannerShare = file.buffer;
            }
        });

        // Verifica se o banner foi alterado
        bannerShare = bannerShare || share[0].banner;

        // Textos iniciais
        let { title, description, moreText } = req.body;

        title = title === '' ? share[0].title : title;
        description = description === '' ? share[0].description : description;
        moreText = moreText === '' ? share[0].moreText : moreText;

        // Imagem de mais sobre
        let moreImage;

        req.files.forEach(file => {
            if (file.fieldname.startsWith('moreImage')) {
                moreImage = file.buffer;
            }
        });

        // Verifica se a imagem "moreImage" foi alterada
        moreImage = moreImage || share[0].moreImage;

        // Serviços
        let servicePrices = [];
        let serviceNames = [];
        let serviceBanners = [];

        // Pessoas
        let peopleNames = [];
        let peopleFunctions = [];
        let peopleBanners = [];

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
        });

        // Percorre pelos arquivos de imagens
        req.files.forEach(file => {
            if (file.fieldname.startsWith('serviceBanner')) {
                serviceBanners.push({
                    filename: file.originalname,
                    buffer: file.buffer,
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

        // Recuperar serviços e pessoas existentes do banco de dados
        const existingServicesQuery = "SELECT services FROM share WHERE id = ?";
        const existingPeoplesQuery = "SELECT peoples FROM share WHERE id = ?";

        const [[existingServices]] = await connection.query(existingServicesQuery, [id]);
        const [[existingPeoples]] = await connection.query(existingPeoplesQuery, [id]);

        // Deserializar os serviços e pessoas existentes
        const currentServices = existingServices ? JSON.parse(existingServices.services) : [];
        const currentPeoples = existingPeoples ? JSON.parse(existingPeoples.peoples) : [];

        // Preparar novos serviços
        // Preparar novos serviços
        const newServices = serviceNames.map((name, index) => {
            // Logar os valores de cada serviço sendo criado
            return {
                id: index,
                name: name,
                price: servicePrices[index],
                banner: serviceBanners[index]
            };
        });

        // Combinar serviços existentes e novos
        const combinedServices = [...currentServices, ...newServices];

        // Preparar novas pessoas
        const newPeoples = peopleNames.map((name, index) => ({
            id: index,
            name: name,
            function: peopleFunctions[index],
            banner: peopleBanners[index]
        }));

        // Combinar pessoas existentes e novas
        const combinedPeoples = [...currentPeoples, ...newPeoples];

        // Query de atualização
        const finalQuery = `
                UPDATE share 
                SET banner = ?, title = ?, description = ?, services = ?, moreImage = ?, moreText = ?, peoples = ?, updatedAt = NOW() 
                WHERE id = ?
            `;

        // Preparar os dados para serem armazenados no banco de dados
        const servicesJSON = JSON.stringify(combinedServices);
        const peoplesJSON = JSON.stringify(combinedPeoples);
        const ownerId = 1; // Considerando um valor fixo ou substitua conforme necessário

        // Executar a atualização
        await connection.query(finalQuery, [bannerShare, title, description, servicesJSON, moreImage, moreText, peoplesJSON, id]);

        res.status(200).redirect('/share/edit/' + id);
    }

    static async view(req, res) { 
        const { shareId, id } = req.params

        console.log(id)

        const query = `SELECT * FROM share WHERE id = ? LIMIT 1`

        const [share] = await connection.query(query, [shareId]);

        const object = JSON.parse(share[0].services )
        const item = object.filter(item => (item.id == id))

        console.log(item)
        
    }

}