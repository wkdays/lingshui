/**
 * 飞鹅云打印机对接模块
 * API文档：http://www.feieyun.com/open/apidoc-cn.html
 */

const crypto = require('crypto')
const https = require('https')
const http = require('http')

// ============ 飞鹅云配置 ============
// 请在此处配置您的飞鹅云账号信息
const FEIE_CONFIG = {
  // 飞鹅云后台注册账号
  USER: process.env.FEIE_USER || '',
  // 飞鹅云注册账号后生成的UKEY  
  UKEY: process.env.FEIE_UKEY || '',
  // 打印机编号SN（可配置多台）
  PRINTER_SN: process.env.FEIE_PRINTER_SN || '',
  // API地址
  API_URL: 'api.feieyun.cn',
  API_PORT: 80,
  API_PATH: '/Api/Open/'
}

/**
 * 生成签名
 * 签名规则：SHA1(USER + UKEY + STIME)
 * @param {string} stime 时间戳
 * @returns {string} 签名
 */
function generateSignature(stime) {
  const signStr = FEIE_CONFIG.USER + FEIE_CONFIG.UKEY + stime
  return crypto.createHash('sha1').update(signStr).digest('hex')
}

/**
 * 发送HTTP请求到飞鹅云API
 * @param {Object} params 请求参数
 * @returns {Promise<Object>} API响应
 */
function sendRequest(params) {
  return new Promise((resolve, reject) => {
    // 构建请求体
    const postData = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')

    const options = {
      hostname: FEIE_CONFIG.API_URL,
      port: FEIE_CONFIG.API_PORT,
      path: FEIE_CONFIG.API_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          resolve(result)
        } catch (e) {
          reject(new Error('解析响应失败: ' + data))
        }
      })
    })

    req.on('error', (e) => {
      reject(new Error('请求失败: ' + e.message))
    })

    req.write(postData)
    req.end()
  })
}

/**
 * 构建公共请求参数
 * @param {string} apiname API接口名称
 * @returns {Object} 公共参数
 */
function buildCommonParams(apiname) {
  const stime = Math.floor(Date.now() / 1000).toString()
  return {
    user: FEIE_CONFIG.USER,
    stime: stime,
    sig: generateSignature(stime),
    apiname: apiname
  }
}

/**
 * 添加打印机到账号
 * @param {string} sn 打印机编号
 * @param {string} key 打印机识别码
 * @param {string} name 打印机备注名称
 * @param {string} phone 流量卡号码（可选）
 * @returns {Promise<Object>}
 */
async function addPrinter(sn, key, name = '', phone = '') {
  const printerContent = `${sn}#${key}#${name}#${phone}`
  const params = {
    ...buildCommonParams('Open_printerAddlist'),
    printerContent: printerContent
  }
  return await sendRequest(params)
}

/**
 * 删除打印机
 * @param {string} snList 打印机编号，多台以逗号分隔
 * @returns {Promise<Object>}
 */
async function deletePrinter(snList) {
  const params = {
    ...buildCommonParams('Open_printerDelList'),
    snlist: snList
  }
  return await sendRequest(params)
}

/**
 * 修改打印机信息
 * @param {string} sn 打印机编号
 * @param {string} name 新的备注名称
 * @param {string} phone 新的流量卡号码
 * @returns {Promise<Object>}
 */
async function editPrinter(sn, name, phone = '') {
  const params = {
    ...buildCommonParams('Open_printerEdit'),
    sn: sn,
    name: name,
    phonenum: phone
  }
  return await sendRequest(params)
}

/**
 * 查询打印机状态
 * @param {string} sn 打印机编号
 * @returns {Promise<Object>}
 */
async function queryPrinterStatus(sn) {
  const params = {
    ...buildCommonParams('Open_queryPrinterStatus'),
    sn: sn
  }
  return await sendRequest(params)
}

/**
 * 查询订单是否打印成功
 * @param {string} orderId 订单ID（飞鹅返回的）
 * @returns {Promise<Object>}
 */
async function queryOrderState(orderId) {
  const params = {
    ...buildCommonParams('Open_queryOrderState'),
    orderid: orderId
  }
  return await sendRequest(params)
}

/**
 * 查询打印机某日订单统计数
 * @param {string} sn 打印机编号
 * @param {string} date 日期，格式：yyyy-MM-dd
 * @returns {Promise<Object>}
 */
async function queryOrderInfoByDate(sn, date) {
  const params = {
    ...buildCommonParams('Open_queryOrderInfoByDate'),
    sn: sn,
    date: date
  }
  return await sendRequest(params)
}

/**
 * 清空待打印队列
 * @param {string} sn 打印机编号
 * @returns {Promise<Object>}
 */
async function clearPrintQueue(sn) {
  const params = {
    ...buildCommonParams('Open_delPrinterSqs'),
    sn: sn
  }
  return await sendRequest(params)
}

/**
 * 生成团餐订单打印内容
 * @param {Object} order 订单信息
 * @returns {string} 打印内容（带飞鹅排版标签）
 */
function generateOrderContent(order) {
  let content = ''
  
  // 标题
  content += '<CB>陵水团餐供应链</CB><BR>'
  content += '<C>================</C><BR>'
  
  // 订单信息
  content += `<B>订单号：${order.orderNo || order.id}</B><BR>`
  content += `下单时间：${order.createTime}<BR>`
  if (order.payTime) {
    content += `支付时间：${order.payTime}<BR>`
  }
  content += '<BR>'
  
  // 配送信息
  content += '<BOLD>【配送信息】</BOLD><BR>'
  const deliveryTypes = ['到店取货', '送到驿站', '送货上门']
  content += `配送方式：${deliveryTypes[order.deliveryType] || '未知'}<BR>`
  content += `配送地址：${order.deliveryAddress}<BR>`
  if (order.deliveryDate) {
    content += `配送日期：${order.deliveryDate}<BR>`
  }
  if (order.contactName) {
    content += `联系人：${order.contactName}<BR>`
  }
  if (order.contactPhone) {
    content += `联系电话：${order.contactPhone}<BR>`
  }
  content += '<BR>'
  
  // 商品明细
  content += '<BOLD>【商品明细】</BOLD><BR>'
  content += '--------------------------------<BR>'
  
  if (order.products && order.products.length > 0) {
    for (const item of order.products) {
      const name = item.name || item.dish_name
      const qty = item.quantity || 1
      const price = item.price
      const spec = item.spec ? `(${item.spec})` : ''
      
      // 商品名称
      content += `${name}${spec}<BR>`
      // 数量和金额右对齐
      content += `<RIGHT>x${qty}  ￥${(price * qty).toFixed(2)}</RIGHT><BR>`
    }
  }
  
  content += '--------------------------------<BR>'
  
  // 金额信息
  content += `<RIGHT>商品金额：￥${order.totalAmount.toFixed(2)}</RIGHT><BR>`
  if (order.deliveryFee && order.deliveryFee > 0) {
    content += `<RIGHT>配送费：￥${order.deliveryFee.toFixed(2)}</RIGHT><BR>`
  }
  content += `<B><RIGHT>实付金额：￥${order.payAmount.toFixed(2)}</RIGHT></B><BR>`
  content += '<BR>'
  
  // 备注
  if (order.remark) {
    content += '<BOLD>【备注】</BOLD><BR>'
    content += `${order.remark}<BR>`
    content += '<BR>'
  }
  
  // 底部信息
  content += '<C>================</C><BR>'
  content += `<C>打印时间：${new Date().toLocaleString('zh-CN')}</C><BR>`
  content += '<C>感谢您的订购！</C><BR>'
  
  // 切纸指令
  content += '<CUT>'
  
  return content
}

/**
 * 打印团餐订单（小票机）
 * @param {Object} order 订单信息
 * @param {number} times 打印份数，默认1份
 * @param {string} sn 打印机编号，默认使用配置的打印机
 * @returns {Promise<Object>}
 */
async function printOrder(order, times = 1, sn = null) {
  // 检查配置
  if (!FEIE_CONFIG.USER || !FEIE_CONFIG.UKEY) {
    console.log('[飞鹅打印] 未配置飞鹅云账号信息，使用模拟打印')
    return mockPrint(order)
  }
  
  const printerSn = sn || FEIE_CONFIG.PRINTER_SN
  if (!printerSn) {
    console.log('[飞鹅打印] 未配置打印机SN，使用模拟打印')
    return mockPrint(order)
  }
  
  // 生成打印内容
  const content = generateOrderContent(order)
  
  // 构建请求参数
  const params = {
    ...buildCommonParams('Open_printMsg'),
    sn: printerSn,
    content: content,
    times: times.toString()
  }
  
  try {
    const result = await sendRequest(params)
    console.log('[飞鹅打印] 打印结果:', result)
    
    if (result.ret === 0) {
      return {
        success: true,
        printId: result.data,
        msg: '打印任务已提交'
      }
    } else {
      return {
        success: false,
        msg: result.msg || '打印失败',
        error: result
      }
    }
  } catch (error) {
    console.error('[飞鹅打印] 打印异常:', error)
    return {
      success: false,
      msg: error.message,
      error: error
    }
  }
}

/**
 * 模拟打印（未配置飞鹅云时使用）
 * @param {Object} order 订单信息
 * @returns {Object}
 */
function mockPrint(order) {
  const content = generateOrderContent(order)
  
  console.log('\n========== 模拟打印小票 ==========')
  // 移除飞鹅排版标签，显示纯文本
  const plainText = content
    .replace(/<BR>/g, '\n')
    .replace(/<CUT>/g, '')
    .replace(/<CB>|<\/CB>/g, '')
    .replace(/<B>|<\/B>/g, '')
    .replace(/<C>|<\/C>/g, '')
    .replace(/<L>|<\/L>/g, '')
    .replace(/<W>|<\/W>/g, '')
    .replace(/<RIGHT>|<\/RIGHT>/g, '')
    .replace(/<BOLD>|<\/BOLD>/g, '')
  console.log(plainText)
  console.log('==================================\n')
  
  return {
    success: true,
    printId: 'MOCK_' + Date.now(),
    msg: '模拟打印成功（未配置飞鹅云）',
    mock: true
  }
}

/**
 * 检查飞鹅云配置是否完整
 * @returns {Object} { configured: boolean, missing: string[] }
 */
function checkConfig() {
  const missing = []
  if (!FEIE_CONFIG.USER) missing.push('FEIE_USER')
  if (!FEIE_CONFIG.UKEY) missing.push('FEIE_UKEY')
  if (!FEIE_CONFIG.PRINTER_SN) missing.push('FEIE_PRINTER_SN')
  
  return {
    configured: missing.length === 0,
    missing,
    config: {
      user: FEIE_CONFIG.USER ? '已配置' : '未配置',
      ukey: FEIE_CONFIG.UKEY ? '已配置' : '未配置',
      printerSn: FEIE_CONFIG.PRINTER_SN || '未配置'
    }
  }
}

/**
 * 更新飞鹅云配置
 * @param {Object} config 新配置
 */
function updateConfig(config) {
  if (config.user) FEIE_CONFIG.USER = config.user
  if (config.ukey) FEIE_CONFIG.UKEY = config.ukey
  if (config.printerSn) FEIE_CONFIG.PRINTER_SN = config.printerSn
}

module.exports = {
  FEIE_CONFIG,
  addPrinter,
  deletePrinter,
  editPrinter,
  queryPrinterStatus,
  queryOrderState,
  queryOrderInfoByDate,
  clearPrintQueue,
  generateOrderContent,
  printOrder,
  mockPrint,
  checkConfig,
  updateConfig
}
