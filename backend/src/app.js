const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const https = require('https');
const correlator = require('express-correlation-id');
const swaggerUi = require('swagger-ui-express');
require('reflect-metadata');
const uniq = require('lodash/uniq');

const { readFileSync } = require('fs');
const morgan = require('./config/morgan');
const routes = require('./routes/v1/index');
const swaggerSpec = require('./swagger.js');
const { getAssetsPath } = require('./utils/path.util');
const authenticateToken = require('./middlewares/authenticateToken');
const { parseTokenToJson } = require('./services/token.service');
const logger = require('./config/logger');
const config = require('./config/config');
const axios = require('axios');

async function startApp({ host, port } = {}) {
  const app = express();

  if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
  }
  // set security HTTP headers
  app.use((req, res, next) => {
    if (req.path.startsWith('/api-docs')) {
      return next();
    }
    helmet()(req, res, next);
  });
  app.use(correlator());

  // parse json request body
  app.use(express.json());

  // parse urlencoded request body
  app.use(express.urlencoded({ extended: true }));

  // enable cors
  app.use(cors());
  app.options('*', cors());
  app.use('/api/v1', routes);
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.get('/ping', (req, res) => {
    res.send('PONG!');
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  const routers = [];
  function collectRoute(routePath, layer) {
    if (layer.route) {
      layer.route.stack.forEach(
        collectRoute.bind(null, routePath.concat(splitRoute(layer.route.path))),
      );
    } else if (layer.name === 'router' && layer.handle.stack) {
      layer.handle.stack.forEach(
        collectRoute.bind(null, routePath.concat(splitRoute(layer.regexp))),
      );
    } else if (layer.method) {
      const concatedPath = `/${routePath
        .concat(splitRoute(layer.regexp))
        .filter(Boolean)
        .join('/')}`;
      routers.push(concatedPath);
    }
  }

  function splitRoute(thing) {
    if (typeof thing === 'string') {
      return thing.split('/');
    }
    if (thing.fast_slash) {
      return '';
    }
    const match = thing
      .toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//);
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : `<complex:${thing.toString()}>`;
  }
  // Add Router Permissions

  app._router.stack.forEach(collectRoute.bind(null, []));

  app.get('/api/v1/get-router', authenticateToken, (req, res) => {
    try {
      res.status(200).send(uniq(routers));
    } catch (_error) {
      logger.error('AN_ERROR_OCCURRED_WHILE_GET_ROUTER', _error);
      res.status(500).send('AN_ERROR_OCCURRED_WHILE_GET_ROUTER');
    }
  });

  app.get('/api/v1/get-student-info', parseTokenToJson, (req, res) => {
    try {
      res.send({ studentData: req.data });
    } catch (_error) {
      logger.error('AN_ERROR_OCCURRED_WHILE_GET_GET_STUDENT_INFO', _error);
      res.status(500).send('AN_ERROR_OCCURRED_WHILE_GET_GET_STUDENT_INFO');
    }
  });
  app.get('/api/v1/get-teacher-info', parseTokenToJson, (req, res) => {
    try {
      res.send({ teacherData: req.data });
    } catch (_error) {
      logger.error('AN_ERROR_OCCURRED_WHILE_GET_GET_TEACHER_INFO', _error);
      res.status(500).send('AN_ERROR_OCCURRED_WHILE_GET_GET_TEACHER_INFO');
    }
  });

  app.post('/api/v1/route-map', async (req, res) => {
    const { coordinates } = req.body;

    if (!coordinates || coordinates.length < 2) {
      return res.status(400).json({ error: 'At least 2 coordinates required' });
    }
    try {
      const arraysOfChunks = [], size = 50;
      while (coordinates.length > 0) {
        arraysOfChunks.push(coordinates.splice(0, size));
      }

      const responses = await Promise.all(arraysOfChunks.map(async (curr) => {
        try {
          const coordString = curr
            .map(([lat, lng]) => `${lng},${lat}`)
            .join(';');
          const url = `${config.osrmUrl}/match/v1/driving/${coordString}?overview=false&geometries=polyline`
          const response = await axios.get(url);
          const result = response.data.tracepoints.reduce((acc, point) => {
            try {
              if (!point || !point.location) {
                return acc;
              }
              acc.push(point.location);
              return acc;
            }
            catch (e) {
              console.log("[DEBUG] ERROR WHILE PROCESSING DATA", e);
            }
            finally {
              return acc;
            }
          }, [])
          return result;
        }
        catch (e) {
          console.log("[DEBUG] ERROR WHILE MATCHING COORDINATES", e);
          return null;
        }
      }))
      const result = responses.reduce((acc, curr) => { 
        if (!curr) {
          return acc;
        }
        acc.push(...curr); 
        return acc; 
      }, []);
      res.json({ coordinates: result });
    } catch (err) {
      console.error('Error fetching route:', err);
      res.status(500).json({ error: 'Failed to fetch route' });
    }
  });

  // send back a 404 error for any unknown api request
  app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../html/404.html'));
  });

  host = host || config.host;
  port = port || config.port;

  if (process.env.USE_SSL) {
    const key = readFileSync(getAssetsPath('ssl', 'key.pem'));
    const cert = readFileSync(getAssetsPath('ssl', 'cert.pem'));
    if (host !== 'localhost') {
      https.createServer({ key, cert }, app).listen(host, port);
    } else {
      https.createServer({ key, cert }, app).listen(port);
    }
  } else if (host !== 'localhost') {
    app.listen(host, port);
  } else {
    app.listen(port);
  }

  return app;
}

module.exports = startApp;
