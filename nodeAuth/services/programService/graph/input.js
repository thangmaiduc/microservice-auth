const gql = require("moleculer-apollo-server").moleculerGql;

module.exports = gql`
  input LoginInput {
    email: String!
    password: String!
  }
  input ForgotPasswordInput {
    email: String!
  }
  input RegisterInput {
    email: String!
    password: String!
    fullName: String!
    gender: GenderEnum!
    phone: String!
    avatar: String
  }
  input UpdateUserInput {
    fullName: String
    phone: String
    gender: GenderEnum
  }
`;
