import { gql } from 'apollo-angular';

export const REMOVE_MEMBER_MUTATION = gql`
  mutation RemoveContactDetails(
    $removeContactRequest: RemoveContactQueryInput!
  ) {
    removeContact(removeContactRequest: $removeContactRequest) {
      data
      isSuccess
      message
      errorCode
    }
  }
`;
