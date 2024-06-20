var pool = require("../../config/pool-conexao");

const userModel = {
    createUser: async (dadosUser) => {
        try {
            const [resultados] = await pool.query("insert into CLIENTE set ?", [dadosUser])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findUserByCelular: async (celular) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM CLIENTE WHERE CELULAR_USUARIOS = ?', [celular])
            console.log(resultados)
            return resultados
        } catch (error) {
            return error
        }
    },
    findUserByEmail: async (email) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM CLIENTE WHERE EMAIL_USUARIOS = ?', [email])
            console.log(resultados)
            return resultados
        } catch (error) {
            return error
        }
    },
    // findUserBy: async (clausulaWhere, valor) => {
    //     try {
    //         const [resultados] = await pool.query('SELECT * FROM USUARIOS WHERE ? ?', [clausulaWhere, valor])
    //         console.log(resultados)
    //         return resultados
    //     } catch (error) {
    //         return error
    //     }
    // },
}


module.exports = userModel