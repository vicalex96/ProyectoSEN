
const knex = require('../db/connection')



function pedirTabla(req, res, done){
    return knex.select().table('usuario')
}

  module.exports = {
    
    pedirTabla
  };
