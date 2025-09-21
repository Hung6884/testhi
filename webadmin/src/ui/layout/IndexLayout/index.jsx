import { ConfigProvider } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import { useCallback, useEffect, useState } from 'react';
import {
  Helmet,
  Outlet,
  useDispatch,
  useIntl,
  useLocation,
  useModel,
  useSelector,
} from 'umi';

import get from 'lodash/get';
import reduce from 'lodash/reduce';

// import { userService } from '@toolchain/service';
import { ErrorBoundary } from '@ant-design/pro-components';
import { mergeUnique as ArrayMergeUnique } from '../../../utils/array';
import {
  formatRoutePathTheParents,
  getBreadcrumbRoutes,
  getPermissionMenuData,
  getRouteBelongTopMenu,
  getRouteItem,
  getSelectLeftMenuPath,
} from '../../../utils/routes';
import Left from './components/Left';
import RightFooter from './components/RightFooter';
import RightTop from './components/RightTop';

import { Notification } from '../../component/Notification';
import styles from './style.less';

const IndexLayout = (props) => {
  const { routes, settings } = props || {};
  const { collapsed, topNavEnable, userRoles, headFixed, currentUser } =
    useSelector(
      ({ global, User }) => ({
        collapsed: global.collapsed,
        topNavEnable: global.topNavEnable,
        headFixed: global.headFixed,
        userRoles: User.currentUser.roles,
        currentUser: User.currentUser,
      }),
      {
        devModeChecks: { stabilityCheck: 'never' },
      },
    );

  const { formatMessage } = useIntl();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const { initialState, setInitialState } = useModel('@@initialState') || {};

  const readRouteItem = () => {
    return getRouteItem(pathname, routes);
  };

  const [routeItem, setRouteItem] = useState({
    title: '',
    path: '',
  });
  const [belongTopMenu, setBelongTopMenu] = useState('');
  const [selectedKey, setSelectedKey] = useState('');

  const [routeParentPaths, setRouteParentPaths] = useState([]);
  const [leftOpenKeys, setLeftOpenKeys] = useState(routeParentPaths);

  const [breadcrumb, setBreadcrumb] = useState([]);
  const [menuData, setMenuData] = useState([]);

  const toggleCollapsed = () => {
    if (dispatch) {
      console.log('🚀 ~ toggleCollapsed ~ dispatch:', dispatch);
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload: !collapsed,
      });
    }
  };

  const handleFetchPermission = useCallback(async () => {
    // const permissionsResponse =
    //     await userService.getPermissionByUserAPI('Task Management');
    const permissionsResponse = [];
    if (setInitialState) {
      setInitialState({
        ...initialState,
        userPermissions: reduce(
          get(permissionsResponse, 'permissions.data', []),
          (res, permission) => {
            res[permission.componentId || permission.permissionName] =
              permission;
            return res;
          },
          {},
        ),
      });
    }
  }, []);

  useEffect(() => {
    const routeItem = readRouteItem();
    const routeParentPaths = formatRoutePathTheParents(pathname);
    const breadcrumbRoutes = getBreadcrumbRoutes(
      routeItem,
      routeParentPaths,
      routes,
      formatMessage,
    );
    setRouteItem(routeItem);
    setRouteParentPaths(routeParentPaths);
    setBreadcrumb(breadcrumbRoutes);
  }, [pathname]);

  // 设置所属顶部菜单与左侧选中菜单
  useEffect(() => {
    setBelongTopMenu(getRouteBelongTopMenu(routeItem));
    setSelectedKey(getSelectLeftMenuPath(routeItem));
  }, [routeItem]);

  // 更新左侧菜单展开的子菜单key
  useEffect(() => {
    if (routeParentPaths.length && !collapsed) {
      setLeftOpenKeys(ArrayMergeUnique(leftOpenKeys, routeParentPaths));
      // setLeftOpenKeys(routeParentPaths);
    }
  }, [routeParentPaths, collapsed, leftOpenKeys]);

  useEffect(() => {
    // setMenuData(getPermissionMenuData(userRoles, routes));
    setMenuData(routes);
    // }, [userRoles, pathname]);
  }, [pathname]);

  // useEffect(() => {
  //   if (!get(initialState, ['userPermissions', 'length'])) {
  //     handleFetchPermission();
  //   }
  // }, [initialState]);

  return (
    <ConfigProvider locale={viVN}>
      <div id={styles.indexlayout}>
        <Helmet>
          <title>{`${settings.siteTitle}`}</title>
        </Helmet>
        <Notification />
        <Left
          collapsed={collapsed}
          topNavEnable={topNavEnable}
          belongTopMenu={belongTopMenu}
          selectedKeys={[selectedKey]}
          openKeys={leftOpenKeys}
          onOpenChange={setLeftOpenKeys}
          menuData={menuData}
        />
        <div
          id={styles['indexlayout-right']}
          className={headFixed ? styles['fixed-header'] : ''}
        >
          <RightTop
            collapsed={collapsed}
            topNavEnable={topNavEnable}
            belongTopMenu={belongTopMenu}
            toggleCollapsed={toggleCollapsed}
            breadCrumbs={breadcrumb}
            menuData={menuData}
            currentUser={currentUser}
            settings={settings}
          />
          <div className={styles['indexlayout-right-main']}>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default IndexLayout;
