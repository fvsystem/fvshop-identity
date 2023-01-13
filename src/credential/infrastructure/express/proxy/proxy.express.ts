import axios from 'axios';

import {
  CreateCredentialUseCaseInput,
  CreateCredentialUseCaseOutput,
  CredentialFacade,
  VerifyCredentialInputProps,
  VerifyCredentialOutputProps,
} from '@root/credential/application';
import { UseCase } from '@fvsystem/fvshop-shared-entities';

export class CreateCredentialUseCaseRest {
  constructor(private readonly domain: string, private readonly port: number) {
    this.domain = domain;
    this.port = port;
  }

  async execute(
    input: CreateCredentialUseCaseInput
  ): Promise<CreateCredentialUseCaseOutput> {
    const response = await axios.post(
      `http://${this.domain}:${this.port}/register`,
      input
    );
    return response.data;
  }
}

export class VerifyCredentialUseCaseRest {
  constructor(private readonly domain: string, private readonly port: number) {
    this.domain = domain;
    this.port = port;
  }

  async execute(
    input: VerifyCredentialInputProps
  ): Promise<VerifyCredentialOutputProps> {
    throw new Error('This method is not intended to use among services');
  }
}

export class CredentialFacadeImplRest implements CredentialFacade {
  createCredential: UseCase<
    CreateCredentialUseCaseInput,
    CreateCredentialUseCaseOutput
  >;

  verifyCredential: UseCase<
    VerifyCredentialInputProps,
    VerifyCredentialOutputProps
  >;

  constructor(domain: string, port: number) {
    this.createCredential = new CreateCredentialUseCaseRest(domain, port);
    this.verifyCredential = new VerifyCredentialUseCaseRest(domain, port);
  }
}
