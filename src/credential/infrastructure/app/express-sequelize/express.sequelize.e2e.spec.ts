/* eslint-disable import/no-extraneous-dependencies */
import {
  HashServiceBCryptJS,
  JWTServiceJsonWebToken,
} from '@fvsystem/fvshop-shared-entities';
import { UserFacadeProxyGrpc } from '@fvsystem/fvshop-user-manager';
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

jest.mock('@grpc/proto-loader', () => ({
  loadSync: jest.fn().mockReturnValue({}),
}));

jest.mock('@grpc/grpc-js', () => ({
  credentials: {
    createInsecure: jest.fn(),
  },
  loadPackageDefinition: jest.fn().mockReturnValue({
    GetByEmail: jest.fn().mockReturnValue({
      GetByEmail: {
        bind: jest.fn().mockReturnValue(
          jest
            .fn()
            .mockImplementation(
              ({ email }: { email: string }, callback: any) => {
                callback(null, {
                  user: {
                    id: uuidValue,
                    email,
                    roles: ['admin'],
                    firstName: 'John',
                    lastName: 'Doe',
                    fullName: 'John Doe',
                  },
                });
              }
            )
        ),
      },
    }),

    CreateUser: jest.fn().mockReturnValue({
      CreateUser: jest.fn(),
    }),

    GetById: jest.fn().mockReturnValue({
      GetById: jest.fn(),
    }),
    GetAllUsers: jest.fn().mockReturnValue({
      GetAllUsers: jest.fn(),
    }),
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
    const userFacade = new UserFacadeProxyGrpc('user-manager', 50051);
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
