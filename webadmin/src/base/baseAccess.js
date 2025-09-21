import reduce from 'lodash/reduce';

export function baseAccessFactory(initialState) {
  const { userPermissions } = initialState || {}; // the initialState is the returned value in step 2

  return reduce(
    userPermissions,
    (res, permission) => {
      res[permission.permissionName] = permission;
      return res;
    },
    {},
  );
}
