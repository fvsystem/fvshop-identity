import {
  NotFoundError,
  UniqueEntityId,
} from '@fvsystem/fvshop-shared-entities';
import {
  CredentialEntity,
  CredentialRepositoryInterface,
  InvalidPasswordError,
  PasswordValueObject,
} from '@root/credential/domain';
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

const jwtServiceMock = {
  sign: jest.fn().mockReturnValue('token'),
  verify: jest.fn().mockImplementation((token) => {
    if (token === 'token') {
      return Promise.resolve({
        userId: uuidValue,
        email: 'test@test.com',
        scope: ['user'],
      });
    }
    return Promise.reject(new Error('Invalid token'));
  }),
};

const userFacadeMock = {
  getUserById: {
    execute: jest.fn().mockImplementation(({ id }) => {
      if (id === uuidValue) {
        return Promise.resolve({ user: userData });
      }
      return Promise.reject(new NotFoundError('User not found'));
    }),
  },

  getUserByEmail: {
    execute: jest.fn().mockImplementation(({ email }) => {
      if (email === 'test@test.com') {
        return Promise.resolve({ user: userData });
      }
      return Promise.reject(new NotFoundError('User not found'));
    }),
  },
};

const hashMock = {
  compare: jest.fn().mockImplementation((password, hash) => {
    if (password === 'validHFH676' && hash === 'jfhdksjfdsjkfhdskjfhdsjkfhfh') {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }),
  hash: jest.fn().mockReturnValue('jfhdksjfdsjkfhdskjfhdsjkfhfh'),
};

let credential: CredentialEntity;

class MockCredentialRepository implements CredentialRepositoryInterface {
  sortableFields: string[] = ['email'];

  credential: CredentialEntity;

  constructor(credentialProp: CredentialEntity) {
    this.credential = credentialProp;
  }

  async findByEmail(email: string): Promise<CredentialEntity> {
    if (email === 'noCredential') {
      throw new NotFoundError('Credential not found');
    }
    return this.credential;
  }

  async insert(entity: CredentialEntity): Promise<void> {
    console.log('inserted');
  }

  async bulkInsert(entities: CredentialEntity[]): Promise<void> {
    console.log('bulk inserted');
  }

  async findById(id: string | UniqueEntityId): Promise<CredentialEntity> {
    if (id === 'noCredential') {
      throw new NotFoundError('Credential not found');
    }
    return this.credential;
  }

  async findAll(): Promise<CredentialEntity[]> {
    return [this.credential];
  }

  async update(entity: CredentialEntity): Promise<void> {
    console.log('updated');
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    console.log('deleted');
  }
}

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
