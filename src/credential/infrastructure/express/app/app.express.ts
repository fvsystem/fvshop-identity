import {
  HashServiceInterface,
  JWTServicesInterface,
} from '@fvsystem/fvshop-shared-entities';
import express, { Router, Express } from 'express';

import { CredentialRepositoryInterface } from '@root/credential/domain';
import UserFacadeInterface from '@fvsystem/fvshop-user-manager';
import { RoutesExpressIdentity } from '../router';

export function getAppExpress(
  credentialRepository: CredentialRepositoryInterface,
  userFacade: UserFacadeInterface,
  hashService: HashServiceInterface,
  jwtService: JWTServicesInterface<{
    email: string;
    userId: string;
    scope: string[];
  }>
): Express {
  const app = express();
  const routes = Router();
  const routesExpressIdentity = new RoutesExpressIdentity(
    credentialRepository,
    hashService,
    jwtService
  );

  routesExpressIdentity.userFacade = userFacade;
  app.use(express.json());
  routesExpressIdentity.addRoutes(routes);
  app.use(routes);
  return app;
}
