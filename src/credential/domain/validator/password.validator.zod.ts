import { z } from 'zod';
import { ValidatorFieldsZod } from '@fvsystem/fvshop-shared-entities';
import { CredentialProps } from '../entity';

export class PasswordValidatorZod extends ValidatorFieldsZod<CredentialProps> {
  constructor() {
    super();
    this.schema = z.object({
      password: z
        .string()
        .min(8, { message: 'Password must contain at least 8 characters long' })
        .regex(/[a-z]+/, {
          message: 'Password must contain at least one lowercase',
        })
        .regex(/[A-Z]+/, {
          message: 'Password must contain at least one uppercase',
        })
        .regex(/[0-9]+/, {
          message: 'Password must contain at least one number',
        }),
    });
  }
}
