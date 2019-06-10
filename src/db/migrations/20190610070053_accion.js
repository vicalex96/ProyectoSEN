
exports.up = (knex, Promise) => {
  return knex.schema.createTable('accion', (table) => {
    table.increments();
    table.date('fecha').unique().notNullable();
    table.string('tipo_accion').notNullable();
    table.string('objeto_afectado').notNullable().defaultTo('-');
    table.string('nombre_operador').notNullable();
    table.integer('id_operador').notNullable();

  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('accion');
};
