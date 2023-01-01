import {
  HashServiceInterface,
  JWTServicesInterface,
} from '@fvsystem/fvshop-shared-entities';
import { IdentityUserEntity } from '../entity';
import { IdentityUserFactory } from '../entity/identity-user.factory';
import { InvalidPasswordError } from '../error';

export interface CreateIdentityUserInput {
  email: string;
  password: string;
}

export interface ValidateUserInput {
  email: string;
  password: string;
  issuer: string;
  subject: string;
  scope: string[];
  audience: string;
}

export interface ValidateUserOutput {
  token: string;
}

export class IdentityService {
  constructor(
    private readonly hashService: HashServiceInterface,
    private readonly jwtService: JWTServicesInterface
  ) {}

  async createIdentityUser(
    props: CreateIdentityUserInput
  ): Promise<IdentityUserEntity> {
    const identity = await IdentityUserFactory.create(props, this.hashService);
    return identity;
  }

  async validateUser(props: ValidateUserInput): Promise<ValidateUserOutput> {
    const user = await IdentityUserFactory.create(props, this.hashService);
    const isValid = await user.comparePassword(
      props.password,
      this.hashService
    );
    if (!isValid) {
      throw new InvalidPasswordError();
    }
    const accessToken = await this.jwtService.sign(
      {
        email: props.email,
        userId: props.subject,
        scope: props.scope,
      },
      {
        iss: props.issuer,
        sub: props.subject,
        aud: props.audience,
      }
    );
    return {
      token: accessToken,
    };
  }
}
