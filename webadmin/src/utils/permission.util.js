export function checkDefinePermission(listPermissions = [], permission = {}) {
  if (!listPermissions.includes(permission)) {
    throw new Error('Permission is not define in permission config yet');
  }
}
