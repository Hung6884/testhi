const { existsSync, readFileSync, writeFileSync, unlinkSync } = require('fs');
const httpStatus = require('http-status');
const axios = require('axios');
const ErrorMessage = require('../constant/ErrorMessage');
const ResponseDataSuccess = require('../utils/response/ResponseDataSuccess');
const BadRequestServerError = require('../utils/response/BadRequestServerError');
const logger = require('../config/logger');
const { getConfigPath } = require('../utils/path.util');
const InternalServerError = require('../utils/response/InternalServerError');

const appInforsPath = getConfigPath('app.config.json');

async function startApp(appInformations) {
  let response = {};

  if (existsSync(getConfigPath('app.config.json'))) {
    return new ResponseDataSuccess('Success');
  }
  try {
    writeFileSync(appInforsPath, JSON.stringify(appInformations, null, 4), {
      flag: 'w',
    });

    if (appInformations?.workplaceType !== 'ob') {
      await axios.post(
        `http://${process.env.NODERED_HOST}:${process.env.NODERED_PORT}/api/sync-employees`,
        {
          token: appInformations.token,
          organizaionName: appInformations.organizaionName,
          organizaionEmail: appInformations.organizaionEmail,
        },
        {
          proxy: false,
        },
      );
    }
    response = await axios.post(
      `http://${process.env.NODERED_HOST}:${process.env.NODERED_PORT}/api/create-admin`,
      {},
      {
        proxy: false,
      },
    );
  } catch (error) {
    logger.error(error.message);
    return new InternalServerError(ErrorMessage.INTERNAL_SERVER_ERROR);
  }

  if (response.status === httpStatus.OK) {
    return new ResponseDataSuccess('Success');
  }
  try {
    unlinkSync(appInforsPath);
  } catch (_error) {}
  return new BadRequestServerError(ErrorMessage.BAD_REQUEST);
}

function getAppInformations() {
  try {
    if (existsSync(appInforsPath)) {
      return new ResponseDataSuccess(
        JSON.parse(readFileSync(appInforsPath).toString()),
      );
    }
  } catch (_error) {
    logger.error(_error);
  }
  return new BadRequestServerError(ErrorMessage.BAD_REQUEST);
}

module.exports = { startApp, getAppInformations };
