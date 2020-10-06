const { Router } = require('express');
const { isUuid, uuid: funcUuid } = require('uuidv4');

const knex = require('../database/connection');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const studentsRouter = Router();

studentsRouter.use(ensureAuthenticated);

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
      await knex('students')
        .update({
          first_name,
          last_name,
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

module.exports = studentsRouter;