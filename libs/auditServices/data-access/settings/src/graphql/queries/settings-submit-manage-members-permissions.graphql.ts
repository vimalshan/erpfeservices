import { gql } from 'apollo-angular';

export const MANAGE_MEMBER_PERMISSION_MUTATION = gql`
  mutation ManageMemberPermission(
    $manageMemberRequest: ManageMemberQueryInput!
  ) {
    managememberpermission(manageMemberRequest: $manageMemberRequest) {
      data
      isSuccess
      errorCode
      message
    }
  }
`;
