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
    findUsuariosById: async (id) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM USUARIOS WHERE ID_USUARIOS = ?', [id])
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
    },

    findHorariosIdservico : async (id)=>{
        try {
            const [resultados] = await pool.query('SELECT * FROM HORARIOS_SERVICO WHERE ID_SERVICO = ?', [id])
            console.log(resultados)
            return resultados
        } catch (error) {
            return error
        }
    },
    criarHorario : async (dadosHorario)=>{
        try {
            const [resultados] = await pool.query('INSERT INTO HORARIOS_SERVICO SET ?', [dadosHorario])
            console.log("HORARIO CRIADO")
            console.log(resultados)
            return resultados
        } catch (error) {
            console.log("erros do criar o horário")
            return error
        }
    }
}


module.exports = usuariosModel