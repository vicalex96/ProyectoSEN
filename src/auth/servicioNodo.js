
const knex = require('../db/connection')
const servicioAccion = require('./servicioAccion');
const dao = require('./DAO/nodoDAO');

async function crear(req, res) {
    req.body.coordenaLatitud  = juntarCoordenadas(req.body.latitud_grados,
        req.body.latitud_minutos,
        req.body.latitud_segundos)
    req.body.coordenaLongitud = juntarCoordenadas(req.body.longitud_grados,
        req.body.longitud_minutos,
        req.body.longitud_segundos)
    respuesta = await dao.crear(req,res)
    //TODO agregar la entrada a la bitacora
    return respuesta
}

function juntarCoordenadas(grados, minutos, segundos){
    return grados + '°' + minutos + "\`" + segundos + '\"'
}

function separarCoordenadas(nodo){
    nodo.latitud ={
        grados: nodo.latitud.split("°")[0],
        minutos: (nodo.latitud.split("°")[1]).split('`')[0],
        segundos: ((nodo.latitud.split("°")[1]).split('`')[1]).split('"')[0],
    }
    nodo.longitud ={
        grados: nodo.longitud.split("°")[0],
        minutos: (nodo.longitud.split("°")[1]).split('`')[0],
        segundos: ((nodo.longitud.split("°")[1]).split('`')[1]).split('"')[0],
    }
    return nodo
}

async function cargarTabla(){
    respuesta = await dao.cargar()
    //TODO agregar la entrada a la bitacora
    return respuesta
}

async function cargarNodo(req,res){
    respuesta = await dao.cargarNodo(req,res)
    //TODO agregar la entrada a la bitacora
    return respuesta
}

async function actualizar(req,res){
    req.body.coordenaLatitud  = juntarCoordenadas(req.body.latitud_grados,
        req.body.latitud_minutos,
        req.body.latitud_segundos)
    req.body.coordenaLongitud = juntarCoordenadas(req.body.longitud_grados,
        req.body.longitud_minutos,
        req.body.longitud_segundos)
    respuesta = await dao.actualizar(req,res).catch((error)=>{console.log(error.code)})
    //TODO agregar la entrada a la bitacora
    //TODO actualizar las asociaciones
    return respuesta
}

async function eliminar(req,res) {
    respuesta = await dao.eliminar(req,res)
    //TODO agregar la entrada a la bitacora
    //TODO actualizar las asociaciones
    return respuesta
   }



   module.exports = {
     separarCoordenadas,
     cargarTabla,
     cargarNodo,
     crear,
     actualizar,
     eliminar
   };
