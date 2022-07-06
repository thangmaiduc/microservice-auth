const gql = require("moleculer-apollo-server").moleculerGql;

module.exports = gql`
  
  type QueryBO {
    customerOrders(body: CustomerOrderInput!): CustomerOrderResponse
    exportCustomerOrders(body: CustomerOrderInput!): ExportResponse
    orderStatistics(body: OrderStatisticsInput!): OrderStatisticsResponse
    exportOrderStatistics(body: OrderStatisticsInput!): ExportResponse
  }

  type ExportResponse {
    data: String
  }
  type CustomerOrderResponse {
    numberTransactionPending: Int
    numberTransactionFailed: Int
    numberCustomer: Int
    data: [DataCustomerOrderResponse]
  }
  type DataCustomerOrderResponse {
    fullName: String
    email: String
    userId: Int
    date: String
    numberTransaction: Int
    numberTransactionSucceeded: Int
  }
  type OrderStatisticsResponse {
    numberTransactionPending: Int
    numberTransactionFailed: Int
    numberTransactionSucceeded: Int
    data: [DataOrderStatisticsResponse]
  }
  type DataOrderStatisticsResponse {
   
    date: String
    numberTransaction: Int
    numberTransactionSucceeded: Int
  }
`;
