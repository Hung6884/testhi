import { Breadcrumb } from 'antd';

import { ALink } from './ALink';
import useIntl from '../hook/useIntl';

export const BreadCrumbs = (props) => {
  const { list = [], ...attr } = props;
  const { formatMessage } = useIntl();

  return (
    <Breadcrumb {...attr}>
      {list.map((item) => {
        return (
          <Breadcrumb.Item key={item.path}>
            <ALink to={item.hasParams ? '#' : item.path}>
              {formatMessage({ id: item.title })}
            </ALink>
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};
