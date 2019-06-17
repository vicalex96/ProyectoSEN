
const rout = require("path")
const servicioUsuario = require('../auth/servicioUsuario');
const servicioNodo = require('../auth/servicioNodo');
const servicioAsociacion = require('../auth/servicioAsociacion');
const servicioAccion = require('../auth/servicioAccion');
const passport = require('../auth/servicioSesion');
const fs = require('fs')

module.exports = (app) => {
    
    app.get('/asociaciones', async (req, res) => {
        if (req.isAuthenticated()) {
            tablaAsociacion = await servicioAsociacion.cargarTabla(req,res)
            if(tablaAsociacion){
                res.render('viewGrafoAsociacion',{
                    logged: true,
                    user: req.user,
                    asociaciones: tablaAsociacion
                })
            }
        }else{
            res.redirect('/home')
        }
    })

    app.get('/asociaciones/crear', async (req, res) =>{
        if (req.isAuthenticated() && !req.user.superviso) {
            tablaNodo = await servicioNodo.cargarTabla(req, res)
            if(tablaNodo){
                res.render('viewGrafoCrearAsociacion',{
                    logged: true,
                    user: req.user,
                    message2: req.flash('asociacionMessage'),
                    messageAction: req.flash('accionMessage'),
                    nodos: tablaNodo,
                })
            }else{
                res.redirect('/home')
            }
        }
    })

    app.post('/asociaciones/crear', async (req, res) => {
        respuesta =  await servicioAsociacion.crear(req,res)

        res.redirect('/asociaciones/crear')
    })

    app.get('/asociaciones/editar', async (req, res)  => {
      if (req.isAuthenticated() && !req.user.superviso) {
          console.log(req.body)
          asociacion = await servicioAsociacion.cargarAsociacion(req,res)
          res.render('viewGrafoEditarAsociacion',{
              logged: true,
              user: req.user,
              asociacion: asociacion,
              message: req.flash('asociacionMessage'),
          })
      }else{
        res.redirect('/home')
      }
    })

    app.post('/asociaciones/actualizar', async (req, res) => {
        respuesta = await servicioAsociacion.actualizar(req,res)
        res.redirect('/asociaciones')
    })

    app.post('/asociaciones/eliminar', async (req, res) => {
        respuesta =  await servicioAsociacion.eliminar(req,res)
        res.redirect('/asociaciones')
    })

  }
