import React from 'react';
import { useModel } from 'umi';

import get from 'lodash/get';
/**
 *
 * @param {Object} props React props
 * @param {String} props.accessible Name of component to validate permission
 * @param {import('react').ReactElement} props.fallback Return if component hasn't permission
 * @param {import('react').ReactElement} props.children Return if component has permission
 *
 */
export function Access({ accessible, fallback, children } = {}) {
  const globalState = useModel('@@initialState');

  // if (!get(globalState, ['initialState', 'permissions', accessible])) {
  //   throw new Error(
  //     `${accessible} - Component ID's permission is not define in permissions.js`,
  //   );
  // }

  if (
    process.env.NODE_ENV === 'development' &&
    typeof accessible === 'function'
  ) {
    console.warn(
      '[plugin-access]: provided "accessible" prop is a function named "' +
        accessible.name +
        '" instead of a boolean, maybe you need check it.',
    );
  }
  const hasPermission = get(globalState, [
    'initialState',
    'userPermissions',
    'Add Team Member',
  ]);
  return <>{hasPermission ? children : fallback}</>;
}
