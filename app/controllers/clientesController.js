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


  cadastrar: async (req, res) => {
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
      console.log(errors)
      const jsonResult = {
        form: "../partial/login/cadastrar",
        errors: errors,
        valores: req.body,
        isCadastrar: true
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
      }
      try {
        const clienteCriado = await clienteModel.createCliente(dadosCliente);
        req.session.Clienteid = clienteCriado.insertId
        const jsonResult = {
          page: "../partial/landing-home/home-page"
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
        incorreto: false
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
          const jsonResult = {
            page: "../partial/landing-home/home-page"
          }
          res.render("pages/template-hm", jsonResult)

        } else {
          const jsonResult = {
            form: "../partial/login/entrar",
            errors: null,
            valores: req.body,
            incorreto: true
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
        nome: results[0].NOME_CLIENTE,
        email: results[0].EMAIL_CLIENTE,
        /// img_perfil_pasta: results[0].img_perfil_pasta,
        /// img_perfil_banco: results[0].img_perfil_banco != null ? `data:image/jpeg;base64,${results[0].img_perfil_banco.toString('base64')}` : null,
        nasc: dataFormatada,
        celular: results[0].CELULAR_CLIENTE,
        cpf: results[0].CPF_CLIENTE,
        senha: ""
      }

      res.render("./pages/template-hm", { page: "../partial/landing-home/page-user", avisoErro: null, valores: campos })
    } catch (e) {
      console.log(e);
      res.render("partial/landing-home/page-user", {
        avisoErro: null, dadosNotificacao: null, valores: {
          img_perfil_banco: "", img_perfil_pasta: "", nome_cli: "", email_cli: "",
          nomecli_cli: "", celular_cli: "", senha_cli: "", cpf_cli: ""
        }
      })
    }
  },
  gravarPerfil: async (req, res) => {

    const erros = validationResult(req);
    const erroMulter = req.session.erroMulter;
    if (!erros.isEmpty() || erroMulter != null) {
      aviso = !erros.isEmpty() ? erros : { formatter: null, errors: [] };
      if (erroMulter != null) {
        aviso.errors.push(erroMulter);

        return res.render("partial/landing-home/page-user", { avisoErros: aviso, valores: req.body })

      }
      try {
        var dadosForm = {

          nome_cliente: req.body.nome_cli,
          email_cliente: req.body.email_cli,
          celular_cliente: req.body.fone_cli,
          img_perfil_banco: req.session.autenticado.img_perfil_banco,
          img_perfil_pasta: req.session.autenticado.img_perfil_pasta,
        };

        if (req.body.senha_cli != "") {
          dadosForm.senha_cliente = bcrypt.hashSync(req.body.senha_cli, salt);
        }
        if (!req.file) {
          console.log("Falha no carregamento");
        } else {
          //Armazenando o caminho do arquivo salvo na pasta do proieto
          caminhoArquivo = "imagem/perfil/" + req.file.filename;
          //Se houve alteracao de imagem de perfil apaga a imagem anterior
          if (dadosForm.img_perfil_pasta != caminhoArquivo) {
            removeImg(dadosForm.img_perfil_pasta);
          }

          dadosForm.img_perfil_pasta = caminhoArquivo;
          dadosForm.img_perfil_banco = null;
        }
        // //Armazenando o buffer de dados binarios do arquivo
        // dadosForm.img_perfil_banco = req.file.buffer;
        // //Apagando a imagem armazenada na pasta
        // removeImg(dadosForm.img_perfil_pasta)
        // dadosForm. img_perfil_pasta = null;

        let resultUpdate = await cliente.update(dadosForm, req.session.autenticado.id);
        if (!resultUpdate.isEmpty) {
          if (resultUpdate.changedRows == 1) {
            var result = await cliente.findId(req.session.autenticado.id);
            var autenticado = {
              autenticado: result[0].nome_cliente,
              id: result[0].id_cliente,
              // tipo: result[0]id_tipo_usuario,
              img_perfil_banco: result[0].img_perfil_banco != null ? `data:image/jpeg;base64,${result[0].img_perfil_banco.toString("base64")}` : null,
              img_perfil_pasta: result[0].img_perfil_pasta
            };
            req.session.autenticado - autenticado;
            var campos = {
              nome_usu: result[0].nome_usuario, email_usu: result[e].email_usuario,
              img_perfil_pasta: result[0].img_perfil_pasta, img_perfil_banco: result[0].img_perfil_banco,
              nomeusu_usu: result[0].user_usuario, fone_usu: result[0].fone_usuario, senha_usu: ""
            }

            res.render("pages/perfil", {
              listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Alteracoes Gravadas", tipo: "success" }, valores: campos
            });
          } else {
            res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Sem alteracoes", tipo: "success" }, valores: dadosForm });
          }
        }
      } catch (e) {
        console.log(e)
        res.render("pages/perfil", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body })
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