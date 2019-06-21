const knex = require('../db/connection')
const servicioAccion = require('./servicioAccion');
const dao  = require('./DAO/asociacionDAO');

async function crear(req, res) {
    var respuesta
    req.body.primerNodo = req.body.primerNodo.split("-")
    req.body.segundoNodo = req.body.segundoNodo.split("-")
    nodo1 = req.body.primerNodo
    nodo2 = req.body.segundoNodo

    compatible = false;
    if(nodo1[2] === "Generacion" && nodo2[2] === "Termoelectrica"){
        compatible = await dao.comprobarCompatibilidad(req,res)
    }

    if(compatible || ( nodo1[2] === "Generacion" && nodo2[2] === "Distribucion"
    || nodo1[2] === "Termoelectrica" && nodo2[2] === "Distribucion"
    || nodo1[2] === "Distribucion" && nodo2[2] === "Distribucion"   )
    && nodo1[2] != nodo2[2] ) {

        respuesta = ejecutaCreacionAsociacion(req,res)

    }else{
        req.flash('asociacionMessage','la relacion '+nodo1[2] +' -> '+ nodo2[2] +' no es compatible')

    }

    return respuesta
}

async function ejecutaCreacionAsociacion(req,res){
    var respuesta
    await dao.comprobarExistencia(req,res)
    .then(async (exitencia)=>{

        if(exitencia){
            req.flash('asociacionMessage','Error: ambos nodos ya estan asociados')
            respuesta = false
        }else{
            await dao.crear(req,res)
            .then((resp)=>{
                req.flash('asociacionMessage','Asociacion creada')
                servicioAccion.crearAccion(req,res,"crear asociacion",
                               "asociacion: " + req.body.nombreAsociacion, req.user)
                respuesta = true
            })
            .catch((error)=>{
                req.flash('asociacionMessage',' no se pudo crear la asociacion')
                servicioAccion.crearAccion(req,res,"crear asociacion",
                                "Fallida, error: " + error.code, req.user)
                respuesta = false
            })
        }
    })
    .catch((error)=>{
        req.flash('asociacionMessage','Error: no se pudo crear la asociacion')
        respuesta = false
    })
    return respuesta
}

async function cargarTabla(req, res){
    respuesta = await dao.cargarTabla(req,res)
    return respuesta
}

async function cargarAsociacion(req,res){
    respuesta = await dao.cargarAsociacion(req,res)
    return respuesta
}

async function actualizar(req,res){
    var respuesta
    await dao.actualizar(req,res)
    .then(()=>{
        servicioAccion.crearAccion(req,res,"actualizar asociacion",
                       "asociacion: " + req.body.nombreAsociacion, req.user)
        respuesta = true
    })
    .catch((error)=>{
        req.flash('listaAsociacionMessage','Error: no se pudo actualizar la asociacion')
        servicioAccion.crearAccion(req,res,"actualizar asociacion",
                        "Fallida, error: " + error.code, req.user)
        respuesta = false
    })
    return respuesta
}

async function eliminar(req, res){
    var respuesta
    await dao.eliminar(req,res)
    .then(()=>{
        servicioAccion.crearAccion(req,res,"eliminar asociacion",
                       "asociacion: " + req.body.nombreAsociacion, req.user)
        respuesta = true
    })
    .catch((error)=>{
        req.flash('listaAsociacionMessage','Error: no se logro eliminar la asociacion')
        servicioAccion.crearAccion(req,res,"eliminar asociacion",
                        "Fallida, error: " + error.code, req.user)
        respuesta = false
    })

    return respuesta
}

  module.exports = {
    cargarTabla,
    cargarAsociacion,
    crear,
    actualizar,
    eliminar
  };
