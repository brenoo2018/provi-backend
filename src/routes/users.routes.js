const { Router } = require('express');
const { isUuid, uuid: funcUuid } = require('uuidv4');
const { hash } = require('bcryptjs');

const knex = require('../database/connection');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const usersRouter = Router();

usersRouter.post('/create', async (request, response) => {
  try {
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

    return response.json({ ok: true });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

// usersRouter.post('/test', ensureAuthenticated, async (request, response) => {
//   try {
//     const { first_name, last_name } = request.body;
//     const { user_uuid } = request.user;

//     if (!user_uuid) {
//       return response.status(400).json({ message: 'Uuid not found' });
//     }

//     if (!isUuid(user_uuid)) {
//       return response.status(400).json({ message: 'Does not Uuid' });
//     }

//     const user = await knex('users').where({ uuid: user_uuid }).first();

//     if (!user) {
//       return response.status(400).json({ message: 'User does not exists' });
//     }

//     if (!user.first_name && !user.last_name) {
//       await knex('users')
//         .update({
//           first_name,
//           last_name,
//           updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
//         })
//         .where({ uuid: user_uuid });
//       const aftterUpdate = await knex('users')
//         .where({ uuid: user_uuid })
//         .first();

//       return response.json({
//         data: `${first_name} ${last_name}`,
//         updated_at: aftterUpdate.updated_at,
//       });
//     }

//     if (user.first_name === first_name && user.last_name === last_name) {
//       await knex('users')
//         .update({
//           updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
//         })
//         .where({ uuid: user_uuid });

//       const aftterUpdate = await knex('users')
//         .where({ uuid: user_uuid })
//         .first();

//       return response.json({
//         data: `${first_name} ${last_name}`,
//         updated_at: aftterUpdate.updated_at,
//       });
//     }

//     if (user.first_name !== first_name && user.last_name !== last_name) {
//       await knex('users')
//         .update({
//           first_name,
//           last_name,
//           updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
//         })
//         .where({ uuid: user_uuid });

//       const aftterUpdate = await knex('users')
//         .where({ uuid: user_uuid })
//         .first();

//       return response.json({
//         data: `${first_name} ${last_name}`,
//         updated_at: aftterUpdate.updated_at,
//       });
//     }
//   } catch (error) {
//     return response.status(400).json({ error: error.message });
//   }
// });

module.exports = usersRouter;
