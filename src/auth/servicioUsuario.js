const knex = require('../db/connection')
const dao = require('./DAO/usuarioDAO');
const bcrypt = require('bcrypt');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

async function crear(req, res) {
    respuesta = await dao.crear(req,res)
    //TODO agregar la entrada a la bitacora
    return respuesta
}

async function cargarTabla(){
    respuesta = await dao.cargar()
    //TODO agregar la entrada a la bitacora
    return respuesta
}

async function actualizar(){
    respuesta = await dao.actualizar(req,res).catch((error)=>{console.log(error.code)})
    //TODO agregar la entrada a la bitacora
    return respuesta
}

  function loginRequired(req, res, next) {
    if (!req.user){
        return req.flash("loginMessage","No hay ninguna sesion abierta")
    }
    return next();
  }

  function adminRequired(req, res, next) {
    if (!req.user){
        req.flash("loginMessage","No hay ninguna sesion abierta")
    }
    return knex('users').where({username: req.user.username}).first()
    .then((user) => {
        if (!user.supervisor) {
            req.flash("loginMessage","No hay autorizacion para entrar en esa seccion")
        }
    })
    .catch((err) => {
      req.flash("loginMessage","Error: ocurrio un problema y no se pudo proseguir")
    });
  }

  function loginRedirect(req, res, next) {
    if (req.user) return res.status(401).json(
      {status: 'Estas conectado en este momento'});
    return next();
  }



  module.exports = {
    comparePass,
    crear,
    actualizar,
    loginRequired,
    adminRequired,
    loginRedirect,
    cargarTabla
  };
