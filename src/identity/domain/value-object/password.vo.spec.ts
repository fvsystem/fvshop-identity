import { EntityValidationError } from '@fvsystem/fvshop-shared-entities';
import { PasswordValueObject } from './password.vo';

const compareMock = jest.fn();
const hashMock = jest.fn();

const hashServiceMock = {
  compare: compareMock,
  hash: hashMock,
};

describe('PasswordValueObject', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a password', async () => {
    hashMock.mockResolvedValue('hashedPasswordLongEnoughtoBeValid');
    const password = await PasswordValueObject.create(
      { password: 'passValid4' },
      hashServiceMock
    );
    expect(password).toBeDefined();
    expect(password.passwordHashed).toBe('hashedPasswordLongEnoughtoBeValid');
  });

  it('should validate a password', async () => {
    hashMock.mockResolvedValue('hashedPasswordLongEnoughtoBeValid');
    expect(() =>
      PasswordValueObject.create({ password: 'password' }, hashServiceMock)
    ).rejects.toThrowError(EntityValidationError);
  });

  it('should compare a password', async () => {
    hashMock.mockResolvedValue('hashedPasswordLongEnoughtoBeValid');
    compareMock.mockResolvedValue(true);
    const password = await PasswordValueObject.create(
      { password: 'passValid4' },
      hashServiceMock
    );
    const isValid = await password.comparePassword(
      'passValid4',
      hashServiceMock
    );
    expect(isValid).toBe(true);
  });

  it('should compare a password - version false', async () => {
    hashMock.mockResolvedValue('hashedPasswordLongEnoughtoBeValid');
    compareMock.mockResolvedValue(false);
    const password = await PasswordValueObject.create(
      { password: 'passValid4' },
      hashServiceMock
    );
    const isValid = await password.comparePassword(
      'passValid4d',
      hashServiceMock
    );
    expect(isValid).toBe(false);
  });
});
