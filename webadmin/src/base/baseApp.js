import get from 'lodash/get';
import reduce from 'lodash/reduce';
import { createRequest } from '../utils/createRequest';
import { getTokenInfo } from '../utils/localToken';

export async function getBaseInitialState({ settings }) {
  const request = await createRequest({ settings, number: 2 });

  let permissionsResponse = {};
  try {
    permissionsResponse = await request('/user/permissions-by-email', {
      method: 'POST',
      data: { moduleName: settings.siteName },
    });
  } catch {}

  let user = null;
  try {
    user = await getTokenInfo(settings);
  } catch {}

  return {
    request,
    ...user?.body,
    permissions: get(settings, 'permissions', {}),
    userPermissions: reduce(
      get(permissionsResponse, 'permissions.data', []),
      (res, permission) => {
        res[permission.componentId || permission.permissionName] = permission;
        return res;
      },
      {},
    ),
  };
}
