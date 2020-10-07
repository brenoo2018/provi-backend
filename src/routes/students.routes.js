const { Router } = require('express');
const { isUuid, uuid: funcUuid } = require('uuidv4');

const knex = require('../database/connection');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const studentsRouter = Router();

studentsRouter.use(ensureAuthenticated);

studentsRouter.post('/cpf', async (request, response) => {
  try {
    const { cpf } = request.body;
    const { user_uuid } = request.user;

    if (!user_uuid) {
      return response.status(400).json({ message: 'Uuid not found' });
    }

    if (!isUuid(user_uuid)) {
      return response.status(400).json({ message: 'Does not Uuid' });
    }

    const user = await knex('students')
      .where({ user_uuid })
      .first()
      .orderBy('updated_at', 'desc');

    if (!user) {
      return response.status(400).json({ message: 'User does not exists' });
    }

    const findCpfUsers = await knex('students')
      .where({ cpf })
      .select(['cpf', 'user_uuid']);

    if (findCpfUsers.length > 0) {
      if (findCpfUsers[0].user_uuid !== user_uuid) {
        return response.status(400).json({ message: 'CPF already exists' });
      }
    }

    if (!user.cpf) {
      console.log('caiu aqui 1');
      await knex('students').insert({
        uuid: funcUuid(),
        cpf,
        first_name: user.first_name,
        last_name: user.last_name,
        birthday: user.birthday,
        phone_number: user.phone_number,
        cep: user.cep,
        street: user.street,
        number: user.number,
        complement: user.complement,
        state: user.state,
        city: user.city,
        user_uuid,
        created_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
      });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      return response.json({
        data: cpf,
        updated_at: aftterUpdate.updated_at,
      });
    }

    if (user.cpf === cpf) {
      console.log('caiu aqui 2');
      await knex('students')
        .update({
          updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        })
        .where({ uuid: user.uuid, user_uuid });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      return response.json({
        data: cpf,
        updated_at: aftterUpdate.updated_at,
      });
    }

    if (user.cpf !== cpf) {
      console.log('caiu aqui 3');

      await knex('students').insert({
        uuid: funcUuid(),
        cpf: cpf,
        first_name: user.first_name,
        last_name: user.last_name,
        birthday: user.birthday,
        phone_number: user.phone_number,
        cep: user.cep,
        street: user.street,
        number: user.number,
        complement: user.complement,
        state: user.state,
        city: user.city,
        user_uuid,
        created_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
      });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      console.log(aftterUpdate);

      return response.json({
        data: cpf,
        updated_at: aftterUpdate.updated_at,
      });
    }
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

studentsRouter.post('/full-name', async (request, response) => {
  try {
    const { first_name, last_name } = request.body;
    const { user_uuid } = request.user;

    if (!user_uuid) {
      return response.status(400).json({ message: 'Uuid not found' });
    }

    if (!isUuid(user_uuid)) {
      return response.status(400).json({ message: 'Does not Uuid' });
    }

    const user = await knex('students')
      .where({ user_uuid })
      .first()
      .orderBy('updated_at', 'desc');

    if (!user) {
      return response.status(400).json({ message: 'User does not exists' });
    }

    if (!user.first_name && !user.last_name) {
      await knex('students').insert({
        uuid: funcUuid(),
        first_name,
        last_name,
        cpf: user.cpf,
        birthday: user.birthday,
        phone_number: user.phone_number,
        cep: user.cep,
        street: user.street,
        number: user.number,
        complement: user.complement,
        state: user.state,
        city: user.city,
        user_uuid,
        created_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
      });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      return response.json({
        data: `${first_name} ${last_name}`,
        updated_at: aftterUpdate.updated_at,
      });
    }

    if (user.first_name === first_name && user.last_name === last_name) {
      await knex('students')
        .update({
          updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        })
        .where({ uuid: user.uuid, user_uuid });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      return response.json({
        data: `${first_name} ${last_name}`,
        updated_at: aftterUpdate.updated_at,
      });
    }

    if (user.first_name !== first_name || user.last_name !== last_name) {
      await knex('students').insert({
        uuid: funcUuid(),
        first_name,
        last_name,
        cpf: user.cpf,
        birthday: user.birthday,
        phone_number: user.phone_number,
        cep: user.cep,
        street: user.street,
        number: user.number,
        complement: user.complement,
        state: user.state,
        city: user.city,
        user_uuid,
        created_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
      });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      return response.json({
        data: `${first_name} ${last_name}`,
        updated_at: aftterUpdate.updated_at,
      });
    }
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

studentsRouter.post('/birthday', async (request, response) => {
  try {
    const { birthday } = request.body;
    const { user_uuid } = request.user;

    if (!user_uuid) {
      return response.status(400).json({ message: 'Uuid not found' });
    }

    if (!isUuid(user_uuid)) {
      return response.status(400).json({ message: 'Does not Uuid' });
    }

    const user = await knex('students')
      .where({ user_uuid })
      .first()
      .orderBy('updated_at', 'desc');

    if (!user) {
      return response.status(400).json({ message: 'User does not exists' });
    }

    if (!user.birthday) {
      await knex('students').insert({
        uuid: funcUuid(),
        first_name: user.first_name,
        last_name: user.last_name,
        cpf: user.cpf,
        birthday,
        phone_number: user.phone_number,
        cep: user.cep,
        street: user.street,
        number: user.number,
        complement: user.complement,
        state: user.state,
        city: user.city,
        user_uuid,
        created_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
      });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      return response.json({
        data: birthday,
        updated_at: aftterUpdate.updated_at,
      });
    }

    if (user.birthday === birthday) {
      await knex('students')
        .update({
          updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        })
        .where({ uuid: user.uuid, user_uuid });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      return response.json({
        data: birthday,
        updated_at: aftterUpdate.updated_at,
      });
    }

    if (user.birthday !== birthday) {
      await knex('students').insert({
        uuid: funcUuid(),
        first_name: user.first_name,
        last_name: user.last_name,
        cpf: user.cpf,
        birthday,
        phone_number: user.phone_number,
        cep: user.cep,
        street: user.street,
        number: user.number,
        complement: user.complement,
        state: user.state,
        city: user.city,
        user_uuid,
        created_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
      });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      return response.json({
        data: birthday,
        updated_at: aftterUpdate.updated_at,
      });
    }
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

studentsRouter.post('/phone-number', async (request, response) => {
  try {
    const { phone_number } = request.body;
    const { user_uuid } = request.user;

    if (!user_uuid) {
      return response.status(400).json({ message: 'Uuid not found' });
    }

    if (!isUuid(user_uuid)) {
      return response.status(400).json({ message: 'Does not Uuid' });
    }

    const user = await knex('students')
      .where({ user_uuid })
      .first()
      .orderBy('updated_at', 'desc');

    if (!user) {
      return response.status(400).json({ message: 'User does not exists' });
    }

    const findPhoneNumberUsers = await knex('students')
      .where({ phone_number })
      .select(['phone_number', 'user_uuid']);

    if (findPhoneNumberUsers.length > 0) {
      if (findPhoneNumberUsers[0].user_uuid !== user_uuid) {
        return response
          .status(400)
          .json({ message: 'Phone number already exists' });
      }
    }

    if (!user.phone_number) {
      await knex('students').insert({
        uuid: funcUuid(),
        first_name: user.first_name,
        last_name: user.last_name,
        cpf: user.cpf,
        birthday: user.birthday,
        phone_number,
        cep: user.cep,
        street: user.street,
        number: user.number,
        complement: user.complement,
        state: user.state,
        city: user.city,
        user_uuid,
        created_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
      });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      return response.json({
        data: phone_number,
        updated_at: aftterUpdate.updated_at,
      });
    }

    if (user.phone_number === phone_number) {
      await knex('students')
        .update({
          updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        })
        .where({ uuid: user.uuid, user_uuid });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      return response.json({
        data: phone_number,
        updated_at: aftterUpdate.updated_at,
      });
    }

    if (user.phone_number !== phone_number) {
      await knex('students').insert({
        uuid: funcUuid(),
        first_name: user.first_name,
        last_name: user.last_name,
        cpf: user.cpf,
        birthday: user.birthday,
        phone_number,
        cep: user.cep,
        street: user.street,
        number: user.number,
        complement: user.complement,
        state: user.state,
        city: user.city,
        user_uuid,
        created_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
      });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      return response.json({
        data: phone_number,
        updated_at: aftterUpdate.updated_at,
      });
    }
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

studentsRouter.post('/address', async (request, response) => {
  try {
    const { cep, street, number, complement, state, city } = request.body;
    const { user_uuid } = request.user;

    if (!user_uuid) {
      return response.status(400).json({ message: 'Uuid not found' });
    }

    if (!isUuid(user_uuid)) {
      return response.status(400).json({ message: 'Does not Uuid' });
    }

    const user = await knex('students')
      .where({ user_uuid })
      .first()
      .orderBy('updated_at', 'desc');

    if (!user) {
      return response.status(400).json({ message: 'User does not exists' });
    }

    if (
      !user.cep &&
      !user.street &&
      !user.number &&
      !user.complement &&
      !user.state &&
      !user.city
    ) {
      await knex('students').insert({
        uuid: funcUuid(),
        first_name: user.first_name,
        last_name: user.last_name,
        cpf: user.cpf,
        birthday: user.birthday,
        phone_number: user.phone_number,
        cep,
        street,
        number,
        complement,
        state,
        city,
        user_uuid,
        created_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
      });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      const data = { cep, street, number, complement, state, city };

      return response.json({
        data,
        updated_at: aftterUpdate.updated_at,
      });
    }

    if (
      user.cep === cep &&
      user.street === street &&
      user.number === number &&
      user.complement === complement &&
      user.state === state &&
      user.city === city
    ) {
      await knex('students')
        .update({
          updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        })
        .where({ uuid: user.uuid, user_uuid });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      const data = { cep, street, number, complement, state, city };

      return response.json({
        data,
        updated_at: aftterUpdate.updated_at,
      });
    }

    if (
      user.cep !== cep ||
      user.street !== street ||
      user.number !== number ||
      user.complement !== complement ||
      user.state !== state ||
      user.city !== city
    ) {
      await knex('students').insert({
        uuid: funcUuid(),
        first_name: user.first_name,
        last_name: user.last_name,
        cpf: user.cpf,
        birthday: user.birthday,
        phone_number: user.phone_number,
        cep,
        street,
        number,
        complement,
        state,
        city,
        user_uuid,
        created_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
      });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      const data = { cep, street, number, complement, state, city };

      return response.json({
        data,
        updated_at: aftterUpdate.updated_at,
      });
    }
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

module.exports = studentsRouter;
