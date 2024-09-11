var pool = require("../../config/pool-conexao");

const usuariosModel = {
    createUsuario: async (dadosUsuario) => {
        try {
            const [resultados] = await pool.query("insert into USUARIO set ?", [dadosUsuario])
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
    findAllEspeci: async ()=>{
        try {
            const [resultados] = await pool.query('SELECT * FROM ESPECIALIDADES')
            return resultados
        } catch (error) {
            return error
        }
    }
}


module.exports = usuariosModel