import { EntityValidationError } from '@fvsystem/fvshop-shared-entities';
import { PasswordValueObject } from '../value-object';
import { CredentialEntity } from './credential.entity';

const compareMock = jest.fn();
const hashMock = jest.fn();

const hashServiceMock = {
  compare: compareMock,
  hash: hashMock,
};

describe('CredentialEntity', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should create a credential', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    const password = await PasswordValueObject.create(
      {
        password: 'fdfdHFJ4345',
      },
      hashServiceMock
    );
    const credential = new CredentialEntity({
      password,
      email: 'test@test.com',
    });
    expect(credential).toBeDefined();
    expect(credential.passwordHashed).toBe('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    expect(credential.email).toBe('test@test.com');
  });

  it('should compare password correctly', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    compareMock.mockResolvedValueOnce(true);
    const password = await PasswordValueObject.create(
      {
        password: 'fdfdHFJ4345',
      },
      hashServiceMock
    );
    const credential = new CredentialEntity({
      password,
      email: 'test@test.com',
    });

    const isValid = await credential.comparePassword(
      'fdfdHFJ4345',
      hashServiceMock
    );
    expect(isValid).toBeTruthy();

    compareMock.mockResolvedValueOnce(false);

    const notValid = await credential.comparePassword(
      'jfhdksjfdsjkfhdskjfhdsjkfhfh9',
      hashServiceMock
    );
    expect(notValid).toBeFalsy();
  });

  it('should change Password', async () => {
    hashMock.mockResolvedValueOnce('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    const password = await PasswordValueObject.create(
      {
        password: 'fdfdHFJ4345',
      },
      hashServiceMock
    );
    const credential = new CredentialEntity({
      password,
      email: 'test@test.com',
    });

    const oldPassword = credential.props.password;

    hashMock.mockResolvedValueOnce('jfhdksjfdsjkfhdskjfhdsjkfhfhfdf');

    await credential.changePassword('dsdsff3Jvnd434', hashServiceMock);

    expect(credential.props.password).not.toBe(oldPassword);
  });

  it('should validate on Creation with invalid email', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjasync kfhfh');
    const password = await PasswordValueObject.create(
      {
        password: 'fdfdHFJ4345',
      },
      hashServiceMock
    );
    expect(
      () =>
        new CredentialEntity({
          password,
          email: 'a',
        })
    ).toThrowError(EntityValidationError);
  });

  it('should change email', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    const password = await PasswordValueObject.create(
      {
        password: 'fdfdHFJ4345',
      },
      hashServiceMock
    );
    const credential = new CredentialEntity({
      password,
      email: 'test@test.com',
    });

    expect(credential).toBeDefined();
    expect(credential.passwordHashed).toBe('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    expect(credential.email).toBe('test@test.com');

    credential.changeEmail('ff@ff.com');
    expect(credential.email).toBe('ff@ff.com');
  });
});
