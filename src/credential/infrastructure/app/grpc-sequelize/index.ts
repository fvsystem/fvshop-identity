/* istanbul ignore file */
import * as grpc from '@grpc/grpc-js';
import {
  HashServiceBCryptJS,
  JWTServiceJsonWebToken,
  LoggerServiceWinton,
} from '@fvsystem/fvshop-shared-entities';
import { UserFacadeProxyGrpc } from '@fvsystem/fvshop-user-manager';
import { makeConfigShared } from '../../config';
import { getAppGrpc } from '../../grpc';
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
  const userFacade = new UserFacadeProxyGrpc(
    config.userFacade.domain,
    config.userFacade.grpc.port
  );
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
  const app = getAppGrpc(
    credentialRepository,
    hashService,
    jwtService,
    userFacade
  );
  const { server } = app;

  server.bindAsync(
    `0.0.0.0:${config.grpc.port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        logger.error(err);
        process.exit(1);
      }
      server.start();
      logger.info(`Server running on port ${port}`);
    }
  );
})();
