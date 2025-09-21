const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');

const trim = require('lodash/trim');

// const userService = require('../projects/hrm/services/user.service');
const { initService } = require('../services/index');
// const permissionRepository = require('../projects/hrm/repositories/permission.repository');
// const userRepository = require('../projects/hrm/repositories/user.repository');
const config = require('../config/config');
const logger = require('../config/logger');

// let appInformations = initService.getAppInformations();

module.exports = (req, res, next) => {
  //   if (appInformations.status === 400) {
  //     appInformations = initService.getAppInformations();
  //   }
  //   const authHeader = req.headers.authorization;
  //   const token = trim(authHeader && authHeader.split(' ')[1]);

  //   if (appInformations.status === httpStatus.BAD_REQUEST) {
  //     return res.status(httpStatus.BAD_GATEWAY).send({
  //       message: 'NO_CONTENT',
  //     });
  //   }

  //   if (`${token}` === 'null')
  //     return res.status(httpStatus.UNAUTHORIZED).send({
  //       message: 'Unauthorized',
  //     });

  jwt.verify(token, config.jwt.secret, async (err, user) => {
    return next();
    // if (err) {
    //   logger.error('FORBIDDEN', err);
    //   return res.status(httpStatus.FORBIDDEN).send({
    //     message: 'Forbidden',
    //   });
    // }

    // if (user.body?.dataValues) {
    //   const username = user.body.dataValues.username;
    //   const matchedUser = await userRepository.findByUsername(username);
    //   user.body = {
    //     ...matchedUser.dataValues,
    //     ...user.body,
    //   };
    // }

    // try {
    //   const routePath = req.route.path === '/' ? '' : req.route.path;
    //   const apiRoute = `${req.baseUrl}${routePath}`;
    //   const method = req.method;
    //   const permissionsByRoute = await permissionRepository.findAllByParams({
    //     api: apiRoute,
    //     method,
    //   });
    //   if (!permissionsByRoute.length) {
    //     logger.warn(
    //       `No permissions found for route: ${req.method} ${apiRoute}`,
    //     );
    //     return res.status(httpStatus.FORBIDDEN).send({ message: 'Forbidden' });
    //   }

    //   const {
    //     data: { permissions },
    //   } = await userService.findRoleAndPermissionById(user.body.id);

    //   const permissionsByRouteValue = permissionsByRoute.map(
    //     (item) => item.dataValues,
    //   );
    //   const matchedPermissions = permissions.filter((a) =>
    //     permissionsByRouteValue.some(
    //       (b) => a.api === b.api && a.method === b.method,
    //     ),
    //   );

    //   if (matchedPermissions.length > 0) {
    //     req.headers.userId = user.body.id;
    //     req.headers.account_name = user.body.username;
    //     req.headers.matched_permissions = matchedPermissions;
    //     return next();
    //   }
    // } catch (e) {
    //   logger.error('Error fetching role and permission:', e);
    // }

    // req.headers.userId = user.body.id;
    // req.headers.email = user.body.email;
    // req.headers.account_name = user.body.username;

    // logger.error('Unauthorized:');

    // return res.status(httpStatus.UNAUTHORIZED).send({
    //   message: 'Unauthorized',
    // });
  });
};
