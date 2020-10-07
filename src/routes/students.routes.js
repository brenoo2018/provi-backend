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

    if (!user.cpf) {
      await knex('students').insert({
        uuid: funcUuid(),
        cpf,
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
      await knex('students').insert({
        uuid: funcUuid(),
        cpf,
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

    if (user.first_name !== first_name && user.last_name !== last_name) {
      await knex('students').insert({
        uuid: funcUuid(),
        first_name,
        last_name,
        cpf: user.cpf,
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

module.exports = studentsRouter;
