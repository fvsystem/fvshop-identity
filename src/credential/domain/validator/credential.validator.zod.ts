import { z } from 'zod';
import { ValidatorFieldsZod } from '@fvsystem/fvshop-shared-entities';
import { CredentialProps } from '../entity';

export class CredentialValidatorZod extends ValidatorFieldsZod<
  Omit<CredentialProps, 'password'>
> {
  constructor() {
    super();
    this.schema = z.object({
      email: z.string().email({ message: 'Email is not valid' }),
    });
  }
}
