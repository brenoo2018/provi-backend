const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('CREATE USER', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });
  it('should be able to create a new USER', async () => {
    const response = await request(app).post('/users/create').send({
      email: 'email4@teste.com',
      password: '123456',
    });

    //criar um novo usuário
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('next_end_point');

    // criar novamente o mesmo usuário anterior
    // expect(response.body).toHaveProperty('message');
  });
});
