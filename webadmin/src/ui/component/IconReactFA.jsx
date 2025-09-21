import React from 'react';
import * as icons from 'react-icons/fa';

//Reference https://react-icons.github.io/react-icons/icons/fa/

export const IconReactFA = (props) => {
  const { iconName, className = 'anticon', ...attr } = props;
  const iconComponent =
    iconName && icons[iconName]
      ? React.createElement(icons[iconName], { className, ...attr })
      : null;
  return iconComponent; // or style it, etc
};
