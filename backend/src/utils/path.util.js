const trim = require('lodash/trim');
const os = require('os');
const path = require('path');

const SRC_PATH = path.resolve(__dirname, '..');
const isDev = process.env.NODE_ENV === 'development';
const machineType = os.machine();
const isWindow = ['x86_64', 'i686'].includes(machineType);
const defaultPath = isWindow ? 'D:/' : os.homedir();

function isAlphanumeric(mixedVar) {
  return /number|string/i.test(typeof mixedVar);
}

function pathify(p) {
  if (!isAlphanumeric(p)) {
    return '';
  }

  const absPath = trim(`${p}`);
  if (absPath.length === 0) {
    return '';
  }

  return path.normalize(absPath);
}

function generatePath(...paths) {
  return pathify(
    paths
      .filter(isAlphanumeric)
      .map((p) => trim(`${p}`))
      .filter((t) => t.length > 0)
      .join(path.sep),
  );
}

function getConfigPath(...paths) {
  if (isDev) {
    return generatePath(SRC_PATH, 'config', ...paths);
  }
  return generatePath(defaultPath, '.dat', 'config', ...paths);
}

function getAssetsPath(...paths) {
  if (isDev) {
    return generatePath(SRC_PATH, 'assets', ...paths);
  }
  return generatePath(process.resourcesPath, 'assets', ...paths);
}

function getResourcePath(...paths) {
  if (isDev) {
    return generatePath(SRC_PATH, '..', ...paths);
  }
  return generatePath(process.resourcesPath, ...paths);
}

function getPublicPath(...paths) {
  if (isDev) {
    return generatePath(SRC_PATH, '../public', ...paths);
  }
  return generatePath(defaultPath, '.dat', 'public', ...paths);
}

function getDefaultPath(...paths) {
  return generatePath(defaultPath, '.dat', ...paths);
}

function getNodeModulesPath(...paths) {
  if (isDev) {
    return generatePath(SRC_PATH, '../node_modules', ...paths);
  }
  return generatePath(SRC_PATH, 'node_modules', ...paths);
}

module.exports = {
  generatePath,
  getConfigPath,
  getAssetsPath,
  getPublicPath,
  getResourcePath,
  getDefaultPath,
  getNodeModulesPath,
};
