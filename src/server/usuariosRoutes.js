
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
  if (req.isAuthenticated() && req.user.supervisor) {
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

app.get('/usuarios/cambiarcontrasena', async (req, res)  => {

  if (req.isAuthenticated()) {
      if(req.user.supervisor){
          sujetoAEditar = req.query.usuarioid
      }else{
          sujetoAEditar = req.user.id
      }
      res.render('viewEditarContrasena',{
          logged: true,
          user: req.user,
          id: sujetoAEditar,
          message: req.flash('usuarioMessage'),
      })
  }else{
    res.redirect('/home')
  }
})

app.post('/usuarios/cambiarcontrasena', async (req, res)  => {
    if (req.isAuthenticated()) {
        respuesta = await servicioUsuario.actualizarContrasena(req,res)
        if(req.user.supervisor){

            res.redirect('/userAdministration')
        }else{
            res.redirect('/perfil')
        }

    }else{
        res.redirect('/home')
    }

})



}
