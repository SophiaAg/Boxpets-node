var express = require("express");
var router = express.Router();
const clienteModel = require("../models/clienteModel.js");
const usuariosModel = require("../models/usuariosModel.js");
const agendaModel = require("../models/agendaModel.js");
const middleWares = require("../middlewares/auth.js");
const upload = require("../util/uploader.js");
const { validationResult, body, Result } = require("express-validator");
const crypto = require('crypto');
const dotenv = require("dotenv");
const adminModel = require("../models/adminModel.js");
dotenv.config();

router.get("/login-admin", (req, res) => {
    let alert = undefined
    if (req.session.alert && req.session.alert.count == 0) {
        alert = req.session.alert
        req.session.alert.count++
    }
    const jsonResult = {
        alert: alert,
        errors: null,
        valores: "",
        incorreto: false
    }
    res.render("pages/loginAdmin", jsonResult)
})
router.post("/loginAdmin",
    middleWares.gravarAutenticacaoAdmin,
    async function (req, res) {
        let errors = validationResult(req)

        if (!errors.isEmpty()) {
            console.log(errors)
            const jsonResult = {
                alert: null,
                errors: errors,
                valores: req.body,
                incorreto: false
            }
            res.render("pages/loginAdmin", jsonResult)
        } else {

            const { email, senha } = req.body
            try {
                const adminBd = await adminModel.findAdminByEmail(email)
                if (adminBd[0] && senha == adminBd[0].SENHA_ADMIN) {

                    req.session.autenticado = {
                        autenticado: adminBd[0].EMAIL_ADMIN,
                        id: adminBd[0].ID_ADMIN
                    }
                    req.session.alert = {
                        type: "success",
                        title: "Login concluido!",
                        msg: "login feito com sucesso",
                        count: 0
                    }
                    res.redirect("/adm-clientes")

                } else {
                    const jsonResult = {
                        alert: null,
                        errors: null,
                        valores: req.body,
                        incorreto: true
                    }
                    res.render("pages/loginAdmin", jsonResult)
                }

            } catch (erros) {
                console.log(erros)
                res.render("pg-erro")
            }

        }
    })
// EMPRESAS
router.get("/adm-empresas",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/loginAdmin",
        {
            alert: null,
            errors: null,
            valores: "",
            incorreto: false
        },
        "admin"
    ),
    async function (req, res) {

        let alert = undefined
        if (req.session.alert && req.session.alert.count == 0) {
            alert = req.session.alert
            req.session.alert.count++
        }
        const usuarios = await adminModel.findAllUsuarios()
        const jsonResult = {
            alert: alert,
            page: "../partial/adm/adm-empresas",
            classePagina: "empresas",
            usuarios: usuarios
        }
        res.render("pages/template-admin", jsonResult)

    });
router.post("/ativarUsuario",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/loginAdmin",
        {
            alert: null,
            errors: null,
            valores: "",
            incorreto: false
        },
        "admin"
    ),
    async function (req, res) {
        const idUsuario = req.query.idUsuario
        if (!idUsuario) {
            req.session.alert = {
                type: "danger",
                title: "Erro ao encontrar empresa",
                msg: "Não foi possivel encontrar o empresa",
                count: 0
            }
            return res.redirect("/adm-empresas")
        }
        await usuariosModel.updateUser({ USUARIOS_STATUS: "ativo" }, idUsuario)
        req.session.alert = {
            type: "success",
            title: "Empresa ativado!",
            msg: "O empresa foi ativado e poderá acessar o site",
            count: 0
        }
        res.redirect("/adm-empresas")
    })
router.post("/inativarUsuario",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/loginAdmin",
        {
            alert: null,
            errors: null,
            valores: "",
            incorreto: false
        },
        "admin"
    ),
    async function (req, res) {
        const idUsuario = req.query.idUsuario
        if (!idUsuario) {
            req.session.alert = {
                type: "danger",
                title: "Erro ao encontrar empresa",
                msg: "Não foi possivel encontrar o empresa",
                count: 0
            }
            return res.redirect("/adm-empresas")
        }
        await usuariosModel.updateUser({ USUARIOS_STATUS: "inativo" }, idUsuario)
        req.session.alert = {
            type: "success",
            title: "Empresa ativado!",
            msg: "O empresa foi inativada e não poderá acessar o site",
            count: 0
        }
        res.redirect("/adm-empresas")
    })

// CLIENTES
router.get("/adm-clientes",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/loginAdmin",
        {
            alert: null,
            errors: null,
            valores: "",
            incorreto: false
        },
        "admin"
    ),
    async function (req, res) {

        let alert = undefined
        if (req.session.alert && req.session.alert.count == 0) {
            alert = req.session.alert
            req.session.alert.count++
        }
        const clientes = await adminModel.findAllClientes()
        const jsonResult = {
            alert: alert,
            page: "../partial/adm/adm-clientes",
            classePagina: "clientes",
            clientes: clientes
        }
        res.render("pages/template-admin", jsonResult)

    });
router.post("/ativarCliente",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/loginAdmin",
        {
            alert: null,
            errors: null,
            valores: "",
            incorreto: false
        },
        "admin"
    ),
    async function (req, res) {
        const idCliente = req.query.idCliente
        if (!idCliente) {
            req.session.alert = {
                type: "danger",
                title: "Erro ao encontrar cliente",
                msg: "Não foi possivel encontrar o cliente",
                count: 0
            }
            res.redirect("/adm-clientes")
        }
        await clienteModel.updateUser({ STATUS_CLIENTE: "ativo" }, idCliente)
        req.session.alert = {
            type: "success",
            title: "Cliente ativado!",
            msg: "O cliente foi ativado e poderá acessar o site",
            count: 0
        }
        res.redirect("/adm-clientes")
    })
router.post("/inativarCliente",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/loginAdmin",
        {
            alert: null,
            errors: null,
            valores: "",
            incorreto: false
        },
        "admin"
    ),
    async function (req, res) {
        const idCliente = req.query.idCliente
        if (!idCliente) {
            req.session.alert = {
                type: "danger",
                title: "Erro ao encontrar cliente",
                msg: "Não foi possivel encontrar o cliente",
                count: 0
            }
            res.redirect("/adm-clientes")
        }
        await clienteModel.updateUser({ STATUS_CLIENTE: "inativo" }, idCliente)
        req.session.alert = {
            type: "success",
            title: "Cliente inativado!",
            msg: "O cliente foi inativado e não acessará mais o site",
            count: 0
        }
        res.redirect("/adm-clientes")
    })



module.exports = router;
