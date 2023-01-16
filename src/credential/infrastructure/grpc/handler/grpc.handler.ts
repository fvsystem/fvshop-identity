/* eslint-disable no-underscore-dangle */
import {
  HashServiceInterface,
  JWTServicesInterface,
} from '@fvsystem/fvshop-shared-entities';
import UserFacadeInterface from '@fvsystem/fvshop-user-manager';
import {
  CredentialFacadeImpl,
  CreateCredentialUseCaseInput,
  CreateCredentialUseCaseOutput,
} from '@root/credential/application';
import { CredentialRepositoryInterface } from '@root/credential/domain';
import { HealthHandlers } from '../proto';
import { RegisterHandlers } from '../proto/Register';

export interface Handlers {
  Health: HealthHandlers;
  Register: RegisterHandlers;
}

export function getHandlers(
  credentialRepository: CredentialRepositoryInterface,
  hashService: HashServiceInterface,
  jwtService: JWTServicesInterface<{
    email: string;
    userId: string;
    scope: string[];
  }>,
  userFacade: UserFacadeInterface
): Handlers {
  const registerService = new CredentialFacadeImpl(
    credentialRepository,
    hashService,
    jwtService,
    userFacade
  );

  return {
    Health: {
      Check: (call, callback) => {
        callback(null, { status: 'SERVING' });
      },
      Watch: (call) => {
        call.write({ status: 'SERVING' });
        call.end();
      },
    },
    Register: {
      Register: (call, callback) => {
        const { email, password, userId } = call.request;
        const input: CreateCredentialUseCaseInput = { email, password, userId };
        (
          registerService.createCredential.execute as (
            inputProps: CreateCredentialUseCaseInput
          ) => Promise<CreateCredentialUseCaseOutput>
        )(input)
          .then(() => callback(null))
          .catch((error) => callback(error));
      },
    },
  };
}
