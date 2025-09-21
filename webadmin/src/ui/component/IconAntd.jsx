import * as Icons from '@ant-design/icons';
import React from 'react';

export const IconAntd = (props) => {
  const { type, ...attr } = props;

  return Icons[type] ? React.createElement(Icons[type], { ...attr }) : null;
};
