/* istanbul ignore file */

/* eslint-disable no-return-assign */
import { Dialect } from 'sequelize';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { getConfigTest } from '../../config';
// import { Config } from "sequelize/types";

const config = getConfigTest();

const sequelizeOptions: SequelizeOptions = {
  dialect: config.db.vendor as Dialect,
  host: config.db.host,
  logging: config.db.logging,
};

export function setupSequelize(options: SequelizeOptions = {}) {
  let _sequelize: Sequelize;

  beforeAll(
    () =>
      (_sequelize = new Sequelize({
        ...sequelizeOptions,
        ...options,
      }))
  );

  beforeEach(async () => {
    await _sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await _sequelize.close();
  });

  return {
    get sequelize() {
      return _sequelize;
    },
  };
}
