require('@bqy/node-module-alias/register');

const { readFileSync, readdirSync, copyFileSync, mkdirSync } = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const {
  getPublicPath,
  getAssetsPath,
  getDefaultPath,
  generatePath,
} = require('./utils/path.util');
const logger = require('./config/logger');
const startApp = require('./app');
// const startNodeRed = require('./node-red');
// const getDataSource = require('./libs/database');

dotenv.config({ path: path.join(__dirname, '../.env') });
// Start socket
// require('./socket');

async function bootstrap() {
  let env = {};
  // Read external env file
  try {
    try {
      mkdirSync(getPublicPath());
    } catch (_error) {}
    env = JSON.parse(readFileSync(getPublicPath('env.json')).toString());

    process.env = {
      ...process.env,
      ...env,
    };
  } catch (_error) {
    logger.error('CAN_NOT_READ_FILE_ENV', _error.message);
  }

  // Copy and overwrite excel templates
  const defaultPath = getDefaultPath();
  /* for (const excelFile of readdirSync(getAssetsPath('excel-templates'))) {
    try {
      try {
        mkdirSync(generatePath(defaultPath, 'excel-templates'), {
          recursive: true,
        });
      } catch (_error) {}
      copyFileSync(
        generatePath(getAssetsPath('excel-templates'), excelFile),
        generatePath(defaultPath, 'excel-templates', excelFile),
      );
    } catch (_error) {
      logger.error(_error);
    }
  } */
  // Init database
  // await getDataSource();

  // Start Node-Red
  // await startNodeRed();

  // Start main app services
  await startApp();
}

module.exports = bootstrap;
