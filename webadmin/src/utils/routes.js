import { isExternal } from './validate';

/**
 * 获取 route
 * @param pathname path
 * @param routesData routes
 */
export const getRouteItem = (pathname, routesData) => {
  let item = { title: '', path: '' };
  for (let index = 0, len = routesData.length; index < len; index += 1) {
    const element = routesData[index];
    if (
      element.path === pathname ||
      (element.selectLeftMenu &&
        pathname.includes(element.selectLeftMenu) &&
        pathname.includes(element.path.split('/').slice(-2)[0]))
    ) {
      item = element;
      break;
    }

    if (element.routes) {
      item = getRouteItem(pathname, element.routes);
      if (item.path !== '') {
        break;
      }
    }
  }

  return item;
};

/**
 * 获取 父 route
 * @param pathname path
 * @param routesData routes
 */
export const getRouteParentItem = (pathname, routesData, defaultParentItem) => {
  let item = {};
  for (let index = 0, len = routesData.length; index < len; index += 1) {
    const element = routesData[index];
    if (element.path === pathname) {
      item = defaultParentItem;
      break;
    }

    if (element.routes) {
      item = getRouteParentItem(pathname, element.routes, element);
      if (Object.keys(item).length) {
        break;
      }
    }
  }

  return item;
};

/**
 * 根据路由 path 格式化 - 获取 父path
 * @param pathname path
 * @param separator 路由分割符- 默认 /
 */
export const formatRoutePathTheParents = (pathname, separator = '/') => {
  const arr = [];
  if (!pathname || pathname === '') {
    return arr;
  }

  const pathArr = pathname.split(separator);
  for (let index = 1, len = pathArr.length - 1; index < len; index += 1) {
    arr.push(pathArr.slice(0, index + 1).join(separator));
  }

  return arr;
};

/**
 * 根据路由 pathname 数组 - 返回对应的 route 数组
 * @param pathname path[]
 * @param routesData routes
 */
export const getPathsTheRoutes = (pathname, routesData) => {
  const routeItem = [];

  for (let index = 0, len = pathname.length; index < len; index += 1) {
    const element = pathname[index];
    const item = getRouteItem(element, routesData);
    if (item.path !== '') {
      routeItem.push(item);
    }
  }

  return routeItem;
};

/**
 * 获取面包屑对应的 route 数组
 * @param route route 当前routeItem
 * @param pathname path[]
 * @param routesData routes
 */
export const getBreadcrumbRoutes = (
  route,
  pathname,
  routesData,
  formatMessage,
) => {
  if (!route.breadcrumb) {
    const routePaths = getPathsTheRoutes(pathname, routesData);

    return route.breadcrumb === false ? routePaths : [...routePaths, route];
  }

  if (formatMessage) {
    if (route['breadcrumbFormatMessage'] === true) {
      return route.breadcrumb;
    }
    route['breadcrumbFormatMessage'] = true;
    return route.breadcrumb.map((item) => {
      item.title = formatMessage({ id: item.title });
      return item;
    });
  }

  return route.breadcrumb;
};

/**
 * 获取当前路由选中的侧边栏菜单path
 * @param route route
 */
export const getSelectLeftMenuPath = (route) => {
  return route.selectLeftMenu || route.path;
};

/**
 * 获取当前路由对应的顶部菜单path
 * @param route route
 */
export const getRouteBelongTopMenu = (route) => {
  if (route.belongTopMenu) {
    return route.belongTopMenu;
  }
  return `/${route.path.split('/')[1]}`;
};

/**
 * 获取当前路由对应的顶部菜单path
 * @param pathname path
 * @param routes routes
 */
export const getRouteBelongTopMenuForRoutes = (pathname, routes) => {
  const routeItem = getRouteItem(pathname, routes);
  return getRouteBelongTopMenu(routeItem);
};

/**
 * 根据父path 设置当前项 path
 * @param pathname path
 * @param parentPath 父path - 默认 /
 * @param headStart 路由起始头 - 默认 /
 */
export const setRoutePathForParent = (
  pathname,
  parentPath = '/',
  headStart = '/',
) => {
  if (isExternal(pathname)) {
    return pathname;
  }

  return pathname.substr(0, headStart.length) === headStart
    ? pathname
    : `${parentPath}/${pathname}`;
};

/**getPermissionMenuData
 * 返回404路由
 */
export const getNotFoundRoute = (notFoundComponent) => {
  return {
    hidden: true,
    title: '',
    path: '*',
    component: notFoundComponent,
  };
};

/**
 * 格式化返回 umijs 路由, 主要处理特殊情况
 * @param routesData routes
 * @param parentPath 父path - 默认 /
 * @param headStart 路由起始头 - 默认 /
 */
export const umiRoutes = (routesData, parentPath = '/', headStart = '/') => {
  return routesData.map((item) => {
    const { redirect, routes, ...other } = item;
    const itemRoutes = routes || [];
    const newItem = { ...other };
    newItem.path = setRoutePathForParent(newItem.path, parentPath, headStart);

    /**
     * 处理跳转[redirect]
     * 因为 react 路由 如果父级有 redirect 后，子集路由不再好使
     * 这里把处理成有效
     */
    if (item.redirect && item.routes) {
      newItem.routes = [
        ...umiRoutes(itemRoutes, newItem.path, headStart),
        {
          hidden: true,
          title: newItem.title,
          path: newItem.path,
          redirect: item.redirect,
        },
        getNotFoundRoute(),
      ];
    } else if (item.redirect && !item.routes) {
      newItem.redirect = redirect;
    } else if (!item.redirect && item.routes) {
      newItem.routes = [
        ...umiRoutes(itemRoutes, newItem.path, headStart),
        getNotFoundRoute(),
      ];
    } /*  else {
 
    } */

    return newItem;
  });
};

/**
 * 根据 自定义传入权限名 判断当前用户是否有权限
 * @param userRoles 用户的权限
 * @param role 自定义权限名
 */
export const hasPermissionRouteRoles = (userRoles, role) => {
  // if (userRoles.includes('admin')) {
  //   return true;
  // }

  return userRoles.includes(role);
};

/**
 * 根据 route.roles 判断当前用户是否有权限
 * @param roles 用户的权限
 * @param route 当前路由
 */
export const hasPermission = (roles, route) => {
  // if (roles.includes('admin')) {
  //   return true;
  // }

  if (route.roles) {
    return route.roles.some((role) => roles.includes(role));
    //return roles.some(role => route.roles?.includes(role));
  }

  return true;
};

/**
 * 根据用户权限 获取 对应权限菜单
 * @param roles 用户的权限
 * @param routes 框架对应路由
 */
export const getPermissionMenuData = (roles, routes) => {
  const menu = [];
  for (let index = 0, len = routes.length; index < len; index += 1) {
    const element = routes[index];
    if (hasPermission(roles, element)) {
      if (element.routes) {
        element.routes = getPermissionMenuData(roles, element.routes);
      }
      menu.push(element);
    }
  }

  return menu;
};
