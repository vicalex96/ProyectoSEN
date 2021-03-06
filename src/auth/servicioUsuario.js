const knex = require('../db/connection')
const dao = require('./DAO/usuarioDAO');
const servicioAccion = require('./servicioAccion');
const bcrypt = require('bcrypt');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

async function crear(req, res) {
    var respuesta
    await dao.crear(req,res)
    .then(async() => {
            req.flash('registerMessage','se creo el usuario')
            console.log("a guardar la accion")
            await servicioAccion.crearAccion(req,res,"crear usuario",
                            "Usuario: " + req.body.userName, req.user)
            respuesta = true
    })
    .catch(async(error) =>{
        if(error.code == 23505){
            req.flash('registerMessage','usuario duplicado')
        }else if( error.code != null){
            req.flash('registerMessage','ocurrio un error')
        }
        console.log("a guardar la accion error")
        await servicioAccion.crearAccion(req,res,"crear usuario",
                        "Fallida, error: " + error.code, req.user)
        respuesta = false
    })
    return respuesta
}

async function cargarTabla(){
    respuesta = await dao.cargarTabla()
    return respuesta
}

async function actualizar(req,res){
    var respuesta
    await dao.actualizar(req,res)
    .then(async(resp)=>{
        respuesta = true
        req.flash('usuarioMessage','El usuario se ha actualizado')
    })
    .catch(async(error)=>{
        respuesta = false
        req.flash('usuarioMessage','Error: no se pudo actualizar el usuario')
    })
    return respuesta
}


async function actualizarContrasena(req,res,usuario){
    var respuesta
    await dao.actualizarContrasena(req,res,usuario)
    .then(async(resp)=>{
        respuesta = true
        req.flash('usuarioMessage','La contraseña se ha actualizado')
    })
    .catch(async(error)=>{
        respuesta = false
        req.flash('usuarioMessage','Error: no se pudo actualizar la contraseña')
    })
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
    .then(async(user) => {
        if (!user.supervisor) {
            req.flash("loginMessage","No hay autorizacion para entrar en esa seccion")
        }
    })
    .catch(async(err) => {
      req.flash("loginMessage","Error: ocurrio un problema y no se pudo proseguir")
    });
  }

function loginRedirect(req, res, next) {
    if (req.user) return res.status(401).json(
      {status: 'Estas conectado en este momento'});
    return next();
  }


  async function cargarUsuario(req,res){
      var respuesta
      await dao.cargarUsuario(req,res)
      .then((usuario)=>{
          respuesta = usuario
      })
      .catch((error)=>{
          req.flash('usuarioMessage','Error: usuario no encontrado')
          respuesta = false
      })

      return respuesta
  }

module.exports = {
    comparePass,
    crear,
    cargarTabla,
    actualizar,
    loginRequired,
    adminRequired,
    loginRedirect,
    cargarUsuario,
    actualizarContrasena
  };
