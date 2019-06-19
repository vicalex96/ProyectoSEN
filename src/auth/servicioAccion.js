const knex = require('../db/connection')
const dao = require('./DAO/accionDAO');
const servicioAccion = require('./servicioAccion');

async function crearAccion(req, res, tipoDeAccion, objeto, operador) {
    var respuesta
    await dao.crear(req,res, tipoDeAccion, objeto, operador)
    .then(()=>{
        console.log("salimos")
        repuesta =true
    })
    .catch((error)=>{
        console.log("error: " + error.code)
        respuesta = false
    })
    return respuesta
    }

async function cargarTabla(req, res){
    respuesta = await dao.cargarTabla(req,res)
    return respuesta
}

  module.exports = {
    crearAccion,
    cargarTabla,
  };
