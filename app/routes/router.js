var express = require("express");
const usuariosController = require("../controllers/usersController");
var router = express.Router();

router.get("/", function (req, res) {
    res.render("pages/template-lp", { pagina: "LandingPage", page: "../partial/landing-page/lp-inicial" });
});

router.get("/souempresa", function (req, res) {
    res.render("pages/template-lp", { pagina: "LandingPage", page: "../partial/landing-page/souempresa" });
});

router.get("/soucliente", function (req, res) {
    res.render("pages/template-lp", { pagina: "LandingPage", page: "../partial/landing-page/soucliente" });
});

// essa
router.get("/cadastrar", function (req, res) {
    res.render("pages/template-login", { form: "../partial/login/cadastrar", errors: null, valores: null, isCadastrar: false });
});


router.get("/entrar", function (req, res) {
    const jsonResult = { 
        form: "../partial/login/entrar", 
        errors: null, 
        valores: null, 
        isCadastrar: false 
    }
    res.render("pages/template-login", jsonResult);
});

router.get("/template-hm", function (req, res) {
    res.render("pages/template-hm", { pagina: "LandingPage", page: "../pages/template-hm" });
});


// Cadastro de usuários
router.post("/cadastrarUsuario", usuariosController.regrasValidacaoCriarConta, function (req, res) {
    usuariosController.cadastrar(req, res)
})

router.get("/cadastrar", function (req, res) {
    console.log("teste")
    res.render("pages/teste.ejs")
    // res.render("pages/template-login", );
});

module.exports = router;
