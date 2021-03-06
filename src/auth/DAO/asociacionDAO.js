const knex = require('../../db/connection')
const servicioAccion = require('../../auth/servicioAccion');


async function crear(req,res){
    nodo1 = req.body.primerNodo
    nodo2 = req.body.segundoNodo

    return new Promise(function(resolve,reject){
        knex('asociacion').insert({
            nombre_nodo1: nodo1[1],
            tipo_nodo1:nodo1[2],
            nombre_nodo2:nodo2[1],
            tipo_nodo2:nodo2[2],
            capacidad:req.body.capacidad
        })
        .then(()=>{
            resolve(true)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}

function comprobarExistencia(req, res){
    return new Promise(function(resolve,reject){
        knex('asociacion').where({ nombre_nodo1: req.body.primerNodo[1], nombre_nodo2: req.body.segundoNodo[1] }).first()
        .then((asociacion)=>{
            if(!asociacion){
                resolve(false)
            }else{
                resolve(true)
            }
        }).catch((error)=>{
            reject(error)
        })
    })
 }

 function comprobarCompatibilidad(req, res) {
    return new Promise(function(resolve,reject){
        knex('asociacion').where({ nombre_nodo1: req.body.segundoNodo[1],
            tipo_nodo2: "Distribucion" }).first()
        .then((asociacion)=>{
            if(!asociacion){
                req.flash('asociacionMessage',` Error: La termoelectrica no esta
                asociada con una central de distribucion`)
                resolve(false)
            }
            resolve(true)
        })
    })
 }

function cargarTabla(req, res){
    return knex.select().table('asociacion')
}

function cargarAsociacion(req,res){
    return new Promise(function(resolve,reject){
        asociacionid = parseInt(req.query.asociacionid)
        knex('asociacion').where({ id: asociacionid}).first()
        .then((asociacion)=>{
            resolve(asociacion)
        })
    })
}

function actualizar(req, res) {
   return new Promise(function(resolve,reject){
       knex('asociacion').where({ id: req.body.asociacionid})
       .update({ capacidad: req.body.capacidad})
       .then(()=>{
           resolve(true)
       })
       .catch((error)=>{
           reject(error)
       })
   })
}

function eliminar(req, res) {
   return new Promise(function(resolve,reject){
       knex('asociacion').where({ id: req.body.asociacionid}).first().del()
       .then(()=>{
           resolve(true)
       })
       .catch((error)=>{
           reject(error)
       })
   })
}
function buscarExistenciaAsociacion(req,res){
    var cantidad
    return new Promise(function(resolve,reject){
        knex('asociacion').where({ nombre_nodo1: req.body.nombreNodo})
        .orWhere({ nombre_nodo2: req.body.nombreNodo}).first()
        .then((asociacion)=>{
            if(asociacion){
                resolve(true)
            }else{
                resolve(false)
            }
        })
        .catch((error)=>{
            reject(error)
        })
    })
}

module.exports = {
    crear,
    cargarTabla,
    cargarAsociacion,
    eliminar,
    buscarExistenciaAsociacion,
    actualizar,
    comprobarCompatibilidad,
    comprobarExistencia
}
