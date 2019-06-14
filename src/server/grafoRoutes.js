
const rout = require("path")
const authHelpers = require('../auth/_helpers');
const servicioNodo = require('../auth/servicioNodo');
const servicioAsociacion = require('../auth/servicioAsociacion');
const servicioAccion = require('../auth/servicioAccion');
const passport = require('../auth/local');
const fs = require('fs')

module.exports = (app) => {



    app.get('/grafo/crear/nodo', function (req, res) {
      if (req.isAuthenticated() && !req.user.superviso) {
          servicioNodo.pedirTabla(req, res)
          .then((tablaNodo) => {
              res.render('viewGrafoCrearNodo',{
                  logged: true,
                  user: req.user,
                  message1: req.flash('nodoMessage'),
                  messageAction: req.flash('accionMessage'),
                  nodos: tablaNodo,
                 })
             })
             .catch((error) => {

             })
      }else{
        res.redirect('/home')
      }
    })

    app.get('/grafo/crear/asociacion', function (req, res) {
      if (req.isAuthenticated() && !req.user.superviso) {
          servicioNodo.pedirTabla(req, res)
          .then((tablaNodo) => {
              servicioAsociacion.pedirTabla(req, res)
              .then((tablaAsociacion) => {
                  res.render('viewGrafoCrearAsociacion',{
                      logged: true,
                      user: req.user,
                      message2: req.flash('asociacionMessage'),
                      messageAction: req.flash('accionMessage'),
                      nodos: tablaNodo,
                      Asociaciones: tablaAsociacion
                  })
              })
              .catch((error) => {

              });
          })
          .catch((error) => {

          });
      }else{
        res.redirect('/home')
      }
    })

    app.get('/grafo/nodo', function (req, res) {
        if (req.isAuthenticated()) {
            servicioNodo.pedirTabla(req, res)
            .then((tablaNodo) => {
                res.render('viewGrafoNodo',{
                    logged: true,
                    user: req.user,
                    nodos: tablaNodo
                })
            })
            .catch((error) => {

            });
        }else{
          res.redirect('/home')
        }
    })

    app.get('/grafo/asociacion', function (req, res) {
        if (req.isAuthenticated()) {
            servicioAsociacion.pedirTabla(req,res)
            .then((tablaAsociacion) => {
                res.render('viewGrafoAsociacion',{
                    logged: true,
                    user: req.user,
                    asociaciones: tablaAsociacion
                })
            })
            .catch((error) => {

            });

        }else{
            res.redirect('/home')
        }
    })


    app.get('/grafo', function (req, res) {
      if (req.isAuthenticated()) {
          servicioNodo.pedirTabla(req, res)
          .then((tablaNodo) => {
              servicioAsociacion.pedirTabla(req, res)
              .then((tablaAsociacion) => {
                  if(req.user.supervisor){
                      res.render('viewGrafo',{
                        logged: true,
                        user: req.user,
                        nodos: tablaNodo,
                        asociaciones: tablaAsociacion
                      })
                  }else{
                      res.render('viewGrafo',{
                        logged: true,
                        user: req.user,
                        message1: req.flash('nodoMessage'),
                        message2: req.flash('asociacionMessage'),
                        messageAction: req.flash('accionMessage'),
                        nodos: tablaNodo,
                        asociaciones: tablaAsociacion
                      })
                  }
              })
              .catch((error) => {

              });
          })
          .catch((error) => {

          });
      }else{
        res.redirect('/home')
          }
    })

    app.post('/nodo', (req, res, next)  => {
         servicioNodo.crearNodo(req, res)
        .then((respuesta)=>{
            req.flash('nodoMessage','Nodo creado')
            servicioAccion.crearAccion(req,res,"crear", "nodo", req.user)
            .then((resp)=>{})
            res.redirect('/grafo/crear/nodo')

        })
        .catch((error) => {
            if(error.code == 23505){
                req.flash('nodoMessage','nodo duplicado')
            }else if( error.code != null){
                req.flash('nodoMessage','ocurrio un error')
            }
            servicioAccion.crearAccion(req,res,"crear, fallida Error: "+ error.code, "nodo", req.user)
            .then((resp)=>{})
            res.redirect('/grafo/crear/nodo')
        })
    })

    app.post('/asociacion', (req, res, next)  => {
        ejecutaPromesaDeCrearAsociacion(req,res)
    });


    async function ejecutaPromesaDeCrearAsociacion(req,res){
        respuesta = await servicioAsociacion.crearAsociacion(req,res)
        res.redirect("/grafo/crear/asociacion")
    }

    app.post('/grafo/eliminar/nodo', (req, res, next)  => {
        if (req.isAuthenticated()){
            ejecutaPromesaDeEliminarNodo(req,res)
        }
    })

    async function ejecutaPromesaDeEliminarNodo(req,res){
        respuesta = await servicioNodo.eliminarNodo(req,res)
        //req.flash('nodoMessage', 'se elimino el nodo')
        res.redirect("/grafo/nodo")
    }

    app.post('/grafo/eliminar/asociacion', (req, res, next)  => {
        if (req.isAuthenticated()){
            ejecutaPromesaDeEliminarAsociacion(req,res)
        }
    })

    async function ejecutaPromesaDeEliminarAsociacion(req,res){
        respuesta = await servicioAsociacion.eliminarAsociacion(req,res)
        req.flash('asociacionMessage', 'se elimino la asociacion')
        res.redirect("/grafo/asociacion")
    }

    app.get('/grafo/editar/asociacion', (req, res, next)  => {
        if (req.isAuthenticated()){
            servicioAsociacion.pedirTabla(req, res)
            .then((tablaAsociacion) => {
                    res.render('viewGrafoEditarAsociacion',{
                      logged: true,
                      user: req.user,
                      message: req.flash('asociacionMessage'),
                      asociaciones: tablaAsociacion
                    })

            })
        }
    })

    app.post('/grafo/editar/asociacion', (req, res, next)  => {
        if (req.isAuthenticated()){
            ejecutaPromesaDeEditarAsociacion(req,res)
        }
    })

    async function ejecutaPromesaDeEditarAsociacion(req,res){
        respuesta = await servicioAsociacion.editaAsociacion(req,res)
        req.flash('asociacionMessage', 'se edito la asociacion correctamente')
        res.redirect("/grafo/asociacion")
    }



  }
