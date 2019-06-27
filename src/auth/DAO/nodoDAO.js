const knex = require('../../db/connection')
const servicioAccion = require('../servicioAccion')

function crear(req, res) {
    return new Promise(function(resolve,reject){
        knex('nodo').insert({
            nombre: req.body.nombreNodo,
            latitud: req.body.coordenaLatitud,
            longitud: req.body.coordenaLongitud,
            tipo_nodo: req.body.tipoNodo
        })
        .then((nodo) => {
            resolve(nodo)
        })
        .catch((error) =>{
            reject(error)
        })
    })
}

function cargarTabla(){
    return knex.select().table('nodo')
}

function cargarNodo(req,res){
    return new Promise(function(resolve,reject){
        knex('nodo').where({ nombre: req.query.nodoNombre}).first()
        .then((nodo)=>{
            resolve(nodo)
        })
    })
}

function eliminar(req,res){
    return new Promise(function(resolve,reject){
        knex('nodo').where({ nombre: req.body.nodoNombre}).first().del()
        .then(()=>{
            resolve(true)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

function actualizar(req,res){
    return new Promise(function(resolve,reject){
        nodoid = parseInt(req.body.id)
      
        knex('nodo').where({ id: nodoid}).first()
        .update({nombre: req.body.nombreNodo,
            latitud: req.body.coordenaLatitud,
            latitud: req.body.coordenaLatitud,
            tipo_nodo: req.body.tipoNodo
         })
        .then(()=>{
            resolve(true)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}


  module.exports = {
      crear,
      cargarTabla,
      cargarNodo,
      eliminar,
      actualizar,
  };
