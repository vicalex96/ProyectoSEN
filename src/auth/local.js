const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const authHelpers = require('./_helpers');
const init = require('./passport');
const knex = require('../db/connection.js');

const options = {};

init();

passport.use(new LocalStrategy(options, (username, password, done) => {
  // check to see if the username exists
  knex('usuario').where({ nombre_usuario: username  }).first()
  .then((usuario) => {
    if (!usuario) return done(null, false,req.flash('loginMessage', 'Usuario no encontrado'));
    if (!authHelpers.comparePass(password, usuario.contrasena)) {
      return done(null, false, req.flash('loginMessage', 'Contraseña no valida'));
    } else {
      return done(null, usuario);
    }
  })
  .catch((err) => { return done(err); });
}));

module.exports = passport;
