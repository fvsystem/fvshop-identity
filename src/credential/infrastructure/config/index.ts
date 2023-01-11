/* istanbul ignore file */
import { config as readEnv } from 'dotenv';
import { join } from 'path';
import { z } from 'zod';

const envSchema = z.object({
  REST_PORT: z.coerce.number().optional(),
  NODE_ENV: z.string(),
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
  readEnv({ path: envFile });

  const env = envSchema.parse(process.env);

  return {
    nodeEnv: env.NODE_ENV,
    rest: {
      port: env.REST_PORT ? Number(env.REST_PORT) : undefined,
    },
    db: {
      vendor: env.DB_VENDOR,
      host: env.DB_HOST,
      logging: env.DB_LOGGING,
      password: env.DB_PASSWORD,
      port: env.DB_PORT ? Number(env.DB_PORT) : undefined,
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
  const envTestingFile = join(__dirname, '../../../../.env.test');
  return makeConfigShared(envTestingFile);
}
