import {
  HashServiceInterface,
  JWTServicesInterface,
  UseCase,
} from '@fvsystem/fvshop-shared-entities';
import {
  CredentialRepositoryInterface,
  CredentialService,
} from '@root/credential/domain';

export interface CreateCredentialUseCaseInput {
  email: string;
  password: string;
  userId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type CreateCredentialUseCaseOutput = void;

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
  }
}
