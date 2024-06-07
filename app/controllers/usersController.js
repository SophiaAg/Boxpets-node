const usuariosModel = require("../models/userModel")
const { body, validationResult } = require("express-validator")
var bcrypt = require("bcryptjs")
var salt = bcrypt.genSaltSync(8)

const usuariosController = {

  // Validação do form de cadastro
  regrasValidacaoCriarConta: [
    body("nome")
      .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 letras!"),
    body("celular")
      .isMobilePhone('pt-BR').withMessage("Número de telefone inválido")
      .bail()
      .custom(async (celular) => {
        const celularExistente = await usuariosModel.findUserByCelular(celular)
        if (celularExistente > 0) {
          throw new Error("Celular já em uso! Tente outro.");
        }
        return true;
      }),
    body('email')
      .isEmail().withMessage('Deve ser um email válido')
      .bail()
      .custom(async (email) => {
        const emailExistente = await usuariosModel.findUserByEmail(email)
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
      res.render("pagina de cadastro novamente com erros")
    } else {
      const { nome, celular, email, password, cep, uf, cidade, bairro, logradouro } = req.body
      dadosUser = {
        NOME_USUARIOs: nome,
        CELULAR_USUARIOS: celular,
        EMAIL_USUARIOS: email,
        SENHA_USUARIOS: bcrypt.hashSync(password, salt),
        CIDADE_USUARIOS: cidade,
        UF_USUARIOS: uf,
        CEP_USUARIOS: cep,
        LOGRADOURO_USUARIOS: logradouro,
        BAIRRO_USUARIOS: bairro,
      }
      try {
        const usuarioCriado = await usuariosModel.createUser(dadosUser);
        res.render("pages/template-hm", {page:"../partial/landing-home/home-page"})
        
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
      res.render("pages/template-login", { page: "../partial/template-login/login", modal: "fechado", erros: errors, incorreto: null });
    } else {

      const { usuario, senha } = req.body
      try {
        const userBd = await usuariosModel.findUserByNickname(usuario)
        if (userBd[0] && bcrypt.compareSync(senha, userBd[0].SENHA_USUARIO) && req.session.autenticado.autenticado) {
          res.render("pages/template-home", { page: "../partial/template-home/inicial-home", classePagina: "inicialHome", tokenAlert: { msg: `Bom te ver de novo`, usuario: `${usuario}!` } })
          console.log("Logado!")
        } else {
          res.render("pages/template-login", { page: "../partial/template-login/login", modal: "fechado", erros: null, incorreto: "ativado" });
        }

      } catch (erros) {
        console.log(erros)
        res.render("pages/error-500")
      }

    }
  },
}

module.exports = usuariosController