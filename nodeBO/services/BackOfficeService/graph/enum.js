const gql = require("moleculer-apollo-server").moleculerGql;

module.exports = gql`
  enum PayMethodEnum{
    PAYME
    ATMCARD
    BANK_ACCOUNT
    VNPAY
  }
`;
