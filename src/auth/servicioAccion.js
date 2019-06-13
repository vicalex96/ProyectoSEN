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
    return  knex('accion').select('id',
                            knex('nodo').select('nombre').where({id: 'id_nodo1'}),
                            knex('nodo').select('nombre').where({id: 'id_nodo2'}),
                            'capacidad')
}


  module.exports = {
    crearAccion,
    pedirTabla
  };
