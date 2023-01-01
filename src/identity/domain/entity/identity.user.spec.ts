import { EntityValidationError } from '@fvsystem/fvshop-shared-entities';
import { PasswordValueObject } from '../value-object';
import { IdentityUserEntity } from './identity.user';

const compareMock = jest.fn();
const hashMock = jest.fn();

const hashServiceMock = {
  compare: compareMock,
  hash: hashMock,
};
describe('IdentityUser', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should create a identity user', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    const password = await PasswordValueObject.create(
      {
        password: 'fdfdHFJ4345',
      },
      hashServiceMock
    );
    const identity = new IdentityUserEntity({
      password,
      email: 'test@test.com',
    });
    expect(identity).toBeDefined();
    expect(identity.passwordHashed).toBe('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    expect(identity.props.email).toBe('test@test.com');
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
        new IdentityUserEntity({
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
    const identity = new IdentityUserEntity({
      password,
      email: 'test@test.com',
    });

    expect(identity).toBeDefined();
    expect(identity.passwordHashed).toBe('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    expect(identity.email).toBe('test@test.com');

    identity.changeEmail('ff@ff.com');
    expect(identity.email).toBe('ff@ff.com');
  });
});
