import {
  EntityValidationError,
  HashServiceInterface,
  ValueObject,
} from '@fvsystem/fvshop-shared-entities';
import { PasswordValidatorZod } from '../validator';

export interface PasswordProps {
  password: string;
}
export class PasswordValueObject extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps, hash: string) {
    PasswordValueObject.validate(props);
    super({ password: hash });
  }

  static async create(
    props: PasswordProps,
    hashService: HashServiceInterface
  ): Promise<PasswordValueObject> {
    const hash = await hashService.hash(props.password);
    return new PasswordValueObject(props, hash);
  }

  static validate(props: PasswordProps) {
    const validator = new PasswordValidatorZod();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  get passwordHashed(): string {
    return this.value.password;
  }

  public async comparePassword(
    password: string,
    hashService: HashServiceInterface
  ): Promise<boolean> {
    return hashService.compare(password, this.value.password);
  }
}
