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
        .then((user) => {
            if(user){
                req.flash('registerMessage','se creo el usuario')
                resolve(true)
            }else{
                req.flash('registerMessage','Error: no se pudo crear el usuario')
                resolve(false)
            }
        })
        .catch((error) =>{
            if(error.code == 23505){
                req.flash('registerMessage','usuario duplicado')
            }else if( error.code != null){
                req.flash('registerMessage','ocurrio un error')
            }

        })
    })
}

function cargar(){
    return knex.select().table('usuario')
}

function eliminar(req,res){
    return new Promise(function(resolve,reject){
        knex('usuario').where({ nombre: req.body.nombreUsuario}).first().del()
        .then(()=>{
            servicioAccion.crearAccion(req,res,"Eliminar", "usuario: " + req.body.nombreUsuario, req.user)
            .then((resp)=>{})
            resolve(true)
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
      cargar,
      eliminar,
      actualizar,
  };
