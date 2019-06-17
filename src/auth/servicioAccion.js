const knex = require('../db/connection')
const dao = require('./DAO/accionDAO');

async function crear(req, res, tipoDeAccion, objeto, operador) {
    respuesta = await dao.crear(req,res)
    //TODO agregar la entrada a la bitacora
    return respuesta
    }

async function cargarTabla(req, res){
    respuesta = await dao.cargarTabla(req,res)
    return respuesta
}

  module.exports = {
    crear,
    cargarTabla
  };
