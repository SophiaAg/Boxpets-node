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
    createPet: async (dadosPet) => {
        try {
            const [resultados] = await pool.query("insert into CARTERINHA_PET set ?", [dadosPet])
            return resultados
        } catch (error) {
            throw error
        }
    },

    findClienteByCelular: async (celular) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM CLIENTE WHERE CELULAR_CLIENTE = ?', [celular])
            return resultados
        } catch (error) {
            return error
        }
    },
    findClienteByEmail: async (email) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM CLIENTE WHERE EMAIL_CLIENTE = ? AND STATUS_CLIENTE = 'ativo' ", [email])
            return resultados
        } catch (error) {
            return error
        }
    },

    findClienteById: async (id) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM CLIENTE WHERE ID_CLIENTE = ?', [id])
            return resultados
        } catch (error) {
            return error
        }
    },
    findClientesByIds: async (ids) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM CLIENTE WHERE ID_CLIENTE IN (?) ", [ids]);
            return resultados;
        } catch (error) {
            console.error("Erro ao buscar clientes", error);
            throw error;
        }
    },
    findPetsInIds: async (ids) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM CARTERINHA_PET WHERE ID_PET IN (?) ", [ids]);
            return resultados;
        } catch (error) {
            console.error("Erro ao buscar pets", error);
            throw error;
        }
    },
    findClienteByEmailAtivo: async (email) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM CLIENTE WHERE EMAIL_USUARIOS = ? AND STATUS_CLIENTE = 'ativo' LIMIT 1", [email])
            console.log(resultados)
            return resultados
        } catch (error) {
            return error
        }
    },

    findClienteByIdInativo: async (id) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM CLIENTE WHERE ID_CLIENTE = ? AND STATUS_CLIENTE = 'inativo' LIMIT 1", [id])
            return resultados

        } catch (error) {
            console.error("Erro ao buscar usuário", error);
            throw error;
        }
    },

    findPetById: async (id) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM CARTERINHA_PET WHERE ID_CLIENTE = ?', [id])
            return resultados
        } catch (error) {
            return error
        }
    },
    findPetByIdPet: async (id) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM CARTERINHA_PET WHERE ID_PET = ?', [id])
            return resultados
        } catch (error) {
            return error
        }
    },
    updateUser: async (dadosForm, id) => {
        try {
            const [resultados] = await pool.query("UPDATE CLIENTE SET ? WHERE ID_CLIENTE = ?", [dadosForm, id])
            return resultados

        } catch (error) {
            console.error("Erro ao atualizar usuário", error);
            throw error;
        }
    },
    updatePet: async (dadosForm, id) => {
        try {
            const [resultados] = await pool.query("UPDATE CARTERINHA_PET SET ? WHERE ID_PET = ?", [dadosForm, id])
            return resultados

        } catch (error) {
            console.error("Erro ao atualizar usuário", error);
            throw error;
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
    deletePet: async (id) => {
        try {
            const [resultados] = await pool.query('DELETE FROM CARTERINHA_PET WHERE ID_PET = ?', [id])
            console.log("Horário agendado!")
            return resultados
        } catch (error) {
            console.log("erro ao excluir pet")
            throw error
        }
    },
    excluirComentario: async (id) => {
        try {
            await pool.query("DELETE FROM MENSAGEM WHERE ID_MENSAGEM = ?", [id]);
        } catch (error) {
            return error
        }
    }
    // findClienteBy: async (clausulaWhere, valor) => {
    //     try {
    //         const [resultados] = await pool.query('SELECT * FROM CLIENTE WHERE ? ?', [clausulaWhere, valor])
    //         console.log(resultados)
    //         return resultados
    //     } catch (error) {
    //         return error
    //     }
    // },

}


module.exports = clienteModel