import { useEffect, useState } from 'react';
import { Link } from 'umi';

import logo from '../../../../shared/images/logo-collapsed.png';

import SiderMenu from './SiderMenu';
import styles from '../style.less';
import useIntl from '../../../hook/useIntl';

const Left = ({
  collapsed = false,
  topNavEnable = true,
  belongTopMenu = '',
  selectedKeys = [],
  openKeys = [],
  onOpenChange,
  menuData = [],
}) => {
  const { formatMessage } = useIntl();

  const [leftClassName, setLeftClassName] = useState('');

  useEffect(() => {
    if (collapsed) {
      setLeftClassName(`${styles.narrow}`);
    } else {
      setLeftClassName('');
    }
  }, [collapsed]);

  return (
    <div id={styles['indexlayout-left']} className={leftClassName}>
      <div className={styles['indexlayout-left-logo']}>
        <Link to="/" className={styles['logo-url']}>
          {collapsed ? (
            <img alt="logo" src={logo} width="30" />
          ) : (
            <h3 className={styles['logo-title']}>
              {formatMessage({ id: 'app.global.siteName' })}
            </h3>
          )}
        </Link>
      </div>
      <div className={styles['indexlayout-left-menu']}>
        <SiderMenu
          collapsed={collapsed}
          topNavEnable={topNavEnable}
          belongTopMenu={belongTopMenu}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          menuData={menuData}
        />
      </div>
    </div>
  );
};

export default Left;
