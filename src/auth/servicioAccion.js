const knex = require('../db/connection')

function crearAccion(req, res, tipoDeAccion, objeto, operador) {
    return knex('accion').insert({
            tipo_accion: tipoDeAccion,
            objeto_afectado: objeto,
            nombre_operador: operador.nombre,
            id_operador: operador.id
        })
    }



function pedirTabla(req, res){
    return knex.select().table('accion')
}


  module.exports = {
    crearAccion,
    pedirTabla
  };
