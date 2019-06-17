const knex = require('../../db/connection')
const servicioAccion = require('../servicioAccion')

function crear(req, res) {
    return new Promise(function(resolve,reject){
        return knex('accion').insert({
                tipo_accion: tipoDeAccion,
                objeto_afectado: objeto,
                nombre_operador: operador.nombre,
                id_operador: operador.id
        })
        .then((accion) => {
            if(accion){
                resolve(true)
            }else{
                req.flash('accionMessage','Error Bitacora: no se pudo crear el nodo')
                resolve(false)
            }
        })
        .catch((error) =>{
            req.flash('nodoMessage','Error Bitacora: no fue posible crear el nodo')
            resolve(false)
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
