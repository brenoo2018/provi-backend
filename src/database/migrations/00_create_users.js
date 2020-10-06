exports.up = async (knex) =>
  knex.schema.createTable('users', (table) => {
    table.uuid('uuid').primary();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

exports.down = async (knex) => knex.schema.dropTable('users');
