const bcrypt = require('bcrypt');
const knex = require('../db/connection')

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}
function createUser (req) {
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
}

module.exports = {
  comparePass,
  createUser
};
