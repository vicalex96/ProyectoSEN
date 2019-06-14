
const knex = require('../db/connection')
const servicioAccion = require('../auth/servicioAccion');

function crearNodo(req, res) {

    campo = req.body

    coordenaLatitud  = juntarCoordenadas(campo.latitud_grados,
        campo.latitud_minutos,
        campo.latitud_segundos)
    coordenaLongitud = juntarCoordenadas(campo.longitud_grados,
        campo.longitud_minutos,
        campo.longitud_segundos)

    return knex('nodo').insert({
        nombre: campo.nombreNodo,
        latitud: coordenaLatitud,
        longitud: coordenaLongitud,
        tipo_nodo: campo.tipoNodo
    })
}

function juntarCoordenadas(grados, minutos, segundos){
    return grados + '°' + minutos + "\`" + segundos + '\"'
}

function pedirTabla(){
    return knex.select().table('nodo')
}


function eliminarNodo(req,res) {
   return new Promise(function(resolve,reject){
           knex('nodo').where({ nombre: req.body.nodoNombre}).first().del()
           .then(()=>{
                servicioAccion.crearAccion(req,res,"Eliminar", "nodo: " + req.body.nodoNombre, req.user)
               .then((resp)=>{})
                resolve(true)
           })
        })
   }

  module.exports = {
    crearNodo,
    pedirTabla,
    eliminarNodo
  };
