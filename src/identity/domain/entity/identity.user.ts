import {
  UniqueEntityId,
  EntityValidationError,
} from '@fvsystem/fvshop-shared-entities';
import { IdentityUserValidatorZod } from '../validator/identity-user.validator.zod';
import { IdentityEntity, IdentityProps } from './identity.abstract';

export interface IdentityUserProps extends IdentityProps {
  email: string;
}

export class IdentityUserEntity extends IdentityEntity<IdentityUserProps> {
  constructor(props: IdentityUserProps, id?: UniqueEntityId) {
    super(props, id);
    IdentityUserEntity.validate(props);
    this.props.email = props.email;
  }

  get email(): string {
    return this.props.email;
  }

  changeEmail(email: string): void {
    this.props.email = email;
  }

  static validate(props: IdentityUserProps) {
    const validator = new IdentityUserValidatorZod();
    const isValid = validator.validate({ email: props.email });
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
