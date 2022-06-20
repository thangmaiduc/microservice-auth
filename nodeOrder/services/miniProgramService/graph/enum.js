const gql = require("moleculer-apollo-server").moleculerGql;

module.exports = gql`
enum PaymentMethodUITypeEnum {
  PAYME
  ATMCARD
  BANK_ACCOUNT
  VNPAY
}
enum NotifyPaymentStateEnum {
  "đã thanh toán"
  SUCCEEDED
  "thanh toán thất bại"
  FAILED
  "thanh toán bị từ chối"
  REJECTED
  EXPIRED
  CANCELED
}
enum OrderPaymentStateEnum {
  "đang chờ thanh toán"
  PENDING
  "đã thanh toán"
  SUCCEEDED
  "thanh toán thất bại"
  FAILED
  "thanh toán bị từ chối"
  REJECTED
  EXPIRED
  CANCELED
}

`;
