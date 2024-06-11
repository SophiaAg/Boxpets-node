var express = require("express");
const usuariosController = require("../controllers/usersController");
var router = express.Router();

router.get("/", function (req, res) {
    res.render("pages/template-lp", { pagina: "LandingPage", page: "../partial/landing-page/lp-inicial" });
});

router.get("/souempresa", function (req, res) {
    res.render("pages/template-lp", { pagina: "LandingPage", page: "../partial/landing-page/souempresa" });
});

router.get("/entrar", function (req, res) {
    res.render("pages/template-login", { form: "../partial/login/entrar", isCadastrar: false });
});
router.get("/cadastrar", function (req, res) {
    res.render("pages/template-login", { form: "../partial/login/cadastrar", isCadastrar: true });
});

router.get("/template-hm", function (req, res) {
    res.render("pages/template-hm", { pagina: "LandingPage", page: "../pages/template-hm" });
});


// Cadastro de usuários
router.post("/cadastrarUsuario", function (req, res) {
    usuariosController.cadastrar(req, res)
})


module.exports = router;
