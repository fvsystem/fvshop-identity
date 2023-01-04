import {
  HashServiceInterface,
  JWTServicesInterface,
} from '@fvsystem/fvshop-shared-entities';
import { CredentialEntity } from '../entity';
import { CredentialFactory } from '../entity/credential.factory';
import { InvalidPasswordError } from '../error';

export interface CreateCredentialInput {
  email: string;
  password: string;
  userId: string;
}

export interface CreateCredentialOutput {
  credential: CredentialEntity;
}

export interface ValidateCredentialInput {
  email: string;
  password: string;
  credential: CredentialEntity;
  issuer: string;
  subject: string;
  scope: string[];
  audience: string;
}

export interface ValidateCredentialOutput {
  token: string;
}

export class CredentialService {
  constructor(
    private readonly hashService: HashServiceInterface,
    private readonly jwtService: JWTServicesInterface<{
      email: string;
      userId: string;
      scope: string[];
    }>
  ) {}

  async createCredential(
    props: CreateCredentialInput
  ): Promise<CreateCredentialOutput> {
    const credential = await CredentialFactory.create(props, this.hashService);
    return { credential };
  }

  async validateCredential(
    props: ValidateCredentialInput
  ): Promise<ValidateCredentialOutput> {
    const isValid =
      (await props.credential.comparePassword(
        props.password,
        this.hashService
      )) && props.credential.email === props.email;
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
