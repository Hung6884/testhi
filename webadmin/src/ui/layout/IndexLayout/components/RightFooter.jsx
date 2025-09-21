import { connect } from 'umi';
import styles from '../style.less';

const RightFooter = ({ collapsed }) => {
  // Add collapsed class if sidebar is collapsed
  const footerClass = collapsed
    ? `${styles['indexlayout-right-footer']} ${styles['collapsed']}`
    : styles['indexlayout-right-footer'];

  return (
    <div className={footerClass}>
      <div>Copyright © 2025 Metatek. Powered by Metatek.</div>
    </div>
  );
};

export default connect(({ global }) => ({
  collapsed: global.collapsed,
}))(RightFooter);
