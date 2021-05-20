export const VIP_STATUS = {
  0: '否',
  1: '是',
};

export const ISSUE_STATUS = {
  0: '待领取',
  1: '已领取',
  2: '处理中',
  3: '人工完结',
  4: '自动化完结',
  5: '自动化处理中',
};

export const MESSAGE_STATUS = {
  0: '运营有新消息未读',
  1: '用户有新消息未读',
  2: '双方都已读',
};

export const ISSUE_CLOSE_REASON = {
  0: '未完结',
  1: '用户操作',
  2: '客服操作',
  3: '超时',
};

export const ISSUE_SORT_ORDER_TYPE = {
  serviceCreateTime: 1,
  serviceModifyTime: 2,
  gmtCreate: 3,
  /**
   * 按照消息回复时间排序
   */
  replyTime: 4,
};

export const ISSUE_STATUS_CODE = {
  /**
   * 待领取
   */
  PENDING_ASSIGN: 0,
  /**
   * 已领取
   */
  ASSIGNED: 1,
  /**
   * 处理中
   */
  PROCESSING: 2,
  /**
   * 人工完结
   */
  MANUAL_CLOSED: 3,
  /**
   * 自动化完结
   */
  AUTOMATIC_CLOSED: 4,
  /**
   * 自动化处理中
   */
  AUTOMATIC_PROCESSING: 5,
};

export const ISSUE_CLOSE_REASON_CODE = {
  /**
   * 未完结
   */
  UNCLOSED: 0,
  /**
   * 用户操作
   */
  USER: 1,
  /**
   * 客服操作
   */
  SERVICE: 2,
  /**
   * 超时
   */
  TIME_OUT: 3,
};

/**
 * 目前工单系统支持的产品
 */
export const ISSUE_SUPPORT_PRODUCT = {
  2: 'VivaVideo',
  3: 'slideplus',
  10: 'tempo',
  16: '甜影',
  28: 'Vcam',
  33: 'PICCLUB',
  15: 'VivaCut',
  18: 'VMix',
  35: 'Facee',
};

export const ISSUE_TAG_CHANNEL = {
  0: '工单',
  1: 'Google Play',
  2: 'App Store',
  3: '邮件',
};

export const IssueTagReportSourceTypeMap = {
  ISSUE: 0,
  GP: 1,
  APPSTORE: 2,
  EMAIL: 3,
};

export const chatLogTypeDict = {
  image: 1,
  video: 2,
};

// 知识库标签产品对应关系
export const knowledgeProductDict = {
  2: '小影',
  3: '简拍',
  10: 'tempo',
  16: '甜影',
  28: 'Vcam',
  33: 'PICCLUB',
};


/**
 * 发票相关
 * 会员项，根据后端返回值
 * XXX VIP会员名显示 如果后续有添加，需要手动更新
 * NOTE 在开发票H5中的订单列表中也有用到
 */
export const PAY_COMMODITY = {
  'vip_normal#365': 'VIP年会员',
  'vip_normal#30': 'VIP月会员',
  'vip_normal#90': 'VIP季会员',
  'vip_normal#1': 'VIP日会员',
  'vip_normal#455': '15个月会员',
  'vip_normal#910': '30个月会员',
  'vip_normal#730': '2年会员',
  'vip_normal#183': '半年会员',
  'vip_normal#0': '当日会员',
  'vip_normal#3': '3日会员',
  'vip_normal#62': '双月会员',
  'vip_normal#7': 'VIP周会员',
  'vip_normal#92': 'VIP季会员',
  'vip_subscription#92': 'VIP季会员',
  'iap.liveshow.charge_***': '小影币',
};

/**
 * 发票状态
 */
export const statusDict = {
  1: '未处理',
  2: '已核对',
  3: '已处理',
};

/**
 * 发票状态标签颜色
 */
export const tagColorDict = {
  1: 'red',
  2: 'blue',
  3: 'green',
};

// 发票抬头类型
export const typeDict = {
  1: '企业',
  2: '个人',
};

/**
 * 平台
 */
export const platformDict = {
  1: 'Android',
  2: 'iOS',
};

/**
 * 支付渠道，根据后端返回值
 */
export const PAY_CHANNEL = {
  wx: '微信支付',
  wx_subscribe: '微信代扣',
  wx_pub: '微信公众号',
  alipay: '支付宝支付',
  alipay_subscribe: '支付宝代扣',
  huawei_iap: '华为支付',
  googleplay: 'GooglePlay',
  admin: '系统支付',
  qpay: 'QQ支付',
};
