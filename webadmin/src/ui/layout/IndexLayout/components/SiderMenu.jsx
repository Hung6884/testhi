import { Menu } from 'antd';
import { useEffect, useState } from 'react';

import {
  getRouteBelongTopMenu,
  setRoutePathForParent,
} from '../../../../utils/routes';
import useIntl from '../../../hook/useIntl';
import { Access } from '../../../component/Access';
import { ALink } from '../../../component/ALink';
import { IconReactFA } from '../../../component/IconReactFA';

const hasChild = (children) => {
  const showChildren = children.filter((item) => {
    if (item.hidden) {
      return false;
    }
    return true;
  });
  if (showChildren.length > 0) {
    return true;
  }
  return false;
};

const getMenuItems = (menuData, topNavEnable) => {
  let MenuItems = menuData;
  if (topNavEnable) {
    MenuItems = [];
    for (let index = 0, len = menuData.length; index < len; index += 1) {
      const element = menuData[index];
      if (element.routes) {
        MenuItems.push(
          ...element.routes.map((item) => {
            const newItem = item;
            newItem.path = setRoutePathForParent(item.path, element.path);
            newItem.key = item.path;
            return newItem;
          }),
        );
      }
    }
  }

  return MenuItems;
};

const SiderMenu = ({
  collapsed = false,
  topNavEnable = true,
  belongTopMenu = '',
  selectedKeys = [],
  openKeys = [],
  onOpenChange,
  menuData = [],
}) => {
  const { formatMessage } = useIntl();

  const getSubMenuOrItem = (routeItem, parentPath = '') => {
    const item = routeItem;

    if (item.hidden) {
      return null;
    }
    item.path = setRoutePathForParent(item.path, parentPath);

    const topMenuPath = getRouteBelongTopMenu(item);
    if (belongTopMenu !== topMenuPath && topNavEnable === true) {
      return null;
    }

    if (item.routes && Array.isArray(item.routes) && hasChild(item.routes)) {
      return (
        // <Access accessible={item.permission} key={item.path}>
        <Menu.SubMenu
          key={item.path}
          title={
            <span>
              {item.icon && <IconReactFA iconName={item.icon} />}
              <span>
                {item.title && item.title !== ''
                  ? formatMessage({ id: item.title })
                  : '--'}
              </span>
            </span>
          }
        >
          {item.routes.map((node) => {
            return getSubMenuOrItem(node, item.path);
          })}
        </Menu.SubMenu>
        // </Access>
      );
    }
    return (
      // <Access accessible={item.permission} key={item.path}>
      <Menu.Item key={item.path}>
        <ALink to={item.path} key={item.path}>
          {item.icon && <IconReactFA iconName={item.icon} />}
          <span>
            {item.title && item.title !== ''
              ? formatMessage({ id: item.title })
              : '--'}
          </span>
        </ALink>
      </Menu.Item>
      // </Access>
    );
  };

  const [MenuItems, setMenuItems] = useState([]);

  // 设置菜单
  useEffect(() => {
    setMenuItems(getMenuItems(menuData, topNavEnable));
  }, [menuData, topNavEnable]);

  return (
    <Menu
      key="sider-menu"
      theme="dark"
      inlineCollapsed={collapsed}
      mode="inline"
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onOpenChange={(key) => {
        if (onOpenChange) {
          onOpenChange(key);
        }
      }}
      onSelect={() => {
        onOpenChange([]);
      }}
    >
      {MenuItems.map((item) => {
        return getSubMenuOrItem(item, '/');
      })}
    </Menu>
  );
};

export default SiderMenu;
