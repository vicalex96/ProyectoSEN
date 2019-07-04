const knex = require('../db/connection')
const servicioAccion = require('./servicioAccion');
const servicioAsociacion = require('./servicioAsociacion');
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
    .then(async()=>{
        req.flash('nodoMessage','se creo el nodo')
        await servicioAccion.crearAccion(req,res,"crear nodo",
                       "Nodo: " + req.body.nombreNodo, req.user)
        respuesta = true
    })
    .catch(async(error)=>{
        if(error.code == 23505){
            req.flash('nodoMessage','Error: Nodo duplicado')
        }else{
            req.flash('nodoMessage','Error: no fue posible crear el nodo')
        }
        await servicioAccion.crearAccion(req,res,"crear nodo",
                        "Fallida, error: " + error.code, req.user)
        respuesta = false
    })
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
    respuesta = await dao.cargarTabla()
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

    var nodoOriginal = req.body
    req.body.coordenaLatitud  = juntarCoordenadas(req.body.latitud_grados,
        req.body.latitud_minutos,
        req.body.latitud_segundos)
    req.body.coordenaLongitud = juntarCoordenadas(req.body.longitud_grados,
        req.body.longitud_minutos,
        req.body.longitud_segundos)
    var respuesta
    await dao.actualizar(req,res)
    .then(async()=>{
        req.flash('listaNodoMessage','se actualizo el nodo')
        await servicioAccion.crearAccion(req,res,"actualizar nodo",
                       "Nodo: " + req.body.nombreNodo, req.user)
        respuesta = true
    })
    .catch(async(error)=>{
        if(error.code == 23505){
            req.flash('listaNodoMessage','Error: no se pudo actualizar el nodo '+
                                        nodoOriginal.nombreNodo +', el nombre indicado ya existe')
        }else{
            req.flash('listaNodoMessage','Error: no fue posible actualizar el nodo')
        }
        await servicioAccion.crearAccion(req,res,"actualizar nodo ",
                         "Fallida, error: " + error.code + " sobre:" + nodoOriginal.nombreNodo, req.user)
        respuesta = false
    })
    //TODO actualizar las asociaciones
    return respuesta
}

async function eliminar(req,res) {
    var respuesta
    var nodoAfectado = req.body.nombreNodo
    existe = await servicioAsociacion.comprobarExistenciaDeAsociacion(req,res)
    if(!existe){
        await dao.eliminar(req,res)
        .then(async()=>{
            req.flash('listaNodoMessage','Nodo Eliminado')
            await servicioAccion.crearAccion(req,res,"eliminar nodo",
                           "Nodo: " + req.body.nombreNodo, req.user)
            respuesta = true
        })
        .catch(async(error)=>{
            req.flash('listaNodoMessage','Error: no fue posible eliminar el nodo')
            await servicioAccion.crearAccion(req,res,"eliminar nodo",
                            "Fallida, error: " + error.code + " sobre :" + req.body.nombreNodo, req.user)
            respuesta = false
        })
    }else{
        req.flash('listaNodoMessage',"Error: el nodo "+ req.body.nombreNodo +
                        " esta asociado a otros nodos, elimine primero sus asociaciones")
        respuesta = false
    }
    return respuesta
}

function pasarCoordenadasDeStringAJson(nodos) {
    for(i=0; i < nodos.length; i++ ){
        latitud = nodos[i].latitud
        nodos[i].latitud = [
            parseInt(latitud.split("°")[0]),
            parseInt((latitud.split("°")[1]).split('`')[0]),
            parseInt(((latitud.split("°")[1]).split('`')[1]).split('"')[0])
        ]
        longitud = nodos[i].longitud
        nodos[i].longitud = [
            parseInt(longitud.split("°")[0]),
            parseInt((longitud.split("°")[1]).split('`')[0]),
            parseInt(((longitud.split("°")[1]).split('`')[1]).split('"')[0])
        ]
    }
}
function convertirGMSaGD(coordenada){
    signo = coordenada[0]/Math.abs(coordenada[0])
    coordenada = signo *(Math.abs(coordenada[0]) + coordenada[1] / 60 + coordenada[2] / 3600)
    return coordenada
}

function adapatarCoordenasAGrafoGD(nodos){
    pasarCoordenadasDeStringAJson(nodos)
    for(i=0; i < nodos.length; i++ ){
        latitud = convertirGMSaGD(nodos[i].latitud)
        longitud = convertirGMSaGD(nodos[i].longitud)
        nodos[i].coordenadas = [ longitud, latitud ]
    }
}

module.exports = {
    separarCoordenadas,
    cargarTabla,
    cargarNodo,
    crear,
    actualizar,
    eliminar,
    adapatarCoordenasAGrafoGD,
    juntarCoordenadas
}
