/**
 * Custom request network utility
 * More detailed API documentation: https://github.com/umijs/umi-request
 * @author LiQingSong
 */

import { notification } from 'antd';
import { get, isArray, isString } from 'lodash';
import { extend } from 'umi-request';
import { getToken } from './localToken';

const serverCodeMessage = {
  200: 'Success',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

/**
 * Error handling function
 */
const errorHandler = async (error) => {
  const { formatMessage } = await import('umi');
  const customCodeMessage = {
    10002: 'app.global.login.expired',
  };

  const { response, message, data } = error;

  if (message === 'CustomError') {
    // Custom error handling
    const { req, res } = data;
    const { url } = req;
    const { code } = res;

    const reqUrl = url.split('?')[0].replace(API_HOST, '');
    const noVerifyBool = get(settings, 'ajaxResponseNoVerifyUrl', []).includes(
      reqUrl,
    );
    if (!noVerifyBool) {
      notification.error({
        message: formatMessage({ id: 'app.global.custom.error.message' }),
        description:
          customCodeMessage[code] ||
          res.msg ||
          formatMessage({ id: 'app.global.error' }),
      });
    }
  } else if (message === 'CancelToken') {
    // Request cancellation token
    // eslint-disable-next-line no-console
    console.log(message);
  } else if (response && response.status) {
    const errorText = serverCodeMessage[response.status] || response.statusText;
    const hasMessage =
      data.message && (isString(data.message) || isArray(data.message));
    let messageNotification = '';

    if (hasMessage) {
      if (isArray(data.message)) {
        for (const message of data.message) {
          messageNotification += message + '\n';
        }
      } else {
        messageNotification = data.message;
      }
    } else if (errorText) {
      messageNotification = errorText;
    } else {
      messageNotification = formatMessage({ id: 'app.global.something.wrong' });
    }
    // notification.error({
    //   message: messageNotification,
    // });
  } else if (!response) {
    notification.error({
      description: formatMessage({ id: 'app.global.no.response.description' }),
      message: formatMessage({ id: 'app.global.no.response.message' }),
    });
  }

  return Promise.reject(
    error.data || formatMessage({ id: 'app.global.custom.error.message' }),
  );

  // throw error; // If we throw, the error continues to propagate through the catch block.
};
export function createRequest({ settings, number } = {}) {
  const API_HOST = window.env.API_HOST;

  /**
   * Configure default parameters for the request
   */
  const request = extend({
    errorHandler, // Default error handler
    credentials: 'same-origin', // Whether to send cookies with the request by default
    prefix: API_HOST,
  });

  request.use(async (ctx, next) => {
    try {
      // Before making the request
      const { req } = ctx;

      const { options } = req;
      const authorization = await getToken();
      ctx.req.options = {
        ...options,
        headers: {
          authorization,
          // access_authorization: accessToken,
          // refresh_authorization: refreshToken,
        },
      };
      await next();
    } catch (error) {
      throw error;
      // console.log(_error);
    }
  });

  return request;
}

export function createRequestNodeRed({ settings, number } = {}) {
  // API_HOST_NODE_RED example in env.example file
  const API_HOST_NODE_RED = window.env.API_HOST_NODE_RED;

  /**
   * Configure default parameters for the request
   */
  const request = extend({
    errorHandler, // Default error handler
    credentials: 'same-origin', // Whether to send cookies with the request by default
    prefix: API_HOST_NODE_RED,
  });

  request.use(async (ctx, next) => {
    try {
      // Before making the request
      const { req } = ctx;

      const { options } = req;
      const authorization = await getToken();
      ctx.req.options = {
        ...options,
        headers: {
          authorization,
          // access_authorization: accessToken,
          // refresh_authorization: refreshToken,
        },
      };
      await next();
    } catch (error) {
      throw error;
      // console.log(_error);
    }
  });

  return request;
}
