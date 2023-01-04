/* eslint-disable no-underscore-dangle */
import {
  HashServiceInterface,
  JWTServicesInterface,
} from '@fvsystem/fvshop-shared-entities';
import UserFacadeInterface from '@fvsystem/fvshop-user-manager';
import { CredentialFacadeImpl } from '@root/credential/application';
import { CredentialRepositoryInterface } from '@root/credential/domain';
import { Router } from 'express';

export class RoutesExpressIdentity {
  private _userFacade: UserFacadeInterface;

  constructor(
    private readonly credentialRepository: CredentialRepositoryInterface,
    private readonly hashService: HashServiceInterface,
    private readonly jwtService: JWTServicesInterface<{
      email: string;
      userId: string;
      scope: string[];
    }>
  ) {}

  set userFacade(userFacade: UserFacadeInterface) {
    this._userFacade = userFacade;
  }

  addRoutes(router: Router) {
    const credentailFacade = new CredentialFacadeImpl(
      this.credentialRepository,
      this.hashService,
      this.jwtService,
      this._userFacade
    );

    router.post('/login', async (req, res) => {
      const { email, password } = req.body;
      try {
        const result = await credentailFacade.verifyCredential.execute({
          email,
          password,
        });
        res.status(200).json(result);
      } catch (err) {
        res.status(401).json(err);
      }
    });

    router.post('/register', async (req, res) => {
      const { email, password, userId } = req.body;
      try {
        const result = await credentailFacade.createCredential.execute({
          email,
          password,
          userId,
        });
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(err);
      }
    });
  }
}
