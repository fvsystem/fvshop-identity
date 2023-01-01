import { UniqueEntityId } from '@fvsystem/fvshop-shared-entities';
import { PasswordValueObject } from '../value-object';
import { IdentityEntity, IdentityProps } from './identity.abstract';

class Identity extends IdentityEntity<IdentityProps> {
  constructor(props: IdentityProps, id?: UniqueEntityId) {
    super(props, id);
  }
}

const compareMock = jest.fn();
const hashMock = jest.fn();

const hashServiceMock = {
  compare: compareMock,
  hash: hashMock,
};

describe('IdentityAbstract', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should create a identity', async () => {
    hashMock.mockResolvedValue('jfhdksjfdsjkfhdskjfhdsjkfhfh');
    const password = await PasswordValueObject.create(
      {
        password: 'fdfdHFJ4345',
      },
      hashServiceMock
    );
    const identity = new Identity({
      password,
    });
    expect(identity).toBeDefined();
    expect(identity.passwordHashed).toBe('jfhdksjfdsjkfhdskjfhdsjkfhfh');
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
    const identity = new Identity({
      password,
    });

    const isValid = await identity.comparePassword(
      'fdfdHFJ4345',
      hashServiceMock
    );
    expect(isValid).toBeTruthy();

    compareMock.mockResolvedValueOnce(false);

    const notValid = await identity.comparePassword(
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
    const identity = new Identity({
      password,
    });

    const oldPassword = identity.props.password;

    hashMock.mockResolvedValueOnce('jfhdksjfdsjkfhdskjfhdsjkfhfhfdf');

    await identity.changePassword('dsdsff3Jvnd434', hashServiceMock);

    expect(identity.props.password).not.toBe(oldPassword);
  });
});
