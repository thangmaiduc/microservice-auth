const gql = require("moleculer-apollo-server").moleculerGql;

module.exports = gql`
  type Order {
    getOrder(input: GetOrderInput!): GetOrderInfoResponse
    getOrders: ListOrderResponse
    createOrder(input:OrderInput): CreateOrderInfoResponse
    notifyPayment(input: NotifyPaymentInput): NotifyPaymentResponse
  }
  
  type OrderInfo {
    partnerTransaction: String
    amount: Int
    ipnUrl: String
    description: String
    payMethod: PaymentMethodUITypeEnum
    state: OrderPaymentStateEnum
    transaction: Int
    orderId: Int
    userId: Int
  }
  type GetOrderInfoResponse {
    message: String
    successed: Boolean
    orderInfo: OrderInfo
  }
  type ListOrderResponse {
    message: String
    successed: Boolean
    orderInfo: [OrderInfo]
  }

  type CreateOrderInfoResponse {
    message: String
    successed: Boolean
    dataCreateOrderInfoResponse: DataCreateOrderInfoResponse
  }
  type DataCreateOrderInfoResponse {
    transaction: Int
    url: String
  }
  type NotifyPaymentResponse {
    message: String
    successed: Boolean
  }
`;
