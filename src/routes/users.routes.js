const { Router } = require('express');
const { uuid: funcUuid } = require('uuidv4');
const Yup = require('yup');
const { hash } = require('bcryptjs');

const getValidationErrors = require('../utils/getValidationErrors');
const knex = require('../database/connection');

const usersRouter = Router();

usersRouter.post('/create', async (request, response) => {
  try {
    const schema = Yup.object().shape({
      email: Yup.string()
        .required('E-mail obrigatório')
        .email('Digite um e-mail válido'),
      password: Yup.string()
        .min(6, 'Mínimo de 6 dígitos')
        .required('Senha obrigatória'),
    });

    await schema.validate(request.body, {
      abortEarly: false,
    });

    const { email, password } = request.body;

    const trx = await knex.transaction();

    const checkUsersExists = await trx('users').where({ email }).first();

    if (checkUsersExists) {
      return response.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await hash(password, 8);

    await trx('users').insert({
      uuid: funcUuid(),
      email,
      password: passwordHash,
    });

    const aftterInsert = await trx('users').where({ email }).first();

    await trx('students').insert({
      uuid: funcUuid(),
      user_uuid: aftterInsert.uuid,
    });

    await trx.commit();

    return response.json({ success: true, next_end_point: 'sessions/create' });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors = getValidationErrors(error);

      return response.json({ errors });
    } else {
      return response.status(400).json({ error: error.message });
    }
  }
});

module.exports = usersRouter;
