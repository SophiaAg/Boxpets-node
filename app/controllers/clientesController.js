const clienteModel = require("../models/clienteModel")
const { body, validationResult } = require("express-validator")
var bcrypt = require("bcryptjs")
var salt = bcrypt.genSaltSync(8)
const { removeImg } = require("../util/removeImg")
const moment = require("moment")
const { invalid } = require("moment/moment")
const clienteController = {

  // Validação do form de cadastro
  regrasValidacaoLogarConta: [
    body('email')
      .isEmail().withMessage('Deve ser um email válido')
      .bail()
    ,
    body('password')
      .isLength({ min: 8, max: 30 })
      .withMessage('A senha deve ter pelo menos 8 e no máximo 30 caracteres!')
      .bail()
      .matches(/[A-Z]/).withMessage('A senha deve conter pelo menos uma letra maiúscula.')
      .bail()
      .matches(/[a-z]/).withMessage('A senha deve conter pelo menos uma letra minúscula.')
      .bail()
      .matches(/[0-9]/).withMessage('A senha deve conter pelo menos um número inteiro.')
      .bail()
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('A senha deve conter pelo menos um caractere especial.')
      .bail()
    ,
  ],
  regrasValidacaoCriarConta: [
    body("nome")
      .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 letras!")
      .isAlpha().withMessage("Deve conter apenas letras!"),

    body("celular")
      .isMobilePhone('pt-BR').withMessage("Número de telefone inválido")
      .bail()
      .custom(async (celular) => {
        const celularExistente = await clienteModel.findClienteByCelular(celular)
        if (celularExistente.length > 0) {
          throw new Error("Celular já em uso! Tente outro.");
        }
        return true;
      }),
    body('email')
      .isEmail().withMessage('Deve ser um email válido')
      .bail()
      .custom(async (email) => {
        const emailExistente = await clienteModel.findClienteByEmail(email)
        if (emailExistente.length > 0) {
          throw new Error("E-mail já em uso! Tente outro");
        }
        return true;
      }),
    body('password')
      .isLength({ min: 8, max: 30 })
      .withMessage('A senha deve ter pelo menos 8 e no máximo 30 caracteres!')
      .bail()
      .matches(/[A-Z]/).withMessage('A senha deve conter pelo menos uma letra maiúscula.')
      .bail()
      .matches(/[a-z]/).withMessage('A senha deve conter pelo menos uma letra minúscula.')
      .bail()
      .matches(/[0-9]/).withMessage('A senha deve conter pelo menos um número inteiro.')
      .bail()
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('A senha deve conter pelo menos um caractere especial.')
      .bail()
    ,
    body("cpf").custom(cpf => {

      cpf = cpf.replace(/[^\d]+/g, '');
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        throw new Error('CPF inválido');
      }
      let soma = 0;
      let resto;
      for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }
      resto = (soma * 10) % 11;

      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      if (resto !== parseInt(cpf.substring(9, 10))) {
        throw new Error('CPF inválido');
      }

      soma = 0;

      // Validação do segundo dígito verificador
      for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }
      resto = (soma * 10) % 11;

      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      if (resto !== parseInt(cpf.substring(10, 11))) {
        throw new Error('CPF inválido');
      }

      return true;
    })
    ,
    body("nasc")
      .custom(nasc => {
        const dataNasc = moment(nasc, "YYYY-MM-DD");
        const dataMin = moment().subtract(16, 'years');
        if (dataNasc.isAfter(dataMin)) {
          throw new Error("Necessário ser maior de 16 anos!");
        }
        return true;
      }),
  ],
  regrasValidacaoPerfil: [
    body("nome_cli")
      .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 letras!").matches(/^[A-Za-zÀ-ÿ\s]+$/).withMessage("Deve conter apenas letras!"),

    body("celular_cli")
      .isMobilePhone('pt-BR').withMessage("Número de telefone inválido")
      .bail()
      .custom(async (celular) => {
        const celularExistente = await clienteModel.findClienteByCelular(celular)
        if (celularExistente.length > 0) {
          if (celular == celularExistente[0].CELULAR_CLIENTE) {
            return true
          }
          throw new Error("Celular já em uso! Tente outro.");
        }
        return true;
      }),
    body('email_cli')
      .isEmail().withMessage('Deve ser um email válido')
      .bail()
      .custom(async (email) => {
        const emailExistente = await clienteModel.findClienteByEmail(email)
        if (emailExistente.length > 0) {
          if (email == emailExistente[0].EMAIL_CLIENTE) {
            return true
          }
          throw new Error("E-mail já em uso! Tente outro");
        }
        return true;
      }),
    body("cpf_cli").custom(cpf => {

      cpf = cpf.replace(/[^\d]+/g, '');
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        throw new Error('CPF inválido');
      }
      let soma = 0;
      let resto;
      for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }
      resto = (soma * 10) % 11;

      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      if (resto !== parseInt(cpf.substring(9, 10))) {
        throw new Error('CPF inválido');
      }

      soma = 0;

      // Validação do segundo dígito verificador
      for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }
      resto = (soma * 10) % 11;

      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      if (resto !== parseInt(cpf.substring(10, 11))) {
        throw new Error('CPF inválido');
      }

      return true;
    })
    ,
    body("nasc_cli")
      .custom(nasc => {
        const dataNasc = moment(nasc, "YYYY-MM-DD");
        const dataMin = moment().subtract(16, 'years');
        if (dataNasc.isAfter(dataMin)) {
          throw new Error("Necessário ser maior de 16 anos!");
        }
        return true;
      }),
  ],
  regrasValidacaoPet: [
    body("nome_pet")
    .matches(/^[A-Za-zÀ-ÿ\s]+$/)
    .withMessage("O nome do pet deve conter apenas letras!"),
  body("idade_pet")
    .isInt({ min: 0 })
    .withMessage("Não é uma idade válida!"),
  body("raca_pet")
    .isLength({ min: 3, max: 45 })
    .withMessage("O nome da raça deve ter entre 3 e 45 letras!")
    .matches(/^[A-Za-zÀ-ÿ\s]+$/)
    .withMessage("O nome da raça deve conter apenas letras!")
],

  cadastrar: async (req, res) => {
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
      console.log(errors)
      const jsonResult = {
        form: "../partial/login/cadastrar",
        errors: errors,
        valores: req.body,
        isCadastrar: true,
      }
      res.render("pages/template-login", jsonResult);
    } else {
      const { nome, celular, email, password, cpf, nasc } = req.body
      dadosCliente = {
        NOME_CLIENTE: nome,
        CELULAR_CLIENTE: celular,
        EMAIL_CLIENTE: email,
        SENHA_CLIENTE: bcrypt.hashSync(password, salt),
        CPF_CLIENTE: cpf,
        DATA_NASC_CLIENTE: nasc,
        img_perfil_pasta: "imgUser.png"
      }
      try {
        const clienteCriado = await clienteModel.createCliente(dadosCliente);
        req.session.Clienteid = clienteCriado.insertId
        const jsonResult = {
          page: "../partial/landing-home/home-page" ,
          nome: dadosCliente.NOME_CLIENTE
        }


        req.session.save(() => {
          res.render("pages/template-hm", jsonResult)
        })

      } catch (erros) {
        console.log(erros)
        res.json(errors)
      }

    }
  },
  entrar: async (req, res) => {
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
      console.log(errors)
      const jsonResult = {
        form: "../partial/login/entrar",
        errors: errors,
        valores: req.body,
        incorreto: false,
      }
      res.render("pages/template-login", jsonResult);
    } else {

      const { email, password } = req.body
      try {
        const clienteBd = await clienteModel.findClienteByEmail(email)
        if (clienteBd[0] && bcrypt.compareSync(password, clienteBd[0].SENHA_CLIENTE))
           {

          req.session.autenticado = {
            autenticado: clienteBd[0].EMAIL_CLIENTE,
            id: clienteBd[0].ID_CLIENTE
          }
          const jsonResult = {
            page: "../partial/landing-home/home-page", 
            nome: clienteBd[0].NOME_CLIENTE
          }
          res.render("pages/template-hm", jsonResult)

        } else {
          const jsonResult = {
            form: "../partial/login/entrar",
            errors: null,
            valores: req.body,
            incorreto: true,
  
          }
          res.render("pages/template-login", jsonResult);
        }

      } catch (erros) {
        console.log(erros)
        res.render("pages/error-500")
      }

    }
  },
  mostrarPerfil: async (req, res) => {
    try {
      let results = await clienteModel.findClienteById(req.session.autenticado.id);
      // if (results[0].cep_cliente != null) {
      //   const httpsAgent = new https.Agent({
      //     rejectUnauthorized: false,
      //   });
      //   const response = await fetch('https://viacep.com.br/ws/${results[0].cep_cliente}/json/',
      //     { method: 'GET', headers: null, body: null, agent: httpsAgent, });
      //   var viaCep = await response.json();
      //   var cep = results[0].cep_cliente.slice(0, 5) + "-" + results[0].cep_cliente.slice(5)
      // } else {
      //   var viaCep = { logradouro: "", bairro: "", cidade: "", uf: "" }
      //   var cep = null;
      // }

      const data = new Date(results[0].DATA_NASC_CLIENTE);
      const dataFormatada = data.toISOString().split('T')[0];

      let campos = {
        nome_cli: results[0].NOME_CLIENTE,
        email_cli: results[0].EMAIL_CLIENTE,
        /// img_perfil_pasta: results[0].img_perfil_pasta,
        /// img_perfil_banco: results[0].img_perfil_banco != null ? `data:image/jpeg;base64,${results[0].img_perfil_banco.toString('base64')}` : null,
        nasc_cli: dataFormatada,
        celular_cli: results[0].CELULAR_CLIENTE,
        cpf_cli: results[0].CPF_CLIENTE,
        senha_cli: ""
      }

      res.render("./pages/template-hm", { page: "../partial/landing-home/page-user", avisoErro: null, valores: campos, foto: results[0].img_perfil_pasta })
    } catch (e) {
      console.log(e);
      res.redirect("/")
    }
  },
  gravarPerfil: async (req, res) => {

    const erros = validationResult(req);

    if (!erros.isEmpty()) {
      console.log(erros)

      let result = await clienteModel.findClienteById(req.session.autenticado.id);

      const data = new Date(result[0].DATA_NASC_CLIENTE);
      const dataFormatada = data.toISOString().split('T')[0];

      const campos = {
        nome_cli: result[0].NOME_CLIENTE,
        email_cli: result[0].EMAIL_CLIENTE,
        cpf_cli: result[0].CPF_CLIENTE,
        celular_cli: result[0].CELULAR_CLIENTE,
        nasc_cli: dataFormatada,
        senha_cli: ""
      }
      res.render("./pages/template-hm", { page: "../partial/landing-home/page-user", listaErros: erros, dadosNotificacao: null, valores: campos, foto: result[0].img_perfil_pasta });

    } else {
      try {
        var dadosForm = {

          NOME_CLIENTE: req.body.nome_cli,
          EMAIL_CLIENTE: req.body.email_cli,
          CELULAR_CLIENTE: req.body.celular_cli,
          CPF_CLIENTE: req.body.cpf_cli,
          DATA_NASC_CLIENTE: req.body.nasc_cli,
          // SENHA_CLIENTE: req.body.senha_cli,
        };

        // if (req.body.senha_cli != "") {
        //   console.log(req.body.senha_cli)
        //   dadosForm.SENHA_CLIENTE = bcrypt.hashSync(req.body.senha_cli, salt);
        // }


        let resultUpdate = await clienteModel.updateUser(dadosForm, req.session.autenticado.id);
        if (!resultUpdate.isEmpty) {
          var result = await clienteModel.findClienteById(req.session.autenticado.id);
          const data = new Date(result[0].DATA_NASC_CLIENTE);
          const dataFormatada = data.toISOString().split('T')[0];
          const campos = {
            nome_cli: result[0].NOME_CLIENTE,
            email_cli: result[0].EMAIL_CLIENTE,
            cpf_cli: result[0].CPF_CLIENTE,
            celular_cli: result[0].CELULAR_CLIENTE,
            nasc_cli: dataFormatada,
            senha_cli: ""
          }
          console.log('Foto:', result[0].img_perfil_pasta);
          if (resultUpdate.changedRows == 1) {
            console.log("ATUALIZADO--------------------")

            var autenticado = {
              autenticado: result[0].NOME_CLIENTE,
              id: result[0].ID_CLIENTE,
              foto: result[0].img_perfil_pasta

            };
            req.session.autenticado = autenticado;
            res.render("./pages/template-hm", { page: "../partial/landing-home/page-user", avisoErro: null, valores: campos, foto: req.session.autenticado.foto })
          } else {
            console.log("Sem alterações")
            res.render("./pages/template-hm", { page: "../partial/landing-home/page-user", avisoErro: null, valores: campos, foto: result[0].img_perfil_pasta })
          }
        }
      } catch (erros) {
        console.log(erros)
        res.redirect("/")
      }
    }
  },
  atualizarFoto: async (req, res) => {
    let errosMulter = req.session.erroMulter

    if (errosMulter.length > 0) {
      let listaErros = { formatter: null, errors: [] };

      if (errosMulter.length > 0) {
        listaErros.errors.push(...errosMulter)
        if (req.file) removeImg(`./app/public/src/fotos-perfil/${req.file.filename}`)
      }
      console.log("-------erro-de-validação-foto--------")
      console.log(listaErros)

      let results = await clienteModel.findClienteById(req.session.autenticado.id);
      const data = new Date(results[0].DATA_NASC_CLIENTE);
      const dataFormatada = data.toISOString().split('T')[0];


      let campos = {
        nome: results[0].NOME_CLIENTE,
        email: results[0].EMAIL_CLIENTE,
        nasc: dataFormatada,
        celular: results[0].CELULAR_CLIENTE,
        cpf: results[0].CPF_CLIENTE,
        senha: ""
      }

      res.render("./pages/template-hm", { page: "../partial/landing-home/page-user", avisoErro: listaErros, valores: campos, foto: results[0].img_perfil_pasta })


    } else {

      if (!req.file) {
        console.log("falha ao carregar arquivo!")
        let results = await clienteModel.findClienteById(req.session.autenticado.id);
        let campos = {
          nome: results[0].NOME_CLIENTE,
          email: results[0].EMAIL_CLIENTE,
          nasc: dataFormatada,
          celular: results[0].CELULAR_CLIENTE,
          cpf: results[0].CPF_CLIENTE,
          senha: ""
        }

        return res.render("./pages/template-hm", { page: "../partial/landing-home/page-user", avisoErro: { errors: [{ value: '', msg: 'falhaa ao carregar arquivo!', path: 'imgPerfil' }] }, valores: campos, foto: results[0].img_perfil_pasta })
      } else {
        try {
          var caminhoFoto = req.session.autenticado.foto
          if (caminhoFoto != req.file.filename && caminhoFoto != "imgUser.png") {
            removeImg(`./app/public/src/fotos-perfil/${caminhoFoto}`)
          }
          caminhoFoto = req.file.filename
          let resultado = await clienteModel.updateUser({ img_perfil_pasta: caminhoFoto }, req.session.autenticado.id)
          let results = await clienteModel.findClienteById(req.session.autenticado.id);
          const data = new Date(results[0].DATA_NASC_CLIENTE);
          const dataFormatada = data.toISOString().split('T')[0];

          req.session.autenticado.foto = caminhoFoto
          console.log(resultado)
          let campos = {
            nome: results[0].NOME_CLIENTE,
            email: results[0].EMAIL_CLIENTE,
            nasc: dataFormatada,
            celular: results[0].CELULAR_CLIENTE,
            cpf: results[0].CPF_CLIENTE,
            senha: ""
          }

          res.render("./pages/template-hm", { page: "../partial/landing-home/page-user", avisoErro: null, valores: campos, foto: results[0].img_perfil_pasta })

        } catch (errors) {
          console.log(errors)
          res.render("pages/error-500")

        }
      }

    }
  },
  excluirFoto: async (req, res) => {
    try {
      var caminhoFoto = req.session.autenticado.foto
      if (caminhoFoto != "imgUser.png") {
        removeImg(`./app/public/src/fotos-perfil/${caminhoFoto}`)
      }
      caminhoFoto = "imgUser.png"
      let resultado = await clienteModel.updateUser({ img_perfil_pasta: caminhoFoto }, req.session.autenticado.id)
      let results = await clienteModel.findClienteById(req.session.autenticado.id);
      const data = new Date(results[0].DATA_NASC_CLIENTE);
      const dataFormatada = data.toISOString().split('T')[0];
      req.session.autenticado.foto = caminhoFoto
      console.log(resultado)

      let campos = {
        nome: results[0].NOME_CLIENTE,
        email: results[0].EMAIL_CLIENTE,
        nasc: dataFormatada,
        celular: results[0].CELULAR_CLIENTE,
        cpf: results[0].CPF_CLIENTE,
        senha: ""
      }

      res.render("./pages/template-hm", { page: "../partial/landing-home/page-user", avisoErro: null, valores: campos, foto: results[0].img_perfil_pasta })

    } catch (errors) {
      console.log(errors)
      res.render("pages/error-500")

    }
  },
  mostrarPet: async (req, res) => {
    try {
      let pets = await clienteModel.findPetById(req.session.autenticado.id);


      // const data = new Date(results[0].DATA_NASC_CLIENTE);
      // const dataFormatada = data.toISOString().split('T')[0];

      // let campos = {
      //   nome_pet: results[0].NOME_PET,
      //   idade_pet: dataFormatada,
      //   sexo_pet: results[0].SEXO_PET,
      //   porte_pet: results[0].PORTE_PET,
      //   raca_pet: results[0].RACA_PET,
      // }

      res.render("./pages/template-hm", { page: "../partial/landing-home/carterinha-pet", avisoErro: null, pets: pets, modalAberto: false })
    } catch (e) {
      console.log(e);
      res.redirect("/")
    }
  },
  cadastrarPet: async (req, res) => {
    let errors = validationResult(req)
    let errorsMulter = req.session.erroMulter
    if (!errors.isEmpty() && errorsMulter.length > 0) {

      let listaErros = errors.isEmpty ? { formatter: null, errors: [] }: errors;
      if (errorsMulter.length > 0) {
        listaErros.errors.push(...errorsMulter)
        if (req.file) removeImg(`./app/public/src/fotos-pet/${req.file.filename}`)
      }
      console.log(listaErros)
      const jsonResult = {
        page: "../partial/landing-home/carterinha-pet",
        errors: errors,
        valores: req.body,
        modalAberto: true
      }
      res.render("pages/template-hm", jsonResult);
    } else {
      const { nome_pet, idade_pet, sexo_pet, porte_pet, raca_pet } = req.body
      const imgPet = req.file.filename
      if (!req.file) {
        const jsonResult = {
          page: "../partial/landing-home/carterinha-pet",
          errors: null,
          valores: req.body,
          modalAberto: true
        }
        return res.render("pages/template-hm", jsonResult);
      }
      const dadosPet = {
        NOME_PET: nome_pet,
        IDADE_PET: idade_pet,
        SEXO_PET: sexo_pet,
        PORTE_PET: porte_pet,
        RACA_PET: raca_pet,
        ID_CLIENTE: req.session.autenticado.id,
        img_pet: imgPet
      }
      try {
        const petCriado = await clienteModel.createPet(dadosPet);
        console.log(petCriado)
        res.redirect("/carterinha-pet")
      } catch (erros) {
        console.log(erros)
        res.json(errors)
      }

    }
  },
  // comentar

  FazerComentario: async (req, res) => {

    const id = req.session.Clienteid;
    const { comment } = req.body;

    if (!id) {
      // Lida com erros e retorna uma resposta de erro
      res.status(500).json({ message: 'Usuário não logado' });
    }

    if (comment.length == 0) {
      res.status(500).json({ message: 'Comentario não pode estar vazio' });
    }

    await clienteModel.insertCommentForUser(id, comment)

    res.redirect("/bsEmpresa");

  }
}


module.exports = clienteController