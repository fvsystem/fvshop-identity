import { ConfigShared } from '@root/credential/infrastructure/config';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CredentialModel } from '../repository';

export async function getAppSequelize(config: ConfigShared): Promise<void> {
  const sequelize = new Sequelize({
    dialect: config.db.vendor as Dialect,
    host: config.db.host,
    logging: config.db.logging,
    password: config.db.password,
    port: config.db.port,
    username: config.db.username,
    database: 'fvshop',
    models: [CredentialModel],
  });

  await sequelize.sync();
}
