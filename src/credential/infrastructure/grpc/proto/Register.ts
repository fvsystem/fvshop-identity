// Original file: src/credential/infrastructure/grpc/proto/credential.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { RegisterRequest as _RegisterRequest, RegisterRequest__Output as _RegisterRequest__Output } from './RegisterRequest';
import type { RegisterResponse as _RegisterResponse, RegisterResponse__Output as _RegisterResponse__Output } from './RegisterResponse';

export interface RegisterClient extends grpc.Client {
  Register(argument: _RegisterRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_RegisterResponse__Output>): grpc.ClientUnaryCall;
  Register(argument: _RegisterRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_RegisterResponse__Output>): grpc.ClientUnaryCall;
  Register(argument: _RegisterRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_RegisterResponse__Output>): grpc.ClientUnaryCall;
  Register(argument: _RegisterRequest, callback: grpc.requestCallback<_RegisterResponse__Output>): grpc.ClientUnaryCall;
  register(argument: _RegisterRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_RegisterResponse__Output>): grpc.ClientUnaryCall;
  register(argument: _RegisterRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_RegisterResponse__Output>): grpc.ClientUnaryCall;
  register(argument: _RegisterRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_RegisterResponse__Output>): grpc.ClientUnaryCall;
  register(argument: _RegisterRequest, callback: grpc.requestCallback<_RegisterResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface RegisterHandlers extends grpc.UntypedServiceImplementation {
  Register: grpc.handleUnaryCall<_RegisterRequest__Output, _RegisterResponse>;
  
}

export interface RegisterDefinition extends grpc.ServiceDefinition {
  Register: MethodDefinition<_RegisterRequest, _RegisterResponse, _RegisterRequest__Output, _RegisterResponse__Output>
}
