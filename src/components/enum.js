import intl from 'react-intl-universal';

export const tagTypeOptions = [
  {
    value: '1',
    label: '注册用户',
  },
  {
    value: '2',
    label: '全部活跃用户',
  },
  {
    value: 'tool',
    label: '工具用户',
    children: [
      {
        value: 'tool1',
        label: '工具用户1天活跃',
      },
      {
        value: 'tool3',
        label: '工具用户3天活跃',
      },
      {
        value: 'tool7',
        label: '工具用户7天活跃',
      },
      {
        value: 'tool30',
        label: '工具用户30天活跃',
      },
    ],
  },
  {
    value: 'creator',
    label: '创作号',
    children: [
      {
        value: 'creator1',
        label: '创作用户1天活跃',
      },
      {
        value: 'creator3',
        label: '创作用户3天活跃',
      },
      {
        value: 'creator7',
        label: '创作用户7天活跃',
      },
      {
        value: 'creator30',
        label: '创作用户30天活跃',
      },
    ],
  },
  {
    value: 'community',
    label: '社区',
    children: [
      {
        value: 'community1',
        label: '社区用户1天活跃',
      },
      {
        value: 'community3',
        label: '社区用户3天活跃',
      },
      {
        value: 'community7',
        label: '社区用户7天活跃',
      },
      {
        value: 'community30',
        label: '社区用户30天活跃',
      },
    ],
  },
];

export const ABTESTREPORTSKEY = {
  active_duid_cnt: '活跃设备数',
  new_duid_cnt: '新增设备数',
  user_stay_cnt: '前一日新增设备次留数',
  duid_total: '触发事件设备数',
  total: '触发事件总次数',
  day: '日期',
};

export const CONMMONDATAKEY = [
  {
    value: 'active_duid_cnt',
    name: '活跃设备数',
  },
  {
    value: 'new_duid_cnt',
    name: '新增设备数',
  },
  {
    value: 'play_ratio',
    name: '播放率',
  },
  {
    value: 'sec_stay_ratio',
    name: '次留率',
  },
  {
    value: 'per_play',
    name: '人均播放数',
  },
  {
    value: 'per_use_period',
    name: '人均使用时长',
  },
];

export const CTRDATAMAP = ['play_ratio', 'sec_stay_ratio'];

export const ALLCOMMONDATAMAP = [
  'active_duid_cnt',
  'new_duid_cnt',
  'per_use_period',
  'per_play',
  'play_ratio',
  'sec_stay_ratio',
];
export const State = {
  0: intl.get('vivaplus.user.review.Unpublished').defaultMessage('未发布'),
  1: intl.get('vivaplus.user.review.publishing').defaultMessage('发布中'),
  2: intl.get('vivaplus.user.review.published').defaultMessage('发布完成'),
  3: intl.get('vivaplus.user.review.Publish failed').defaultMessage('发布失败'),
  4: intl.get('vivaplus.user.review.Cancel publish').defaultMessage('取消发布'),
  5: intl.get('vivaplus.user.review.Disabled').defaultMessage('禁用'),
  6: intl.get('vivaplus.user.review.delete').defaultMessage('删除'),
};
export const PermitType = {
  0: '默认公开放映',
  5: intl.get('vivaplus.user.review.public').defaultMessage('公开'),
  6: intl.get('vivaplus.user.review.Friends point of view').defaultMessage('好友点映'),
  7: intl.get('vivaplus.user.review.Group view').defaultMessage('群组点映'),
  9: intl.get('vivaplus.user.review.undisclosed').defaultMessage('未公开'),
  10: intl.get('vivaplus.user.review.Private').defaultMessage('私密'),
  16: '隐私用户视频',
};
export const ReviewFlag = {
  未审核: 0,
  人工审核通过: 1,
  人工审核未通过: 2,
  机器审核通过: 3,
  机器审核未通过: 4,
};

export const Color = {
  '#f50': 1,
  '#2db7f5': 2,
  '#87d068': 3,
};

export const Quality = {
  一般: 0,
  优质: 20,
  精品: 30,
};

export const UserGrade = {
  普通: 0,
  初级达人: 1,
  中级达人: 2,
  高级达人: 3,
};

export const GradeType = {
  日优: 1,
  日次: 2,
  小时优: 3,
  小时次优: 4,
};

export const GradeDataType = {
  曝光播放率: 1,
  播放互动率: 2,
  播放值: 3,
  互动值: 4,
  时间衰减: 5,
  在榜降权: 6,
};

export const ActivityVideoType = {
  用户直接参加活动: 0,
  编辑指定参加活动: 1,
  展示视频: 2,
};

export const platformType = {
  不限: 0,
  Android: 1,
  iOS: 2,
};

export const BadgeState = {
  '': 1,
  '(停用)': 2,
  '(删除)': 3,
};
