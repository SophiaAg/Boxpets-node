var pool = require("../../config/pool-conexao");
userModel = {
    createUser: async (dadosUser) => {
        try {
            const [resultados] = await pool.query("insert into USUARIOS set ?", [dadosUser])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findUserByCelular: async (celular) => {
        try {
            const [resultados] = await pool.query("SELECT count(*) FROM USUARIOS WHERE CELULAR_USUARIOS = ?", [celular])
            return resultados
        } catch (error) {
            throw error
        }
    }
}


module.exports = userModel