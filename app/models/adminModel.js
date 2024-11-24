var pool = require("../../config/pool-conexao");
const { findAllUsuarios } = require("./usuariosModel");

const adminModel = {
    findAdminByEmail: async (email) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM ADMIN WHERE EMAIL_ADMIN = ?", [email])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findAdminById: async (id) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM ADMIN WHERE ID_ADMIN = ?", [id])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findAllClientes: async () => {
        try {
            const [resultados] = await pool.query("SELECT * FROM CLIENTE LIMIT 1000")
            return resultados
        } catch (error) {
            throw error
            
        }
    },
    findAllUsuarios: async () => {
        try {
            const [resultados] = await pool.query("SELECT * FROM USUARIOS LIMIT 1000")
            return resultados
        } catch (error) {
            throw error
            
        }
    },
    findAllServicos: async () => {
        try {
            const [resultados] = await pool.query("SELECT * FROM SERVICO LIMIT 1000")
            return resultados
        } catch (error) {
            throw error
            
        }
    },
}

module.exports = adminModel