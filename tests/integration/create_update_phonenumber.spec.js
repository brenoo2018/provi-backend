const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('CREATE OR UPDATE PHONE NUMBER', () => {
  afterAll(async () => {
    await connection.destroy();
  });
  it('should be able to create or update PHONE NUMBER', async () => {
    const response = await request(app)
      .post('/students/phone-number')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDIwOTcyMDMsImV4cCI6MTYwMjE4MzYwMywic3ViIjoiZDVmMDA0N2MtYjEzNS00MGJjLTg2YWYtNDk5N2YwOTIzYjY1In0.Z2-LaHC-90nhGHUIjm6MZzj7EMCrIk_AozrTIoM2j-c'
      )
      .send({
        phone_number: 12345678910,
      });

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('updated_at');
  });
});
