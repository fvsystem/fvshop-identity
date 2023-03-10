import { v4 as uuid } from 'uuid';
import { promisify } from 'util';
import * as grpc from '@grpc/grpc-js';
import { UniqueEntityId } from '@fvsystem/fvshop-shared-entities';
import {
  CredentialEntity,
  MockCredentialRepository,
  PasswordValueObject,
} from '@root/credential/domain';
import { getJWTServiceMock, getUserFacade, hashMock } from '../../testing';
import { getAppGrpc, ServerGrpc } from './grpc.app';
import { RegisterClient } from '../proto';
import { HealthClient } from '../proto/grpc/health/v1/Health';

let app: ServerGrpc;
let client: RegisterClient;
let health: HealthClient;

const uuidValue = uuid();

describe('App Express', () => {
  jest.setTimeout(10000);
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

    app = getAppGrpc(
      credentialRepository,
      hashMock,
      jwtServiceMock,
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

    const clients = app.getClient(address);
    health = clients.Health;
    client = clients.Register;
  });

  afterAll(async () => {
    client.close();
    health.close();
    const sleep = promisify(setTimeout);
    await sleep(6000);
    const finish = promisify(app.server.tryShutdown.bind(app.server));
    await finish();
  });

  it('should register credential', async () => {
    const checkHealth = promisify(health.Check.bind(health));

    await expect(checkHealth({})).resolves.toEqual({ status: 1 });
    const register = promisify(client.Register.bind(client));

    await expect(
      register({
        email: 'test@test.com',
        password: 'validHFH676',
        userId: uuidValue,
      })
    ).resolves.toEqual({});
  });

  it('should not register credential', async () => {
    const register = promisify(client.Register.bind(client));

    await expect(
      register({
        email: 'test@test.com',
        password: 'validHFH676',
        userId: 'noUser',
      })
    ).rejects.toBeTruthy();
  });
});
