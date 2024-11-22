var pool = require("../../config/pool-conexao");

const favoritoModel = {


findAll: async() => {
    try{
const[resultados] = await poll.query("SELECT * FROM FAVORITOS");
return resultados;
    }catch(error){
  return error;
    }
},

findID: async (idServico, idCliente) => {
    try{
    const[resultados] = await poll.query( " SELECT FROM FAVORITOS where SERVICO_ID_SERVICO = ? and CLIENTE_ID_CLIENTE = ?", [idServico, idCliente] );
    return resultados;
    }catch (error){
        console.log(error);
        return error;
    }
},

create: async (camposJson) => {
try {
const [resultados] = await pool.query("insert into FAVORITOS set ?", camposJson);
return resultados;
} catch (error) {
console.log(error);
return error;
}

},

update: async (camposJson, idServico, idCliente) => {
    try {
    const [resultados] = await pool.query(
    "UPDATE FAVORITOS SET ? WHERE SERVICO_ID_SERVICO = ? and CLIENTE_ID_CLIENTE = ? ",
    [camposJson, idServico, idCliente])
    return resultados;
    }catch (error) {
    console.log(error);
    return error;
    }
},

delete: async (id) => {
    try {
    const [resultados] = await pool.query(
    "UPDATE FAVORITOS SET STATUS_FAVORITOS = @ WHERE SERVICO_ID_SERVICO = ? and CLIENTE_ID_CLIENTE = ?",
    [idServico, idCliente]);
    return resultados;
    } catch (error) {
    console.log(error);
    return error;
    }
},


favoritar: async (dadosFavorito) => {
    try {
        if (dadosFavorito.situacao == "favorito") {

        const resultados = await favoritoModel.update({STATUS_FAVORITOS: 0 }, dadosFavorito.idServico, dadosFavorito.idCliente);
        return resultados;
        } else if (dadosFavorito.situacao == "favoritar") {
        const result = await favoritoModel.findID(dadosFavorito.idServico, dadosFavorito.idCliente);
        var total = Object.keys(result).length;
        if (total == 0) {

        let obj = {
            SERVICO_ID_SERVICO: dadosFavorito.idServico,
            CLIENTE_ID_CLIENTE: dadosFavorito.idUsuario,
            DT_INCLUSAO_FAVORITOS: moment().format("YYYY/MM/DD"),
            STATUS_FAVORITOS: 1
        }
        const resultados = await favoritoModel.create(obj);
        }else {
            const resultados = await favoritoModel.update({STATUS_FAVORITOS: 1}, )
        }
      
}
}catch(error){
    console.log(error);
    return error
}
},

}

module.exports = favoritoModel