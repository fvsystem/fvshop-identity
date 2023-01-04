import {
  HashServiceInterface,
  JWTServicesInterface,
  UseCase,
} from '@fvsystem/fvshop-shared-entities';
import UserManagerFacade from '@fvsystem/fvshop-user-manager';
import {
  CredentialRepositoryInterface,
  CredentialService,
} from '@root/credential/domain';

export interface VerifyCredentialInputProps {
  email: string;
  password: string;
}

export interface VerifyCredentialOutputProps {
  token: string;
}

export class VerifyCredentialUseCase
  implements UseCase<VerifyCredentialInputProps, VerifyCredentialOutputProps>
{
  credentialService: CredentialService;

  constructor(
    private readonly userManagerFacade: UserManagerFacade,
    private readonly credentialRepository: CredentialRepositoryInterface,
    private readonly hashService: HashServiceInterface,
    private readonly jwtService: JWTServicesInterface<{
      email: string;
      userId: string;
      scope: string[];
    }>
  ) {
    this.credentialService = new CredentialService(hashService, jwtService);
  }

  async execute(
    props: VerifyCredentialInputProps
  ): Promise<VerifyCredentialOutputProps> {
    const { user } = await this.userManagerFacade.getUserByEmail.execute({
      email: props.email,
    });
    const credential = await this.credentialRepository.findByEmail(user.email);
    const { token } = await this.credentialService.validateCredential({
      email: props.email,
      password: props.password,
      credential,
      issuer: 'FVShop',
      subject: user.id,
      scope: user.roles,
      audience: 'FVShop',
    });

    return { token };
  }
}
