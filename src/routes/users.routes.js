const { Router } = require('express');
const { isUuid, uuid: funcUuid } = require('uuidv4');
const { hash } = require('bcryptjs');

const knex = require('../database/connection');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

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
      uuid: funcUuid(),
      email,
      password: passwordHash,
    });

    return response.json({ ok: true });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

usersRouter.post('/test', ensureAuthenticated, async (request, response) => {
  try {
    const { user_uuid } = request.user;

    if (!user_uuid) {
      return response.json({ message: 'Uuid not found' });
    }

    if (!isUuid(user_uuid)) {
      return response.json({ message: 'Does not Uuid' });
    }

    const user = await knex('users').where({ uuid: user_uuid }).first();

    if (!user) {
      return response.json({ message: 'User does not exists' });
    }

    console.log(user);

    return response.json({ ok: true });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

module.exports = usersRouter;
