import { Language } from '@customer-portal/shared';

import { SIDEBAR_MENU_GROUP_LIST, UserRoles } from '../../constants';
import { ProfileDto } from '../../dtos';
import { isValidKey } from '../../helpers';
import {
  ProfileModel,
  ProfileSettingsLanguagesModel,
  SidebarGroup,
  UserPermissions,
} from '../../models';

export class ProfileMapperService {
  static mapToProfileItemModel(dto: ProfileDto): ProfileModel | null {
    if (!dto?.data) {
      return null;
    }

    const { data } = dto;
    const profile = data;

    const languagesList: ProfileSettingsLanguagesModel[] = Object.keys(
      Language,
    ).map((key) => ({
      languageName: key,
      isSelected: key === profile.communicationLanguage,
    }));

    const mapAccessRolesToPermissions: UserPermissions = Object.fromEntries(
      dto.data.accessLevel.map((role) => [
        role.roleName.trim().toLowerCase(),
        {
          noAccess: role.roleLevel.includes(UserRoles.NoAccess),
          view: role.roleLevel.includes(UserRoles.View),
          edit: role.roleLevel.includes(UserRoles.Edit),
          submit: role.roleLevel.includes(UserRoles.Submit),
        },
      ]),
    );

    const updatedSidebarMenu: SidebarGroup[] = SIDEBAR_MENU_GROUP_LIST.map(
      (group) => ({
        ...group,
        items: group.items.map((item) => ({
          ...item,
          isVisible:
            isValidKey(item.i18nKey, mapAccessRolesToPermissions, null) ?? true,
        })),
      }),
    );

    return {
      information: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        displayName: profile.displayName,
        country: profile.country,
        countryCode: profile.countryCode,
        region: profile.region,
        email: profile.email,
        phone: profile.phone,
        portalLanguage: profile.portalLanguage,
        veracityId: profile.veracityId,
        communicationLanguage: profile.communicationLanguage,
        jobTitle: profile.jobTitle,
        languages: languagesList,
        accessLevel: mapAccessRolesToPermissions,
        sidebarMenu: updatedSidebarMenu,
      },
    };
  }
}
