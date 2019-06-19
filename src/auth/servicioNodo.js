
const knex = require('../db/connection')
const servicioAccion = require('./servicioAccion');
const dao = require('./DAO/nodoDAO');

async function crear(req, res) {
    var respuesta
    req.body.coordenaLatitud  = juntarCoordenadas(req.body.latitud_grados,
        req.body.latitud_minutos,
        req.body.latitud_segundos)
    req.body.coordenaLongitud = juntarCoordenadas(req.body.longitud_grados,
        req.body.longitud_minutos,
        req.body.longitud_segundos)

     await dao.crear(req,res)
    .then((nodo)=>{
        if(nodo){
            req.flash('nodoMessage','se creo el nodo')
        }else{
            req.flash('nodoMessage','Error: no se pudo crear el nodo')
        }
        respuesta = true
    })
    .catch((error)=>{
        if(error.code == 23505){
            req.flash('nodoMessage','Error: Nodo duplicado')
        }else{
            req.flash('nodoMessage','Error: no fue posible crear el nodo')
        }
        respuesta = false
    })
    //TODO agregar la entrada a la bitacora
    return respuesta
}

function juntarCoordenadas(grados, minutos, segundos){
    return grados + '°' + minutos + "\`" + segundos + '\"'
}

function separarCoordenadas(nodo) {
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
    return respuesta
}

async function cargarNodo(req,res){
    var respuesta
    await dao.cargarNodo(req,res)
    .then((nodo)=>{
        respuesta = nodo
    })
    .catch((error)=>{
        req.flash('nodoMessage','Error: nodo no encontrado')
        respuesta = false
    })

    return respuesta
}

async function actualizar(req,res){
    req.body.coordenaLatitud  = juntarCoordenadas(req.body.latitud_grados,
        req.body.latitud_minutos,
        req.body.latitud_segundos)
    req.body.coordenaLongitud = juntarCoordenadas(req.body.longitud_grados,
        req.body.longitud_minutos,
        req.body.longitud_segundos)
    var respuesta
    await dao.actualizar(req,res)
    .then((nodo)=>{
        if(nodo){
            req.flash('listaNodoMessage','se actualizo el nodo')
        }else{
            req.flash('listaNodoMessage','Error: no se pudo actualizar el nodo')
        }
        respuesta = true
    })
    .catch((error)=>{
        if(error.code == 23505){
            req.flash('listaNodoMessage','Error: Nodo duplicado')
        }else{
            req.flash('listaNodoMessage','Error: no fue posible crear el nodo')
        }
        respuesta = false
    })
    //TODO agregar la entrada a la bitacora
    //TODO actualizar las asociaciones
    return respuesta
}

async function eliminar(req,res) {
    var respuesta
    await dao.eliminar(req,res)
    .then((nodo)=>{
        if(nodo){
            req.flash('listaNodoMessage','Nodo Eliminado')
        }else{
            req.flash('listaNodoMessagee','Error: no se pudo eliminar el nodo')
        }
        respuesta = true
    })
    .catch((error)=>{
        req.flash('nodoMessage','Error: no fue posible eliminar el nodo')
        respuesta = false
    })

    //TODO agregar la entrada a la bitacora, en el then
    //TODO actualizar las asociaciones en el then
    //TODO hacer un registro en la bitacora donde salga error de eliminacion
    return respuesta
   }

module.exports = {
    separarCoordenadas,
    cargarTabla,
    cargarNodo,
    crear,
    actualizar,
    eliminar
}
