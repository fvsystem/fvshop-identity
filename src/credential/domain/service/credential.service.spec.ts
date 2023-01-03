import { EntityValidationError } from '@fvsystem/fvshop-shared-entities';
import { CredentialFactory } from '../entity';
import { InvalidPasswordError } from '../error';
import { CredentialService } from './credential.service';

const compareMock = jest.fn();
const hashMock = jest.fn();

const signMock = jest.fn();
const verifyMock = jest.fn();

const hashServiceMock = {
  compare: compareMock,
  hash: hashMock,
};

const hashJwtServiceMock = {
  sign: signMock,
  verify: verifyMock,
};

describe('CredentialService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should create a user credential', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    const credentialService = new CredentialService(
      hashServiceMock,
      hashJwtServiceMock
    );
    const { credential } = await credentialService.createCredential({
      email: 'test@test.com',
      password: 'passValid4',
      userId: '123',
    });
    expect(credential).toBeDefined();
    expect(credential.email).toBe('test@test.com');
    expect(credential.passwordHashed).toBe('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    expect(credential.id).toBe('123');
  });

  it('should not create a user credential with invalid email', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    const credentialService = new CredentialService(
      hashServiceMock,
      hashJwtServiceMock
    );
    expect(() =>
      credentialService.createCredential({
        email: 't.com',
        password: 'passValid4',
        userId: '123',
      })
    ).rejects.toThrowError(EntityValidationError);
  });

  it('should not create a user credential with invalid password', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    const credentialService = new CredentialService(
      hashServiceMock,
      hashJwtServiceMock
    );
    expect(() =>
      credentialService.createCredential({
        email: 'test@test.com',
        password: 'fd',
        userId: '123',
      })
    ).rejects.toThrowError(EntityValidationError);
  });

  it('should not verify a user credential with invalid password', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    compareMock.mockResolvedValue(false);
    const credentialService = new CredentialService(
      hashServiceMock,
      hashJwtServiceMock
    );
    const credential = await CredentialFactory.create(
      {
        email: 'test@test.com',
        password: 'ffhfVff344d',
        userId: '123',
      },
      hashServiceMock
    );
    expect(() =>
      credentialService.validateCredential({
        email: 'test@test.com',
        password: 'ffhfVff344d',
        issuer: 'test',
        credential,
        subject: 'test',
        audience: 'test',
        scope: ['system'],
      })
    ).rejects.toThrowError(InvalidPasswordError);
  });

  it('should not verify a user credential with invalid email', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    compareMock.mockResolvedValue(true);
    const credentialService = new CredentialService(
      hashServiceMock,
      hashJwtServiceMock
    );
    const credential = await CredentialFactory.create(
      {
        email: 'test2@test.com',
        password: 'ffhfVff344d',
        userId: '123',
      },
      hashServiceMock
    );
    expect(() =>
      credentialService.validateCredential({
        email: 'test@test.com',
        password: 'ffhfVff344d',
        issuer: 'test',
        credential,
        subject: 'test',
        audience: 'test',
        scope: ['system'],
      })
    ).rejects.toThrowError(InvalidPasswordError);
  });

  it('should create a token for valid user', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    compareMock.mockResolvedValue(true);
    signMock.mockResolvedValue('token');
    const credentialService = new CredentialService(
      hashServiceMock,
      hashJwtServiceMock
    );

    const credential = await CredentialFactory.create(
      {
        email: 'test@test.com',
        password: 'ffhfVff344ffd',
        userId: '123',
      },
      hashServiceMock
    );
    const token = await credentialService.validateCredential({
      email: 'test@test.com',
      password: 'ffhfVff344d',
      issuer: 'test',
      credential,
      subject: 'test',
      audience: 'test',
      scope: ['system'],
    });
    expect(token).toEqual({ token: 'token' });
  });
});
