import { gql } from 'apollo-angular';

export const SETTINGS_MEMBERS_ROLES_QUERY = gql`
  query GetSettingsMembersRoles {
    functionalRoleList {
      data
      errorCode
      isSuccess
      message
    }
  }
`;
