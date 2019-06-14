
exports.up = (knex, Promise) => {
  return knex.schema.createTable('asociacion', (table) => {
    table.increments();
    table.string('nombre_nodo1').notNullable();
    table.string('tipo_nodo1').notNullable();
    table.string('nombre_nodo2').notNullable();
    table.string('tipo_nodo2').notNullable();
    table.float('capacidad').notNullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('asociacion');
};
