/**
 * 订单规则工具函数
 * 包含：下单时间限制、库存校验等
 */

// ============ 下单时间配置 ============
const ORDER_TIME_CONFIG = {
  // 工作日配置（周一至周五）
  workday: {
    // 早餐下单时间：前一天17:00前
    breakfast: {
      orderDeadline: { hour: 17, minute: 0 },
      orderDayOffset: -1  // 提前1天
    },
    // 午餐下单时间：当天9:00前
    lunch: {
      orderDeadline: { hour: 9, minute: 0 },
      orderDayOffset: 0  // 当天
    },
    // 晚餐下单时间：当天14:00前
    dinner: {
      orderDeadline: { hour: 14, minute: 0 },
      orderDayOffset: 0  // 当天
    },
    // 下午茶下单时间：当天11:00前
    afternoon: {
      orderDeadline: { hour: 11, minute: 0 },
      orderDayOffset: 0  // 当天
    }
  },
  // 周末配置（周六、周日）
  weekend: {
    // 周末所有餐次需要提前1天下单，截止时间为前一天17:00
    breakfast: {
      orderDeadline: { hour: 17, minute: 0 },
      orderDayOffset: -1
    },
    lunch: {
      orderDeadline: { hour: 17, minute: 0 },
      orderDayOffset: -1
    },
    dinner: {
      orderDeadline: { hour: 17, minute: 0 },
      orderDayOffset: -1
    },
    afternoon: {
      orderDeadline: { hour: 17, minute: 0 },
      orderDayOffset: -1
    }
  }
}

// 取消订单时间配置
const CANCEL_TIME_CONFIG = {
  // 取消截止时间：配送日期前一天的17:00
  deadline: { hour: 17, minute: 0 },
  dayOffset: -1  // 提前1天
}

/**
 * 判断指定日期是否为周末
 * @param {Date} date 日期
 * @returns {boolean}
 */
function isWeekend(date) {
  const day = date.getDay()
  return day === 0 || day === 6  // 0=周日, 6=周六
}

/**
 * 判断指定日期是否为工作日
 * @param {Date} date 日期
 * @returns {boolean}
 */
function isWorkday(date) {
  return !isWeekend(date)
}

/**
 * 检查是否可以下单指定餐次
 * @param {Date} deliveryDate 配送日期
 * @param {string} mealTime 餐次类型: breakfast|lunch|dinner|afternoon
 * @param {Date} currentTime 当前时间（可选，默认为当前时间）
 * @returns {Object} { canOrder: boolean, reason: string, deadline: Date }
 */
function checkOrderTime(deliveryDate, mealTime, currentTime = new Date()) {
  const isWeekendDay = isWeekend(deliveryDate)
  const config = isWeekendDay ? ORDER_TIME_CONFIG.weekend : ORDER_TIME_CONFIG.workday
  const mealConfig = config[mealTime]
  
  if (!mealConfig) {
    return { canOrder: false, reason: '无效的餐次类型', deadline: null }
  }
  
  // 计算下单截止时间
  const deadline = new Date(deliveryDate)
  deadline.setDate(deadline.getDate() + mealConfig.orderDayOffset)
  deadline.setHours(mealConfig.orderDeadline.hour, mealConfig.orderDeadline.minute, 0, 0)
  
  // 检查当前时间是否在截止时间之前
  const canOrder = currentTime < deadline
  
  const mealNames = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', afternoon: '下午茶' }
  const dayType = isWeekendDay ? '周末' : '工作日'
  
  let reason = ''
  if (!canOrder) {
    const deadlineStr = `${deadline.getMonth() + 1}月${deadline.getDate()}日 ${deadline.getHours()}:${String(deadline.getMinutes()).padStart(2, '0')}`
    reason = `${dayType}${mealNames[mealTime]}下单已截止（截止时间：${deadlineStr}）`
  }
  
  return { canOrder, reason, deadline }
}

/**
 * 批量检查多个餐次的下单时间
 * @param {Array} items 订单项数组，每项包含 { deliveryDate, mealTime }
 * @param {Date} currentTime 当前时间
 * @returns {Object} { canOrder: boolean, invalidItems: Array }
 */
function checkOrderTimeMultiple(items, currentTime = new Date()) {
  const invalidItems = []
  
  for (const item of items) {
    const result = checkOrderTime(item.deliveryDate, item.mealTime, currentTime)
    if (!result.canOrder) {
      invalidItems.push({
        ...item,
        reason: result.reason,
        deadline: result.deadline
      })
    }
  }
  
  return {
    canOrder: invalidItems.length === 0,
    invalidItems
  }
}

/**
 * 检查订单是否可以取消
 * @param {Date} deliveryDate 配送日期
 * @param {Date} currentTime 当前时间
 * @returns {Object} { canCancel: boolean, reason: string }
 */
function checkCancelTime(deliveryDate, currentTime = new Date()) {
  // 计算取消截止时间
  const deadline = new Date(deliveryDate)
  deadline.setDate(deadline.getDate() + CANCEL_TIME_CONFIG.dayOffset)
  deadline.setHours(CANCEL_TIME_CONFIG.deadline.hour, CANCEL_TIME_CONFIG.deadline.minute, 0, 0)
  
  const canCancel = currentTime < deadline
  
  let reason = ''
  if (!canCancel) {
    const deadlineStr = `${deadline.getMonth() + 1}月${deadline.getDate()}日 ${deadline.getHours()}:${String(deadline.getMinutes()).padStart(2, '0')}`
    reason = `订单取消已截止（截止时间：${deadlineStr}），如需取消请联系客服`
  }
  
  return { canCancel, reason, deadline }
}

/**
 * 获取指定日期可下单的餐次列表
 * @param {Date} deliveryDate 配送日期
 * @param {Date} currentTime 当前时间
 * @returns {Object} 各餐次的可下单状态
 */
function getAvailableMeals(deliveryDate, currentTime = new Date()) {
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'afternoon']
  const result = {}
  
  for (const mealType of mealTypes) {
    const check = checkOrderTime(deliveryDate, mealType, currentTime)
    result[mealType] = {
      available: check.canOrder,
      deadline: check.deadline,
      reason: check.reason
    }
  }
  
  return result
}

/**
 * 格式化下单时间规则说明
 * @param {Date} deliveryDate 配送日期
 * @returns {string} 规则说明文本
 */
function getOrderTimeRuleText(deliveryDate) {
  const isWeekendDay = isWeekend(deliveryDate)
  const dayType = isWeekendDay ? '周末' : '工作日'
  
  if (isWeekendDay) {
    return `${dayType}订餐规则：所有餐次需提前一天17:00前下单`
  } else {
    return `${dayType}订餐规则：早餐需提前一天17:00前下单；午餐当天9:00前；晚餐当天14:00前；下午茶当天11:00前`
  }
}

module.exports = {
  ORDER_TIME_CONFIG,
  CANCEL_TIME_CONFIG,
  isWeekend,
  isWorkday,
  checkOrderTime,
  checkOrderTimeMultiple,
  checkCancelTime,
  getAvailableMeals,
  getOrderTimeRuleText
}
