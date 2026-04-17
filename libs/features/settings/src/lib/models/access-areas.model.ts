export interface AccessAreasPermission {
  isChecked: boolean;
  roleId: number;
  roleName: string;
}

export interface AccessAreas {
  name: string;
  area: string;
  permission: {
    view?: AccessAreasPermission;
    edit?: AccessAreasPermission;
    submit?: AccessAreasPermission;
  };
}
