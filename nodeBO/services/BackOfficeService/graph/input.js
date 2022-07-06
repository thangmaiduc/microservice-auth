const gql = require("moleculer-apollo-server").moleculerGql;

module.exports = gql`
  input CustomerOrderInput {
    toDate: String!
    fromDate: String!
    userId: Int
  }
  input OrderStatisticsInput {
    toDate: String!
    fromDate: String!
    method: PayMethodEnum
  }
`;
