/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import { UniqueEntityId } from '@fvsystem/fvshop-shared-entities';
import {
  CredentialEntity,
  MockCredentialRepository,
  PasswordValueObject,
} from '@root/credential/domain';
import { getJWTServiceMock, getUserFacade, hashMock } from '../../testing';
import { getAppExpress } from './app.express';

let app: Express;

const uuidValue = uuid();

describe('App Express', () => {
  beforeAll(async () => {
    const jwtServiceMock = getJWTServiceMock(uuidValue);

    const password = await PasswordValueObject.create(
      {
        password: 'validHFH676',
      },
      hashMock
    );
    const credential = new CredentialEntity(
      {
        password,
        email: 'test@test.com',
      },
      new UniqueEntityId(uuidValue)
    );

    const credentialRepository = new MockCredentialRepository(credential);

    const userData = {
      id: uuidValue,
      email: 'test@test.com',
      firstName: 'test',
      lastName: 'test',
      fullName: 'test test',
      roles: ['user'],
    };

    const userFacade = getUserFacade(uuidValue, userData);

    app = getAppExpress(
      credentialRepository,
      userFacade,
      hashMock,
      jwtServiceMock
    );
  });
  it('should verify credential', async () => {
    const { body } = await request(app)
      .post('/login')
      .send({
        email: 'test@test.com',
        password: 'validHFH676',
      })
      .expect(200);
    expect(body).toHaveProperty('token');
  });

  it('should not verify wrong credential', async () => {
    const { body } = await request(app)
      .post('/login')
      .send({
        email: 'test@test.com',
        password: 'validHFH676fdf',
      })
      .expect(401);
    expect(body).not.toHaveProperty('token');
  });
});
