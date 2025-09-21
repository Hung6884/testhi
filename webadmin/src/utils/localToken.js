import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

const getRootDomain = () => {
  const hostnameParts = window.location.hostname.split('.');
  const rootDomain = hostnameParts.slice(-2).join('.');
  return rootDomain.startsWith('.') ? rootDomain : `.${rootDomain}`;
};

export const getTokenInfo = async () => {
  const tokenInfo = jwtDecode(
    (await Cookies.get(window.env.siteTokenKey)) || '',
  ) || {
    body: {},
  };
  tokenInfo.body = { ...tokenInfo.body };
  return tokenInfo;
};

/**
 * 获取本地Token
 */

export const getToken = async () => {
  const jwtToken = 'Bearer ' + (await Cookies.get(window.env.siteTokenKey));
  return jwtToken;
};

/**
 * 设置存储本地Token
 */
export const setToken = async ({ token }) => {
  try {
    await Cookies.set(window.env.siteTokenKey, token, {
      domain: getRootDomain(),
    });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 移除本地Token
 */
export const removeToken = async () => {
  try {
    await Cookies.remove(window.env.siteTokenKey);
    await Cookies.remove(window.env.siteTokenKey, {
      domain: getRootDomain(),
    });
    await localStorage.removeItem('user-permissions');
    return true;
  } catch (error) {
    return false;
  }
};
