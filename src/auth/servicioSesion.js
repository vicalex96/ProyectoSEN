const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const servicioUsuario = require('./servicioUsuario');
const init = require('./passport');
const knex = require('../db/connection.js');

const options = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
};

init();

passport.use(new LocalStrategy(options, (req, username, password, done) => {
  knex('usuario').where({ nombre_usuario: username }).first()
  .then((usuario) => {

      if (!usuario) {
          return done(null, false,req.flash('loginMessage', 'Usuario no encontrado'))
      }

      if(validatePass(req,usuario,password,done)){
          if(usuario.bloqueado) {
              return done(null, false, req.flash('loginMessage', 'Usuario Bloqueado'));
          }
          else if(usuario.contador != 0){
              knex('usuario').where({id: usuario.id }).update({contador: 0}, ['id', 'contador']).then()
          }
          return done(null, usuario);
      }

  })
  .catch((err) => { return done(null, false, req.flash('loginMessage', 'Error no esperado: '+ err)) });
}));


function validatePass(req,usuario, password,done){
  var idup = usuario.id
  var aumentoContador= usuario.contador+1

  if (servicioUsuario.comparePass(password, usuario.contrasena)){
    return true
  }
  else {

    if(usuario.contador  < 2 ) {
      knex('usuario').where({id: idup }).update({contador: aumentoContador}, ['id', 'contador']).then()

    } else if (!usuario.bloqueado){
      knex('usuario').where({ id: idup }).update({bloqueado: true, contador: 0}, ['id', 'bloqueado', 'contador']).then()
      return done(null, false, req.flash('loginMessage', 'Usuario Bloqueado'));
    }

    return done(null, false, req.flash('loginMessage', 'Contraseña no valida'));
  }
}

module.exports = passport;
