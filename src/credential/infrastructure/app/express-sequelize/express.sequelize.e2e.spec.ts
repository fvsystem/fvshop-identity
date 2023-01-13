/* eslint-disable import/no-extraneous-dependencies */
import {
  HashServiceBCryptJS,
  JWTServiceJsonWebToken,
} from '@fvsystem/fvshop-shared-entities';
import { UserFacadeProxyExpress } from '@fvsystem/fvshop-user-manager';
import { CreateCredentialUseCase } from '@root/credential/application';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import { getConfigTest } from '../../config';
import { getAppExpress } from '../../express';
import {
  CredentialMapper,
  CredentialModel,
  CredentialRepositorySequelize,
  getAppSequelize,
} from '../../sequelize';

const config = getConfigTest();

const uuidValue = uuid();

jest.mock('axios', () => ({
  get: jest.fn().mockImplementation(async (path: string, values: unknown) => {
    if (!path.includes('mail')) {
      const id = path.split('/').pop();

      if (id !== uuidValue) {
        throw new Error('User not found');
      }
      return {
        data: {
          user: {
            id,
            email: 'test@test.com',
            roles: ['user'],
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
          },
        },
      };
    }
    if (path.includes('mail')) {
      const {
        params: { email },
      } = values as { params: { email: string } };
      return {
        data: {
          user: {
            id: uuidValue,
            email,
            roles: ['user'],
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
          },
        },
      };
    }
  }),
}));

describe('ExpressSequelize', () => {
  beforeEach(async () => {
    await getAppSequelize(config);
  });

  it('should register', async () => {
    const hashService = new HashServiceBCryptJS(10);
    const jwtService = new JWTServiceJsonWebToken<{
      email: string;
      userId: string;
      scope: string[];
    }>({
      algorithm: 'RS256',
      expiration: '15m',
      privateKey: config.jwt.privateKey,
      publicKey: config.jwt.publicKey,
    });
    const userFacade = new UserFacadeProxyExpress('user-manager');
    const credentialRepository = new CredentialRepositorySequelize(
      CredentialModel,
      CredentialMapper.mapToEntity,
      CredentialMapper.mapToModel
    );
    const app = getAppExpress(
      credentialRepository,
      userFacade,
      hashService,
      jwtService
    );

    const createCredentialUseCase = new CreateCredentialUseCase(
      credentialRepository,
      hashService,
      jwtService
    );

    await createCredentialUseCase.execute({
      email: 'test@test.com',
      password: 'validPassw0rd',
      userId: uuidValue,
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@test.com',
        password: 'validPassw0rd',
      })
      .expect(200);
    expect(response.body).toHaveProperty('token');

    await request(app)
      .post('/login')
      .send({
        email: 'test@test.com',
        password: 'validPassw0rda',
      })
      .expect(401);
  });
});
