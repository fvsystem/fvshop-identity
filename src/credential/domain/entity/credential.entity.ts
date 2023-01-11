import {
  Entity,
  UniqueEntityId,
  HashServiceInterface,
  EntityValidationError,
} from '@fvsystem/fvshop-shared-entities';
import { CredentialValidatorZod } from '../validator/credential.validator.zod';
import { PasswordValueObject } from '../value-object';

export interface CredentialProps {
  password: PasswordValueObject;
  email: string;
}

export interface CredentialDTO {
  password: string;
  email: string;
  id: string;
}

export class CredentialEntity extends Entity<CredentialProps> {
  public constructor(props: CredentialProps, id?: UniqueEntityId) {
    super(props, id);
    CredentialEntity.validate(props);
    this.props.password = props.password;
    this.props.email = props.email;
  }

  public async changePassword(
    password: string,
    hashService: HashServiceInterface
  ): Promise<void> {
    this.props.password = await PasswordValueObject.create(
      { password },
      hashService
    );
  }

  get passwordHashed(): string {
    return this.props.password.passwordHashed;
  }

  private get password(): PasswordValueObject {
    return this.props.password;
  }

  get email(): string {
    return this.props.email;
  }

  changeEmail(email: string): void {
    this.props.email = email;
  }

  public async comparePassword(
    password: string,
    hashService: HashServiceInterface
  ): Promise<boolean> {
    return this.password.comparePassword(password, hashService);
  }

  static validate(props: CredentialProps) {
    const validator = new CredentialValidatorZod();
    const isValid = validator.validate({ email: props.email });
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
