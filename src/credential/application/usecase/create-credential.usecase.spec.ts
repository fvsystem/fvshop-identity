import { UniqueEntityId } from '@fvsystem/fvshop-shared-entities';
import {
  CredentialEntity,
  MockCredentialRepository,
  PasswordValueObject,
} from '@root/credential/domain';
import {
  getJWTServiceMock,
  hashMock,
} from '@root/credential/infrastructure/testing';
import { v4 as uuid } from 'uuid';
import { CreateCredentialUseCase } from './create-credential.usecase';

const uuidValue = uuid();

let credential: CredentialEntity;

const jwtServiceMock = getJWTServiceMock(uuidValue);

describe('CreateCredentialUseCase', () => {
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
  it('should create credential', async () => {
    const credentialRepository = new MockCredentialRepository(credential);
    const createCredentialUseCase = new CreateCredentialUseCase(
      credentialRepository,
      hashMock,
      jwtServiceMock
    );
    expect(async () => {
      await createCredentialUseCase.execute({
        email: 'test@test.com',
        password: 'validHFH676',
        userId: uuidValue,
      });
    }).not.toThrow();
  });
});
