import { EntityValidationError } from '@fvsystem/fvshop-shared-entities';
import { IdentityUserFactory } from './identity-user.factory';

const compareMock = jest.fn();
const hashMock = jest.fn();

const hashServiceMock = {
  compare: compareMock,
  hash: hashMock,
};

describe('IdentityUserFactory', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a valid user', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    const userIdentity = await IdentityUserFactory.create(
      { email: 'test@test.com', password: 'passValid4' },
      hashServiceMock
    );
    expect(userIdentity).toBeDefined();
    expect(userIdentity.email).toBe('test@test.com');
    expect(userIdentity.passwordHashed).toBe('jfhdksjfdsjkfhdskjfhdsjkfhfh');
  });

  it('should throw an error when email is invalid', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    expect(
      IdentityUserFactory.create(
        { email: 's', password: 'passValid4' },
        hashServiceMock
      )
    ).rejects.toThrowError(EntityValidationError);
  });

  it('should throw an error when password is invalid', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    expect(
      IdentityUserFactory.create(
        { email: 'test@test.com', password: 'rer' },
        hashServiceMock
      )
    ).rejects.toThrowError(EntityValidationError);
  });
});
