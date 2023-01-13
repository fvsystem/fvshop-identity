import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { RegisterClient as _RegisterClient, RegisterDefinition as _RegisterDefinition } from './Register';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  Register: SubtypeConstructor<typeof grpc.Client, _RegisterClient> & { service: _RegisterDefinition }
  RegisterRequest: MessageTypeDefinition
  RegisterResponse: MessageTypeDefinition
}

