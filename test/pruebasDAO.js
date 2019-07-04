var chai = require('chai')

var assert = chai.assert
var should = chai.should()
var expect = chai.expect
var servicioNodo = require('../src/auth/servicioNodo.js')
const nodoDAO = require('../src/auth//DAO/nodoDAO');

describe('Pruebas de nodos', function(){
    describe('revicion de creacion de los nodos', function(){
        var req= {
            body: {
                id: 1,
                nombreNodo: 'El guri',
                longitud_grados: -63,
                longitud_minutos: 40,
                longitud_segundos: 20,
                latitud_grados: 6,
                latitud_minutos: 20,
                latitud_segundos: 15,
                tipoNodo: "Generacion",
            },
            query: {
                nombreNodo: 'El guri',
                }
        }

        req.body.coordenaLatitud  = servicioNodo.juntarCoordenadas(req.body.latitud_grados,
            req.body.latitud_minutos,
            req.body.latitud_segundos)
        req.body.coordenaLongitud = servicioNodo.juntarCoordenadas(req.body.longitud_grados,
            req.body.longitud_minutos,
            req.body.longitud_segundos)

        var res

        it('crea un nodo', async function(){
            var result
            await nodoDAO.crear(req,res)
                .then(()=>{
                    result = true
                })
                .catch((error)=>{
                    if(error.code == 23505)
                    result = "nodo duplicado"
                })
            expect(result).to.equal(true)
        })

        it('comprueba que el mismo nodo no se pueda crear de nuevo', async function(){
            var result
            await nodoDAO.crear(req,res)
                .then(()=>{
                result = false
                })
                .catch((error)=>{
                    if(error.code == 23505)
                    result = true
                })
            expect(result).to.equal(true)
        })

        it('comprueba que el nodo se pueda conseguir y entregar', async function(){
            var result

            await nodoDAO.cargarNodo(req,res)
                .then((nodo)=>{
                    if(nodo){
                        result = true
                    }else{
                        result = false
                    }
            })
            expect(result).to.equal(true)
        })

        it('comprueba que se pueda eliminar el nodo', async function(){
            var result
            req.body.id = 1
            await nodoDAO.eliminar(req,res)
                .then(()=>{
                    result = true
                })
                .catch((error)=>{
                    result = error.code
                })
            expect(result).to.equal(true)
        })

        it('comprueba que se pueda actualizar el nodo', async function(){
            req.body.nombreNodo= 'Josefa'
            req.body.longitud_grados= -33
            req.body.longitud_minutos= 45
            req.body.longitud_segundos= 52
            req.body.latitud_grados= 7
            req.body.latitud_minutos= 3
            req.body.latitud_segundos= 1
            req.body.tipoNodo= "Termoelectrica"

            req.body.coordenaLatitud  = servicioNodo.juntarCoordenadas(req.body.latitud_grados,
                req.body.latitud_minutos,
                req.body.latitud_segundos)
            req.body.coordenaLongitud = servicioNodo.juntarCoordenadas(req.body.longitud_grados,
                req.body.longitud_minutos,
                req.body.longitud_segundos)

            var result
            await nodoDAO.actualizar(req,res)
                .then(()=>{
                    result = true
                })
                .catch((error)=>{
                    result = error.code
                })
            expect(result).to.equal(true)
        })
    })
})
