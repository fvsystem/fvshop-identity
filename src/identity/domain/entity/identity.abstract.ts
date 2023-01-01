import {
  Entity,
  UniqueEntityId,
  HashServiceInterface,
} from '@fvsystem/fvshop-shared-entities';
import { PasswordValueObject } from '../value-object';

export interface IdentityProps {
  password: PasswordValueObject;
}

export abstract class IdentityEntity<
  Props extends IdentityProps
> extends Entity {
  protected constructor(props: Props, id?: UniqueEntityId) {
    super(props, id);
    this.props.password = props.password;
  }

  public async changePassword(
    password: string,
    hashService: HashServiceInterface
  ): Promise<void> {
    this.props.password = await PasswordValueObject.create(
      { password },
      hashService
    );
    this.props.password = password;
  }

  get passwordHashed(): string {
    return this.props.password.passwordHashed;
  }

  private get password(): PasswordValueObject {
    return this.props.password;
  }

  public async comparePassword(
    password: string,
    hashService: HashServiceInterface
  ): Promise<boolean> {
    return this.password.comparePassword(password, hashService);
  }
}
