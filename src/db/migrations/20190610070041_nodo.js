
exports.up = (knex, Promise) => {
  return knex.schema.createTable('nodo', (table) => {
    table.increments();
    table.string('nombre').notNullable();
    table.integer('idAsociacion');
    table.float('latitud').notNullable();
    table.float('logitud').notNullable();
    table.string('tipo_nodo').notNullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('nodo');
};
