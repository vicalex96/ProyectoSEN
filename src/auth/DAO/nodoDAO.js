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
            if(nodo){
                req.flash('nodoMessage','se creo el nodo')
                resolve(true)
            }else{
                req.flash('nodoMessage','Error: no se pudo crear el nodo')
                resolve(false)
            }
        })
        .catch((error) =>{
            if(error.code == 23505){
                req.flash('nodoMessage','Error: Nodo duplicado')
                resolve(false)
            }else{
                req.flash('nodoMessage','Error: no fue posible crear el nodo')
                resolve(false)
            }

        })
    })
}

function cargar(){
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
            servicioAccion.crearAccion(req,res,"Eliminar", "nodo: " + req.body.nodoNombre, req.user)
            .then((resp)=>{})
            resolve(true)
        })
    })
}

function actualizar(req,res){
    return new Promise(function(resolve,reject){
        nodoid = parseInt(req.body.id)
        console.log(req.body)
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
      cargar,
      cargarNodo,
      eliminar,
      actualizar,
  };
