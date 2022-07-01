const gql = require("moleculer-apollo-server").moleculerGql;

module.exports = gql`
  type MutationAuth {
    login(body: LoginInput!): LoginResponse
    updateUser(body: UpdateUserInput!): UpdateUserResponse
    register(body: RegisterInput): RegisterResponse
    forgotPassword(body: ForgotPasswordInput!): ForgotPasswordResponse
  }
  type QueryAuth {
    userInfo: UserInfoResponse
  }
  type LoginResponse {
    message: String
    successed: Boolean
    user: UserInfo
    token: String
  }
  type RegisterResponse {
    message: String
    successed: Boolean
    user: UserInfo
  }
  type UserInfoResponse {
    user: UserInfo
  }
  type ForgotPasswordResponse {
    message: String
    successed: Boolean
  }

  type UserInfo {
    id: Int
    fullName: String
    phone: String
    email: String
    gender: String
    avatar: String
  }

  type UpdateUserResponse {
    message: String
    successed: Boolean
  }
`;
