import { Avatar, Dropdown, Space, Typography } from 'antd';
import { last, split } from 'lodash';
import { useState } from 'react';
import { useDispatch } from 'umi';

import { stringToColour } from '../../../../utils/color';
import useIntl from '../../../hook/useIntl';
import ChangePasswordModal from './ChangePasswordModal';

function RightTopUser({ currentUser, className, settings }) {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  const showPasswordModal = () => {
    setIsPasswordModalVisible(true);
  };

  const hidePasswordModal = () => {
    setIsPasswordModalVisible(false);
  };

  const items = [
    {
      key: 'change-password',
      label: formatMessage({ id: 'user.button.changePassword' }),
      onClick: showPasswordModal,
    },
    {
      key: 'logout',
      label: formatMessage({ id: 'user.button.logout' }),
      onClick() {
        dispatch({ type: 'User/logout', payload: settings });
      },
    },
  ];

  return (
    <>
      <Space className={className}>
        <Avatar
          style={{
            backgroundColor: stringToColour(currentUser.name) + '11',
            color: stringToColour(currentUser.name) + 'ff',
          }}
        >
          {last(split(currentUser.name, /\s+/g))}
        </Avatar>
        <Dropdown menu={{ items }}>
          <Typography.Text>{currentUser.name}</Typography.Text>
        </Dropdown>
      </Space>

      <ChangePasswordModal
        visible={isPasswordModalVisible}
        onCancel={hidePasswordModal}
        settings={settings}
      />
    </>
  );
}

export default RightTopUser;
