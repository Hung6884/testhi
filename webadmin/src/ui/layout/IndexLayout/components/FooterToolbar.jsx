import { connect } from 'umi';

import styles from '../style.less';

const FooterToolbar = (props) => {
  const { collapsed, className, children } = props;

  let classNames = `${className || ''} ${styles['indexlayout-footer-toolbar']}`;
  if (collapsed) {
    classNames = `${className || ''} ${styles['indexlayout-footer-toolbar']} ${
      styles['narrow']
    }`;
  }

  return <div className={classNames}>{children}</div>;
};

export default connect(({ global }) => ({
  collapsed: global.collapsed,
}))(FooterToolbar);
