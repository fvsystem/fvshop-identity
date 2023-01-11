import {
  NotFoundError,
  UniqueEntityId,
} from '@fvsystem/fvshop-shared-entities';
import {
  CredentialEntity,
  InvalidPasswordError,
  MockCredentialRepository,
  PasswordValueObject,
} from '@root/credential/domain';
import {
  getJWTServiceMock,
  getUserFacade,
  hashMock,
} from '@root/credential/infrastructure/testing';
import { v4 as uuid } from 'uuid';
import { VerifyCredentialUseCase } from './verify-credential.usecase';

const uuidValue = uuid();
const userData = {
  id: uuidValue,
  email: 'test@test.com',
  firstName: 'test',
  lastName: 'test',
  fullName: 'test test',
  roles: ['user'],
};

const userFacadeMock = getUserFacade(uuidValue, userData);

const jwtServiceMock = getJWTServiceMock(uuidValue);

let credential: CredentialEntity;

describe('VerifyCredentialUseCase', () => {
  beforeAll(async () => {
    const password = await PasswordValueObject.create(
      {
        password: 'validHFH676',
      },
      hashMock
    );

    credential = new CredentialEntity(
      {
        password,
        email: 'test@test.com',
      },
      new UniqueEntityId(uuidValue)
    );
  });
  it('should verify credential', async () => {
    const credentialRepository = new MockCredentialRepository(credential);
    const verifyCredentialUseCase = new VerifyCredentialUseCase(
      userFacadeMock,
      credentialRepository,
      hashMock,
      jwtServiceMock
    );
    const { token } = await verifyCredentialUseCase.execute({
      email: 'test@test.com',
      password: 'validHFH676',
    });
    expect(token).toBe('token');
  });

  it('should not verify credential with wrong password', async () => {
    const credentialRepository = new MockCredentialRepository(credential);
    const verifyCredentialUseCase = new VerifyCredentialUseCase(
      userFacadeMock,
      credentialRepository,
      hashMock,
      jwtServiceMock
    );
    expect(() =>
      verifyCredentialUseCase.execute({
        email: 'test@test.com',
        password: 'validHFH6764',
      })
    ).rejects.toThrowError(InvalidPasswordError);
  });

  it('should not verify credential with inexistent email', async () => {
    const credentialRepository = new MockCredentialRepository(credential);
    const verifyCredentialUseCase = new VerifyCredentialUseCase(
      userFacadeMock,
      credentialRepository,
      hashMock,
      jwtServiceMock
    );
    expect(() =>
      verifyCredentialUseCase.execute({
        email: 'test2@test.com',
        password: 'validHFH6764',
      })
    ).rejects.toThrowError(NotFoundError);
  });
});
