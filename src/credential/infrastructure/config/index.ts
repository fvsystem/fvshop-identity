/* istanbul ignore file */
import { config as readEnv } from 'dotenv';
import { join } from 'path';
import { readFileSync } from 'node:fs';
import { z } from 'zod';

const envSchema = z.object({
  DOMAIN: z.string().default('localhost'),
  USER_DOMAIN: z.string(),
  USER_REST_PORT: z.coerce.number(),
  USER_GRPC_PORT: z.coerce.number(),
  DOMAIN_PORT: z.coerce.number().optional(),
  REST_PORT: z.coerce.number().optional(),
  NODE_ENV: z.string(),
  GRPC_PORT: z.coerce.number().optional(),
  DB_VENDOR: z.string(),
  DB_HOST: z.string(),
  DB_LOGGING: z.coerce.boolean(),
  DB_PASSWORD: z.string().optional(),
  DB_PORT: z.coerce.number().optional(),
  DB_USERNAME: z.string().optional(),
});

export type ConfigShared = {
  nodeEnv: string;
  userFacade: {
    domain: string;
    rest: {
      port: number;
    };
    grpc: {
      port: number;
    };
  };
  grpc: {
    port?: number;
  };
  domain: {
    domain: string;
  };
  rest: {
    port?: number;
  };
  db: {
    vendor: string;
    host: string;
    logging: boolean;
    password?: string;
    port?: number;
    username?: string;
  };
  jwt: {
    publicKey: string;
    privateKey: string;
  };
};

export function makeConfigShared(envFile?: string): ConfigShared {
  const jwtPublicKey =
    process.env.NODE_ENV === 'production'
      ? readFileSync('/key/key.public', 'utf8')
      : readFileSync(join(process.cwd(), 'key.public'), 'utf8');

  const jwtPrivateKey =
    process.env.NODE_ENV === 'production'
      ? readFileSync('/key/key.private', 'utf8')
      : readFileSync(join(process.cwd(), 'key.private'), 'utf8');
  if (process.env.NODE_ENV !== 'production') {
    readEnv({ path: envFile, override: true });
  }

  const env = envSchema.parse(process.env);

  return {
    nodeEnv: env.NODE_ENV,
    userFacade: {
      domain: env.USER_DOMAIN,
      rest: {
        port: env.USER_REST_PORT,
      },
      grpc: {
        port: env.USER_GRPC_PORT,
      },
    },
    domain: {
      domain: env.DOMAIN,
    },
    grpc: {
      port: env.GRPC_PORT,
    },
    rest: {
      port: env.REST_PORT,
    },
    db: {
      vendor: env.DB_VENDOR,
      host: env.DB_HOST,
      logging: env.DB_LOGGING,
      password: env.DB_PASSWORD,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
    },
    jwt: {
      publicKey: jwtPublicKey,
      privateKey: jwtPrivateKey,
    },
  };
}

export function getConfigTest(): ConfigShared {
  const envTestingFile = join(process.cwd(), '.env.test');
  return makeConfigShared(envTestingFile);
}
