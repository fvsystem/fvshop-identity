import {
  HashServiceInterface,
  JWTServicesInterface,
  UseCase,
} from '@fvsystem/fvshop-shared-entities';
import {
  CredentialEntity,
  CredentialRepositoryInterface,
  CredentialService,
} from '@root/credential/domain';

export interface CreateCredentialUseCaseInput {
  email: string;
  password: string;
  userId: string;
}

export interface CreateCredentialUseCaseOutput {
  credential: CredentialEntity;
}

export class CreateCredentialUseCase
  implements
    UseCase<CreateCredentialUseCaseInput, CreateCredentialUseCaseOutput>
{
  private readonly credentialService: CredentialService;

  constructor(
    private readonly credentialRepository: CredentialRepositoryInterface,
    hashService: HashServiceInterface,
    jwtService: JWTServicesInterface<{
      email: string;
      userId: string;
      scope: string[];
    }>
  ) {
    this.credentialService = new CredentialService(hashService, jwtService);
  }

  async execute(
    input: CreateCredentialUseCaseInput
  ): Promise<CreateCredentialUseCaseOutput> {
    const { credential } = await this.credentialService.createCredential(input);
    await this.credentialRepository.insert(credential);
    return { credential };
  }
}
