const path = require('path');

const { app, BrowserWindow, Menu } = require('electron');
const log = require('electron-log');
const { readFileSync } = require('fs');

const join = require('lodash/join');

const createHostFileServer = require('./createHostFileServer');
const bootstrap = require('../../bootstrap');
const { getPublicPath } = require('../../utils/path.util');
const logger = require('../../config/logger');

let mainWindow;

const isDevelopment = process.env.NODE_ENV === 'development';

function resolveDistPath(...paths) {
  try {
    const filePath = isDevelopment
      ? path.resolve(...[__dirname, '../../renderers', ...paths])
      : join([process.resourcesPath, 'renderers', ...paths], path.sep);
    log.error(filePath);

    return filePath.replaceAll(/\\+/g, '/');
  } catch (_error) {
    log.error(_error);
  }
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  });

  mainWindow.maximize();
  if (!isDevelopment) {
    Menu.buildFromTemplate([]);
  }

  let env = {};
  try {
    env = JSON.parse(readFileSync(getPublicPath('env.json')).toString());

    process.env = {
      ...process.env,
      ...env,
    };
  } catch (_error) {
    logger.error('CAN_NOT_READ_FILE_ENV', _error.message);
  }

  createHostFileServer({
    host: process.env.ADMIN_HOST,
    port: process.env.ADMIN_PORT,
    distPath: resolveDistPath(
      'human-resource-management',
      'FE-settings',
      'dist',
    ),
  });

  createHostFileServer({
    host: process.env.HRM_ADMIN_HOST,
    port: process.env.HRM_ADMIN_PORT,
    distPath: resolveDistPath('human-resource-management', 'FE', 'dist'),
  });

  createHostFileServer({
    host: process.env.ASM_ADMIN_HOST,
    port: process.env.ASM_ADMIN_PORT,
    distPath: resolveDistPath('asset-management', 'FE', 'dist'),
  });

  createHostFileServer({
    host: process.env.TKM_ADMIN_HOST,
    port: process.env.TKM_ADMIN_PORT,
    distPath: resolveDistPath('ticket-management', 'FE', 'dist'),
  });

  createHostFileServer({
    host: process.env.TSM_ADMIN_HOST,
    port: process.env.TSM_ADMIN_PORT,
    distPath: resolveDistPath('task-management', 'FE', 'dist'),
  });

  createHostFileServer({
    host: process.env.TCM_ADMIN_HOST,
    port: process.env.TCM_ADMIN_PORT,
    distPath: resolveDistPath('test-management', 'FE', 'dist'),
  });

  createHostFileServer({
    host: process.env.UTM_ADMIN_HOST,
    port: process.env.UTM_ADMIN_PORT,
    distPath: resolveDistPath('user-token-management', 'FE', 'dist'),
  });

  createHostFileServer({
    host: process.env.TOM_ADMIN_HOST,
    port: process.env.TOM_ADMIN_PORT,
    distPath: resolveDistPath('time-off-management', 'FEcopy', 'dist'),
  });

  await mainWindow.loadURL(
    `http://${process.env.ADMIN_HOST}:${process.env.ADMIN_PORT}`,
  );
}

app.on('ready', async () => {
  // Start app service before create window
  await bootstrap();
  await createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  if (mainWindow === null) {
    await createWindow();
  }
});
