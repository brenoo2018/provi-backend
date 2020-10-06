exports.up = async (knex) =>
  knex.schema.createTable('students', (table) => {
    table.uuid('uuid').primary();
    table.string('first_name');
    table.string('last_name');
    table.string('cpf').unique();
    table.string('birthday');
    table.integer('phone_number').unique();
    table.string('cep');
    table.string('street');
    table.integer('number');
    table.string('complement');
    table.string('state');
    table.string('city');

    table.uuid('user_uuid').notNullable().references('uuid').inTable('users');

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

exports.down = async (knex) => knex.schema.dropTable('students');
