const usuariosModel = require("../models/usuariosModel")
const { body, validationResult } = require("express-validator")
var bcrypt = require("bcryptjs")
var salt = bcrypt.genSaltSync(8)
const moment = require("moment")
const { invalid } = require("moment/moment")
const jwt = require("jsonwebtoken")
const { enviarEmail, enviarEmailAtivacao, enviarEmailRecuperarSenha } = require("../util/sendEmail")


const usuariosController = {

  // Validação do form de cadastro
  regrasValidacaoLogarConta: [
    body('email')
      .isEmail().withMessage('Deve ser um email válido')
      .bail()
    ,
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
  ],
  regrasValidacaoCriarConta: [
    body("nome")
      .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 letras!")
      .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage("Deve conter apenas letras!"),

    body("nomeempresa")
      .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 letras!")
      .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage("Deve conter apenas letras!"),

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
      .isLength({ min: 3 }).withMessage('Digite o email')
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

      // Elimina CNPJs que são sequências repetidas
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

      if (resultado !== parseInt(digitos.charAt(1))) return false;

      // Se chegar aqui, o CNPJ é válido
      return true;

    }).withMessage("CNPJ inválido"),


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
    }).withMessage('logradouro inválido'),


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

    body("razaosocial").isLength({ min: 3, max: 45 }).withMessage("Razão Social inválido"),


    body("cidade").custom(cidade => {
      if (cidade.trim().length < 2) return false;

      // Verifica se contém apenas letras, espaços e acentos
      const regex = /^[A-Za-zÀ-ú\s]+$/;
      return regex.test(cidade);
    }).withMessage('Cidade inválido'),
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


  //função de cadastrar
  cadastrarUsuario: async (req, res) => {

    let error = validationResult(req)

    if (!error.isEmpty()) {
      console.log(error)
      const especialidades = await usuariosModel.findAllEspeci()

      const jsonResult = {
        errors: error,
        valores: req.body,
        especialidades: especialidades,
        page: "../partial/cadastroEmpresa/cadastro"
      }
      res.render("pages/template-cadastroEmpresa", jsonResult);
    } else {
      const { nome, cpf, cnpj, email, celular, senha, razaosocial, especialidades, nomeempresa, cep, uf, logradouro, cidade, bairro } = req.body
      const dadosUsuario = {
        NOME_USUARIOS: nome,
        SENHA_USUARIOS: bcrypt.hashSync(senha, salt),
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
        EMAIL_USUARIOS: email,
        ESPECIALIDADES_ID_ESPECIALIDADES: especialidades,
      }
      try {
        const usuarioCriado = await usuariosModel.createUsuario(dadosUsuario);
        console.log(usuarioCriado)
        const token = jwt.sign(
          {
            userId: usuarioCriado.insertId
          },
          process.env.SECRET_KEY
        )



        enviarEmailAtivacao(
          dadosUsuario.EMAIL_USUARIOS,
          "Cadastro realizado na BoxPets",
          process.env.URL_BASE,
          token,
          async () => {
            const userBd = await usuariosModel.findUserByIdInativo(usuarioCriado.insertId);
            console.log(`------ Usuário ${userBd[0].NOME_USUARIOS} cadastrado! ------`)
            console.log(userBd[0])
            console.log(`------ Verificação enviada para ${userBd[0].EMAIL_USUARIOS} ------`)
            console.log(userBd[0])
            res.redirect("/loginEmpresa")
          })

        // const jsonResult = {
        //   page: "../partial/dashboard/principal",
        //   nomeempresa: nomeempresa, // Aqui é onde passamos o nome da empresa
        //   classePagina: 'dashboard'
        // }
        // res.render("pages/template-dashboard", jsonResult)



      } catch (errors) {
        console.log(errors)
        res.render("./partial/pg-erro")

      }

    }
  },
  entrarEmpresa: async (req, res) => {


    let error = validationResult(req)

    if (!error.isEmpty()) {
      console.log(error)
      const jsonResult = {
        page: "../partial/cadastroEmpresa/login",
        errors: error,
        valores: req.body,
        incorreto: false,
      }
      res.render("pages/template-loginEmpresa", jsonResult);

    } else {

      const { email, senha } = req.body
      try {
        const userBd = await usuariosModel.findUsuariosByEmail(email)
        if (userBd[0] && bcrypt.compareSync(senha, userBd[0].SENHA_USUARIOS)) {
          req.session.autenticado = {
            autenticado: userBd[0].EMAIL_USUARIOS,
            id: userBd[0].ID_USUARIOS
          }
          return res.redirect("/dashboard")

        } else {
          const jsonResult = {
            page: "../partial/cadastroEmpresa/login",
            errors: null,
            valores: req.body,
            incorreto: true
          }
          res.render("pages/template-loginEmpresa", jsonResult);
        }

      } catch (errors) {
        console.log(errors)
        res.render("./partial/pg-erro")
      }

    }
  },
  ativarConta: async (req, res) => {
    try {
      const token = req.query.token
      console.log(token)
      jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        console.log(decoded)
        if (err) {
          console.log("Token inválido ou expirado")
        } else {
          const userBd = await usuariosModel.findUserByIdInativo(decoded.userId)
          console.log(userBd[0])
          if (!userBd[0]) {
            return console.log("Usuário não encontrado")
          }
          const resultadoAtivarConta = await usuariosModel.updateUser({ USUARIOS_STATUS: 'ativo' }, decoded.userId);
          console.log(resultadoAtivarConta)
          console.log("Conta ativada!")
          res.redirect("/loginEmpresa")
        }
      })
    } catch (error) {
      console.log(error)
      res.render("./partial/pg-erro")
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
          res.redirect("/esqueceuSenha")
        } else {
          const jsonResult = {
            page: "../partial/cadastroEmpresa/esqueceuSenha",
            erros: null,
            idUser: decoded.userId,
            modalAberto: true
          }
          res.render("./pages/template-loginEmpresa", jsonResult)
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
        page: "../partial/cadastroEmpresa/esqueceuSenha",
        modal: "fechado",
        errors: error,
        modalAberto: false
      }
      res.render("pages/template-loginEmpresa", jsonResult);
    } else {
      try {
        const { email } = req.body
        const user = await usuariosModel.findUsuariosByEmail(email)

        const token = jwt.sign(
          {
            userId: user[0].ID_USUARIOS,
            expiresIn: "40m"
          },
          process.env.SECRET_KEY
        )

        enviarEmailRecuperarSenha(
          user[0].EMAIL_USUARIOS,
          "Recuperar de senha",
          process.env.URL_BASE,
          token,
          async () => {
            req.session.aviso = { msg: "E-mail enviado com sucesso", type: "success", contagem: 0 }
            res.redirect("/esqueceuSenha")
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
        page: "../partial/cadastroEmpresa/esqueceuSenha",
        token: null,
        errors: error,
        idUser: idUser,
        modalAberto: true
      }
      res.render("./pages/template-loginEmpresa", jsonResult)
    } else {
      try {
        const { senha } = req.body
        let hashSenha = bcrypt.hashSync(senha, salt);
        var resultado = await usuariosModel.updateUser({ SENHA_USUARIOS: hashSenha }, idUser)
        console.log("-------- senha redefinida -----------")
        console.log(resultado)
        req.session.aviso = { msg: "Senha redefinida com sucesso!", type: "success", contagem: 0 }
        res.redirect("/loginEmpresa")
      } catch (error) {
        console.log(error)
        res.render("./partial/pg-erro")
      }
    }
  },

  //   agendamentoUsuario: async (req, res) => {
  // console.log(res)
  //     let error = validationResult(req)


  //     if (!error.isEmpty()) {
  //       console.log(error)

  //       const jsonResult = {
  //         errors: error,
  //         valores: req.body,
  //         page: "../partial/dashboard/agendamento"
  //       }
  //       res.render("pages/template-dashboard", jsonResult);

  //     } else {
  //       const { cliente, servicocliente, horariocliente, diacliente, statuscliente, horarioAgendacliente, usercliente } = req.body
  //       const dadosUsuario = {

  //         ID_CLIENTE: cliente,
  //         ID_SERVICO: servicocliente,
  //         ID_HORARIO_SERVICO: horariocliente,
  //         DIA_SEMANA: diacliente,
  //         ID_STATUS: statuscliente,
  //         HORARIO_AGENDA: horarioAgendacliente,
  //         ID_USUARIO: 
  //       }
  //       try {
  //         const agendaCriado = await usuariosModel.createAgendamento(dadosUsuario);
  //         console.log(agendaCriado)



  //  const jsonResult = {
  //    page: "../partial/dashboard/agendamento",
  //    classePagina: 'agendamento'
  //  }
  //  res.render("pages/template-dashboard", jsonResult)



  //       } catch (errors) {
  //         console.log(errors)
  //         res.render("./partial/pg-erro")

  //       }

  //     }
  //   },





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

  },
  //pagina comercial
  addFoto: async (req, res) => {
    let errosMulter = req.session.erroMulter

    if (errosMulter.length > 0) {
      let listaErros = { formatter: null, errors: [] };

      if (errosMulter.length > 0) {
        listaErros.errors.push(...errosMulter)
        if (req.file) removeImg(`./app/public/src/fotos-perfil/${req.file.filename}`)
      }
      console.log("-------erro-de-validação-foto--------")
      console.log(listaErros)

      res.render("./pages/template-hm", { page: "../partial/dashboard/criaPg", avisoErro: null, valores: campos, foto: results[0].img_perfil_pasta })

    } else {
      try {
        var caminhoFoto = req.session.autenticado.foto
        if (caminhoFoto != req.file.filename && caminhoFoto != "bannerImg.png") {
          removeImg(`./app/public/src/fotos-perfil/${caminhoFoto}`)

          res.render("./pages/template-hm", { page: "../partial/dashboard/criaPg", avisoErro: null, valores: campos, foto: results[0].img_perfil_pasta })
        }
        caminhoFoto = req.file.filename
        let resultado = await usuariosModel.updateUsuario({ img_perfil_pasta: caminhoFoto }, req.session.autenticado.id)
        let results = await usuariosModel.findUsuariosById(req.session.autenticado.id);
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

        res.render("./pages/template-hm", { page: "../partial/dashboard/criaPg", avisoErro: null, valores: campos, foto: results[0].img_perfil_pasta })

      } catch (errors) {
        console.log(errors)
        res.render("pages/error-500")

      }
    }

  },
  criarServico: async (req, res) => {
    let errors = validationResult(req)
    let errosMulter = req.session.erroMulter

    if (!errors.isEmpty || errosMulter.length > 0) {

    } else {
      try {
        const { nomeServico, descricaoServico, precoServico, portePequeno, porteMedio, porteGrande } = req.body
        if (!req.file) {
          console.log("Não foi possivel baixar imagem")
          // renderizar pagina de erro
          return res.redirect("/dashboard")
        }
        
        const dadosServico = {
          NOME_SERVICO: nomeServico,
          DESCRICAO_SERVICO: descricaoServico,
          ID_USUARIO: req.session.autenticado.id,
          CAMINHO_IMAGEM_SERVICO: req.file.filename,
          PRECO_SERVICO: precoServico,
          PORTES_PERMITIDOS:[],
        }
      } catch (error) {
        console.log(error)
        // renderizar pagina de erro
        res.redirect("/dashboard")
      }
    }
  }
}
module.exports = usuariosController