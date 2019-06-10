const bcrypt = require('bcrypt');
const knex = require('../db/connection')

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function createUser(req, res) {
    if(req.body.userType == 'Supervisor'){
        userType = true;
    }else{
        userType = false;
    }
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt)
    return knex('usuario')
    .insert({
      nombre_usuario: req.body.userName,
      contrasena: hash,
      nombre: req.body.name,
      apellido:req.body.lastname,
      supervisor: userType
    })
    .then((res) => {
        if (res) {
            req.flash('registerMessage','usuario creado')
        }
        return next();
    })
    .catch(function(error) {
        if(error.code == 23505){
            req.flash('registerMessage','usuario duplicado')
        }else if( error.code != null){
            req.flash('registerMessage','ocurrio un error')
        }
        return next();
    });
}

  function loginRequired(req, res, next) {
    if (!req.user) return res.status(401).json({status: 'Porfavor inicia sesion'});
    return next();
  }

  function adminRequired(req, res, next) {
    if (!req.user) res.status(401).json({status: 'Porfavor inicia sesion'});
    return knex('users').where({username: req.user.username}).first()
    .then((user) => {
      if (!user.supervisor) res.status(401).json({status: 'No estas autorizado para esto'});
      return next();
    })
    .catch((err) => {
      res.status(500).json({status: 'Algo malo sucedio'});
    });
  }

  function loginRedirect(req, res, next) {
    if (req.user) return res.status(401).json(
      {status: 'Estas conectado en este momento'});
    return next();
  }

  function handleErrors(req) {
    return new Promise( function(resolve, reject){
      if (req.body.userName.length < 6) {
        reject({
          message: 'El nombre tiene que tener almenos 6 caracteres'
        });
      }
      if (req.body.userName.length > 12) {
          reject({
            message: 'El nombre de usuario es muy largo, maximo 12 caracteres'
          });
      }
      if (req.body.password.length < 8) {
        reject({
          message: 'La contraseña tiene que tener minimo 8 caracteres'
        });
      } else {
        resolve();
      }
    })
  }

  module.exports = {
    comparePass,
    createUser,
    loginRequired,
    adminRequired,
    loginRedirect
  };
