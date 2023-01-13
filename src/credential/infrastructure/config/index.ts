/* istanbul ignore file */
import { config as readEnv } from 'dotenv';
import { join } from 'path';
import { z } from 'zod';

const envSchema = z.object({
  DOMAIN: z.string().default('localhost'),
  USER_DOMAIN: z.string(),
  USER_PORT: z.coerce.number(),
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
  JWT_PUBLIC_KEY: z.string(),
  JWT_PRIVATE_KEY: z.string(),
});

export type ConfigShared = {
  nodeEnv: string;
  userFacade: {
    domain: string;
    port: number;
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
  readEnv({ path: envFile, override: true });

  const env = envSchema.parse(process.env);

  return {
    nodeEnv: env.NODE_ENV,
    userFacade: {
      domain: env.USER_DOMAIN,
      port: env.USER_PORT,
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
      publicKey: env.JWT_PUBLIC_KEY,
      privateKey: env.JWT_PRIVATE_KEY,
    },
  };
}

// export const config = makeConfig(envFile);

export function getConfigTest(): ConfigShared {
  const envTestingFile = join(process.cwd(), '.env.test');
  return makeConfigShared(envTestingFile);
}
