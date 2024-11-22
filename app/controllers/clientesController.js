const favoritoModel = require("../models/favoritoModel")
const clienteModel = require("../models/clienteModel")
const { body, validationResult } = require("express-validator")
var bcrypt = require("bcryptjs")
var salt = bcrypt.genSaltSync(8)
const { removeImg } = require("../util/removeImg")
const moment = require("moment")
const { invalid } = require("moment/moment")
const jwt = require("jsonwebtoken")
const { enviarEmail, enviarEmailAtivacao, enviarEmailRecuperarSenha, enviarEmailAtivacaoCli } = require("../util/sendEmail")

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
      .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage("Deve conter apenas letras!"),

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
  regrasValidacaoRecuperarSenha: [
    body('email')
      .isEmail().withMessage('Deve ser um email válido')
      .bail()
      .custom(async (email) => {
        const emailExistente = await usuariosModel.findUsuariosByEmail(email)
        if (emailExistente.length > 0) {
          return true
        }
        throw new Error("Nenhum e-mail encontrado");
      })
  ],
  regrasValidacaoRedefinirSenha: [
    body('senha')
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
      .bail(),
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
        const token = jwt.sign(
          {
            userId: clienteCriado.insertId
          },
          process.env.SECRET_KEY
        )


        enviarEmailAtivacaoCli(
          dadosCliente.EMAIL_CLIENTE,
          "Cadastro realizado na BoxPets",
          process.env.URL_BASE,
          token,
          async () => {
            const clienteBd = await clienteModel.findClienteByIdInativo(clienteCriado.insertId);
            console.log(`------ Cliente ${clienteBd[0].NOME_CLIENTE} cadastrado! ------`)
            console.log(`------ Verificação enviada para ${clienteBd[0].EMAIL_CLIENTE} ------`)
            req.session.alert = {
              type: "success",
              title: "Conta criada com sucesso!",
              msg: "Verifique sua caixa de email para ativar sua conta.",
              count: 0
            }
            req.session.save(() => {
              res.redirect("/entrar")
            })
          })


      } catch (erros) {
        console.log(erros)
        res.redirect("/pg-erro")
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
        if (clienteBd[0] && bcrypt.compareSync(password, clienteBd[0].SENHA_CLIENTE)) {

          req.session.autenticado = {
            autenticado: clienteBd[0].EMAIL_CLIENTE,
            id: clienteBd[0].ID_CLIENTE
          }
          res.redirect("/home")

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
        res.render("pg-erro")
      }

    }
  },
  mostrarPerfil: async (req, res) => {

    try {
      let results = await clienteModel.findClienteById(req.session.autenticado.id);

      const data = new Date(results[0].DATA_NASC_CLIENTE);
      const dataFormatada = data.toISOString().split('T')[0];

      let campos = {
        nome_cli: results[0].NOME_CLIENTE,
        nasc_cli: dataFormatada,
        email_cli: results[0].EMAIL_CLIENTE,
        celular_cli: results[0].CELULAR_CLIENTE,
        cpf_cli: results[0].CPF_CLIENTE,
        senha_cli: ""
      }
      let alert = undefined
      if (req.session.alert && req.session.alert.count == 0) {
        alert = req.session.alert
        req.session.alert.count++
    }
  

      res.render("./pages/template-hm", { page: "../partial/landing-home/page-user", dadosNotificacao: alert, valores: campos, foto: results[0].img_perfil_pasta })
    } catch (e) {
      console.log(e);
      res.redirect("pg-erro")
    }
  },
  gravarPerfil: async (req, res) => {

    const erros = validationResult(req);

    if (!erros.isEmpty()) {
      console.log(erros)
      let alert = undefined
      if (req.session.alert && req.session.alert.count == 0) {
        alert = req.session.alert
        req.session.alert.count++
    }


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

      res.render("./pages/template-hm", { page: "../partial/landing-home/page-user", alert: alert, listaErros: erros, valores: campos, foto: result[0].img_perfil_pasta });

    } else {
      try {
        var dadosForm = {

          NOME_CLIENTE: req.body.nome_cli,
          EMAIL_CLIENTE: req.body.email_cli,
          CELULAR_CLIENTE: req.body.celular_cli,
          CPF_CLIENTE: req.body.cpf_cli,
          DATA_NASC_CLIENTE: req.body.nasc_cli,
          SENHA_CLIENTE: req.body.senha_cli,
        };

        if (req.body.senha_cli != "") {
          console.log(req.body.senha_cli)
          dadosForm.SENHA_CLIENTE = bcrypt.hashSync(req.body.senha_cli, salt);
        }
        console.log(dadosForm.SENHA_CLIENTE)


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

          if (resultUpdate.changedRows == 1) {
            console.log("ATUALIZADO--------------------")

            var autenticado = {
              autenticado: result[0].NOME_CLIENTE,
              id: result[0].ID_CLIENTE,
              foto: result[0].img_perfil_pasta

            };
            let alert = undefined
            if (req.session.alert && req.session.alert.count == 0) {
              alert = req.session.alert
              req.session.alert.count++
          }
            req.session.autenticado = autenticado;
            res.render("./pages/template-hm", { page: "../partial/landing-home/page-user",  alert: alert, avisoErro: null, valores: campos, foto: req.session.autenticado.foto })
          } else {
            console.log("Sem alterações")
            res.render("./pages/template-hm", { page: "../partial/landing-home/page-user",   avisoErro: null, valores: campos, foto: result[0].img_perfil_pasta })
          }
        }
      } catch (erros) {
        console.log(erros)
        res.redirect("pg-erro")
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

      let listaErros = errors.isEmpty ? { formatter: null, errors: [] } : errors;
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

  // ativar conta
  ativarConta: async (req, res) => {
    try {
      const token = req.query.token
      console.log(token)
      jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        console.log(decoded)
        if (err) {
          console.log("Token inválido ou expirado")
        } else {
          const clienteBd = await clienteModel.findClienteByIdInativo(decoded.userId)
          if (!clienteBd[0]) {
            return console.log("Cliente não encontrado")
          }

          const resultadoAtivarConta = await clienteModel.updateUser({ STATUS_CLIENTE: 'ativo' }, decoded.userId);
          console.log(resultadoAtivarConta)
          req.session.alert = {
            type: "success",
            title: "Conta ativada com sucesso!",
            msg: "Utilize seus dados para acessar a plataforma!",
            count: 0
          }
          res.redirect("/entrar")
        }
      })
    } catch (error) {
      console.log(error)
      res.render("/pg-erro")
    }
  },

  //redefinir senha
  verificarTokenRedefinirSenha: async (req, res) => {
    try {
      const token = req.query.token
      if (!token) {
        let alert = req.session.token ? req.session.token : null;
        if (alert && alert.contagem < 1) {
          req.session.token.contagem++;
        } else {
          req.session.token = null;
        }
        return res.render("/pg-erro");
      }

      jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
          req.session.token = { msg: "Link expirado!", type: "danger", contagem: 0 }
          res.redirect("/esqueceuSenha-cli")
        } else {
          const jsonResult = {
            page: "../partial/login/esqueceuSenha",
            erros: null,
            idUser: decoded.userId,
            modalAberto: true
          }
          res.render("./pages/template-login", jsonResult)
        }
      })
    } catch (error) {
      console.log(error)
      res.render("/pg-erro")

    }
  },
  solicitarResetSenha: async (req, res) => {
    let error = validationResult(req)

    if (!error.isEmpty) {
      const jsonResult = {
        page: "../partial/login/esqueceuSenha",
        erros: null,
        idUser: decoded.userId,
        modalAberto: true
      }
      res.render("./pages/template-login", jsonResult);
    } else {
      try {
        const { email } = req.body
        const user = await clienteModel.findClienteByEmailAtivo(email)

        const token = jwt.sign(
          {
            userId: user[0].ID_CLIENTE,
            expiresIn: "40m"
          },
          process.env.SECRET_KEY
        )

        enviarEmailRecuperarSenha(
          user[0].EMAIL_CLIENTE,
          "Recuperar de senha",
          process.env.URL_BASE,
          token,
          async () => {
            req.session.aviso = { msg: "E-mail enviado com sucesso", type: "success", contagem: 0 }
            res.redirect("/esqueceuSenha-cli")
          })


      } catch (error) {
        console.log(error)
        res.render("/pg-erro")

      }
    }
  },

  verificarTokenRedefinirSenha: async (req, res) => {
    try {
      const token = req.query.token
      if (!token) {
        let alert = req.session.token ? req.session.token : null;
        if (alert && alert.contagem < 1) {
          req.session.token.contagem++;
        } else {
          req.session.token = null;
        }
        return res.render("./partial/pg-erro");
      }

      jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
          req.session.token = { msg: "Link expirado!", type: "danger", contagem: 0 }
          res.redirect("/esqueceuSenha-cli")
        } else {
          const jsonResult = {
            page: "../partial/login/esqueceuSenha",
            erros: null,
            idUser: decoded.userId,
            modalAberto: true
          }
          res.render("./pages/template-login", jsonResult);
        }
      })
    } catch (error) {
      console.log(error)
      res.render("./partial/pg-erro")

    }
  },
  solicitarResetSenha: async (req, res) => {
    let error = validationResult(req)

    if (!error.isEmpty) {
      const jsonResult = {
        page: "../partial/login/esqueceuSenha",
        modal: "fechado",
        errors: error,
        modalAberto: false
      }
      res.render("pages/template-login", jsonResult);
    } else {
      try {
        const { email } = req.body
        const user = await clienteModel.findClienteByEmail(email)

        const token = jwt.sign(
          {
            userId: user[0].ID_CLIENTE,
            expiresIn: "40m"
          },
          process.env.SECRET_KEY
        )

        enviarEmailRecuperarSenhaCli(
          user[0].EMAIL_CLIENTE,
          "Recuperar de senha",
          process.env.URL_BASE,
          token,
          async () => {
            req.session.aviso = { msg: "E-mail enviado com sucesso", type: "success", contagem: 0 }
            res.redirect("/esqueceuSenha-cli")
          })


      } catch (error) {
        console.log(error)
        res.render("./partial/pg-erro")

      }
    }
  },
  redefinirSenha: async (req, res) => {
    let idUser = req.query.idUser
    if (!idUser) {
      console.log("usuario não achado")
      req.session.token = { msg: "Usuário não encontrado", type: "danger", contagem: 0 }
      return res.render("./partial/pg-erro")
    }
    let error = validationResult(req)

    if (!error.isEmpty) {
      const jsonResult = {
        page: "../partial/login/esqueceuSenha",
        token: null,
        errors: error,
        idUser: idUser,
        modalAberto: true,
      }
      res.render("./pages/template-login", jsonResult)
    } else {
      try {
        const { senha } = req.body
        let hashSenha = bcrypt.hashSync(senha, salt);
        var resultado = await clienteModel.updateUser({ SENHA_CLIENTE: hashSenha }, idUser)
        console.log("-------- senha redefinida -----------")
        console.log(resultado)
        req.session.alert = { msg: "Senha redefinida com sucesso!", type: "success", contagem: 0 }
        res.redirect("/logarCliente")
      } catch (error) {
        console.log(error)
        res.render("./partial/pg-erro")
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

  },

  //favoritar

  listar: async (req, res) => {
    results = await favoritoModel.findAll(req.session.autenticado.id);
    res.render("", {
      listaServico: results
    });
  },

  favoritar: async (req, res) => {
 
    try {
      let results = await clienteModel.findClienteById(req.session.autenticado.id);

  let favoritos = await favoritoModel.favoritar({
    
    idServico: req.query.id,
    situacao: req.query.sit
   });
    
      res.render("./pages/template-hm", { page: "../partial/cliente-empresa/favoritos", avisoErro: null, valores: campos, favoritos: favoritos })
    } catch (e) {
      console.log(e);
      res.redirect("/pg-erro")
    }

  //  await favoritoModel.favoritar({
  //   idCliente: results,
  //   idServico: req.query.id,
  //   situacao: req.query.sit
    
  //  });
  //  res.redirect("/")
    }
  }

  


module.exports = clienteController