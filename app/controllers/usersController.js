const userModel = require("../models/userModel")
const { body, validationResult } = require("express-validator")
var bcrypt = require("bcryptjs")
var salt = bcrypt.genSaltSync(8)

const usuariosController = {

  // Validação do form de cadastro
  regrasValidacaoCriarConta: [
    body("nome")
      .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 letras!"),
    body("cidade")
      .isLength({ min: 3, max: 45 }).withMessage("Cidade deve ter de 3 a 45 letras!"),
    body("bairro")
      .isLength({ min: 3, max: 45 }).withMessage("Bairro deve ter de 3 a 45 letras!"),
    body("logradouro")
      .isLength({ min: 3, max: 45 }).withMessage("Logradouro deve ter de 3 a 45 letras!"),
    body("cep")
      .matches(/^\d{5}-?\d{3}$/).withMessage('O CEP deve estar no formato 12345678 ou 12345-678'),
    body("celular")
      .isMobilePhone('pt-BR').withMessage("Número de telefone inválido")
      .bail()
      .custom(async (celular) => {
        const celularExistente = await userModel.findUserByCelular(celular)
        if (celularExistente.length > 0) {
          throw new Error("Celular já em uso! Tente outro.");
        }
        return true;
      }),
    body('email')
      .isEmail().withMessage('Deve ser um email válido')
      .bail()
      .custom(async (email) => {
        const emailExistente = await userModel.findUserByEmail(email)
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
      res.render("pages/template-login", {isCadastrar: false});
    } else {
      const { nome, celular, email, password, cep, uf, cidade, bairro, logradouro } = req.body
      dadosUser = {
        NOME_CLIENTE: nome,
        CELULAR_CLIENTE: celular,
        EMAIL_CLIENTE: email,
        SENHA_CLIENTE: bcrypt.hashSync(password, salt),
        CIDADE_CLIENTE: cidade,
        UF_CLIENTE: uf,
        CEP_CLIENTE: cep,
        LOGRADOURO_CLIENTE: logradouro,
        BAIRRO_CLIENTE: bairro,
      }
      try {
        const usuarioCriado = await userModel.createUser(dadosUser);
        console.log(usuarioCriado)
        const jsonResult = {
          page: "../partial/landing-home/home-page"
        }
        res.render("pages/template-hm", jsonResult)

      } catch (erros) {
        console.log(erros)
        res.json(errors)
      }

    }
  },
  entrar: async (req, res) => {
    // Aqui verifico se tem erros de validação no formulário, se tiver carrego a pagina de login novamente com erros, senão busco a partir do um usuário a partir do digitado, e então eu por fim, verifico se o usuario do banco existe e se o hash da senha digitada no form bate com o hash da senha que estava no banco e se a sessão não é null. Se tudo estiver correto ele renderiza a page home, senão ele manda pra page de login como usuário ou senha incorretos
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
      console.log(errors)
      res.render("pages/template-login", { page: "../partial/template-login/login", modal: "fechado", erros: errors, incorreto: null, isCadastrar: true });
    } else {

      const { usuario, senha } = req.body
      try {
        const userBd = await userModel.findUserByNickname(usuario)
        if (userBd[0] && bcrypt.compareSync(senha, userBd[0].SENHA_USUARIO) && req.session.autenticado.autenticado) {
          res.render("pages/template-home", { page: "../partial/template-home/inicial-home", classePagina: "inicialHome", tokenAlert: { msg: `Bom te ver de novo`, usuario: `${usuario}!` } })
          console.log("Logado!")
        } else {
          res.render("pages/template-login", { page: "../partial/template-login/login", modal: "fechado", erros: null, incorreto: "ativado", isCadastrar: true });
        }

      } catch (erros) {
        console.log(erros)
        res.render("pages/error-500")
      }

    }
  },
}

module.exports = usuariosController