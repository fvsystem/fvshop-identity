import {
  HashServiceInterface,
  UniqueEntityId,
} from '@fvsystem/fvshop-shared-entities';
import { PasswordValueObject } from '../value-object';
import { CredentialEntity } from './credential.entity';

export interface CreateCredentialUserInterface {
  email: string;
  password: string;
  userId: string;
}

export class CredentialFactory {
  static async create(
    props: CreateCredentialUserInterface,
    servicehash: HashServiceInterface
  ): Promise<CredentialEntity> {
    const password = await PasswordValueObject.create(
      { password: props.password },
      servicehash
    );
    const uniqueId = new UniqueEntityId(props.userId);
    return new CredentialEntity({ password, email: props.email }, uniqueId);
  }
}
