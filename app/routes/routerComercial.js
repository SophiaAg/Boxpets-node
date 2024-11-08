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
const uploadBanner = upload("./app/public/src/dashboardImg/", 5, ['jpeg', 'jpg', 'png', 'webp']);;
const MainController = require('../controllers/mainController.js');
const crypto = require('crypto');
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { enviarEmail, enviarEmailAtivacao, enviarEmailRecuperarSenha } = require("../util/sendEmail");
var pool = require("../../config/pool-conexao");



router.get("/criaPg", function (req, res) { 

    res.render("./pages/template-dashboard", { page: "../partial/dashboard/criaPg", avisoErro: null, valores: campos, foto: null })
});


router.post("/addFoto",
    (req, res, next) => {
        req.session.erroMulter = [];
        next();
    },
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: "", incorreto: null, foto: BANNER_IMG }),
    uploadBanner("bannerImg"),
    function (req, res) {
        usuariosController.addFoto(req, res)
    });
