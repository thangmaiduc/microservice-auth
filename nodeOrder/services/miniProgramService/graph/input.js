const gql = require("moleculer-apollo-server").moleculerGql;

module.exports = gql`
input OrderInput{
    partnerTransaction: String!
    amount: Int!
    ipnUrl: String
    description: String!
    payMethod: PaymentMethodUITypeEnum
}
input NotifyPaymentInput{
    transaction: Int!
    amount: Int!
    description: String!
    state: NotifyPaymentStateEnum!
}
input GetOrderInput{
    orderId: Int!
}
input payInput{
    orderId: Int!
}
`;
