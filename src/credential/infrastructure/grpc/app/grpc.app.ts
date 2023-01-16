/* eslint-disable no-restricted-syntax */
import { resolve } from 'node:path';
import * as grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { CredentialRepositoryInterface } from '@root/credential/domain';
import {
  HashServiceInterface,
  JWTServicesInterface,
} from '@fvsystem/fvshop-shared-entities';
import UserFacadeInterface from '@fvsystem/fvshop-user-manager';
import { ProtoGrpcType } from '../proto/credential';
import { getHandlers, Handlers } from '../handler/grpc.handler';
import { RegisterClient } from '../proto';
import { HealthClient } from '../proto/grpc/health/v1/Health';

const protoPath = resolve(__dirname, '../proto/credential.proto');

export class ServerGrpc {
  private readonly _packageDefinition: ProtoGrpcType;

  private readonly _server: grpc.Server;

  constructor(packageDefinition: ProtoGrpcType, handlers: Handlers) {
    this._packageDefinition = packageDefinition;
    this._server = new grpc.Server();
    this._server.addService(
      this._packageDefinition.grpc.health.v1.Health.service,
      handlers.Health
    );
    this._server.addService(
      this._packageDefinition.Register.service,
      handlers.Register
    );
  }

  get server(): grpc.Server {
    return this._server;
  }

  get packageDefinition(): ProtoGrpcType {
    return this._packageDefinition;
  }

  public getClient(port: number): {
    Register: RegisterClient;
    Health: HealthClient;
  } {
    const Register = new this.packageDefinition.Register(
      `0.0.0.0:${port}`,
      grpc.credentials.createInsecure()
    );

    const Health = new this.packageDefinition.grpc.health.v1.Health(
      `0.0.0.0:${port}`,
      grpc.credentials.createInsecure()
    );

    return { Register, Health };
  }
}

export function getAppGrpc(
  credentialRepository: CredentialRepositoryInterface,
  hashService: HashServiceInterface,
  jwtService: JWTServicesInterface<{
    email: string;
    userId: string;
    scope: string[];
  }>,
  userFacade: UserFacadeInterface
): ServerGrpc {
  const packageDefinition = loadSync(protoPath, {
    keepCase: true,
    defaults: true,
    oneofs: true,
  });

  const protoDescriptor = grpc.loadPackageDefinition(
    packageDefinition
  ) as unknown as ProtoGrpcType;

  const serviceRegister = getHandlers(
    credentialRepository,
    hashService,
    jwtService,
    userFacade
  );

  const server = new ServerGrpc(protoDescriptor, {
    Health: serviceRegister.Health,
    Register: serviceRegister.Register,
  });

  return server;
}
