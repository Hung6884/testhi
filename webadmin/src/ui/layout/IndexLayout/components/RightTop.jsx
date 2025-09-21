import {
  EnvironmentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';

import RightTopUser from './RightTopUser';

import { ALink } from '../../../component/ALink';
import { BreadCrumbs } from '../../../component/BreadCrumbs';
import { SelectLang } from '../../../component/SelectLang';
import useIntl from '../../../hook/useIntl';
import styles from '../style.less';

const RightTop = ({
  collapsed = false,
  topNavEnable = true,
  belongTopMenu = '',
  toggleCollapsed,
  breadCrumbs = [],
  menuData = [],
  currentUser = {},
  settings,
}) => {
  const { formatMessage } = useIntl();
  return (
    <div
      id={styles['indexlayout-right-top']}
      className={!topNavEnable ? styles.topNavEnable : ''}
    >
      <div className={styles['indexlayout-right-top-top']}>
        <div
          className={styles['indexlayout-flexible']}
          onClick={() => {
            if (toggleCollapsed) {
              toggleCollapsed();
            }
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
        <div className={styles['indexlayout-top-menu']}>
          {topNavEnable ? (
            menuData.map((item) => {
              if (item.hidden) {
                return null;
              }

              let className = `${styles['indexlayout-top-menu-li']}`;
              if (belongTopMenu === item.path) {
                className = `${styles['indexlayout-top-menu-li']} ${styles.active}`;
              }

              return (
                <ALink to={item.path} className={className} key={item.path}>
                  {formatMessage({ id: item.title })}
                </ALink>
              );
            })
          ) : (
            <BreadCrumbs className={styles.breadcrumb} list={breadCrumbs} />
          )}
        </div>
        <Space className={styles['indexlayout-top-menu-right']} size="large">
          {/* <RightTopMessage /> */}
          <SelectLang className={styles['indexlayout-top-selectlang']} />
          <RightTopUser
            className={styles['indexlayout-top-usermenu']}
            currentUser={currentUser}
            settings={settings}
          />
        </Space>
      </div>

      {topNavEnable ? (
        <div className={styles['indexlayout-right-top-bot']}>
          <div className={styles['indexlayout-right-top-bot-home']}>
            <EnvironmentOutlined />
          </div>
          <BreadCrumbs className={styles.breadcrumb} list={breadCrumbs} />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default RightTop;
