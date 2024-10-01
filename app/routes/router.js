var express = require("express");
var router = express.Router();
const clienteController = require("../controllers/clientesController");
const clienteModel = require("../models/clienteModel");
const usuariosController = require("../controllers/usuariosContoller");
const usuariosModel = require("../models/usuariosModel");
const middleWares = require("../middlewares/auth");
const upload = require("../util/uploader");
const uploadClientePerfil = upload("./app/public/src/fotos-perfil/", 5, ['jpeg', 'jpg', 'png', 'webp']);


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

router.get("/ ", function (req, res) {
    res.render("pages/template-hm", { pagina: "LandingPage", page: "../pages/template-hm" });
});


router.get("/servicos-gerais", function (req, res) {
    res.render("pages/template-hm", { pagina: "Servicogerais", page: "../partial/servicosgerais/servicos-gerais" });
});

router.get("/veterinarios", function (req, res) {
    res.render("pages/template-hm", { pagina: "LandingPage", page: "../partial/servicosgerais/veterinarios" });
});

router.get("/page-user",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: null, incorreto: false }, false),
    function (req, res) {

        clienteController.mostrarPerfil(req, res);
    });

router.post("/atualizarFoto",
    (req, res, next) => {
        req.session.erroMulter = [];
        next();
    },
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-login", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }),
    uploadClientePerfil("imgPerfil"),
    function (req, res) {
        clienteController.atualizarFoto(req, res)
    });

// btncadastroEmpresa
router.get("/cadastroEmpresa", async function (req, res) {
    try {
        const especialidades = await usuariosModel.findAllEspeci()
        res.render("pages/template-cadastroEmpresa", { page: "../partial/cadastroEmpresa/cadastro", errors: null, valores: "", especialidades: especialidades });
    } catch (error) {
        res.redirect("/")
        // colocar pagina de erro
    }
});

// btnloginEmpresa
router.get("/loginEmpresa", async function (req, res) {
    try {
        res.render("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null });
    } catch (error) {
        res.redirect("/")
        // colocar pagina de erro
    }
});

// Cadastro de EMPRESAS
router.post("/cadastrarEmpresa", usuariosController.regrasValidacaoCriarConta, function (req, res) {
    usuariosController.cadastrarUsuario(req, res)
})

// Login de EMPRESAS
router.post("/logarEmpresa", usuariosController.regrasValidacaoLogarConta, function (req, res) {
    usuariosController.entrarEmpresa(req, res)
})


// Cadastro de CLIENTES
router.post("/cadastrarCliente", clienteController.regrasValidacaoCriarConta, function (req, res) {
    clienteController.cadastrar(req, res)
})
// login de CLIENTES
router.post("/logarCliente", clienteController.regrasValidacaoLogarConta, middleWares.gravarAutenticacaoCliente, function (req, res) {
    clienteController.entrar(req, res)
})



// rota para comentário da empresa?



router.get("/bsEmpresa", async function (req, res) {

    const mensagens = await clienteModel.verComentarios(req, res);

    res.render("pages/template-hm", { pagina: "Comentários", page: "../partial/cliente-empresa/bsEmpresa", comentarios: mensagens })
})

// post para comentar

router.post("/fazerComentario", function (req, res) {
    clienteController.FazerComentario(req, res);
})

router.post("/deletePublication/:id", async function (req, res) {

    const idComentario = req.params.id;

    await clienteModel.excluirComentario(idComentario);

    res.redirect("/bsEmpresa");

});

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
