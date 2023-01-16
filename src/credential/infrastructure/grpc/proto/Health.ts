// Original file: src/credential/infrastructure/grpc/proto/credential.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { HealthCheckRequest as _HealthCheckRequest, HealthCheckRequest__Output as _HealthCheckRequest__Output } from './HealthCheckRequest';
import type { HealthCheckResponse as _HealthCheckResponse, HealthCheckResponse__Output as _HealthCheckResponse__Output } from './HealthCheckResponse';

export interface HealthClient extends grpc.Client {
  Check(argument: _HealthCheckRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  Check(argument: _HealthCheckRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  Check(argument: _HealthCheckRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  Check(argument: _HealthCheckRequest, callback: grpc.requestCallback<_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  check(argument: _HealthCheckRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  check(argument: _HealthCheckRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  check(argument: _HealthCheckRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  check(argument: _HealthCheckRequest, callback: grpc.requestCallback<_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  
  Watch(argument: _HealthCheckRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_HealthCheckResponse__Output>;
  Watch(argument: _HealthCheckRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_HealthCheckResponse__Output>;
  watch(argument: _HealthCheckRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_HealthCheckResponse__Output>;
  watch(argument: _HealthCheckRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_HealthCheckResponse__Output>;
  
}

export interface HealthHandlers extends grpc.UntypedServiceImplementation {
  Check: grpc.handleUnaryCall<_HealthCheckRequest__Output, _HealthCheckResponse>;
  
  Watch: grpc.handleServerStreamingCall<_HealthCheckRequest__Output, _HealthCheckResponse>;
  
}

export interface HealthDefinition extends grpc.ServiceDefinition {
  Check: MethodDefinition<_HealthCheckRequest, _HealthCheckResponse, _HealthCheckRequest__Output, _HealthCheckResponse__Output>
  Watch: MethodDefinition<_HealthCheckRequest, _HealthCheckResponse, _HealthCheckRequest__Output, _HealthCheckResponse__Output>
}
