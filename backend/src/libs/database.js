const { readdirSync, existsSync, writeFileSync, readFileSync } = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const { intersectionWith } = require('lodash');
const logger = require('../config/logger');
const { getConfigPath } = require('../utils/path.util');

const getDataSource = async () => {
  try {
    // const sequelize = require('../database');
    // logger.log('Connection has been established successfully.');
    // const migrationConfigPath = getConfigPath('migration.config.json');
    // let migrationConfig = {};
    // try {
    //   if (!existsSync(migrationConfigPath)) {
    //     writeFileSync(migrationConfigPath, JSON.stringify({}));
    //   } else {
    //     migrationConfig = JSON.parse(
    //       readFileSync(migrationConfigPath).toString(),
    //     );
    //   }
    // } catch {
    //   writeFileSync(migrationConfigPath, JSON.stringify({}));
    // }
    // // Run all migrations
    // try {
    //   const migrationPath = path.resolve(
    //     __dirname,
    //     '../database',
    //     'migrations',
    //   );
    //   const migrationFiles = readdirSync(migrationPath).map((fileName) =>
    //     path.join(migrationPath, fileName),
    //   );
    //   // Run migrate
    //   for (const migrationFile of migrationFiles) {
    //     const migrationName = path.basename(migrationFile);
    //     try {
    //       if (!migrationConfig[migrationName]) {
    //         await require(migrationFile).up(
    //           sequelize.getQueryInterface(),
    //           Sequelize,
    //         );
    //       }
    //     } catch (_error) {
    //       logger.error(migrationName, _error);
    //     } finally {
    //       migrationConfig[migrationName] = true;
    //     }
    //   }
    //   writeFileSync(migrationConfigPath, JSON.stringify(migrationConfig));
    //   logger.error('SYNC_MODELS_SUCCESSFULLY');
    // } catch (_error) {
    //   logger.error('SYNC_MODELS_FAILED', _error);
    // }
    // // Run all seeders
    // try {
    //   const seederPath = path.resolve(__dirname, '../database', 'seeders');
    //   const seederFiles = readdirSync(seederPath).map((fileName) =>
    //     path.join(seederPath, fileName),
    //   );
    //   // Run migrate
    //   for (const seederFile of intersectionWith(
    //     seederFiles,
    //     [
    //       '20241107061453-task-category.js',
    //       '20241107141637-task-status.js',
    //       '20240926070320-roles.js',
    //       '20241001063001-permission_roles.js',
    //     ],
    //     (left, right) => {
    //       return path.basename(left) === right;
    //     },
    //   )) {
    //     try {
    //       await require(seederFile).up(
    //         sequelize.getQueryInterface(),
    //         Sequelize,
    //       );
    //     } catch (_error) {
    //       logger.error(path.basename(seederFile), _error);
    //     }
    //   }
    //   logger.error('SYNC_MODELS_SUCCESSFULLY');
    // } catch (_error) {
    //   logger.error('SYNC_MODELS_FAILED', _error);
    // }
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
};

module.exports = getDataSource;
