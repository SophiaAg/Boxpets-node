var express = require("express");
var router = express.Router();
const clienteController = require("../controllers/clientesController.js");
const clienteModel = require("../models/clienteModel.js");
const usuariosController = require("../controllers/usuariosContoller.js");
const usuariosModel = require("../models/usuariosModel.js");
const middleWares = require("../middlewares/auth.js");
const upload = require("../util/uploader.js");
const { validationResult, body, Result } = require("express-validator");
const storage = require("../util/storage.js")
const uploadBanner = upload("./app/public/src/imagens-empresa/banner-empresa", 32, ['jpeg', 'jpg', 'png', 'webp']);;
const uploadimgServico = upload("./app/public/src/imagens-servico/", 16, ['jpeg', 'jpg', 'png', 'webp']);
const uploadLogo = upload("./app/public/src/imagens-empresa/logo-empresa", 16, ['jpeg', 'jpg', 'png', 'webp']);
const MainController = require('../controllers/mainController.js');
const crypto = require('crypto');
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { enviarEmail, enviarEmailAtivacao, enviarEmailRecuperarSenha } = require("../util/sendEmail.js");
var pool = require("../../config/pool-conexao.js");
const agendaModel = require("../models/agendaModel.js");

// DASHBOARD
router.get("/dashboard",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async function (req, res) {
        let alerta;
        const params = new URLSearchParams(req.query);

        if (params.has('success')) {
            try {
                let plano;
                if(params.has('mensal')){
                    plano = 1
                }
                if(params.has('anual')){
                    plano = 2
                }
                const result = await usuariosModel.updateUser({ PLANOS: plano }, req.session.autenticado.id)
                console.log(result)
            } catch (error) {
                console.log(error)
            }
        } else if (params.has('failure') || params.has('pending')) {
            alerta = { msg: "Erro ao efetuar pagamento!Tente novamente ou contate-nos", type: "success" }
        }

        const usuario = await usuariosModel.findUsuariosById(req.session.autenticado.id)
        const user = usuario[0].INFO_GERAIS
            ? { ...usuario[0], INFO_GERAIS: JSON.parse(usuario[0].INFO_GERAIS) }
            : { ...usuario[0], INFO_GERAIS: { horarioInicio: '', horarioFim: '', localizacao: '', whatsapp: '', descricao: '' } }

        const userBd = await usuariosModel.findUsuariosById(req.session.autenticado.id)
        const nomeempresa = userBd[0].NOMEEMPRESA_USUARIO;
        const jsonResult = {
            alert: alerta,
            page: "../partial/dashboard/principal",
            nomeempresa: nomeempresa,
            empresa: user,
            classePagina: 'dashboard'
        }
        res.render("pages/template-dashboard", jsonResult)
    });

// HISTORICO
router.get("/historico",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async function (req, res) {
        // const horariosServico = await usuariosModel.findHorariosIdservico()
        res.render("pages/template-dashboard",
            {
                alert: null,
                page: "../partial/dashboard/historico",
                nomeempresa: 'nomeempresa',
                classePagina: 'historico',
                // horarios:horariosServico
            }
        );

    });

// PLANOS 
router.get("/planos",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async function (req, res) {
        let isAssinante = false
        const userBd = await usuariosModel.findUsuariosById(req.session.autenticado.id)
        if(userBd[0].PLANOS == 1){
            isAssinante = true
        }
        res.render("pages/template-dashboard", { page: "../partial/dashboard/planos", classePagina: 'planos', alert: null, isAssinante:isAssinante });
    });


// Pagina comercial
router.get('/paginacomercial',
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    middleWares.verifyAssinante,
    async (req, res) => {
        try {
            const usuario = await usuariosModel.findUsuariosById(req.session.autenticado.id)
            const user = usuario[0].INFO_GERAIS
                ? { ...usuario[0], INFO_GERAIS: JSON.parse(usuario[0].INFO_GERAIS) }
                : { ...usuario[0], INFO_GERAIS: { horarioInicio: '', horarioFim: '', localizacao: '', whatsapp: '', descricao: '' } }

            const servicosResult = await usuariosModel.findServicosByIdEmpresa(req.session.autenticado.id)
            const servicos = servicosResult.length > 0 ? servicosResult : []
            const jsonResult = {
                page: "../partial/dashboard/criaPg",
                erros: null,
                classePagina: 'paginaComercial',
                empresa: user,
                servico: null,
                servicos: servicos,
                alert: null 
            }
            res.render("./pages/template-dashboard", jsonResult)
        } catch (error) {
            console.log(error)
            // RETORNAR PAGINA ERRO
            res.redirect("/pg-erro")
        }

    }
);

// router.post("/addFoto",
//     (req, res, next) => {
//         req.session.erroMulter = [];
//         next();
//     },
//     middleWares.verifyAutenticado,
//     middleWares.verifyAutorizado("pages/template-loginEmpresa", { form: "../partial/login/entrar", errors: null, valores: "", incorreto: null, foto: undefined }, true),
//     uploadBanner("bannerImg"),
//     function (req, res) {
//         usuariosController.addFoto(req, res)
//     });

router.get('/editar-servico',
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async (req, res) => {
        try {
            const idServico = req.query.idServico
            if (!idServico) {
                console.log("servico nao encontrado")
                return res.redirect("/paginacomercial")
            }
            const servico = await usuariosModel.findServicoById(idServico)
            if (servico[0].ID_USUARIO != req.session.autenticado.id) {
                console.log("Esse servico não pertence a sua empresa!")
                return res.redirect("/paginacomercial")
            }

            const usuario = await usuariosModel.findUsuariosById(req.session.autenticado.id)
            const user = usuario[0].INFO_GERAIS
                ? { ...usuario[0], INFO_GERAIS: JSON.parse(usuario[0].INFO_GERAIS) }
                : { ...usuario[0], INFO_GERAIS: { horarioInicio: '', horarioFim: '', localizacao: '', whatsapp: '', descricao: '' } }

            const servicosResult = await usuariosModel.findServicosByIdEmpresa(req.session.autenticado.id)
            const servicos = servicosResult.length > 0 ? servicosResult : []


            servico[0].PORTES_PERMITIDOS = servico[0].PORTES_PERMITIDOS.split(",")
            console.log(servico[0])
            const jsonResult = {
                page: "../partial/dashboard/criaPg",
                erros: null,
                classePagina: 'paginaComercial',
                empresa: user,
                servico: servico[0],
                servicos: servicos,
                alert: null             }
            res.render("./pages/template-dashboard", jsonResult)
        } catch (error) {
            console.log(error)
            // RETORNAR PAGINA ERRO
            res.redirect("/pg-erro")
        }

    }
);
router.post("/criarServico",
    (req, res, next) => {
        req.session.erroMulter = [];
        next();
    },
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    uploadimgServico("imagemServico"),
    (req, res) => {
        usuariosController.criarServico(req, res)
    }
)
router.post("/deletarServico",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async (req, res) => {
        try {
            const idServico = req.query.idServico
            if (!idServico) {
                console.log("servico nao encontrado")
                return res.redirect("/paginacomercial")
            }
            const servico = await usuariosModel.findServicoById(idServico)
            if (servico[0].ID_USUARIO != req.session.autenticado.id) {
                console.log("Esse servico não pertence a sua empresa!")
                return res.redirect("/paginacomercial")
            }
            const result = await usuariosModel.deleteServico(idServico)
            console.log(result)
            console.log('Servico deletado com sucesso!')
            res.redirect('/paginacomercial')
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }
)
router.post("/editarServico",
    (req, res, next) => {
        req.session.erroMulter = [];
        next();
    },
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    uploadimgServico("imagemServico"),
    (req, res) => {
        usuariosController.attServico(req, res)
    }
)
router.post("/alterarInfosGerais",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    (req, res) => {
        usuariosController.alterarInfoGeral(req, res)
    }
)
router.post("/attLogoEmpresa",
    (req, res, next) => {
        req.session.erroMulter = [];
        next();
    },
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    uploadLogo("imgLogo"),
    (req, res) => {
        usuariosController.attLogo(req, res)
    }
)
router.post("/attBannerEmpresa",
    (req, res, next) => {
        req.session.erroMulter = [];
        next();
    },
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    uploadBanner("imgBanner"),
    (req, res) => {
        usuariosController.attBanner(req, res)
    }
)
// AGENDA
router.get('/agendamento',
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async (req, res) => {
        try {
            const servicosResult = await usuariosModel.findServicosByIdEmpresa(req.session.autenticado.id)
            const servicos = servicosResult.length > 0 ? servicosResult : [];
            const idServico = req.query.idServico
            const servico = idServico ? await usuariosModel.findServicoById(idServico) : null
            console.log(servico)
            if (servico && servico[0].ID_USUARIO != req.session.autenticado.id) {
                console.log("Esse servico não pertence a você")
                return res.redirect("/agendamento")
            }
            const horarios = servico ? await agendaModel.findHorariosByIdServico(idServico) : null
            const jsonResult = {
                page: "../partial/dashboard/agendamento",
                classePagina: 'agenda',
                servico: servico ? servico[0] : null,
                servicos: servicos,
                horarios: horarios,
                alert: null 
            }
            res.render("./pages/template-dashboard", jsonResult)
        } catch (error) {
            console.log(error)
            // RETORNAR PAGINA ERRO
            res.redirect("/pg-erro")
        }

    }
);

router.post("/criarHorario",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async function (req, res) {
        // usuariosController.agendamentoUsuario(req, res)

        let errors = validationResult(req)
        if (!errors.isEmpty()) {

        } else {
            try {
                const idServico = req.query.idServico;
                if (!idServico) {
                    console.log("servico não encontrado")
                    return res.redirect("/agendamento")
                }
                const servico = await usuariosModel.findServicoById(idServico)
                if (servico[0].ID_USUARIO != req.session.autenticado.id) {
                    console.log("Esse servico não pertence a você")
                    res.redirect("/agendamento")
                }

                const { diaSemana, horario } = req.body

                const dadosHorario = {
                    DIA_SEMANA: diaSemana,
                    HORARIO_SERVICO: horario.slice(0, 5),
                    ID_SERVICO: idServico
                }

                const result = await agendaModel.criarHorario(dadosHorario)
                console.log("Horario incluido na agenda")
                console.log(result)
                res.redirect(`/agendamento?idServico=${idServico}`)
            } catch (error) {
                console.log(error)
                return res.status(404).render("pages/error-404");

            }
        }
    });
router.post("/apagarHorario",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async function (req, res) {
        try {
            const { idHorario, idServico } = req.query
            if (!idServico) {
                console.log("servico não encontrado")
                return res.redirect("/agendamento")
            }
            const servico = await usuariosModel.findServicoById(idServico)

            if (servico[0].ID_USUARIO != req.session.autenticado.id) {
                console.log("Esse servico não pertence a você")
                return res.redirect("/agendamento")
            }
            const result = await agendaModel.apagarHorario(idHorario)
            console.log("Horario excluido da agenda")
            console.log(result)
            res.redirect(`/agendamento?idServico=${idServico}`)
        } catch (error) {
            console.log(error)
            return res.status(404).render("pages/error-404");

        }

    });

module.exports = router;
