var express = require("express");
var router = express.Router();
const clienteController = require("../controllers/clientesController");
const clienteModel = require("../models/clienteModel");
const usuariosController = require("../controllers/usuariosContoller");
const usuariosModel = require("../models/usuariosModel");
const middleWares = require("../middlewares/auth");
const upload = require("../util/uploader");
const { validationResult, body } = require("express-validator");
const storage = require("../util/storage.js")
const uploadBanner = upload("./app/public/src/imagens-empresa/banner-empresa", 32, ['jpeg', 'jpg', 'png', 'webp']);;
const uploadimgServico = upload("./app/public/src/imagens-servico/", 16, ['jpeg', 'jpg', 'png', 'webp']);
const uploadLogo = upload("./app/public/src/imagens-empresa/logo-empresa", 16, ['jpeg', 'jpg', 'png', 'webp']);
const MainController = require('../controllers/mainController.js');
const crypto = require('crypto');
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { enviarEmail, enviarEmailAtivacao, enviarEmailRecuperarSenha } = require("../util/sendEmail");
var pool = require("../../config/pool-conexao");

router.get('/paginacomercial',
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
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
                servicos: servicos
            }
            res.render("./pages/template-dashboard", jsonResult)
        } catch (error) {
            console.log(error)
            // RETORNAR PAGINA ERRO
            res.redirect("/pg-erro")
        }

    }
);

router.get('/editar-servico',
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async (req, res) => {
        try {
            const usuario = await usuariosModel.findUsuariosById(req.session.autenticado.id)
            const user = usuario[0].INFO_GERAIS
                ? { ...usuario[0], INFO_GERAIS: JSON.parse(usuario[0].INFO_GERAIS) }
                : { ...usuario[0], INFO_GERAIS: { horarioInicio: '', horarioFim: '', localizacao: '', whatsapp: '', descricao: '' } }

            const servicosResult = await usuariosModel.findServicosByIdEmpresa(req.session.autenticado.id)
            const servicos = servicosResult.length > 0 ? servicosResult : []

            const idServico = req.query.idServico
            if(!idServico){
                console.log("servico nao encontrado")
                return res.redirect("/paginacomercial")
            }
            const servico = await usuariosModel.findServicoById(idServico)
            const jsonResult = {
                page: "../partial/dashboard/criaPg",
                erros: null,
                classePagina: 'paginaComercial',
                empresa: user,
                servico: servico[0],
                servicos: servicos
            }
            res.render("./pages/template-dashboard", jsonResult)
        } catch (error) {
            console.log(error)
            // RETORNAR PAGINA ERRO
            res.redirect("/pg-erro")
        }

    }
);


router.post("/addFoto",
    (req, res, next) => {
        req.session.erroMulter = [];
        next();
    },
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: "", incorreto: null, foto: undefined }),
    uploadBanner("bannerImg"),
    function (req, res) {
        usuariosController.addFoto(req, res)
    });




router.post("/criarServico",
    (req, res, next) => {
        req.session.erroMulter = [];
        next();
    },
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: "", incorreto: null, foto: null }),
    uploadimgServico("imagemServico"),
    (req, res) => {
        usuariosController.criarServico(req, res)
    }
)
router.post("/criarServico",
    (req, res, next) => {
        req.session.erroMulter = [];
        next();
    },
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: "", incorreto: null, foto: null }),
    uploadimgServico("imagemServico"),
    (req, res) => {
        usuariosController.attServico(req, res)
    }
)
router.post("/alterarInfosGerais",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: "", incorreto: null, foto: null }),
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
    middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: "", incorreto: null, foto: null }),
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
    middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: "", incorreto: null, foto: null }),
    uploadBanner("imgBanner"),
    (req, res) => {
        usuariosController.attBanner(req, res)
    }
)
module.exports = router;
