var pool = require("../../config/pool-conexao");

const usuariosModel = {
    createUsuario: async (dadosUsuario) => {
        try {
            const [resultados] = await pool.query("insert into USUARIOS set ?", [dadosUsuario])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findUsuariosByCelular: async (celular) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM USUARIOS WHERE CELULAR_USUARIOS = ?', [celular])
            console.log(resultados)
            return resultados
        } catch (error) {
            return error
        }
    },
    findUsuariosByEmail: async (email) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM USUARIOS WHERE EMAIL_USUARIOS = ?', [email])
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