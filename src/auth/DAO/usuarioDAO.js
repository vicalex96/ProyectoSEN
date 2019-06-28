const bcrypt = require('bcrypt');
const knex = require('../../db/connection')
const servicioAccion = require('../servicioAccion')

function crear(req, res) {
    if(req.body.userType == 'Supervisor'){
        userType = true;
    }else{
        userType = false;
    }

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt)

    return new Promise(function(resolve,reject){
        knex('usuario').insert({
            nombre_usuario: req.body.userName,
            contrasena: hash,
            nombre: req.body.name,
            apellido:req.body.lastname,
            supervisor: userType
        })
        .then(() => {
            resolve(true)
        })
        .catch((error) =>{
            reject(error)
        })
    })
}

function cargarTabla(){
    return knex.select().table('usuario')
}

function eliminar(req,res){
    return new Promise(function(resolve,reject){
        knex('usuario').where({ nombre: req.body.nombreUsuario}).first().del()
        .then(()=>{
            resolve(true)
        })
        .catch((error) =>{
            reject(error)
        })
    })
}

function actualizar(req,res){
  var bloqueado
  if(req.body.bloqueado ==='on'){
    bloqueado = true
  }else{
    bloqueado = false
  }
  usuarioid=parseInt(req.body.usuarioid)
    if(req.body.userType == 'Supervisor'){
        userType = true;
    }else{
        userType = false;
    }

    return new Promise(function(resolve,reject){
        knex('usuario').where({ id: usuarioid}).first()
        .update({nombre_usuario: req.body.userName,
          nombre: req.body.name,
          apellido:req.body.lastname,
          supervisor: userType,
          bloqueado: bloqueado,
         })
        .then(()=>{
            resolve(true)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}

function actualizarContrasena(req,res,usuario){

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt)

    return new Promise(function(resolve,reject){
        knex('usuario').where({ id: req.body.usuarioid}).first()
        .update({contrasena: hash,
                bloqueado: false,
                contador: 0
                })
        .then(()=>{
            resolve(true)
        })
        .catch((error)=>{

            reject(error)
        })
    })
}

function cargarUsuario(req,res){
    return new Promise(function(resolve,reject){
     var id = parseInt (req.query.usuarioid)
        knex('usuario').where({ id: id}).first()
        .then((usuario)=>{
            resolve(usuario)
        })
    })
}

  module.exports = {
      crear,
      cargarTabla,
      eliminar,
      actualizar,
      cargarUsuario,
      actualizarContrasena
  };
