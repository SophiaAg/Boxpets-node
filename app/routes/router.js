var express = require("express");
const clienteController = require("../controllers/clientesController");
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
    const jsonResult = {
        form: "../partial/login/cadastrar",
        errors: null,
        valores: null,
    }
    res.render("pages/template-login", jsonResult);
});


router.get("/entrar", function (req, res) {
    const jsonResult = {
        form: "../partial/login/entrar",
        errors: null,
        valores: null,
        incorreto: false
    }
    res.render("pages/template-login", jsonResult);
});

router.get("/template-hm", function (req, res) {
    res.render("pages/template-hm", { pagina: "LandingPage", page: "../pages/template-hm" });
});


router.get("/servicos-gerais", function (req, res) {
    res.render("pages/template-hm", { pagina: "Servicogerais", page: "../partial/servicosgerais/servicos-gerais" });
});

router.get("/veterinarios", function (req, res) {
    res.render("pages/template-hm", { pagina: "LandingPage", page: "../partial/servicos-gerais/veterinarios" });
});

// Cadastro de CLIENTES
router.post("/cadastrarCliente", clienteController.regrasValidacaoCriarConta, function (req, res) {
    clienteController.cadastrar(req, res)
})
// login de CLIENTES
router.post("/logarCliente", clienteController.regrasValidacaoLogarConta, function (req, res) {
    clienteController.entrar(req, res)
})

// rota para comentário da empresa?

const clienteModel = require("../models/clienteModel")

router.get("/bsEmpresa", async function(req, res) {

    const mensagens = await clienteModel.verComentarios(req, res);

    res.render("pages/template-hm", { pagina: "Comentários", mensagens: mensagens ,page: "../partial/cliente-empresa/bsEmpresa.ejs" })
})

// post para comentar

router.post("/fazerComentario", function(req, res) {
    clienteController.FazerComentario(req, res);
})

// deslogar, tira a sessão

router.get("/sair", function (req, res) {
    try {
        req.session.destroy(() => {
            res.status(200).redirect("/");
        });
    } catch (error) {
        console.log(error)
        return res.status(500).redirect("/");
    }
})

module.exports = router;
