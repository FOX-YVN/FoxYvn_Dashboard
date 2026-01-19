// Тип права доступа (module:action)
export type Permission = string;

// Проверка единичного права
export function hasPermission(userPermissions: Permission[], required: Permission): boolean {
  return userPermissions.includes(required);
}

// Проверка: есть ли хотя бы одно из прав
export function hasAnyPermission(
  userPermissions: Permission[],
  required: Permission[],
): boolean {
  return required.some((permission) => hasPermission(userPermissions, permission));
}

// Проверка: есть ли все права
export function hasAllPermissions(
  userPermissions: Permission[],
  required: Permission[],
): boolean {
  return required.every((permission) => hasPermission(userPermissions, permission));
}
