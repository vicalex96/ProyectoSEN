
const rout = require("path")
const servicioUsuario = require('../auth/servicioUsuario');
const servicioNodo = require('../auth/servicioNodo');
const servicioAsociacion = require('../auth/servicioAsociacion');
const servicioAccion = require('../auth/servicioAccion');
const passport = require('../auth/servicioSesion');
const fs = require('fs')

module.exports = (app) => {

    app.get('/nodos', async (req, res) =>{
        if (req.isAuthenticated()) {
            tablaNodo = await servicioNodo.cargarTabla(req, res)
            if(tablaNodo){
                res.render('viewGrafoNodo',{
                    logged: true,
                    user: req.user,
                    nodos: tablaNodo
                })
            }
        }else{
          res.redirect('/home')
        }
    })

    app.get('/nodos/crear', function (req, res) {
      if (req.isAuthenticated() && !req.user.superviso) {
          res.render('viewGrafoCrearNodo',{
              logged: true,
              user: req.user,
              message: req.flash('nodoMessage'),
          })
      }else{
        res.redirect('/home')
      }
    })

    app.post('/nodos/crear', async (req, res) => {
        respuesta =  await servicioNodo.crear(req,res)
        res.redirect('/nodos/crear')
    })

    //TODO: terminar la edicion de los nodos
    app.get('/nodos/editar', async (req, res)  => {
      if (req.isAuthenticated() && !req.user.superviso) {
          nodo = await servicioNodo.cargarNodo(req,res)
          nodo = servicioNodo.separarCoordenadas(nodo)
          res.render('viewGrafoEditarNodo',{
              logged: true,
              user: req.user,
              nodo: nodo,
              message: req.flash('nodoMessage'),
          })
      }else{
        res.redirect('/home')
      }
    })

    app.post('/nodos/actualizar', async (req, res) => {
        respuesta = await servicioNodo.actualizar(req,res).catch(()=>{console.log("error")})
        res.redirect('/nodos')

    })

    app.post('/nodos/eliminar', async (req, res) => {
        respuesta = await servicioNodo.eliminar(req,res)
        res.redirect('/nodos')
    })

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
