import { EntityValidationError } from '@fvsystem/fvshop-shared-entities';
import { InvalidPasswordError } from '../error';
import { IdentityService } from './identity.service';

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

describe('IdentityService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should create a user identity', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    const identityService = new IdentityService(
      hashServiceMock,
      hashJwtServiceMock
    );
    const identity = await identityService.createIdentityUser({
      email: 'test@test.com',
      password: 'passValid4',
    });
    expect(identity).toBeDefined();
    expect(identity.email).toBe('test@test.com');
    expect(identity.passwordHashed).toBe('jfhdksjfdsjkfhdskjfhdsjkfhfh');
  });

  it('should not create a user identity with invalid email', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    const identityService = new IdentityService(
      hashServiceMock,
      hashJwtServiceMock
    );
    expect(() =>
      identityService.createIdentityUser({
        email: 't.com',
        password: 'passValid4',
      })
    ).rejects.toThrowError(EntityValidationError);
  });

  it('should not create a user identity with invalid password', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    const identityService = new IdentityService(
      hashServiceMock,
      hashJwtServiceMock
    );
    expect(() =>
      identityService.createIdentityUser({
        email: 'test@test.com',
        password: 'fd',
      })
    ).rejects.toThrowError(EntityValidationError);
  });

  it('should not verify a user identity with invalid password', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    compareMock.mockResolvedValue(false);
    const identityService = new IdentityService(
      hashServiceMock,
      hashJwtServiceMock
    );
    expect(() =>
      identityService.validateUser({
        email: 'test@test.com',
        password: 'ffhfVff344d',
        issuer: 'test',
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
    const identityService = new IdentityService(
      hashServiceMock,
      hashJwtServiceMock
    );
    const token = await identityService.validateUser({
      email: 'test@test.com',
      password: 'ffhfVff344d',
      issuer: 'test',
      subject: 'test',
      audience: 'test',
      scope: ['system'],
    });
    expect(token).toEqual({ token: 'token' });
  });
});
