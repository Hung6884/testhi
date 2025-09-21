import { Badge } from 'antd';
import { useEffect } from 'react';
import { connect } from 'umi';

import { BellOutlined } from '@ant-design/icons';

import styles from '../style.less';
import { ALink } from '../../../component/ALink';

const RightTopMessage = (props) => {
  const { message, dispatch } = props;

  const getMessage = () => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchMessage',
      });
    }
  };

  useEffect(() => {
    getMessage();
  }, []);

  return (
    <ALink to="/" className={styles['indexlayout-top-message']}>
      <BellOutlined style={{ fontSize: '16px' }} />
      <Badge
        className={styles['indexlayout-top-message-badge']}
        size="small"
        count={message}
        style={{ boxShadow: 'none' }}
      />
    </ALink>
  );
};

export default connect(({ User }) => ({
  message: User.message,
}))(RightTopMessage);
