const { Router } = require('express');
const { compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const authConfig = require('../config/auth');

const knex = require('../database/connection');

const sessionsRouter = Router();

sessionsRouter.post('/create', async (request, response) => {
  try {
    const { email, password } = request.body;

    const checkUsersExists = await knex('users').where({ email }).first();

    if (!checkUsersExists) {
      return response
        .status(400)
        .json({ message: 'Incorrect email/password combination' });
    }

    const passwordMatch = await compare(password, checkUsersExists.password);

    if (!passwordMatch) {
      return response
        .status(400)
        .json({ message: 'Incorrect email/password combination' });
    }

    const { uuid } = checkUsersExists;

    const user = { uuid, email };

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: checkUsersExists.uuid,
      expiresIn,
    });

    return response.json({ user, token });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

module.exports = sessionsRouter;
