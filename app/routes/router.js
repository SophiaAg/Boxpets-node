var express = require("express");
var router = express.Router();
const clienteController = require("../controllers/clientesController");
const clienteModel = require("../models/clienteModel");
const usuariosController = require("../controllers/usuariosContoller");
const usuariosModel = require("../models/usuariosModel");
const middleWares = require("../middlewares/auth");
const upload = require("../util/uploader");
const { validationResult, body, param } = require("express-validator");
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
    let alert = undefined
    if (req.session.alert && req.session.alert.count == 0) {
        alert = req.session.alert
        req.session.alert.count++
    }
    const jsonResult = {
        form: "../partial/login/entrar",
        errors: null,
        valores: null,
        incorreto: false,
        dadosNotificacao: alert
    }
    res.render("pages/template-login", jsonResult);
});

router.get("/home",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado(
        "pages/template-login",
        { form: "../partial/login/entrar", errors: null, valores: null, incorreto: false },
        false
    ),
    async function (req, res) {

        let alert = undefined
        if (req.session.alert && req.session.alert.count == 0) {
            alert = req.session.alert
            req.session.alert.count++
        }
        const clienteBd = await clienteModel.findClienteById(req.session.autenticado.id)
        res.render('pages/template-hm', { page: '../partial/landing-home/home-page', dadosNotificacao: alert, nome: clienteBd[0].NOME_CLIENTE });
    });

// Cadastro de CLIENTES
router.post("/cadastrarCliente", clienteController.regrasValidacaoCriarConta, function (req, res) {
    clienteController.cadastrar(req, res)
})
// login de CLIENTES
router.post("/logarCliente", clienteController.regrasValidacaoLogarConta, middleWares.gravarAutenticacaoCliente, function (req, res) {
    clienteController.entrar(req, res)
})

router.get("/servicos-gerais",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado(
        "pages/template-login",
        { form: "../partial/login/entrar", errors: null, valores: null, incorreto: false },
        false
    ),
    async function (req, res) {
        const params = req.query.id;
        console.log(params)
        const usuario = await usuariosModel.findAllUsuarios(params)
        let user = [];
        usuario.forEach((element, index) => {
            let infoGeralParsed = {};

            try {
                infoGeralParsed = JSON.parse(element.INFO_GERAIS);
            } catch (e) {
                infoGeralParsed = {
                    horarioInicio: '',
                    horarioFim: '',
                    localizacao: '',
                    whatsapp: '',
                    descricao: ''
                };
            }

            let moment = {
                ...element,
                INFO_GERAIS: infoGeralParsed
            };
            user.push(moment);
        });
        res.render("pages/template-hm", { pagina: "Servicogerais", page: "../partial/servicosgerais/servicos-gerais", empresas: user });
    });

router.get("/veterinarios",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado(
        "pages/template-login",
        { form: "../partial/login/entrar", errors: null, valores: null, incorreto: false },
        false
    ),
    async function (req, res) {
        const params = req.query.id;
        console.log(params)
        const usuario = await usuariosModel.findAllUsuarios(params)
        let user = [];
        usuario.forEach((element, index) => {
            let infoGeralParsed = {};

            try {
                infoGeralParsed = JSON.parse(element.INFO_GERAIS);
            } catch (e) {
                infoGeralParsed = {
                    horarioInicio: '',
                    horarioFim: '',
                    localizacao: '',
                    whatsapp: '',
                    descricao: ''
                };
            }

            let moment = {
                ...element,
                INFO_GERAIS: infoGeralParsed
            };
            user.push(moment);
        });
        res.render("pages/template-hm", { pagina: "LandingPage", page: "../partial/servicosgerais/veterinarios", empresas: user });
    });

router.get("/historico-cli", function (req, res) {
    res.render("pages/template-hm", { page: "../partial/landing-home/historico-cli.ejs" });
});


router.get("/VizucriaPg", async function (req, res) {
    const idEmpresa = req.query.id;
    console.log(idEmpresa)
    const usuario = await usuariosModel.findUsuariosById(idEmpresa)

    const user = usuario[0].INFO_GERAIS
        ? { ...usuario[0], INFO_GERAIS: JSON.parse(usuario[0].INFO_GERAIS) }
        : { ...usuario[0], INFO_GERAIS: { horarioInicio: '', horarioFim: '', localizacao: '', whatsapp: '', descricao: '' } }

    const servicosResult = await usuariosModel.findServicosByIdEmpresa(idEmpresa)
    const servicos = servicosResult.length > 0 ? servicosResult : []

    res.render("pages/template-hm", {
        pagina: "LandingPage",
        page: "../partial/cliente-empresa/VizucriaPg",
        empresa: user,
        servicos:servicos

    });
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

router.get("/buySer",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado(
        "pages/template-login",
        { form: "../partial/login/entrar", errors: null, valores: null, incorreto: false },
        false
    ),
    async function (req, res) {
    // Deve chamar um servico a partir do id passado na query
    // ex: <a href="/buySer?idServico=<%= variavelResRender.ColunaDoBanco %>">
    // Você irá verificar primeiramente se esse idServico existe, senao vc ira redirecionar para uma pagina de erro ou apenas a home, porque n tem como renderizar a pagina de servico, sem saber qual servico
    const idServico = req.query.idServico
    if (!idServico) {
        console.log("Servico nao encontrado")
        return res.redirect("/home")
    }
    const servico = await usuariosModel.findServicoById(idServico)
    if (servico.length == 0) {
        console.log("Servico não encontrado")
        return res.redirect("/home")
    }
    servico[0].PORTES_PERMITIDOS = servico[0].PORTES_PERMITIDOS.split(",")
    res.render("pages/template-hm", {
        page: "../partial/cliente-empresa/buySer",
        servico: servico[0],
        openModal: false,
        dataSelecionada: null,
        erroData: null,
        horarios: null
    })
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
        form: "../partial/login/esqueceuSenha",
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


//mercadoPago
router.get("/nao-permitido", function (req, res) {
    res.render("pages/template-dashboard", { page: "../partial/nao-permitido", classePagina: '', alert: '' });
});

const { MercadoPagoConfig, Preference } = require('mercadopago');
const agendaModel = require("../models/agendaModel.js");

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
                success: `${baseUrl}/dashboard?success&mensal`,
                failure: `${baseUrl} /dashboard?failure`,
                pending: `${baseUrl} /dashboard?failure`,
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
                success: `${baseUrl}/dashboard?success&anual`,
                failure: `${baseUrl} /dashboard?failure`,
                pending: `${baseUrl} /dashboard?failure`,
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

router.post("/findHorariosByData", async (req, res) => {
    const { data } = req.body
    const idServico = req.query.idServico
    try {
        console.log(data)
        if (!idServico) {
            console.log("Servico nao encontrado")
            return res.redirect("/home")
        }
        const servico = await usuariosModel.findServicoById(idServico)
        if (servico.length == 0) {
            console.log("Servico não encontrado")
            return res.redirect("/home")
        }
        servico[0].PORTES_PERMITIDOS = servico[0].PORTES_PERMITIDOS.split(",")
        const dataSelect = new Date(data);
        dataSelect.setUTCHours(0, 0, 0, 0);
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        if (dataSelect < today) {
            return res.render("pages/template-hm", {
                page: "../partial/cliente-empresa/buySer",
                servico: servico[0],
                openModal: true,
                dataSelecionada: data,
                erroData: { msg: "Data anterior ao dia de hoje!" },
                horarios: null
            });
        }

        const dayOfWeek = dataSelect.getUTCDay();
        const horarios = await agendaModel.findHrByDay(idServico, dayOfWeek)
        if (!horarios || horarios.length == 0) {
            return res.render("pages/template-hm", {
                page: "../partial/cliente-empresa/buySer",
                servico: servico[0],
                openModal: true,
                erroData: { msg: "Nenhuma agenda nesse dia!" },
                horarios: null,
                dataSelecionada: data


            })
        }
        const agendamentos = await agendaModel.findAgendaServicoByData(idServico, data)
        const horariosAgendados = agendamentos.map(agendamento => agendamento.HORARIO_AGENDAMENTO)
        console.log(agendamentos)
        console.log(horariosAgendados)
        // const currentTime = new Date().getHours() + ":" + new Date().getMinutes()

        const horariosDisponiveis = horarios.filter(horario => {
            const [hora, minuto] = horario.HORARIO_SERVICO.slice(0, 5).split(":").map(Number)
            console.log(horario)
            const isAgendado = horariosAgendados.includes(horario.HORARIO_SERVICO)
            const isPast = dataSelect.getTime() === today.getTime() && (hora < new Date().getHours() || (hora === new Date().getHours() && minuto <= new Date().getMinutes()));
            return !isAgendado && !isPast
        })

        res.render("pages/template-hm", {
            page: "../partial/cliente-empresa/buySer",
            servico: servico[0],
            openModal: true,
            erroData: null,
            horarios: horariosDisponiveis,
            dataSelecionada: data
        })

    } catch (error) {
        console.log(error)
        res.redirect(`/buySer?idServico=${idServico}`)
    }
})
router.post("/agendarHorario",
    middleWares.verifyAutenticado,
    middleWares.verifyAutorizado("pages/template-login", { form: "../partial/login/entrar", errors: null, valores: null, incorreto: false }, false),
    async (req, res) => {
        const { dataAgenda, horarioAgenda } = req.body
        const idServico = req.query.idServico
        try {
            if (!idServico) {
                console.log("Servico nao encontrado")
                return res.redirect("/home")
            }
            const servico = await usuariosModel.findServicoById(idServico)
            if (servico.length == 0) {
                console.log("Servico não encontrado")
                return res.redirect("/home")
            }
            const horario = await agendaModel.findHorariosByIdHorario(horarioAgenda)
            if (!horario[0]) {
                console.log("Horário não encontrado")
                return res.redirect(`/buySer?idServico=${idServico}`)

            }
            servico[0].PORTES_PERMITIDOS = servico[0].PORTES_PERMITIDOS.split(",")
            const dadosAgendamento = {
                ID_CLIENTE: req.session.autenticado.id,
                ID_SERVICO: idServico,
                ID_HORARIO_SERVICO: horario[0].ID_HORARIO_SERVICO,
                DATA_AGENDAMENTO: dataAgenda,
                ID_STATUS: 1,
                HORARIO_AGENDAMENTO: horario[0].HORARIO_SERVICO,
                ID_USUARIO: servico[0].ID_USUARIO,
            }
            const resultInsert = await agendaModel.agendarHorario(dadosAgendamento)
            console.log(resultInsert)
            res.redirect(`/buySer?idServico=${idServico}`)
        } catch (error) {
            console.log(error)
            res.redirect("/pg-erro")
        }

    })



module.exports = router;
