import { gql } from 'apollo-angular';

export const ALL_CERTIFICATION_MARKS_QUERY = gql`
  query GetAllCertMarks($serviceName: String!, $language: String!) {
    getAllCertMarks(serviceName: $serviceName, language: $language) {
      data {
        description
        link
      }
      isSuccess
      message
      errorCode
    }
  }
`;
