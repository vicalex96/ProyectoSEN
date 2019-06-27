
const rout = require("path")
const servicioUsuario = require('../auth/servicioUsuario');
const servicioNodo = require('../auth/servicioNodo');
const servicioAsociacion = require('../auth/servicioAsociacion');
const servicioAccion = require('../auth/servicioAccion');
const passport = require('../auth/servicioSesion');
const fs = require('fs')

module.exports = (app) => {
app.post ('/usuario/actualizar', async (req, res)=>{

  respuesta = await servicioUsuario.actualizar(req, res)
    res.redirect('/userAdministration')
} )

app.get('/usuarios/editar', async (req, res)  => {
  if (req.isAuthenticated() && !req.user.superviso) {
      usuario = await servicioUsuario.cargarUsuario(req,res)


      res.render('viewEditarUsuario',{
          logged: true,
          user: req.user,
          usuario: usuario,
          message: req.flash('usuarioMessage'),
      })
  }else{
    res.redirect('/home')
  }
})
}
