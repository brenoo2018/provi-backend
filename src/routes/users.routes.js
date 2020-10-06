const { Router } = require('express');
const { uuid } = require('uuidv4');
const { hash } = require('bcryptjs');

const knex = require('../database/connection');

const usersRouter = Router();

usersRouter.post('/create', async (request, response) => {
  try {
    const { email, password } = request.body;

    const checkUsersExists = await knex('users').where({ email }).first();

    if (checkUsersExists) {
      return response.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await hash(password, 8);

    await knex('users').insert({
      uuid: uuid(),
      email,
      password: passwordHash,
    });

    return response.json({ ok: true });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

module.exports = usersRouter;
