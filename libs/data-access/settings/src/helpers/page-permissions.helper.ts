import { UserPermissions } from '../models';

export const isValidKey = (
  inputKey: string,
  userPermissions: UserPermissions,
  returnType: boolean | null,
): boolean | null => {
  const permission = userPermissions[inputKey as keyof UserPermissions];

  return permission ? permission.view || permission.edit : returnType;
};
