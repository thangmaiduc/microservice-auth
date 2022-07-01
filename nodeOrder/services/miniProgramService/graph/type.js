const gql = require("moleculer-apollo-server").moleculerGql;

module.exports = gql`
  type QueryOrder {
    getOrder(body: GetOrderInput!): GetOrderInfoResponse
    getOrders: ListOrderResponse
  }
  type MutationOrder {
    createOrder(input: OrderInput): CreateOrderInfoResponse
    notifyPayment(input: NotifyPaymentInput): NotifyPaymentResponse
    pay(input: payInput): PayResponse
  }

  type OrderInfo {
    partnerTransaction: String
    amount: Int
    ipnUrl: String
    description: String
    payMethod: PaymentMethodUITypeEnum
    state: OrderPaymentStateEnum
    orderId: Int
    user: UserInfo
  }

  type GetOrderInfoResponse {
    orderInfo: OrderInfo
  }
  type ListOrderResponse {
    orderInfo: [OrderInfo]
  }

  type CreateOrderInfoResponse {
    message: String
    successed: Boolean
    dataCreateOrderInfoResponse: DataCreateOrderInfoResponse
  }

  type DataCreateOrderInfoResponse {
    orderId: Int
    url: String
  }
  type NotifyPaymentResponse {
    message: String
    successed: Boolean
  }
  type PayResponse {
    message: String
    successed: Boolean
    data: DataPayResponse
  }
  type DataPayResponse {
    url: String
    transaction: Int
  }
`;
