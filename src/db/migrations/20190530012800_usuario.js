
exports.up = (knex, Promise) => {
  return knex.schema.createTable('usuario', (table) => {
    table.increments();
    table.string('nombre_usuario', 12).unique().notNullable();
    table.string('contrasena').notNullable();
    table.string('nombre', 50).notNullable();
    table.string('apellido', 50).notNullable();
    table.boolean('supervisor').notNullable().defaultTo(false);
    table.boolean('bloqueado').notNullable().defaultTo(false);
    table.integer('contador').notNullable().defaultTo(0);

  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('usuario');
};
