const { Router } = require('express');
const { isUuid, uuid: funcUuid } = require('uuidv4');
const Yup = require('yup');
const requestApi = require('axios');

const knex = require('../database/connection');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const getValidationErrors = require('../utils/getValidationErrors');
const app = require('../app');

const studentsRouter = Router();

studentsRouter.use(ensureAuthenticated);

studentsRouter.post('/cpf', async (request, response) => {
  try {
    const schema = Yup.object().shape({
      cpf: Yup.string().matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, 'CPF inválido'),
    });

    await schema.validate(request.body, {
      abortEarly: false,
    });

    const { cpf } = request.body;
    const { user_uuid } = request.user;

    let CpfClean = cpf;
    CpfClean = CpfClean.replace(/\.|-/g, '');

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
      .where({ cpf: CpfClean })
      .select(['cpf', 'user_uuid']);

    if (findCpfUsers.length > 0) {
      if (findCpfUsers[0].user_uuid !== user_uuid) {
        return response.status(400).json({ message: 'CPF already exists' });
      }
    }

    if (!user.cpf) {
      await knex('students').insert({
        uuid: funcUuid(),
        cpf: CpfClean,
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
        amount_request: user.amount_request,
        user_uuid,
        created_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
      });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      return response.json({
        data: CpfClean,
        updated_at: aftterUpdate.updated_at,
        next_end_point: '/students/full-name',
      });
    }

    if (user.cpf === CpfClean) {
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
        data: CpfClean,
        updated_at: aftterUpdate.updated_at,
        next_end_point: '/students/full-name',
      });
    }

    if (user.cpf !== CpfClean) {
      await knex('students').insert({
        uuid: funcUuid(),
        cpf: CpfClean,
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
        amount_request: user.amount_request,
        user_uuid,
        created_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
        updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
      });

      const aftterUpdate = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      return response.json({
        data: CpfClean,
        updated_at: aftterUpdate.updated_at,
        next_end_point: '/students/full-name',
      });
    }
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors = getValidationErrors(error);

      return response.json({ errors });
    } else {
      return response.status(400).json({ error: error.message });
    }
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

    if (!user.cpf) {
      return response
        .status(400)
        .json({ message: 'Register your CPF first in endpoint /students/cpf' });
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
        amount_request: user.amount_request,
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
        next_end_point: '/students/birthday',
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
        next_end_point: '/students/birthday',
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
        amount_request: user.amount_request,
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
        next_end_point: '/students/birthday',
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

    if (!user.first_name && !user.last_name) {
      return response.status(400).json({
        message:
          'Register your FULL NAME first in endpoint /students/full-name',
      });
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
        amount_request: user.amount_request,
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
        next_end_point: '/students/phone-number',
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
        next_end_point: '/students/phone-number',
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
        amount_request: user.amount_request,
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
        next_end_point: '/students/phone-number',
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

    if (!user.birthday) {
      return response.status(400).json({
        message: 'Register your BIRTHDAY first in endpoint /students/birthday',
      });
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
        amount_request: user.amount_request,
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
        next_end_point: '/students/address',
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
        next_end_point: '/students/address',
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
        amount_request: user.amount_request,
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
        next_end_point: '/students/address',
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

    if (typeof number !== 'number') {
      return response.status(400).json({ message: 'Only numbers' });
    }

    if (!isUuid(user_uuid)) {
      return response.status(400).json({ message: 'Does not Uuid' });
    }

    const responseApi = await requestApi.get(
      `https://brasilapi.com.br/api/cep/v1/${cep}`
    );

    if (responseApi.data) {
      const user = await knex('students')
        .where({ user_uuid })
        .first()
        .orderBy('updated_at', 'desc');

      if (!user) {
        return response.status(400).json({ message: 'User does not exists' });
      }

      if (!user.phone_number) {
        return response.status(400).json({
          message:
            'Register your PHONE NUMBER first in endpoint /students/phone-number',
        });
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
          amount_request: user.amount_request,
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
          next_end_point: '/students/amount_request',
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
          next_end_point: '/students/amount_request',
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
          amount_request: user.amount_request,
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
          next_end_point: '/students/amount_request',
        });
      }
    }
  } catch (error) {
    if (error.isAxiosError) {
      // console.log(error.response.data.message);
      return response.status(400).json({ error: 'CEP invalid' });
    } else {
      return response.status(400).json({ error: error.message });
    }
  }
});

studentsRouter.post('/amount-request', async (request, response) => {
  try {
    const schema = Yup.object().shape({
      amount_request: Yup.string().matches(/^\d*\,{1}\d*$/, 'formato inválido'),
    });

    await schema.validate(request.body, {
      abortEarly: false,
    });

    const { amount_request } = request.body;
    const { user_uuid } = request.user;

    let amount = amount_request.toString().replace(',', '');

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
      return response.status(400).json({
        message: 'Register your ADDRESS first in endpoint /students/address',
      });
    }

    await knex('students').insert({
      uuid: funcUuid(),
      first_name: user.first_name,
      last_name: user.last_name,
      cpf: user.cpf,
      birthday: user.birthday,
      phone_number: user.phone_number,
      cep: user.cep,
      street: user.street,
      number: user.number,
      complement: user.complement,
      state: user.state,
      city: user.city,
      amount_request: Number(amount),
      user_uuid,
      created_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
      updated_at: knex.raw(`strftime('%Y-%m-%d %H:%M:%S', 'now')`),
    });

    const aftterUpdate = await knex('students')
      .where({ user_uuid })
      .first()
      .orderBy('updated_at', 'desc');

    return response.json({
      data: amount_request,
      updated_at: aftterUpdate.updated_at,
    });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors = getValidationErrors(error);

      return response.json({ errors });
    } else {
      return response.status(400).json({ error: error.message });
    }
  }
});

module.exports = studentsRouter;
