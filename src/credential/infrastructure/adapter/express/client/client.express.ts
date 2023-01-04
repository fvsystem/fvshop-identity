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
  constructor(private readonly domain: string) {
    this.domain = domain;
  }

  async execute(
    input: CreateCredentialUseCaseInput
  ): Promise<CreateCredentialUseCaseOutput> {
    const response = await axios.post(`${this.domain}/register`, input);
    return response.data;
  }
}

export class VerifyCredentialUseCaseRest {
  constructor(private readonly domain: string) {
    this.domain = domain;
  }

  async execute(
    input: VerifyCredentialInputProps
  ): Promise<VerifyCredentialOutputProps> {
    const response = await axios.post(`${this.domain}/login`, input);
    return response.data;
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

  constructor(domain: string) {
    this.createCredential = new CreateCredentialUseCaseRest(domain);
    this.verifyCredential = new VerifyCredentialUseCaseRest(domain);
  }
}
