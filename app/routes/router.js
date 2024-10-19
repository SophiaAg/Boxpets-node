var express = require("express");
var router = express.Router();
const clienteController = require("../controllers/clientesController");
const clienteModel = require("../models/clienteModel");
const usuariosController = require("../controllers/usuariosContoller");
const usuariosModel = require("../models/usuariosModel");
const middleWares = require("../middlewares/auth");
const upload = require("../util/uploader");
const { validationResult } = require("express-validator");
const uploadClientePerfil = upload("./app/public/src/fotos-perfil/", 5, ['jpeg', 'jpg', 'png', 'webp']);
const uploadPet = upload("./app/public/src/fotos-pet/", 5, ['jpeg', 'jpg', 'png', 'webp']);


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

router.get("/carterinha-pet", function (req, res) {
    clienteController.mostrarPet(req, res);
});

router.post("/criarCarterinhaPet",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: null, incorreto: false }, false),
    clienteController.regrasValidacaoPet,
    uploadPet("imgPet"),
    function (req, res) {
        clienteController.cadastrarPet(req, res);
    });


router.get("/page-user",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: null, incorreto: false }, false),
    function (req, res) {

        clienteController.mostrarPerfil(req, res);
    });

router.post("/info-atualizar",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: null, incorreto: false }, false),
    clienteController.regrasValidacaoPerfil,
    function (req, res) {
        clienteController.gravarPerfil(req, res);
    });


router.post("/atualizarFoto",
    (req, res, next) => {
        req.session.erroMulter = [];
        next();
    },
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: "", incorreto: null }),
    uploadClientePerfil("imgPerfil"),
    function (req, res) {
        clienteController.atualizarFoto(req, res)
    });

router.post("/excluirFoto",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: "", incorreto: null }),
    function (req, res) {
        clienteController.excluirFoto(req, res)
    });


    router.get("/dashboard", function (req, res) {
        const jsonResult = {
            page: "../partial/dashboard/principal",
            errors: null,
            valores: null,
        }
        res.render("pages/template-dashboard", jsonResult);
    });

// Cadastro de CLIENTES
router.post("/cadastrarCliente", clienteController.regrasValidacaoCriarConta, function (req, res) {
    clienteController.cadastrar(req, res)
})
// login de CLIENTES
router.post("/logarCliente", clienteController.regrasValidacaoLogarConta, middleWares.gravarAutenticacaoCliente, function (req, res) {
    clienteController.entrar(req, res)
})


//EMPRESAAA

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
router.post("/logarEmpresa", usuariosController.regrasValidacaoLogarConta, middleWares.gravarAutenticacaoEmpresa, function (req, res) {
    usuariosController.entrarEmpresa(req, res)
})

router.get("/editAgenda",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-cadastroEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async function (req, res) {
        const idServico = req.query.idServico;
        const horarios = await usuariosModel.findHorariosIdservico(idServico);
        const dia = req.query.dia
        

        if (!idServico) {
            return res.status(404).render("pages/error-404");
        }

        res.render("pages/editAgenda", {
            idServico: idServico,
            horarios: horarios,
            dia: dia,
            erros: null,
            notify: null
        });
    }
);

router.post("/criarHorario",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-cadastroEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async function (req, res) {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {

        } else {
            try {
                const idServico = req.query.idServico;
                if (!idServico) {
                    console.log("Id de servico não encontrado")
                    return res.status(404).render("pages/error-404");
                }
                
                const { dataHorario, horario, descr } = req.body
                const date = new Date(dataHorario);
                const formattedDate = date.toISOString().split('T')[0];
                const dadosHorario = {
                    DATA_HORARIO: formattedDate,
                    DESCRICAO_HORARIO: descr,
                    HORARIO_SERVICO: horario,
                    ID_SERVICO: idServico
                }

                const result = await usuariosModel.criarHorario(dadosHorario)
                
                res.redirect(`/editAgenda?idServico="${idServico}`)
            } catch (error) {
                console.log(error)
                return res.status(404).render("pages/error-404");

            }

        }
    }
);


router.get("/paginaEmpresa", async function (req, res){
    const query = `
    SELECT share.*, enterprise.name AS enterprise
    FROM share
    INNER JOIN enterprise ON share.onwer = enterprise.id;
    `

    const [sharePosts] = await connection.query(query);

    res.status(200).render("layouts/main.ejs", { router: "../partial/home.ejs", sharePosts : sharePosts });
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
