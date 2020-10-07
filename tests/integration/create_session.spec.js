const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('CREATE SESSION', () => {
  beforeEach(async () => {
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });
  it('should be able to create a new SESSION', async () => {
    const response = await request(app).post('/sessions/create').send({
      email: 'email4@teste.com',
      password: '123456',
    });

    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
  });
});
