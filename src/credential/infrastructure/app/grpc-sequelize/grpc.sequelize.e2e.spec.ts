/* eslint-disable import/no-extraneous-dependencies */
import * as grpc from '@grpc/grpc-js';
import {
  HashServiceBCryptJS,
  JWTServiceJsonWebToken,
} from '@fvsystem/fvshop-shared-entities';
import { v4 as uuid } from 'uuid';
import { promisify } from 'util';
import { getConfigTest } from '../../config';
import { getAppGrpc } from '../../grpc';
import {
  CredentialMapper,
  CredentialModel,
  CredentialRepositorySequelize,
  getAppSequelize,
} from '../../sequelize';

const config = getConfigTest();

const uuidValue = uuid();

const userFacade = {
  getUserByEmail: {
    execute: jest.fn().mockImplementation(({ email }: { email: string }) => ({
      id: uuidValue,
      email,
      roles: ['admin'],
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
    })),
  },
  createUser: {
    execute: jest.fn(),
  },
  getUserById: {
    execute: jest.fn(),
  },
  getAllUsers: {
    execute: jest.fn(),
  },
};

describe('ExpressSequelize', () => {
  jest.setTimeout(10000);
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
    const credentialRepository = new CredentialRepositorySequelize(
      CredentialModel,
      CredentialMapper.mapToEntity,
      CredentialMapper.mapToModel
    );
    const app = getAppGrpc(
      credentialRepository,
      hashService,
      jwtService,
      userFacade
    );

    let address: number;

    await new Promise<void>((resolve, reject) => {
      app.server.bindAsync(
        'localhost:0',
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
          if (err) {
            reject(err);
          } else {
            app.server.start();
            address = port;
            resolve();
          }
        }
      );
    });

    const client = app.getClient('localhost', address);

    const register = promisify(client.Register.bind(client));

    await register({
      email: 'test@test.com',
      password: 'validPassw0rd',
      userId: uuidValue,
    });

    client.close();

    app.server.forceShutdown();

    const credential = await credentialRepository.findByEmail('test@test.com');

    expect(credential).toBeTruthy();
    const sleep = promisify(setTimeout);
    await sleep(6000);
  });
});
