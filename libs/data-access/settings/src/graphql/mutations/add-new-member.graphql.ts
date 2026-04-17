import { gql } from 'apollo-angular';

export const ADD_NEW_MEMBER_MUTATION = gql`
  mutation CreateContactDetails(
    $createContactRequest: CreateContactQueryInput!
  ) {
    createContactDetails(createContactRequest: $createContactRequest) {
      data
      errorCode
      isSuccess
      message
    }
  }
`;
