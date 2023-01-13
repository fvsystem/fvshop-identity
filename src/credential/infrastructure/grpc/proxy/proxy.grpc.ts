import {
  CreateCredentialUseCaseInput,
  CreateCredentialUseCaseOutput,
  CredentialFacade,
  VerifyCredentialInputProps,
  VerifyCredentialOutputProps,
} from '@root/credential/application';
import { promisify } from 'util';
import { UseCase } from '@fvsystem/fvshop-shared-entities';
import { RegisterClient } from '../proto';

export class CreateCredentialUseCaseGrpc {
  constructor(private readonly client: RegisterClient) {
    this.client = client;
  }

  async execute(
    input: CreateCredentialUseCaseInput
  ): Promise<CreateCredentialUseCaseOutput> {
    const register = promisify(this.client.register.bind(this.client));
    await register(input);
  }
}

export class VerifyCredentialUseCaseGrpc {
  async execute(
    input: VerifyCredentialInputProps
  ): Promise<VerifyCredentialOutputProps> {
    throw new Error('This method is not intended to use among services');
  }
}

export class CredentialFacadeImplGrpc implements CredentialFacade {
  createCredential: UseCase<
    CreateCredentialUseCaseInput,
    CreateCredentialUseCaseOutput
  >;

  verifyCredential: UseCase<
    VerifyCredentialInputProps,
    VerifyCredentialOutputProps
  >;

  constructor(client: RegisterClient) {
    this.createCredential = new CreateCredentialUseCaseGrpc(client);
    this.verifyCredential = new VerifyCredentialUseCaseGrpc();
  }
}
