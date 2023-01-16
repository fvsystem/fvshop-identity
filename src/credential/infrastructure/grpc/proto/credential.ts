import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { HealthClient as _HealthClient, HealthDefinition as _HealthDefinition } from './Health';
import type { RegisterClient as _RegisterClient, RegisterDefinition as _RegisterDefinition } from './Register';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  Health: SubtypeConstructor<typeof grpc.Client, _HealthClient> & { service: _HealthDefinition }
  HealthCheckRequest: MessageTypeDefinition
  HealthCheckResponse: MessageTypeDefinition
  Register: SubtypeConstructor<typeof grpc.Client, _RegisterClient> & { service: _RegisterDefinition }
  RegisterRequest: MessageTypeDefinition
  RegisterResponse: MessageTypeDefinition
}

