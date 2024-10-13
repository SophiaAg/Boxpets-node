const usuariosModel = require("../models/usuariosModel")
const { body, validationResult } = require("express-validator")
var bcrypt = require("bcryptjs")
const clienteModel = require("../models/clienteModel")
var salt = bcrypt.genSaltSync(8)

const middleWares = {

    // Verifica se existe o item autenticado na variavel de sessão, se existir ela cria uma variavel e guarda o seu valor, ja se não, ela cria um objeto com os itens autenticado e id como null. dps disso define a propria variavel de sessão como a variavel criada e passa para o proximo middleWare
    verifyAutenticado: (req, res, next) => {
        if (req.session.autenticado) {
            var aut = req.session.autenticado

        } else {
            var aut = {
                autenticado: null, id: null, foto: "imgUser.png" 
            }

        }
        req.session.autenticado = aut
        next();
    },
    // Destroi a variavel de sessão
    clearSession: (req, res, next) => {
        req.session.destroy();
        next()
    },
    // verifica se o item 'autenticado' da variavel de sessão 'autenticado' é diferente de null, se for ele passa pro proximo middleWare, senao ele realiza um res.render para a pagina passada como destinoFalha
    verifyAutorizado: (destinoFalha, objetoResRender = null, isForEmpresa) => {
        return async (req, res, next) => {
            if (req.session.autenticado.autenticado != null) {
                if (isForEmpresa) {
                    const empresaBd = await usuariosModel.findUsuariosById(req.session.autenticado.id)
                    if (empresaBd[0]) {
                       return next();
                    } else {
                        res.redirect("/")
                    }
                }
                next();
            } else {
                res.render(destinoFalha, objetoResRender)
            }
        };
    },
    // ele verifica se tem erros nos inputs da pagina, se tiver ele retorna o objeto como null, senao ele prossegue, buscando um usuario que tenha o nome digitado no formulario no campo name='usuario'. Caso tiver apenas 1 usuário, ele compara o hash da senha do input name="senha" com o hash da senha do banco de dados, caso for diferente de 1, ele retorna também tudo como null
    gravarAutenticacaoEmpresa: async (req, res, next) => {
        let errors = validationResult(req)
        if (errors.isEmpty()) {

            var usuariosBd = await usuariosModel.findUsuariosByEmail(req.body.email)

            if (usuariosBd[0]) {
                console.log(req.body.senha)
                console.log(usuariosBd[0])
                if (Object.keys(usuariosBd).length == 1) {
                    if (bcrypt.compareSync(req.body.senha, usuariosBd[0].SENHA_USUARIOS)) {
                        var aut = {
                            autenticado: usuariosBd[0].EMAIL_USUARIOS, id: usuariosBd[0].ID_USUARIOS, foto: usuariosBd[0].img_perfil_pasta   
                        }
                    } else {
                        var aut = {
                            autenticado: null, id: null , foto: "imgUser.png" 
                        }
                    }
                } else {
                    var aut = {
                        autenticado: null, id: null , foto: "imgUser.png"
                    }
                }

            }



        } else {
            var aut = {
                autenticado: null, id: null , foto: "imgUser.png" 
            }
        }
        req.session.autenticado = aut
        next();
    },
    gravarAutenticacaoCliente: async (req, res, next) => {
        let errors = validationResult(req)
        if (errors.isEmpty()) {


            var clienteBd = await clienteModel.findClienteByEmail(req.body.email)

            if (clienteBd[0]) {
                console.log(req.body.password)
                console.log(clienteBd[0])
                if (Object.keys(clienteBd).length == 1) {
                    if (bcrypt.compareSync(req.body.password, clienteBd[0].SENHA_CLIENTE)) {
                        var aut = {
                            autenticado: clienteBd[0].EMAIL_CLIENTE, id: clienteBd[0].ID_CLIENTE , foto: clienteBd[0].img_perfil_pasta   
                        }
                    } else {
                        var aut = {
                            autenticado: null, id: null , foto: "imgUser.png" 
                        }

                    }
                } else {
                    var aut = {
                        autenticado: null, id: null , foto: "imgUser.png" 
                    }
                }
            }


        } else {
            var aut = {
                autenticado: null, id: null , foto: "imgUser.png" 
            }
        }
        req.session.autenticado = aut
        next();
    },
}

module.exports = middleWares