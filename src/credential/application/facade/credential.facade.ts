import {
  FacadeInterface,
  HashServiceInterface,
  JWTServicesInterface,
  UseCase,
} from '@fvsystem/fvshop-shared-entities';
import { UserFacadeInterface } from '@fvsystem/fvshop-user-manager';
import {
  CreateCredentialUseCaseInput,
  CreateCredentialUseCaseOutput,
} from '@root/credential/application';
import { CredentialRepositoryInterface } from '@root/credential/domain';
import { CreateCredentialUseCase, VerifyCredentialUseCase } from '../usecase';
import {
  VerifyCredentialInputProps,
  VerifyCredentialOutputProps,
} from '../usecase/verify-credential.usecase';

export type FacadeMethods = {
  createCredential: UseCase<
    CreateCredentialUseCaseInput,
    CreateCredentialUseCaseOutput
  >;
  verifyCredential: UseCase<
    VerifyCredentialInputProps,
    VerifyCredentialOutputProps
  >;
};

export type CredentialFacade = FacadeInterface<FacadeMethods>;

export class CredentialFacadeImpl implements CredentialFacade {
  createCredential: UseCase<
    CreateCredentialUseCaseInput,
    CreateCredentialUseCaseOutput
  >;

  verifyCredential: UseCase<
    VerifyCredentialInputProps,
    VerifyCredentialOutputProps
  >;

  constructor(
    credentialRepository: CredentialRepositoryInterface,
    hashService: HashServiceInterface,
    jwtService: JWTServicesInterface<{
      email: string;
      userId: string;
      scope: string[];
    }>,
    userManagerFacade: UserFacadeInterface
  ) {
    this.createCredential = new CreateCredentialUseCase(
      credentialRepository,
      hashService,
      jwtService
    );
    this.verifyCredential = new VerifyCredentialUseCase(
      userManagerFacade,
      credentialRepository,
      hashService,
      jwtService
    );
  }
}
