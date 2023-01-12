/* istanbul ignore file */
import {
  HashServiceBCryptJS,
  JWTServiceJsonWebToken,
  LoggerServiceWinton,
} from '@fvsystem/fvshop-shared-entities';
import { UserFacadeProxyExpress } from '@fvsystem/fvshop-user-manager';
import { makeConfigShared } from '../../config';
import { getAppExpress } from '../../express';
import {
  CredentialMapper,
  CredentialModel,
  CredentialRepositorySequelize,
  getAppSequelize,
} from '../../sequelize';

const logger = new LoggerServiceWinton();
// init server
(async () => {
  const config = makeConfigShared();
  await getAppSequelize(config);
  const credentialRepository = new CredentialRepositorySequelize(
    CredentialModel,
    CredentialMapper.mapToEntity,
    CredentialMapper.mapToModel
  );
  const userFacade = new UserFacadeProxyExpress('user-manager:3000');
  const hashService = new HashServiceBCryptJS(10);
  const jwtService = new JWTServiceJsonWebToken<{
    email: string;
    userId: string;
    scope: string[];
  }>({
    algorithm: 'RS256',
    expiration: '15m',
    privateKey: config.jwt.privateKey,
    publicKey: config.jwt.publicKey,
  });
  const app = getAppExpress(
    credentialRepository,
    userFacade,
    hashService,
    jwtService
  );
  app.listen(config.rest.port || 3000, () => {
    logger.info(`Server running on port ${config.rest.port || 3000}`);
  });
})();
