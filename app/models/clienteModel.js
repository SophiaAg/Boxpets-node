var pool = require("../../config/pool-conexao");

const clienteModel = {
    createCliente: async (dadosCliente) => {
        try {
            const [resultados] = await pool.query("insert into CLIENTE set ?", [dadosCliente])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findClienteByCelular: async (celular) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM CLIENTE WHERE CELULAR_CLIENTE = ?', [celular])
            console.log(resultados)
            return resultados
        } catch (error) {
            return error
        }
    },
    findClienteByEmail: async (email) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM CLIENTE WHERE EMAIL_CLIENTE = ?', [email])
            console.log(resultados)
            return resultados
        } catch (error) {
            return error
        }
    },
    insertCommentForUser: async (id, comment) => {
        try {
            const [resultados] = await pool.query("INSERT INTO MENSAGEM (CONTEUDO_MENSAGEM, FK_ID_CLIENTE) VALUES (?, ?)", [comment, id])
            console.log(resultados)
            return resultados
        } catch (error) {
            return error
        }
    },
    verComentarios: async () => {
        try {
            const [resultados] = await pool.query("SELECT MENSAGEM.* , CLIENTE.* FROM MENSAGEM INNER JOIN CLIENTE ON MENSAGEM.FK_ID_CLIENTE = CLIENTE.ID_CLIENTE ");
            console.log(resultados)
            return resultados
        } catch (error) {
            return error
        }
    },
    // findClienteBy: async (clausulaWhere, valor) => {
    //     try {
    //         const [resultados] = await pool.query('SELECT * FROM USUARIOS WHERE ? ?', [clausulaWhere, valor])
    //         console.log(resultados)
    //         return resultados
    //     } catch (error) {
    //         return error
    //     }
    // },
}


module.exports = clienteModel