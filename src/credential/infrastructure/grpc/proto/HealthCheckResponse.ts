// Original file: src/credential/infrastructure/grpc/proto/credential.proto


// Original file: src/credential/infrastructure/grpc/proto/credential.proto

export const _HealthCheckResponse_ServingStatus = {
  UNKNOWN: 0,
  SERVING: 1,
  NOT_SERVING: 2,
  SERVICE_UNKNOWN: 3,
} as const;

export type _HealthCheckResponse_ServingStatus =
  | 'UNKNOWN'
  | 0
  | 'SERVING'
  | 1
  | 'NOT_SERVING'
  | 2
  | 'SERVICE_UNKNOWN'
  | 3

export type _HealthCheckResponse_ServingStatus__Output = typeof _HealthCheckResponse_ServingStatus[keyof typeof _HealthCheckResponse_ServingStatus]

export interface HealthCheckResponse {
  'status'?: (_HealthCheckResponse_ServingStatus);
}

export interface HealthCheckResponse__Output {
  'status': (_HealthCheckResponse_ServingStatus__Output);
}
