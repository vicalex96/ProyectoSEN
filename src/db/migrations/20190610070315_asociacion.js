
exports.up = (knex, Promise) => {
  return knex.schema.createTable('asociacion', (table) => {
    table.increments();
    table.integer('id_nodo1').notNullable();
    table.integer('id_nodo2').notNullable();
    table.float('capacidad').notNullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('asociacion');
};
