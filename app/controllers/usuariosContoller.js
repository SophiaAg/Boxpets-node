const usuariosModel = require("../models/usuariosModel")
const { body, validationResult } = require("express-validator")
var bcrypt = require("bcryptjs")
var salt = bcrypt.genSaltSync(8)
const moment = require("moment")
const { invalid } = require("moment/moment")


const usuariosController = {

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

    body("nomeempresa")
      .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 letras!")
      .isAlpha().withMessage("Deve conter apenas letras!"),

    body("celular")
      .isMobilePhone('pt-BR').withMessage("Número de telefone inválido")
      .bail()
      .custom(async (celular) => {
        const celularExistente = await usuariosModel.findUsuariosByCelular(celular)
        if (celularExistente.length > 0) {
          throw new Error("Celular já em uso! Tente outro.");
        }
        return true;
      }),
    body('email')
      .isEmail().withMessage('Deve ser um email válido')
      .bail()
      .custom(async (email) => {
        const emailExistente = await usuariosModel.findUsuariosByEmail(email)
        if (emailExistente.length > 0) {
          throw new Error("E-mail já em uso! Tente outro");
        }
        return true;
      }),
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
    }),

    body("cnpj").custom(cnpj => {
      cnpj = cnpj.replace(/[^\d]+/g, '');

      // Verifica se o CNPJ tem 14 dígitos
      if (cnpj.length !== 14) return false;

      // Elimina CNPJs que são sequências repetidas (11111111111111, 22222222222222, etc.)
      if (/^(\d)\1+$/.test(cnpj)) return false;

      // Validação do primeiro dígito verificador
      let tamanho = cnpj.length - 2;
      let numeros = cnpj.substring(0, tamanho);
      let digitos = cnpj.substring(tamanho);
      let soma = 0;
      let pos = tamanho - 7;

      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }

      let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

      if (resultado !== parseInt(digitos.charAt(0))) return false;

      // Validação do segundo dígito verificador
      tamanho = tamanho + 1;
      numeros = cnpj.substring(0, tamanho);
      soma = 0;
      pos = tamanho - 7;

      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }

      resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

      if (resultado !== parseInt(digitos.charAt(1))) return false; {
        throw new Error("CNPJ já em uso! Tente outro.");
      }

      return true;

    }).withMessage("CNPJ invalido"),

    body("cep").custom(cep => {
      cep = cep.replace(/[^\d]+/g, '');

      // Verifica se o CEP tem 8 dígitos
      if (cep.length !== 8) return false;

      // Verifica se todos os caracteres são números
      const regex = /^[0-9]{8}$/;

      return regex.test(cep);

    }).withMessage('CEP inválido'),

    body("logradouro").custom(logradouro => {
      if (logradouro.trim().length < 2) return false;

      // Verifica se contém apenas letras, números e espaços
      const regex = /^[A-Za-zÀ-ú0-9\s]+$/;
      return regex.test(logradouro);
    }) .withMessage('logradouro inválido') ,


    body("uf").custom(uf => {
      const ufsValidas = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

      // Converte para maiúsculas e verifica se está na lista de UFs válidas
      return ufsValidas.includes(uf.toUpperCase());
    }).withMessage('UFinválido'),

    body("bairro").custom(bairro => {
      if (bairro.trim().length < 2) return false;

      // Verifica se contém apenas letras, números e espaços
      const regex = /^[A-Za-zÀ-ú0-9\s]+$/;
      return regex.test(bairro);
    }).withMessage('Bairro inválido'),

    body("razaosocial").custom(razaosocial => {
      if (razaosocial.trim().length < 2) return false;

      // Permite letras, números, espaços e alguns caracteres especiais comuns
      const regex = /^[A-Za-zÀ-ú0-9\s\.,\-]+$/;
      return regex.test(razaoSocial);
    }).withMessage('Razão Social inválido'),

    body("cidade").custom(cidade => {
      if (cidade.trim().length < 2) return false;

      // Verifica se contém apenas letras, espaços e acentos
      const regex = /^[A-Za-zÀ-ú\s]+$/;
      return regex.test(cidade);
    }).withMessage('Cidade inválido'),
  ],

//função de cadastrar
  cadastrarUsuario: async (req, res) => {

    let error = validationResult(req)

    if (!error.isEmpty()) {
      console.log(error)
      const especialidades = await usuariosModel.findAllEspeci()

      const jsonResult = {
        errors: error, 
        valores: req.body, 
        especialidades:especialidades,
        page: "../partial/cadastroEmpresa/cadastro"
      }
      res.render("pages/template-cadastroEmpresa", jsonResult);
    } else {
      const { nome, cpf, cnpj, email, celular, password, razaosocial, especialidades, nomeempresa, cep, uf, logradouro, cidade, bairro } = req.body
      dadosUsuario = {
        NOME_USUARIOS: nome,
        SENHA_USUARIOS: bcrypt.hashSync(password, salt),
        CELULAR_USUARIOS: celular,
        CIDADE_USUARIOS: cidade,
        UF_USUARIOS: uf,
        CEP_USUARIOS: cep,
        LOGRADOURO_USUARIOS: logradouro,
        BAIRRO_USUARIOS: bairro,
        CNPJ_USUARIO: cnpj,
        CPF_USUARIO: cpf,
        NOMEEMPRESA_USUARIO: nomeempresa,
        RAZAOSOCIAL_USUARIO: razaosocial,
      }
      try {
        const usuarioCriado = await usuariosModel.createUsuario(dadosUsuario);
        req.session.Usuarioid = usuarioCriado.insertId
        const jsonResult = {
          page: "../partial/landing-home/home-page"
        }


        req.session.save(() => {
          res.render("pages/template-hm", jsonResult)
        })

      } catch (erros) {
        console.log(erros)
        res.json(error)
      }

    }
  },





  entrar: async (req, res) => {
    // Aqui verifico se tem erros de validação no formulário, se tiver carrego a pagina de login novamente com erros, 
    //senão busco a partir do um usuário a partir do digitado, e então eu por fim, verifico se o usuario do banco existe
    //e se o hash da senha digitada no form bate com o hash da senha que estava no banco e se a sessão não é null. 
    //Se tudo estiver correto ele renderiza a page home, senão ele manda pra page de login como usuário ou senha incorretos

    let error = validationResult(req)

    if (!error.isEmpty()) {
      console.log(error)
      const jsonResult = {
        form: "../partial/login/entrar",
        error: error,
        valores: req.body,
        incorreto: false
      }
      res.render("pages/template-login", jsonResult);
    } else {

      const { email, password } = req.body
      try {
        const clienteBd = await usuariosModel.findClienteByEmail(email)

        if (clienteBd[0] && bcrypt.compareSync(password, clienteBd[0].SENHA_CLIENTE)
          // && req.session.autenticado.autenticado
        ) {

          req.session.Clienteid = clienteBd[0].ID_CLIENTE
          const jsonResult = {
            page: "../partial/landing-home/home-page"
          }
          res.render("pages/template-hm", jsonResult)

        } else {
          const jsonResult = {
            form: "../partial/login/entrar",
            error: null,
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

    await usuariosModel.insertCommentForUser(id, comment)

    res.redirect("/bsEmpresa");

  }
}

module.exports = usuariosController