const knex = require('../db/connection')

function crearAsociacion(req, res, nodos) {
    campo = req.body
    nodo1 = campo.primerNodo.split("-")
    nodo2 = campo.segundoNodo.split("-")

    if((nodo1 === "Generacion"  && nodo2 ==="Termoelectrica" ||
        nodo1 === "Generacion"  && nodo2 ==="Distribucion" ||
        nodo1 === "Termoelectrica" && nodo2  ==="Distribucion" ||
        nodo1 === "Distribucion"  && nodo2 ==="Distribucion" )&&
        nodo1 != nodo2){

        return knex('asociacion').insert({
                id_nodo1: campo.primerNodo[0],
                id_nodo2: campo.segundoNodo[0],
                capacidad: campo.capacidad
            })
        }else{
            if(nodo1 == nodo2){
                req.flash('asociacionMessage','Error: no se puede asociar un nodo a si mismo')
            }else{
                req.flash('asociacionMessage',`Error:  esa asociacion no se puede crear, intenta con:
                    C. Generación       ---> C.Termoeléctrica ---> C.Distribución
                    C. Generación       ---> C.Distribución
                    C.Termoeléctrica  ---> C.Distribución
                    C.Distribución      ---> C.Distribución`)
            }
    }
}

function pedirTabla(req, res){
    return knex.select().table('asociacion')
}

  module.exports = {
    crearAsociacion,
    pedirTabla
  };
