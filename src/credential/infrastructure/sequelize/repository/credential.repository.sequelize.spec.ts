import { NotFoundError } from '@fvsystem/fvshop-shared-entities';
import { CredentialFactory } from '@root/credential/domain';
import { setupSequelize } from '@root/credential/infrastructure/testing';
import { v4 as uuid } from 'uuid';
import { CredentialMapper } from './credential.mapper.sequelize';
import { CredentialModel } from './credential.model.sequelize';
import { CredentialRepositorySequelize } from './credential.repository.sequelize';

const uuidValue = uuid();
const uuidValue2 = uuid();

const hashMock = {
  hash: jest.fn().mockResolvedValue('hashedfgjkfngfjkgfgfjgkgjfgkgfgf'),
  compare: jest.fn().mockImplementation((password, hash) => {
    if (password === 'validHFH676' && hash === 'jfhdksjfdsjkfhdskjfhdsjkfhfh') {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }),
};

describe('SequelizeRepository', () => {
  setupSequelize({ models: [CredentialModel] });

  it('should insert', async () => {
    const credential = await CredentialFactory.create(
      {
        email: 'test@test.com',
        password: 'validHFH676',
        userId: uuidValue,
      },
      hashMock
    );
    const repository = new CredentialRepositorySequelize(
      CredentialModel,
      CredentialMapper.mapToEntity,
      CredentialMapper.mapToModel
    );
    await repository.insert(credential);
    const result = await repository.findById(credential.id);
    expect(result.id).toBe(credential.id);
    expect(result.email).toBe(credential.email);
    expect(result.passwordHashed).toBe(credential.passwordHashed);
  });

  it('should find by email', async () => {
    const credential = await CredentialFactory.create(
      {
        email: 'test@test.com',
        password: 'validHFH676',
        userId: uuidValue,
      },
      hashMock
    );
    const repository = new CredentialRepositorySequelize(
      CredentialModel,
      CredentialMapper.mapToEntity,
      CredentialMapper.mapToModel
    );
    await repository.insert(credential);
    const result = await repository.findByEmail(credential.email);
    expect(result.id).toBe(credential.id);
    expect(result.email).toBe(credential.email);
    expect(result.passwordHashed).toBe(credential.passwordHashed);
  });

  it('should  bulk insert', async () => {
    const credential = await CredentialFactory.create(
      {
        email: 'test@test.com',
        password: 'validHFH676',
        userId: uuidValue,
      },
      hashMock
    );
    const credential2 = await CredentialFactory.create(
      {
        email: 'test2@test.com',
        password: 'validHFH676',
        userId: uuidValue2,
      },
      hashMock
    );
    const repository = new CredentialRepositorySequelize(
      CredentialModel,
      CredentialMapper.mapToEntity,
      CredentialMapper.mapToModel
    );
    await repository.bulkInsert([credential, credential2]);
    const result = await repository.findAll();
    expect(result[0].id).toBe(credential.id);
    expect(result[0].email).toBe(credential.email);
    expect(result[1].id).toBe(credential2.id);
    expect(result[1].email).toBe(credential2.email);
  });

  it('should update', async () => {
    const credential = await CredentialFactory.create(
      {
        email: 'test@test.com',
        password: 'validHFH676',
        userId: uuidValue,
      },
      hashMock
    );
    const repository = new CredentialRepositorySequelize(
      CredentialModel,
      CredentialMapper.mapToEntity,
      CredentialMapper.mapToModel
    );
    await repository.insert(credential);
    const result = await repository.findById(credential.id);
    expect(result.id).toBe(credential.id);
    expect(result.email).toBe(credential.email);
    expect(result.passwordHashed).toBe(credential.passwordHashed);
    credential.changeEmail('test2@test.com');
    await repository.update(credential);
    const result2 = await repository.findById(credential.id);
    expect(result2.id).toBe(credential.id);
    expect(result2.email).toBe(credential.email);
  });

  it('should not update inexistent entity', async () => {
    const credential = await CredentialFactory.create(
      {
        email: 'test@test.com',
        password: 'validHFH676',
        userId: uuidValue,
      },
      hashMock
    );
    const repository = new CredentialRepositorySequelize(
      CredentialModel,
      CredentialMapper.mapToEntity,
      CredentialMapper.mapToModel
    );
    await expect(() => repository.update(credential)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should not delete inexistent entity', async () => {
    const repository = new CredentialRepositorySequelize(
      CredentialModel,
      CredentialMapper.mapToEntity,
      CredentialMapper.mapToModel
    );
    await expect(() => repository.delete('123')).rejects.toThrow(NotFoundError);
  });

  it('should delete', async () => {
    const credential = await CredentialFactory.create(
      {
        email: 'test@test.com',
        password: 'validHFH676',
        userId: uuidValue,
      },
      hashMock
    );
    const repository = new CredentialRepositorySequelize(
      CredentialModel,
      CredentialMapper.mapToEntity,
      CredentialMapper.mapToModel
    );
    await repository.insert(credential);
    const result = await repository.findById(credential.id);
    expect(result.id).toBe(credential.id);
    expect(result.email).toBe(credential.email);
    expect(result.passwordHashed).toBe(credential.passwordHashed);
    credential.changeEmail('test2@test.com');
    await repository.delete(credential.id);
    await expect(() => repository.delete('123')).rejects.toThrow(NotFoundError);
  });
});
