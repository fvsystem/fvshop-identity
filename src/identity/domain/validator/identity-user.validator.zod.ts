import { z } from 'zod';
import { ValidatorFieldsZod } from '@fvsystem/fvshop-shared-entities';
import { IdentityUserEntity } from '../entity/identity.user';

export class IdentityUserValidatorZod extends ValidatorFieldsZod<
  Omit<IdentityUserEntity, 'password'>
> {
  constructor() {
    super();
    this.schema = z.object({
      email: z.string().email({ message: 'Email is not valid' }),
    });
  }
}
