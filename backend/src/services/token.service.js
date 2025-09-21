const jwt = require('jsonwebtoken');
const moment = require('moment');
const get = require('lodash/get');

const config = require('../config/config');
const tokenTypes = require('../config/token');

const parseTokenToJson = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: 'Unauthorized',
    });
  }

  jwt.verify(token, config.jwt.secret, async (err, responseData) => {
    req.data = responseData?.body;
    next();
  });
};

const generateToken = (body, expires, type, secret = config.jwt.secret) => {
  const payload = {
    body,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user) => {
  const userTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes',
  );
  const userToken = generateToken(user.userData, userTokenExpires);

  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes',
  );
  const accessToken = generateToken(
    {
      ...user.userData,
      access_token: user.accessToken,
    },
    accessTokenExpires,
    tokenTypes.ACCESS,
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    'days',
  );
  const refreshToken = generateToken(
    get(user, 'userData.id'),
    refreshTokenExpires,
    tokenTypes.REFRESH,
  );

  // await saveToken(
  //   refreshToken,
  //   get(user, 'userData.id'),
  //   refreshTokenExpires,
  //   tokenTypes.REFRESH,
  //   false,
  // );

  return {
    userToken,
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

module.exports = {
  generateToken,
  generateAuthTokens,
  parseTokenToJson,
};
