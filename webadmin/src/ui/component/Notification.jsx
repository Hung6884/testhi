import { notification } from 'antd';
import isFunction from 'lodash/isFunction';
import last from 'lodash/last';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'umi';

export function Notification() {
  const dispatch = useDispatch();
  const { alerts } = useSelector(({ notification }) => notification);

  notification.config({
    maxCount: 3,
    placement: 'topRight',
  });
  const [notifier, notificationContextHolder] = notification.useNotification();

  useEffect(() => {
    if (alerts.length > 0) {
      const { type, message, description, onClose } = { ...last(alerts) };
      if (type && message) {
        dispatch({
          type: 'notification/removeNotification',
        });
        isFunction(onClose) && onClose();

        isFunction(
          notifier[type] &&
            notifier[type]({
              message,
              description,
            }),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts]);

  return <>{notificationContextHolder}</>;
}
