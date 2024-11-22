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

    createPlanos: async (dadosUsuario) => {
        try {
            const [resultados] = await pool.query("insert into PLANOS set ?", [dadosUsuario])
            return resultados
        } catch (error) {
            throw error
        }
    },
    updateUsuario: async (dadosUsuario, id) => {
        try {
            const [resultados] = await pool.query("update USUARIOS set ? where ID_USUARIOS = ?", [dadosUsuario, id])
            return resultados
        } catch (error) {
            throw error
        }
    },
    updateServico: async (dadosServico, id) => {
        try {
            const [resultados] = await pool.query("update SERVICO set ? where ID_SERVICO = ?", [dadosServico, id])
            return resultados
        } catch (error) {
            throw error
        }
    },
    deleteServico: async (id) => {
        try {
            const [resultados] = await pool.query("delete from SERVICO where ID_SERVICO = ?", [id])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findUsuariosByCelular: async (celular) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM USUARIOS WHERE CELULAR_USUARIOS = ?', [celular])
            return resultados
        } catch (error) {
            return error
        }
    },
    findUsuariosByEmail: async (email) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM USUARIOS WHERE EMAIL_USUARIOS = ? AND USUARIOS_STATUS = 'ativo'", [email])
            return resultados
        } catch (error) {
            return error
        }
    },
    findUsuariosById: async (id) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM USUARIOS WHERE ID_USUARIOS = ? AND USUARIOS_STATUS = 'ativo' LIMIT 1", [id])
            return resultados
        } catch (error) {
            return error
        }
    },
    findAllUsuarios: async (id) => {
        try {
            if(id != undefined) {
                const [resultados] = await pool.query("SELECT * FROM USUARIOS WHERE USUARIOS_STATUS = 'ativo' AND ESPECIALIDADES_ID_ESPECIALIDADES = ?", [id])
                return resultados
            }else{
                const [resultados] = await pool.query("SELECT * FROM USUARIOS WHERE USUARIOS_STATUS = 'ativo'")
                return resultados
            }
            
        } catch (error) {
            return error
        }
    },
    findServicosByIdEmpresa: async (id) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM SERVICO WHERE ID_USUARIO = ?", [id])
            return resultados
        } catch (error) {
            return error
        }
    },
    findServicoById: async (id) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM SERVICO WHERE ID_SERVICO = ?", [id])
            return resultados
        } catch (error) {
            return error
        }
    },
    findUsuariosByEmailAtivo: async (email) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM USUARIOS WHERE EMAIL_USUARIOS = ? AND USUARIOS_STATUS = 'ativo' LIMIT 1", [email])
            return resultados
        } catch (error) {
            return error
        }
    },
    findUserByIdInativo: async (id) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM USUARIOS WHERE ID_USUARIOS = ? AND USUARIOS_STATUS = 'inativo' LIMIT 1", [id])
            return resultados

        } catch (error) {
            console.error("Erro ao buscar usuário", error);
            throw error;
        }
    },
    updateUser: async (dadosForm, id) => {
        try {
            const [resultados] = await pool.query("UPDATE USUARIOS SET ? WHERE ID_USUARIOS = ? ", [dadosForm, id])
            return resultados

        } catch (error) {
            console.error("Erro ao atualizar usuário", error);
            throw error;
        }
    },
    findAllEspeci: async () => {
        try {
            const [resultados] = await pool.query('SELECT * FROM ESPECIALIDADES')
            return resultados
        } catch (error) {
            return error
        }
    },
    createServico: async (dadosServico) => {
        try {
            const [resultados] = await pool.query('INSERT INTO SERVICO SET ?', [dadosServico])
            console.log("---- Serviço criado ----")
            return resultados
        } catch (error) {
            console.log("erros ao criar o serviço")
            return error
        }
    },
    findServicosInIds: async (ids) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM SERVICO WHERE ID_SERVICO IN (?) ", [ids]);
            return resultados;
        } catch (error) {
            console.error("Erro ao buscar clientes", error);
            throw error;
        }
    },

}


module.exports = usuariosModel