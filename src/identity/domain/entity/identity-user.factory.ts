import { HashServiceInterface } from '@fvsystem/fvshop-shared-entities';
import { PasswordValueObject } from '../value-object';
import { IdentityUserEntity } from './identity.user';

export interface CreateIdentityUserInterface {
  email: string;
  password: string;
}

export class IdentityUserFactory {
  static async create(
    props: CreateIdentityUserInterface,
    servicehash: HashServiceInterface
  ): Promise<IdentityUserEntity> {
    const password = await PasswordValueObject.create(
      { password: props.password },
      servicehash
    );
    return new IdentityUserEntity({ password, email: props.email });
  }
}
