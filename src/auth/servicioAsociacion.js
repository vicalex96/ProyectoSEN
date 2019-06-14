const knex = require('../db/connection')
const servicioAccion = require('../auth/servicioAccion');

async function crearAsociacion(req, res) {
    campo = req.body
    nodo1 = campo.primerNodo.split("-")
    nodo2 = campo.segundoNodo.split("-")
    compatible = true;
    console.log("1")
    if(nodo1[2] === "Generacion" && nodo2[2] === "Termoelectrica"){
        compatible = await comprobarCompatibilidad(res,req,nodo2[1],nodo2[2])
    }

    if(compatible && (
        nodo1[2] === "Generacion" && nodo2[2] === "Termoelectrica"||
        nodo1[2] === "Generacion" && nodo2[2] ==="Distribucion" ||
        nodo1[2] === "Termoelectrica" && nodo2[2]  ==="Distribucion" ||
        nodo1[2] === "Distribucion"   && nodo2[2] ==="Distribucion"
    )&& nodo1[2] != nodo2){
        respuesta = await crearAsociacionDAO(res,req,nodo1,nodo2,campo)
        if(respuesta){
            req.flash('asociacionMessage','Asociacion creada')
        }else {
            req.flash('asociacionMessage','No se pudo crear el nodo')
        }
        return respuesta
    }else{
        req.flash('asociacionMessage','Nodos no compatibles')
    }

}

function crearAsociacionDAO(res,req,nodo1,nodo2,campo){
    return new Promise(function(resolve,reject){
        console.log("ejecuta")
        resolve(true)
        knex('asociacion').insert({
            nombre_nodo1:nodo1[1],
            tipo_nodo1:nodo1[2],
            nombre_nodo2:nodo2[1],
            tipo_nodo2:nodo2[2],
            capacidad:campo.capacidad
        })
        .then((asociacion)=>{
            servicioAccion.crearAccion(req,res,"crear", "asociacion " + nodo1[1] + " "+ nodo2[1], req.user)
            .then((resp)=>{})
            resolve(true)
        })
        .catch((error)=>{
            if(error.code == 23505){
                req.flash('asociacionMessage','asociacion duplicado')
            }else if( error.code != null){
                req.flash('asociacionMessage','ocurrio un error')
            }
            reject()
        })
    })
 }

function comprobarCompatibilidad(res, req, nombreNodo,tipoDeNodo) {
   return new Promise(function(resolve,reject){
       knex('asociacion').where({ nombre_nodo1: nombreNodo}).first()
       .then((asociacion)=>{
           if(!asociacion){
               req.flash('asociacionMessage','Error: no se pudo comprobar la compatibilidad')
               resolve(false)
           }else if(asociacion.tipo_nodo2 == "Distribucion"){
               resolve(true)
           }else{
               resolve(false)
           }
       })
   })
}

function pedirTabla(req, res){
    return knex.select().table('asociacion')
}

  module.exports = {
    crearAsociacion,
    pedirTabla
  };
