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
const storage = require("../util/storage.js")
const uploadEmpresa = storage;
const MainController = require('../controllers/mainController.js');
const crypto = require('crypto');
const dotenv = require("dotenv");
const { MercadoPagoConfig, PreApproval, PreApprovalPlan } = require('mercadopago');
dotenv.config();
const jwt = require("jsonwebtoken");
const { enviarEmail, enviarEmailAtivacao, enviarEmailRecuperarSenha } = require("../util/sendEmail");



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
    res.render('pages/template-hm', { page: 'partial/landing-home/home-page', nomeUsuario });
});


router.get("/servicos-gerais", function (req, res) {
    res.render("pages/template-hm", { pagina: "Servicogerais", page: "../partial/servicosgerais/servicos-gerais" });
});

router.get("/veterinarios", function (req, res) {
    res.render("pages/template-hm", { pagina: "LandingPage", page: "../partial/servicosgerais/veterinarios" });
});

router.get("/historico-cli", function (req, res) {
    res.render("pages/template-hm", { page: "../partial/landing-home/historico-cli.ejs" });
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
        classePagina: 'dashboard',
        nomeempresa: nomeempresa,

    }
    res.render("pages/template-dashboard", jsonResult);
});

router.get("/agendamento", function (req, res) {
    res.render("pages/template-dashboard", { page: "../partial/dashboard/agendamento", classePagina: 'agenda', });
});

router.get("/planos", function (req, res) {
    res.render("pages/template-dashboard", { page: "../partial/dashboard/planos", classePagina: 'planos', });
}); ''

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


router.get('/paginacomercial', MainController.first);
// Postar pagina empresa
router.post('/share', uploadEmpresa.any(), MainController.sharePost)
router.get('/share/:id', MainController.viewPost)

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
const mercadopago = new MercadoPagoConfig({
    accessToken: 'APP_USR-2987350217777313-102619-f933e92e0b23c5666b837599613dfac5-2061285426',
    options: { timeout: 5000, idempotencyKey: 'abc' }
});

router.post("/criarAssinaturaMensal",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-cadastroEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async (req, res) => {
        try {

            const empresa = await usuariosModel.findUsuariosById(req.session.autenticado.id);
            const preApproval = new PreApproval(mercadopago);
            const assinatura = await preApproval.create({
                body: {
                    preapproval_plan_id: '2c938084929566050192c9f9205e1089',
                    payer_email: empresa[0].EMAIL_USUARIOS,
                    back_url: `${process.env.URL_BASE}/feedback-assinatura`,
                    reason: 'Assinatura mensal',
                    status: 'pending'
                }
            });



            if (assinatura && assinatura.body && assinatura.body.init_point) {
                console.log(assinatura.body.init_point)
                res.redirect(assinatura.body.init_point);
            } else {
                throw new Error("Erro ao criar assinatura")
            }
        } catch (error) {
            console.error(error)
            return res.status(500).redirect("/");
        }
    })
router.post("/criarAssinaturaAnual",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-cadastroEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async (req, res) => {
        try {
            const empresa = await usuariosModel.findUsuariosbyId(req.session.autenticado.id);
            const preApproval = new PreApproval(mercadopago);
            const assinatura = await preApproval.create({
                preapproval_plan_id: '2c93808492bf1ff80192c9fae8040330',
                payer_email: empresa[0].EMAIL_USUARIOS,
                back_url: `${process.env.URL_BASE}/feedback-assinatura`,
                reason: 'Assinatura anual',
                status: 'pending'

            });
            if (assinatura && assinatura.body && assinatura.body.init_point) {
                res.redirect(assinatura.body.init_point);
            } else {
                throw new Error("Erro ao criar assinatura")
            }
        } catch (error) {
            console.log(error)
            return res.status(500).redirect("/");
        }
    })
function verificarWebhook(payload, assinaturaRecebida, segredo) {
    const hash = crypto
        .createHmac('sha256', segredo)
        .update(payload)
        .digest('hex');
    return hash === assinaturaRecebida;
}
router.post('/atualizarAssinatura', async (req, res) => {
    const data = req.body
    try {

        if (verificarWebhook(JSON.stringify(data), req.headers['x-webhook-signature'], process.env.ASSINATURA_WEBHOOK_SECRET_TESTE)) {

            if (data.status === 'authorized') {
                await usuariosModel.updateUsuario({ IS_ASSINANTE: true }, user[0].ID_USUARIOS)
                console.log(`Usuário ${user[0].NOME_USUARIOS} teve a assinatura ativada.`)
            } else if (data.status === 'paused') {
                await usuariosModel.updateUsuario({ IS_ASSINANTE: false }, user[0].ID_USUARIOS)
                console.log(`Usuário ${user[0].NOME_USUARIOS} teve a assinatura pausada.`)
            }
            res.status(200).send('Webhook processado com sucesso');
        } else {
            console.log('Assinatura inválida')
            res.status(403).send('Assinatura inválida');
        }

    } catch (error) {
        console.log(error)
        console.log('Erro de comunicação com Mercado Pago')
    }

});


//verifcar e redefinir senha

router.get("/ativar-conta",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-cadastroEmpresa", { page: "../partial/cadastroEmpresa/login", errors: null, valores: "", incorreto: null }, true),
    async function (req, res) {
        usuariosController.ativarConta(req, res);
    }
)

router.get("/esqueceuSenha", function (req, res) {
    let alert = req.session.aviso  ? req.session.aviso  : null;
    if (alert && alert.contagem < 1) {
        req.session.aviso.contagem++;
    } else {
        req.session.aviso  = null;
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


router.post("/solicitarResetSenha", usuariosController.regrasValidacaoRecuperarSenha , async function (req, res) {
 usuariosController.solicitarResetSenha(req,res)
 });

    router.get("/redefinir-senha",
        function (req, res) {
            usuariosController.verificarTokenRedefinirSenha(req, res)
        });

    router.post("/redefinirSenha", usuariosController.regrasValidacaoRedefinirSenha, async function (req, res) {
            usuariosController.redefinirSenha(req,res)
        })


module.exports = router;
