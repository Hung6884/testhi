const log = require('electron-log');
const https = require('https');
const { readFileSync } = require('fs');
const path = require('path');
const { getPublicPath, getAssetsPath } = require('../../utils/path.util');

function createHostFileServer({ host, port, distPath }) {
  const express = require('express');
  const app = express();
  try {
    if (!distPath) {
      return null;
    }

    app.use(express.static(distPath));

    app.get('/env.js', (req, res) => {
      const env = readFileSync(getPublicPath('env.json')).toString();
      log.error(env);
      if (env) {
        res.status(200).send(`window.env = ${env}`);
      } else {
        res.status(404).send('ENV_IS_NOT_CONFIGED');
      }
    });

    app.get('*', (req, res) => {
      log.error(req.url);
      res.sendFile(path.join(distPath, 'index.html'));
    });

    if (process.env.USE_SSL == true) {
      const key = readFileSync(getAssetsPath('ssl', 'key.pem'));
      const cert = readFileSync(getAssetsPath('ssl', 'cert.pem'));
      if (host && host !== 'localhost') {
        https.createServer({ key, cert }, app).listen(host, port);
      } else {
        https.createServer({ key, cert }, app).listen(port);
      }
    } else if (host && host !== 'localhost') {
      app.listen(host, port);
    } else {
      app.listen(port);
    }

    log.error(path.basename(distPath), `at ${host}:${port}`);
  } catch (_error) {
    log.error(_error);
  }
}

module.exports = createHostFileServer;
