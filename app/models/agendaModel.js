var pool = require("../../config/pool-conexao");

const agendaModel = {
    apagarHorario: async (id) => {
        try {
            const [resultados] = await pool.query("delete from HORARIOS_SERVICO where ID_HORARIO_SERVICO = ?", [id])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findHorariosByIdServico: async (id) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM HORARIOS_SERVICO WHERE ID_SERVICO = ?", [id])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findHrByDay: async (id, day) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM HORARIOS_SERVICO WHERE ID_SERVICO = ? AND DIA_SEMANA = ?", [id, day])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findHorariosIdservico: async (id) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM HORARIOS_SERVICO WHERE ID_SERVICO = ?', [id])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findHorariosByIdHorario: async (id) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM HORARIOS_SERVICO WHERE ID_HORARIO_SERVICO = ?', [id])
            return resultados
        } catch (error) {
            throw error
        }
    },
    criarHorario: async (dadosHorario) => {
        try {
            const [resultados] = await pool.query('INSERT INTO HORARIOS_SERVICO SET ?', [dadosHorario])
            console.log("HORARIO CRIADO")
            return resultados
        } catch (error) {
            console.log("erros ao criar o horário")
            throw error
        }
    },
    findAgendaServicoByData: async (idServico, data) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM AGENDAMENTOS WHERE ID_SERVICO = ? AND DATA_AGENDAMENTO = ?', [idServico, data])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findAgendaByIdEmpresa: async (id) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM AGENDAMENTOS WHERE ID_USUARIO = ?', [id])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findAgendaByIdHorario: async (id) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM AGENDAMENTOS WHERE ID_HORARIO_SERVICO = ?', [id])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findAgendaByIdCliente: async (id) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM AGENDAMENTOS WHERE ID_CLIENTE = ?', [id])
            return resultados
        } catch (error) {
            throw error
        }
    },
    findAgendaById: async (id) => {
        try {
            const [resultados] = await pool.query('SELECT * FROM AGENDAMENTOS WHERE ID_AGENDAMENTOS = ?', [id])
            return resultados
        } catch (error) {
            throw error
        }
    },
    agendarHorario:async (dados)=>{
        try {
            const [resultados] = await pool.query('INSERT INTO AGENDAMENTOS SET ?', [dados])
            console.log("Horário agendado!")
            return resultados
        } catch (error) {
            console.log("erros ao agendar")
            throw error
        }
    },
    updateAgenda:async (id,dados)=>{
        try {
            const [resultados] = await pool.query('UPDATE AGENDAMENTOS SET ? WHERE ID_AGENDAMENTOS = ?', [dados, id])
            console.log("Horário agendado!")
            return resultados
        } catch (error) {
            console.log("erros ao agendar")
            throw error
        }
    },
    cancelAllAgendaByIdPet: async(id)=>{
        try {
            const [resultados] = await pool.query("DELETE FROM AGENDAMENTOS WHERE ID_CARTEIRINHA_PET = ?", [id])
            return resultados
        } catch (error) {
            console.log("erros ao agendar")
            throw error
        }
    },
    cancelAllAgendaByIdServico: async(id)=>{
        try {
            const [resultados] = await pool.query("DELETE FROM AGENDAMENTOS WHERE ID_SERVICO = ?", [id])
            return resultados
        } catch (error) {
            console.log("erros ao agendar")
            throw error
        }
    },
    cancelAllAgendaByIdHorario: async(id)=>{
        try {
            const [resultados] = await pool.query("DELETE FROM AGENDAMENTOS WHERE ID_HORARIO_SERVICO = ?", [id])
            return resultados
        } catch (error) {
            console.log("erros ao agendar")
            throw error
        }
    },
    cancelAllHorariosByIdServico: async(id)=>{
        try {
            const [resultados] = await pool.query("DELETE FROM HORARIOS_SERVICO WHERE ID_SERVICO = ?", [id])
            return resultados
        } catch (error) {
            console.log("erros ao agendar")
            throw error
        }
    },
}


module.exports = agendaModel