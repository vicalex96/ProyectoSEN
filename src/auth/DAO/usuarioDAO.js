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
    if(req.body.userType == 'Supervisor'){
        userType = true;
    }else{
        userType = false;
    }
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt)
    return new Promise(function(resolve,reject){
        knex('usuario').where({ id: req.body.usuarioid}).first()
        .update({nombre_usuario: req.body.userName,
            contrasena: hash,
            nombre: req.body.name,
            apellido:req.body.lastname,
            supervisor: userType
         })
        .then(()=>{
            resolve(true)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}


  module.exports = {
      crear,
      cargarTabla,
      eliminar,
      actualizar,
  };
