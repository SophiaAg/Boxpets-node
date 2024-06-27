const clienteModel = require("../models/clienteModel")
const { body, validationResult } = require("express-validator")
var bcrypt = require("bcryptjs")
var salt = bcrypt.genSaltSync(8)
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
       // const usuarioCriado = await clienteModel.createCliente(dadosCliente);
       // req.session.Clienteid = usuarioCriado[0].insertId
        //console.log(usuarioCriado[0])
        const jsonResult = {
          page: "../partial/landing-home/home-page"
        }
    

       req.session.save(() => {
         res.redirect("/template-hm", jsonResult)
      })

      } catch (erros) {
        console.log(erros)
        res.json(errors)
      }

    }
  },
  entrar: async (req, res) => {
    // Aqui verifico se tem erros de validação no formulário, se tiver carrego a pagina de login novamente com erros, 
    //senão busco a partir do um usuário a partir do digitado, e então eu por fim, verifico se o usuario do banco existe
    //e se o hash da senha digitada no form bate com o hash da senha que estava no banco e se a sessão não é null. 
    //Se tudo estiver correto ele renderiza a page home, senão ele manda pra page de login como usuário ou senha incorretos
    
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
        console.log(clienteBd)

        if (clienteBd[0] && bcrypt.compareSync(password, clienteBd[0].SENHA_CLIENTE)
          // && req.session.autenticado.autenticado
        ) {

          const jsonResult = {
            page: "../partial/landing-home/home-page"
          }
          res.redirect ("/template-hm", jsonResult)

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
}

module.exports = clienteController