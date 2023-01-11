/* istanbul ignore file */

import {
  NotFoundError,
  UniqueEntityId,
} from '@fvsystem/fvshop-shared-entities';
import { CredentialEntity } from '../entity';
import { CredentialRepositoryInterface } from './credential.repository.interface';

export class MockCredentialRepository implements CredentialRepositoryInterface {
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
