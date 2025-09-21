const { getPublicPath } = require('../utils/path.util');
require("dotenv").config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.APP_HOST || 'localhost',
  port: process.env.APP_PORT || 3000,
  osrmUrl: process.env.OSRM_URL || 'http://localhost:5000',
  faceIdServer: process.env.FACE_ID_SERVER || 'http://103.61.123.146:7000',
  socketHost: process.env.SOCKET_HOST || 'localhost',
  socketPort: process.env.SOCKET_PORT || 3001,
  jwt: {
    secret: process.env.JWT_SECRET || 'thisisasamplesecret',
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || 1440,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS || 30,
    resetPasswordExpirationMinutes:
      process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES || 10,
    verifyEmailExpirationMinutes:
      process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES || 10,
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  },
  upload: {
    folder: getPublicPath(),
    employee: getPublicPath('uploads', 'employee'),
    ticket: getPublicPath('uploads', 'ticket'),
    attachment: getPublicPath('uploads', 'attachment'),
    status: getPublicPath('uploads', 'status'),
    action: getPublicPath('uploads', 'action'),
    asset: getPublicPath('uploads', 'asset'),
    testCaseTemplate: getPublicPath('uploads', 'testCaseTemplate'),
    worklog: getPublicPath('uploads', 'worklog'),
  },
  database: {
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASSWORD || "defaultpassword",
    port: process.env.DB_PORT || 5432,
    defaultDatabase: process.env.DATABASE || "dat_web_db",
    username: process.env.DB_USERNAME || "postgres",
    dialect: process.env.DB_DIALECT || "postgres"
  }
};
