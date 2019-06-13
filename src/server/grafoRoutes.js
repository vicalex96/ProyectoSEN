
const rout = require("path")
const authHelpers = require('../auth/_helpers');
const servicioNodo = require('../auth/servicioNodo');
const servicioAsociacion = require('../auth/servicioAsociacion');
const servicioAccion = require('../auth/servicioAccion');
const passport = require('../auth/local');
const fs = require('fs')

module.exports = (app) => {

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
                            Asociaciones: tablaAsociacion
                          })
                      }else{
                          res.render('viewGrafo',{
                            logged: true,
                            user: req.user,
                            message1: req.flash('nodoMessage'),
                            message2: req.flash('asociacionMessage'),
                            messageAction: req.flash('accionMessage'),
                            nodos: tablaNodo,
                            Asociaciones: tablaAsociacion
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
            res.redirect('/grafo')

        })
        .catch((error) => {
            if(error.code == 23505){
                req.flash('nodoMessage','nodo duplicado')
            }else if( error.code != null){
                req.flash('nodoMessage','ocurrio un error')
            }
            servicioAccion.crearAccion(req,res,"crear, fallida Error: "+ error.code, "nodo", req.user)
            .then((resp)=>{})
            res.redirect('/grafo')
        })
    })

    app.post('/asociacion', (req, res, next)  => {
        servicioAsociacion.crearAsociacion(req, res)
        .then((res) => {
            if (res) {
                req.flash('asociacionMessage','asociacion creada')
            }
        })
        .catch(function(error) {
            if(error.code == 23505){
                req.flash('asociacionMessage','Error: asociacion duplicado')
            }else if( error.code != null){
                req.flash('asociacionMessage','Error: ocurrio un error')
            }
        });

        return servicioAsociacion.crearAsociacion(req, res)
       .then((respuesta)=>{
           req.flash('asociacionMessage','Nodo creado')
           servicioAccion.crearAccion(req,res,"crear", "asociacion", req.user)
           .then((resp)=>{})
           res.redirect('/grafo')

       })
       .catch((error) => {
           if(error.code == 23505){
               req.flash('asociacionMessage','asociacion duplicado')
           }else if( error.code != null){
               req.flash('asociacionMessage','ocurrio un error')
           }
           servicioAccion.crearAccion(req,res,"crear, fallida Error: "+ error.code, "asociacion", req.user)
           .then((resp)=>{})
           res.redirect('/grafo')
       })

    });


  }
