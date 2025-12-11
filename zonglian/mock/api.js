import { realApi, SERVER_URL } from '../config/api'

const wait = (data, time = 260) =>
  new Promise((resolve) => setTimeout(() => resolve({ code: 0, data }), time));

const mockUser = {
  id: 'u_001',
  nickname: '朱墨染',
  avatar: '/static/avatar.png',
  role: '普通用户',
  phone: '138****8098',
  balance: 120.5,
  points: 2760,
  coupons: 3,
  level: '银卡会员',
  publishedCount: 6,
  receivedCount: 12,
  finishedCount: 30,
  ongoingCount: 2,
};

const mockBanners = [
  {
    id: 'b1',
    title: '多多进鱼',
    desc: '款分钟赚 APP联盟排行榜',
    imageUrl: '/static/banner-1.png',
    gradient: ['#3a7bff', '#3a9dff'],
    link: '',
  },
  {
    id: 'b2',
    title: '邀请好友每日领20元',
    desc: '好友下单立返奖励',
    imageUrl: '/static/banner-2.png',
    gradient: ['#ff7c3c', '#ff9f58'],
    link: '',
  },
];

const quickNav = [
  { id: 'nav1', label: '团购', color: '#3a7bff', target: 'mini-groupon' },
  { id: 'nav2', label: '旅游', color: '#4ad17a', target: 'mini-travel' },
  { id: 'nav3', label: '团餐', color: '#fa8c43', target: 'mini-catering' },
];

const simpleTaskCards = [
  {
    id: 'card1',
    title: '游戏试玩',
    count: '129/1057单',
    gradient: ['#4b89ff', '#5fb1ff'],
  },
  {
    id: 'card2',
    title: '高级任务',
    count: '体验高薪',
    gradient: ['#fb9f6c', '#fbb467'],
  },
];

const simpleTaskTypes = [
  { id: 'quick', label: '秒单/秒过', iconUrl: '/static/ic-flash.png', color: '#f2f5ff' },
  { id: 'follow', label: '简单关注', iconUrl: '/static/ic-visibility.png', color: '#f3fbf2' },
  { id: 'download', label: '注册下载', iconUrl: '/static/ic-download.png', color: '#f2f7ff' },
  { id: 'play', label: '游戏试玩', iconUrl: '/static/ic-game.png', color: '#fff6f2' },
  { id: 'bind', label: '认证绑卡', iconUrl: '/static/ic-verified.png', color: '#f2fbf7' },
];

const specialTaskTypes = [
  { id: 'human', label: '人工点赞', iconUrl: '/static/ic-visibility.png', color: '#e9f7ef' },
  { id: 'live', label: '按效果推广', iconUrl: '/static/ic-info.png', color: '#fdf2e6' },
  { id: 'other', label: '其他', iconUrl: '/static/ic-flash.png', color: '#e6f0ff' },
];

const tasks = [
  {
    id: 'task_mp_1',
    title: 'APP注册下载',
    desc: '简单注册下载即可完成，秒审核',
    price: 9,
    unit: '元/单',
    limit: '每日限10单',
    type: 'daily',
    location: '线上',
    tag: '热门',
    peopleNeeded: 100,
    publisher: '高薪速聘',
    status: '开放接单',
    date: '今日结算',
    period: '10分钟内完成',
  },
  {
    id: 'task_mr_1',
    title: '游戏试玩体验',
    desc: '下载游戏试玩5分钟，截图提交',
    price: 17,
    unit: '元/单',
    limit: '每人限3单',
    type: 'bounty',
    location: '线上',
    tag: '精选',
    peopleNeeded: 50,
    publisher: '赏金派单',
    status: '开放接单',
    date: '今日结算',
    period: '30分钟内完成',
  },
  {
    id: 'task_live_1',
    title: '直播点赞互动',
    desc: '直播间在线点赞互动，完成截图提交',
    price: 25,
    unit: '元/单',
    limit: '限额50单',
    type: 'bounty',
    location: '线上',
    tag: '直播',
    peopleNeeded: 50,
    publisher: '互动达人',
    status: '进行中',
    date: '截止今日23:59',
    period: '30分钟内完成',
  },
  {
    id: 'task_daily_2',
    title: '门店盘点录入',
    desc: '到店进行商品盘点、数据录入，需签到打卡',
    price: 80,
    unit: '元/天',
    limit: '2天周期',
    type: 'daily',
    location: '线下',
    tag: '日结',
    peopleNeeded: 3,
    publisher: '门店经理',
    status: '预约中',
    date: '2025-12-12',
    period: '09:00-18:00',
  },
  {
    id: 'task_daily_3',
    title: '地推扫码拉新',
    desc: '商场/超市门口推广扫码，引导用户注册',
    price: 5,
    unit: '元/人',
    limit: '上不封顶',
    type: 'daily',
    location: '线下',
    tag: '地推',
    peopleNeeded: 20,
    publisher: '推广团队',
    status: '开放接单',
    date: '今日结算',
    period: '09:00-21:00',
  },
  {
    id: 'task_bounty_2',
    title: '问卷调查填写',
    desc: '在线完成问卷调查，约10分钟',
    price: 8,
    unit: '元/份',
    limit: '每人限1份',
    type: 'bounty',
    location: '线上',
    tag: '简单',
    peopleNeeded: 200,
    publisher: '调研中心',
    status: '开放接单',
    date: '长期有效',
    period: '随时可做',
  },
  {
    id: 'task_daily_4',
    title: '活动现场协助',
    desc: '协助活动现场布置、签到引导、物料发放',
    price: 150,
    unit: '元/天',
    limit: '单次活动',
    type: 'daily',
    location: '线下',
    tag: '活动',
    peopleNeeded: 10,
    publisher: '活动策划',
    status: '预约中',
    date: '2025-12-15',
    period: '08:00-18:00',
  },
];

const mockAnnouncements = [
  { id: 'anno1', title: '系统维护通知', content: '12月12日01:00-03:00进行升级维护', time: '2025-12-10', status: 'published' },
  { id: 'anno2', title: '邀请好友奖励升级', content: '好友完成首单奖励20元', time: '2025-12-09', status: 'published' },
  { id: 'anno3', title: '总链平台上线公告', content: '欢迎使用总链任务平台，快来接单赚钱吧！', time: '2025-12-08', status: 'published' },
];

const messages = [
  { id: 'msg1', title: '任务状态更新', content: '“直播点赞互动”已审核通过，奖励发放中', time: '刚刚' },
  { id: 'msg2', title: '任务提醒', content: '“门店盘点录入”将于明日开始，请准时到岗', time: '1小时前' },
  { id: 'msg3', title: '充值成功', content: '余额充值50元成功，当前余额170.5元', time: '昨天' },
];

const publishedTasks = [
  { id: 'pub1', title: '地推扫码', status: '招募中', received: 12, total: 20, type: '日结单' },
  { id: 'pub2', title: '视频剪辑邀约', status: '进行中', received: 3, total: 5, type: '赏金单' },
];

const receivedTasks = [
  { id: 'rec1', title: '直播点赞互动', status: '进行中', deadline: '今日23:59' },
  { id: 'rec2', title: '门店盘点录入', status: '已接单', deadline: '明日09:00' },
];

export function login(payload) {
  return wait({ token: 'mock-token', user: mockUser });
}

export function register(payload) {
  return wait({ success: true, user: { ...mockUser, nickname: payload.nickname || '新用户' } });
}

export async function fetchHome() {
  let banners = mockBanners
  let announcements = mockAnnouncements
  let taskList = tasks
  
  // 尝试从后端获取轮播图（管理端配置的真实数据）
  try {
    const bannersRes = await realApi.getBanners()
    if (bannersRes && bannersRes.data && bannersRes.data.length > 0) {
      banners = bannersRes.data.map(b => ({
        ...b,
        imageUrl: b.imageUrl && b.imageUrl.startsWith('/') ? SERVER_URL + b.imageUrl : b.imageUrl
      }))
    }
  } catch (e) {
    console.log('使用mock轮播数据', e)
  }
  
  // 尝试从后端获取公告
  try {
    const annoRes = await realApi.getAnnouncements()
    if (annoRes && annoRes.data && annoRes.data.length > 0) {
      announcements = annoRes.data.filter(a => a.status === 'published')
    }
  } catch (e) {
    console.log('使用mock公告数据', e)
  }
  
  // 尝试从后端获取任务列表
  try {
    const tasksRes = await realApi.getTasks({ status: 'open' })
    if (tasksRes && tasksRes.data && tasksRes.data.length > 0) {
      taskList = tasksRes.data
    }
  } catch (e) {
    console.log('使用mock任务数据', e)
  }
  
  return wait({
    searchPlaceholder: '输入关键词',
    banners,
    quickNav,
    simpleTaskCards,
    simpleTaskTypes,
    specialTaskTypes,
    filters: ['热门精选', '简单关注', '任务刷量', '人员贡献', '筛选'],
    simpleTasks: taskList.filter((t) => t.type === 'daily'),
    bountyTasks: taskList.filter((t) => t.type !== 'daily'),
    tasks: taskList,
    announcements,
  });
}

export async function fetchTasks({ type } = {}) {
  // 尝试从后端获取任务列表
  try {
    const params = { status: 'open' }
    if (type) params.type = type
    const res = await realApi.getTasks(params)
    if (res && res.data && res.data.length > 0) {
      return wait({ list: res.data })
    }
  } catch (e) {
    console.log('使用mock任务数据', e)
  }
  const list = type ? tasks.filter((item) => item.type === type) : tasks;
  return wait({ list });
}

export async function fetchTaskDetail(id) {
  // 优先从后端获取任务详情
  try {
    const res = await realApi.getTaskDetail(id)
    if (res && res.code === 0 && res.data) {
      return wait(res.data)
    }
  } catch (e) {
    console.log('获取任务详情失败，使用mock', e)
  }
  // 后端获取失败时从本地mock数据查找
  const task = tasks.find((item) => item.id === id)
  if (task) {
    return wait(task)
  }
  return wait(null)
}

export function fetchUserProfile() {
  return wait(mockUser);
}

export function fetchMessages() {
  return wait(messages);
}

export async function fetchAnnouncements() {
  // 尝试从后端获取公告（管理端配置的真实数据）
  try {
    const res = await realApi.getAnnouncements()
    if (res && res.data && res.data.length > 0) {
      return wait(res.data.filter(a => a.status === 'published'))
    }
  } catch (e) {
    console.log('使用mock公告数据', e)
  }
  return wait(mockAnnouncements);
}

export function recharge(amount) {
  const num = Number(amount) || 0;
  mockUser.balance = Math.max(0, mockUser.balance + num);
  return wait({ balance: mockUser.balance });
}

export function createTask(payload) {
  const created = {
    id: `created_${Date.now()}`,
    ...payload,
    status: '待审核',
    createdAt: new Date().toISOString(),
  };
  publishedTasks.unshift({
    id: created.id,
    title: created.title || '新建任务',
    status: created.status,
    received: 0,
    total: Number(payload.peopleNeeded) || 0,
    type: payload.taskType === 'bounty' ? '赏金单' : '日结单',
  });
  return wait(created);
}

export function fetchMyPublished() {
  return wait(publishedTasks);
}

export async function fetchMyReceived() {
  // 优先从后端获取我的接单列表
  try {
    const res = await realApi.getMyOrders()
    if (res && res.code === 0 && res.data) {
      // 转换字段格式
      const list = res.data.map(item => ({
        id: item.taskId,
        orderId: item.id,
        title: item.taskTitle,
        status: item.status === 'pending' ? '进行中' : 
                item.status === 'submitted' ? '待审核' : 
                item.status === 'approved' ? '已通过' : 
                item.status === 'rejected' ? '已拒绝' : item.status,
        deadline: item.deadline,
        price: item.price,
        unit: item.unit
      }))
      return { code: 0, data: list }
    }
  } catch (e) {
    console.log('获取我的接单失败，使用mock', e)
  }
  return wait(receivedTasks);
}

export async function fetchHistory() {
  // 从后端获取我的接单记录作为历史
  try {
    const res = await realApi.getMyOrders()
    if (res && res.code === 0 && res.data) {
      const list = res.data.map(item => ({
        id: item.id,
        taskId: item.taskId,
        title: item.taskTitle,
        type: '记录',
        status: item.status === 'pending' ? '进行中' : 
                item.status === 'submitted' ? '待审核' : 
                item.status === 'approved' ? '已通过' : 
                item.status === 'rejected' ? '已拒绝' : item.status,
        deadline: item.deadline,
        price: item.price
      }))
      return { code: 0, data: list }
    }
  } catch (e) {
    console.log('获取历史记录失败，使用mock', e)
  }
  return wait([...publishedTasks, ...receivedTasks]);
}

// 管理端接口 - 轮播图管理
export async function adminGetBanners() {
  try {
    return await realApi.getBanners()
  } catch (e) {
    return wait(mockBanners)
  }
}

export async function adminCreateBanner(data) {
  try {
    return await realApi.createBanner(data)
  } catch (e) {
    const newBanner = { id: `b_${Date.now()}`, ...data }
    mockBanners.push(newBanner)
    return wait(newBanner)
  }
}

export async function adminUpdateBanner(id, data) {
  try {
    return await realApi.updateBanner(id, data)
  } catch (e) {
    const idx = mockBanners.findIndex(b => b.id === id)
    if (idx > -1) mockBanners[idx] = { ...mockBanners[idx], ...data }
    return wait(mockBanners[idx])
  }
}

export async function adminDeleteBanner(id) {
  try {
    return await realApi.deleteBanner(id)
  } catch (e) {
    const idx = mockBanners.findIndex(b => b.id === id)
    if (idx > -1) mockBanners.splice(idx, 1)
    return wait({ success: true })
  }
}

// 管理端接口 - 公告管理
export async function adminGetAnnouncements() {
  try {
    return await realApi.getAnnouncements()
  } catch (e) {
    return wait(mockAnnouncements)
  }
}

export async function adminCreateAnnouncement(data) {
  try {
    return await realApi.createAnnouncement(data)
  } catch (e) {
    const newAnno = { id: `anno_${Date.now()}`, ...data, time: new Date().toISOString().slice(0, 10), status: 'draft' }
    mockAnnouncements.unshift(newAnno)
    return wait(newAnno)
  }
}

export async function adminUpdateAnnouncement(id, data) {
  try {
    return await realApi.updateAnnouncement(id, data)
  } catch (e) {
    const idx = mockAnnouncements.findIndex(a => a.id === id)
    if (idx > -1) mockAnnouncements[idx] = { ...mockAnnouncements[idx], ...data }
    return wait(mockAnnouncements[idx])
  }
}

export async function adminDeleteAnnouncement(id) {
  try {
    return await realApi.deleteAnnouncement(id)
  } catch (e) {
    const idx = mockAnnouncements.findIndex(a => a.id === id)
    if (idx > -1) mockAnnouncements.splice(idx, 1)
    return wait({ success: true })
  }
}

export async function adminToggleAnnouncementStatus(id, status) {
  try {
    return await realApi.toggleAnnouncementStatus(id, status)
  } catch (e) {
    const idx = mockAnnouncements.findIndex(a => a.id === id)
    if (idx > -1) mockAnnouncements[idx].status = status
    return wait(mockAnnouncements[idx])
  }
}

// 接单操作
export async function acceptTask(taskId) {
  console.log('acceptTask 被调用, taskId:', taskId)
  try {
    const res = await realApi.acceptTask(taskId)
    console.log('realApi.acceptTask 返回:', res)
    if (res && res.code === 0) {
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        receivedTasks.unshift({
          id: taskId,
          title: task.title,
          status: '已接单',
          deadline: task.date || '待定',
        })
        mockUser.receivedCount++
      }
      return { code: 0, data: res.data, message: res.message || '接单成功' }
    }
    // 返回后端的错误信息
    return { code: res?.code || -1, message: res?.message || '接单失败' }
  } catch (e) {
    console.log('接单请求异常，使用mock模式', e)
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      receivedTasks.unshift({
        id: taskId,
        title: task.title,
        status: '已接单',
        deadline: task.date || '待定',
      })
      mockUser.receivedCount++
    }
    return { code: 0, success: true, message: '接单成功(mock)' }
  }
}

// 取消/结束任务
export function cancelTask(taskId) {
  const idx = publishedTasks.findIndex(t => t.id === taskId)
  if (idx > -1) {
    publishedTasks[idx].status = '已结束'
  }
  return wait({ success: true })
}
