
const rout = require("path")
const servicioUsuario = require('../auth/servicioUsuario');
const servicioNodo = require('../auth/servicioNodo');
const servicioAsociacion = require('../auth/servicioAsociacion');
const servicioAccion = require('../auth/servicioAccion');
const passport = require('../auth/servicioSesion');
const fs = require('fs')

module.exports = (app) => {
    app.get('/', function (req, res) {
      res.redirect('/home')
    })

    app.get('/home', function (req, res) {
      if (req.isAuthenticated()) {
        res.render('viewHome', {
          logged: true,
          supervisor: req.user.supervisor,
          user: req.user
        });
      }else{
        res.render('viewHome', {
          logged: false,
          supervisor: false,
        });
      }
    })

    app.get('/login', function (req, res) {
      if (req.isAuthenticated()) {
        res.redirect('/perfil');
      }else{
        res.render('viewLogin',{
            message: req.flash('loginMessage'),
            logged: false,
            supervisor: false,
        });
      }
    })

    app.post('/login', (req, res, next) => {
      passport.authenticate('local', {
    		successRedirect: '/perfil',
    		failureRedirect: '/login',
    		failureFlash: true
    	})(req, res, next);
    });

    app.get('/perfil', function (req, res) {

      if (req.isAuthenticated()) {
        res.render('viewPerfil',{
          logged: true,
          user: req.user,
        })
      }else{
        res.redirect('/login');
      }
    })

    app.get('/register', function (req, res) {
      if (req.isAuthenticated()) {
        res.render('viewRegister',{
          logged: true,
          user: req.user,
          message: req.flash('registerMessage')
        })
      }else{
        res.redirect('/home');
      }
    })

    app.post('/register', async (req, res)  => {
        respuesta = await servicioUsuario.crear(req, res)
        res.redirect('/register')
    });

    app.get('/logout', (req, res) => {
        if (req.isAuthenticated()){
            req.logout();
        }
        res.redirect('/login')
    });

    app.get('/userAdministration', async (req, res) => {
        if (req.isAuthenticated() && req.user.supervisor) {
            usuarios = await servicioUsuario.cargarTabla(req, res)
            res.render('viewUserAdministration',{
                logged: true,
                user: req.user,
                usuarios: usuarios,
            })
        }else{
            res.redirect('/home')
        }
    })

    app.get('/bitacora', async (req, res) => {
        if (req.isAuthenticated()) {
            acciones = await servicioAccion.cargarTabla(req, res)
            res.render('viewBitacora',{
                    logged: true,
                    user: req.user,
                    acciones: acciones
            })
        }else{
            res.redirect('/home')
        }
    })

    app.get('/grafo', async function (req, res) {
        if (req.isAuthenticated()) {
           tablaNodo = await servicioNodo.cargarTabla(req, res);
           servicioNodo.adapatarCoordenasAGrafoGD(tablaNodo)
           tablaAsociacion = await servicioAsociacion.cargarTablaConCoordenadas(req,res,tablaNodo)
          res.render('viewGrafo', {
            logged: true,
            user: req.user,
            nodos: tablaNodo,
            asociaciones: tablaAsociacion
          });
        }else{
          res.render('viewHome', {
            logged: false,
            supervisor: false,
          });
        }
    })

  function isLoggedIn (req, res, next) {
	   if (req.isAuthenticated()) {
		     return next();
	   }
     res.redirect('/home');
  }

}
