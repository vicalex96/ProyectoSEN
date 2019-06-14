
exports.up = (knex, Promise) => {
  return knex.schema.createTable('nodo', (table) => {
    table.increments();
    table.string('nombre').unique().notNullable();
    table.string('latitud').notNullable();
    table.string('longitud').notNullable();
    table.string('tipo_nodo').notNullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('nodo');
};
