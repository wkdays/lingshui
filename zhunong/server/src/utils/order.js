export const ORDER_STATUS = {
  1: '待支付',
  2: '待发货',
  3: '待收货',
  4: '配送中',
  5: '已完成',
  6: '已取消'
}

export const generateOrderNo = () =>
  'TG' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase()

