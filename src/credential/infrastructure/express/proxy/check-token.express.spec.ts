/* eslint-disable import/no-extraneous-dependencies */
import { v4 as uuid } from 'uuid';
import express from 'express';
import request from 'supertest';
import { checkTokenExpress } from './check-token.express';

const uuidValue = uuid();

const jwtServiceMock = {
  sign: jest.fn().mockReturnValue('token'),
  verify: jest.fn().mockImplementation((token) => {
    if (token === 'token') {
      return Promise.resolve({
        userId: uuidValue,
        email: 'test@test.com',
        scope: ['user'],
      });
    }
    return Promise.reject(new Error('Invalid token'));
  }),
};

const app = express();

app.get('/ok', checkTokenExpress(['user'], jwtServiceMock), (req, res) => {
  res.send('Hello World!');
});

app.get('/nok', checkTokenExpress(['admin'], jwtServiceMock), (req, res) => {
  res.send('Hello World!');
});

describe('VerifyCredentialUseCase', () => {
  it('should return 200 if token is valid', async () => {
    const response = await request(app)
      .get('/ok')
      .set('Authorization', 'bearer token');
    expect(response.status).toBe(200);
  });
  it('should return 401 if token is not valid', async () => {
    const response = await request(app)
      .get('/ok')
      .set('Authorization', 'bearer tokena');
    expect(response.status).toBe(401);
  });

  it('should return 401 if token is not sent', async () => {
    const response = await request(app).get('/ok');
    expect(response.status).toBe(401);
  });

  it('should return 401 if role is not correct', async () => {
    const response = await request(app)
      .get('/nok')
      .set('Authorization', 'bearer token');
    expect(response.status).toBe(401);
  });
});
