const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const authHelpers = require('./_helpers');
const init = require('./passport');
const knex = require('../db/connection.js');

const options = {};

init();

passport.use(new LocalStrategy(options, (username, password, done) => {
  // check to see if the username exists
  knex('usuario').where({ nombre_usuario: username }).first()
  .then((usuario) => {
    var idup = usuario.id
    var suma= usuario.contador+1

    if (!usuario) {
      return done(null, false,req.flash('loginMessage', 'Usuario no encontrado'))
    }

    if (usuario.bloqueado) {
      return done(null, false,req.flash('loginMessage', 'Usuario Bloqueado'))
    }

    if (!authHelpers.comparePass(password, usuario.contrasena)) {


      if(usuario.contador  < 2 && !usuario.bloqueado ) {
        knex('usuario').where({id: idup }).update({contador: suma}, ['id', 'contador']).then()
      } else if (!usuario.bloqueado){
        knex('usuario').where({ id: idup }).update({bloqueado: true, contador: 0}, ['id', 'bloqueado', 'contador']).then()
        return done(null, false, req.flash('loginMessage', 'Usuario Bloqueado'));
      }

      return done(null, false, req.flash('loginMessage', 'Contraseña no valida'));
    } else if(usuario.contador != 0 && !usuario.bloqueado ) {
        knex('usuario').where({id: idup }).update({contador: 0}, ['id', 'contador']).then()
        return done(null, usuario);
    } else {
      return done(null, false, req.flash('loginMessage', 'Usuario Bloqueado'));
    }
  })
  .catch((err) => { return done(err); });
}));

module.exports = passport;
