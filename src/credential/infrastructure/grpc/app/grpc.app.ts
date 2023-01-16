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
import { RegisterHandlers } from '../proto/Register';
import { getHandlers } from '../handler/grpc.handler';
import { RegisterClient } from '../proto';

const protoPath = resolve(__dirname, '../proto/credential.proto');

export class ServerGrpc {
  private readonly _packageDefinition: ProtoGrpcType;

  private readonly _server: grpc.Server;

  constructor(
    packageDefinition: ProtoGrpcType,
    handlers: Map<keyof ProtoGrpcType, RegisterHandlers>
  ) {
    this._packageDefinition = packageDefinition;
    this._server = new grpc.Server();
    for (const [key, value] of handlers) {
      this._server.addService(
        (this._packageDefinition[key] as any).service,
        value
      );
    }
  }

  get server(): grpc.Server {
    return this._server;
  }

  get packageDefinition(): ProtoGrpcType {
    return this._packageDefinition;
  }

  public getClient(domain: string, port: number): RegisterClient {
    const client = new this.packageDefinition.Register(
      `0.0.0.0:${port}`,
      grpc.credentials.createInsecure()
    );

    return client;
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

  const server = new ServerGrpc(
    protoDescriptor,
    new Map<keyof ProtoGrpcType, RegisterHandlers>().set(
      'Register',
      serviceRegister
    )
  );

  return server;
}
