var express = require("express");
var router = express.Router();
const clienteController = require("../controllers/clientesController");
const clienteModel = require("../models/clienteModel");
const usuariosController = require("../controllers/usuariosContoller");
const usuariosModel = require("../models/usuariosModel");
const middleWares = require("../middlewares/auth");
const upload = require("../util/uploader");
const { validationResult, body } = require("express-validator");
const uploadClientePerfil = upload("./app/public/src/fotos-perfil/", 5, ['jpeg', 'jpg', 'png', 'webp']);
const uploadPet = upload("./app/public/src/fotos-pet/", 5, ['jpeg', 'jpg', 'png', 'webp']);
const storage = require("../util/storage.js")
const uploadEmpresa = storage;
const MainController = require('../controllers/mainController.js');
const crypto = require('crypto');
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { enviarEmail, enviarEmailAtivacao, enviarEmailRecuperarSenha } = require("../util/sendEmail");
var pool = require("../../config/pool-conexao");




router.get("/", function (req, res) {
    res.render("pages/template-lp", { pagina: "LandingPage", page: "../partial/landing-page/lp-inicial" });
});



router.get("/pg-erro", function (req, res) {
    res.render("pages/template-lp", { page: "../partial/pg-erro" });
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

router.get("/", function (req, res) {
    res.render('pages/template-hm', { page: '..partial/landing-home/home-page', nomeUsuario, dadosNotificacao: { type: "success", title: "Conta criada com sucesso!", msg: "Verifique sua caixa de email para ativar sua conta." } });
});

// Cadastro de CLIENTES
router.post("/cadastrarCliente", clienteController.regrasValidacaoCriarConta, function (req, res) {
    clienteController.cadastrar(req, res)
})
// login de CLIENTES
router.post("/logarCliente", clienteController.regrasValidacaoLogarConta, middleWares.gravarAutenticacaoCliente, function (req, res) {
    clienteController.entrar(req, res)
})

router.get("/servicos-gerais", function (req, res) {
    res.render("pages/template-hm", { pagina: "Servicogerais", page: "../partial/servicosgerais/servicos-gerais" });
});

router.get("/veterinarios", function (req, res) {
    res.render("pages/template-hm", { pagina: "LandingPage", page: "../partial/servicosgerais/veterinarios" });
});

router.get("/historico-cli", function (req, res) {
    res.render("pages/template-hm", { page: "../partial/landing-home/historico-cli.ejs" });
});

router.get("/VizucriaPg", function (req, res) {
  
    const empresa =  usuariosModel.findUsuariosById(req.session.autenticado)

        res.render("pages/template-hm", { page: "../partial/cliente-empresa/VizucriaPg.ejs",  empresa: empresa,});
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

//EMPRESA ------------------------------

router.get("/dashboard",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async function (req, res) {

        const params = new URLSearchParams(req.query);

        if (params.has('success')) {
            middleWares.verifyAutenticado,
                middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: "", incorreto: null })

            if (req.session.autenticado !== undefined) {
                // Lógica para quando a ação foi bem-sucedida
                const id = req.session.autenticado.id


            }
        } else if (params.has('failure') || params.has('pending')) {
            req.flash('error', `Erro em efetuar o pagamento. Não foram somados os tokens a sua conta.`)
        }

        // res.status(200).render("layouts/main.ejs", { router: "../pages/store/points.ejs", user: account[0][0], notifications: notifications[0], challenges: challenges[0], challengesForUser: challengesForUser[0][0], tokens: tokens[0], title: "Collectverse - Loja" });

        const userBd = await usuariosModel.findUsuariosById(req.session.autenticado.id)
        const nomeempresa = userBd[0].NOMEEMPRESA_USUARIO;
        const jsonResult = {
            page: "../partial/dashboard/principal",
            nomeempresa: nomeempresa,
            classePagina: 'dashboard'
        }
        res.render("pages/template-dashboard", jsonResult)
    });
// AGENDA
router.get("/agendamento",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async function (req, res) {
        // const horariosServico = await usuariosModel.findHorariosIdservico()
        res.render("pages/template-dashboard",
            {
                page: "../partial/dashboard/agendamento",
                nomeempresa: 'nomeempresa',
                classePagina: 'agenda',
                // horarios:horariosServico
            }
        );

    });

router.post("/criarHorario",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async function (req, res) {
        // usuariosController.agendamentoUsuario(req, res)

        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(404).render("pages/error-404");
        } else {
            try {
                const idServico = req.query.idServico;
                if (!idServico) {
                    console.log("Id de servico não encontrado")
                    return res.status(404).render("pages/error-404");
                }

                const { diaSemana, horario } = req.body

                const dadosHorario = {
                    DIA_SEMANA: diaSemana,
                    HORARIO_SERVICO: horario,
                    ID_SERVICO: idServico
                }

                const result = await usuariosModel.criarHorario(dadosHorario)
                console.log(result)
                res.redirect(`/editAgenda?idServico="${idServico}`)
            } catch (error) {
                console.log(error)
                return res.status(404).render("pages/error-404");

            }
        }
    });

router.get("/planos",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    function (req, res) {
        res.render("pages/template-dashboard", { page: "../partial/dashboard/planos", classePagina: 'planos', nomeempresa: 'nomeempresa' });
    });



router.get("/criaPg",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    function (req, res) {
        res.render("pages/template-dashboard", { page: "../partial/dashboard/criaPg", classePagina: 'teste', nomeempresa: 'nomeempresa' });
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
        let alert = req.session.aviso ? req.session.aviso : null;
        if (alert && alert.contagem < 1) {
            req.session.aviso.contagem++;
        } else {
            req.session.aviso = null;
        }

        res.render("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: alert });
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


// Postar pagina empresa
router.post('/share', uploadEmpresa.any(), MainController.sharePost)
router.get('/share/:id', MainController.viewPost)
router.get('/share/edit/:id', MainController.edit)
router.post('/share/edit', uploadEmpresa.any(), MainController.makeEdit)

// rota para comentário da empresa?

router.get("/buySer", async function (req, res) {

    res.render("pages/template-hm", { page: "../partial/cliente-empresa/buySer" })
})

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
// const mercadopago = new MercadoPagoConfig({
//     accessToken: 'APP_USR-2987350217777313-102619-f933e92e0b23c5666b837599613dfac5-2061285426',
//     options: { timeout: 5000, idempotencyKey: 'abc' }
// });

router.get("/ativar-conta",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-loginEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async function (req, res) {
        usuariosController.ativarConta(req, res);
    }
)

router.get("/esqueceuSenha", function (req, res) {
    let alert = req.session.aviso ? req.session.aviso : null;
    if (alert && alert.contagem < 1) {
        req.session.aviso.contagem++;
    } else {
        req.session.aviso = null;
    }
    const jsonResult = {
        page: "../partial/cadastroEmpresa/esqueceuSenha",
        modal: "fechado",
        erros: null,
        token: alert,
        modalAberto: false
    }
    res.render("pages/template-loginEmpresa", jsonResult);
});


router.post("/solicitarResetSenha", usuariosController.regrasValidacaoRecuperarSenha, async function (req, res) {
    usuariosController.solicitarResetSenha(req, res)
});

router.get("/redefinir-senha",
    function (req, res) {
        usuariosController.verificarTokenRedefinirSenha(req, res)
    });

router.post("/redefinirSenha", usuariosController.regrasValidacaoRedefinirSenha, async function (req, res) {
    usuariosController.redefinirSenha(req, res)
});


//cliente

router.get("/ativar-conta-cli",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-login", { page: "../partial/login/login", errors: null, valores: "", incorreto: null }, true),
    async function (req, res) {
        clienteController.ativarConta(req, res);
    });

router.get("/esqueceuSenha-cli", function (req, res) {
    let alert = req.session.aviso ? req.session.aviso : null;
    if (alert && alert.contagem < 1) {
        req.session.aviso.contagem++;
    } else {
        req.session.aviso = null;
    }
    const jsonResult = {
        page: "../partial/login/esqueceuSenha",
        modal: "fechado",
        erros: null,
        token: alert,
        modalAberto: false
    }
    res.render("pages/template-login", jsonResult);
});


router.post("/solicitarResetSenha-cli", clienteController.regrasValidacaoRecuperarSenha, async function (req, res) {
    clienteController.solicitarResetSenha(req, res)
});

router.get("/redefinir-senha-cli",
    function (req, res) {
        clienteController.verificarTokenRedefinirSenha(req, res)
    });

router.post("/redefinirSenha-cli", clienteController.regrasValidacaoRedefinirSenha, async function (req, res) {
    clienteController.redefinirSenha(req, res)
})


// router.post("/agendamento", usuariosController.regrasValidacaoAgendamento, async function (req, res){
//         usuariosController.agendamentoUsuario(req, res)
//     })

//mercadoPago
const { MercadoPagoConfig, Preference } = require('mercadopago');

const usuario = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    options: { timeout: 5000, idempotencyKey: 'abc' }
});
const preference = new Preference(usuario);

router.post("/PagarAssinatura", async function (req, res) {
    const id = req.body.id

    const baseUrl = req.protocol + '://' + req.get('host');

    let body = undefined;
    if (id == 1) { // seria id do anual
        body = {
            items: [
                {
                    id: id,
                    title: "Pagamento do anual",
                    description: "Plano anual para empresa da BoxPets",
                    quantity: 1,
                    currency_id: 'BRL',
                    unit_price: 345.6
                },
            ],
            back_urls: {
                success: `${baseUrl}/dashboard?success`,
                failure: `${baseUrl} /store/points ? failure`,
                pending: `${baseUrl} /store/points ? failure`,
            },
            auto_return: 'all'
        }
    } else if (id == 2) { // pacote mensal 
        body = {
            items: [
                {
                    id: id,
                    title: "Pagamento do mensal",
                    description: "Plano mensal para empresa da BoxPets",
                    quantity: 1,
                    currency_id: 'BRL',
                    unit_price: 32
                },
            ],
            back_urls: {
                success: `${baseUrl}/dashboard?success`,
                failure: `${baseUrl} /store/points ? failure`,
                pending: `${baseUrl} /store/points ? failure`,
            },
            auto_return: 'all'
        }
    }

    preference.create({ body })
        .then(response => {
            const initPoint = response.init_point;
            res.status(200).redirect(initPoint)
        })
        .catch(error => {
            console.log(error)
            req.flash("error", errorMessages.INTERNAL_ERROR);
            return res.status(500).redirect(`/store/points`)
        });



})


// ROTA DE AGENDAR HORARIO

router.get("/detalhes-servico", async (req, res) => {
    const idServico = req.query.idServico
    if (!idServico) {
        return
    }
    const horariosDisponiveis = await usuariosModel.findHorariosIdservico(idServico)
})

module.exports = router;
