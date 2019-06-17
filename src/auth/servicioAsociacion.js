const knex = require('../db/connection')
const servicioAccion = require('../auth/servicioAccion');
const dao  = require('../auth/DAO/AsociacionDAO');

async function crear(req, res) {
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
        respuesta = await dao.crear(req,res)

        if(respuesta){
            req.flash('asociacionMessage','Asociacion creada')

        }else {
            req.flash('asociacionMessage',' no se pudo crear la asociacion')
        }
    }else{
        req.flash('asociacionMessage','la relacion'+nodo1[2] +' -> '+ nodo2[2] +' no es compatible')
    }
    //TODO agregar la entrada a la bitacora
}

 async function cargarTabla(req, res){
    respuesta = await dao.cargar(req,res)
    //TODO agregar la entrada a la bitacora
    return respuesta
}

async function cargarAsociacion(req,res){
    respuesta = await dao.cargarAsociacion(req,res)
    //TODO agregar la entrada a la bitacora
    return respuesta
}

async function editar(req, res){
    respuesta = await dao.actualizar(req,res)
    //TODO agregar la entrada a la bitacora
    return respuesta
}

async function actualizar(req,res){
    respuesta = await dao.actualizar(req,res).catch((error)=>{console.log(error.code)})
    //TODO agregar la entrada a la bitacora
    //TODO actualizar las asociaciones
    return respuesta
}

async function eliminar(req, res){
    respuesta = await dao.eliminar(req,res)
    //TODO agregar la entrada a la bitacora
    return respuesta
}

  module.exports = {
    cargarTabla,
    cargarAsociacion,
    crear,
    actualizar,
    eliminar
  };
