exports.up = async (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.uuid('uuid').primary();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
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
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  return knex.schema.dropTable('users');
};
