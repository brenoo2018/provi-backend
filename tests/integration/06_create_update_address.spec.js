const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('CREATE OR UPDATE ADDRESS', () => {
  afterAll(async () => {
    await connection.destroy();
  });
  it('should be able to create or update ADDRESS', async () => {
    const response = await request(app)
      .post('/students/address')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDIxMjcwMTIsImV4cCI6MTYwMjIxMzQxMiwic3ViIjoiYWQ1ZTc0YzYtZGNmZC00NGY4LWI0MWItNGY5NjI5YWI5NmQ3In0.rBY8I2gSRCYfNvqGSl94YEzcUQe9QO9oHe8Z-7-KTtc'
      )
      .send({
        cep: '64016903',
        street: 'rua das palmeiras',
        number: 2139,
        complement: 'não possui',
        state: 'PI',
        city: 'Teresina',
      });

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('updated_at');
    expect(response.body).toHaveProperty('next_end_point');
  });
});
