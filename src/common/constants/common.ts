export enum RabbitMqExchangesEnum {
  ORDERS = 'orders',
}

export enum RabbitMqRoutingKeysEnum {
  ORDERS_HANDLE_NEW = 'orders.handle.new',
  ORDERS_HANDLE_NEW_FAIL = 'orders-fail.handle.new',
  ORDERS_HANDLE_CANCEL = 'orders.handle.cancel',
  ORDERS_COMPLETE = 'orders.complete',
  ORDERS_COMPLETE_FAIL = 'orders-fail.complete',
  ORDERS_ENGINE_NEW = 'orders.engine.new',
  ORDERS_ENGINE_NEW_FAIL = 'orders-fail.engine.new',
  ORDERS_ENGINE_CANCEL = 'orders.engine.cancel',
  ORDERS_ENGINE_CANCEL_FAIL = 'orders-fail.engine.cancel',
  ORDERS_COMPLETE_CANCEL = 'orders.complete.cancel',
  ORDERS_COMPLETE_CANCEL_FAIL = 'orders-fail.complete.cancel',
}

export enum RabbitMqQueueEnum {
  ENGINE_ORDERS_NEW = 'engine.orders.new',
  ENGINE_ORDERS_NEW_FAIL = 'engine.orders.new.fail',
  ENGINE_ORDERS_CANCEL = 'engine.orders.cancel',
  ENGINE_ORDERS_COMPLETE = 'engine.orders.complete',
  ENGINE_ORDERS_COMPLETE_CANCEL = 'engine.orders.cancel.complete',
}
