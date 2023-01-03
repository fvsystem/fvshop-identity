import { EntityValidationError } from '@fvsystem/fvshop-shared-entities';
import { CredentialFactory } from './credential.factory';

const compareMock = jest.fn();
const hashMock = jest.fn();

const hashServiceMock = {
  compare: compareMock,
  hash: hashMock,
};

describe('CredentialUserFactory', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a valid user', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    const userCredential = await CredentialFactory.create(
      { email: 'test@test.com', password: 'passValid4', userId: '123' },
      hashServiceMock
    );
    expect(userCredential).toBeDefined();
    expect(userCredential.email).toBe('test@test.com');
    expect(userCredential.passwordHashed).toBe('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    expect(userCredential.id).toBe('123');
  });

  it('should throw an error when email is invalid', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    expect(
      CredentialFactory.create(
        { email: 's', password: 'passValid4', userId: '123' },
        hashServiceMock
      )
    ).rejects.toThrowError(EntityValidationError);
  });

  it('should throw an error when password is invalid', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    expect(
      CredentialFactory.create(
        { email: 'test@test.com', password: 'rer', userId: '123' },
        hashServiceMock
      )
    ).rejects.toThrowError(EntityValidationError);
  });
});
