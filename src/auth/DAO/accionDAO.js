const knex = require('../../db/connection')
const servicioAccion = require('../servicioAccion')

function crear(req, res, tipoDeAccion, objeto, operador)  {
    return new Promise(function(resolve,reject){
            knex('accion').insert({
                tipo_accion: tipoDeAccion,
                objeto_afectado: objeto,
                nombre_operador: operador.nombre,
                id_operador: operador.id
            })
            .then(() => {
                resolve(true)
            })
            .catch((error) =>{
                reject(error)
            })
        })
}

function cargarTabla(){
    return knex.select().table('accion')
}

  module.exports = {
      crear,
      cargarTabla,
  };
