import intl from 'react-intl-universal';
import { ReactIntlUniversalMap } from '../locales';
import { getLang } from './utils';

intl.init({
  currentLocale: getLang(),
  locales: ReactIntlUniversalMap,
});

const GenderMap = {
  0: intl.get('vivaplus.user.male').defaultMessage('男'),
  1: intl.get('vivaplus.user.female').defaultMessage('女'),
  2: intl.get('vivaplus.user.unknown').defaultMessage('保密'),
};

const UserInfoStateMap = {
  0: intl.get('vivaplus.user.state.not_enable').defaultMessage('未启用'),
  1: intl.get('vivaplus.user.state.normal').defaultMessage('正常'),
  2: intl.get('common.Freezing account and equipment').defaultMessage('冻结账号及设备'),
  3: intl.get('vivaplus.user.state.disabled').defaultMessage('禁用'),
  4: intl.get('vivaplus.user.state.delete').defaultMessage('删除'),
  5: intl.get('vivaplus.user.state.shield').defaultMessage('屏蔽'),
  9: intl.get('vivaplus.user.state.write_off').defaultMessage('注销'),
  99: intl.get('common.Only freezing account').defaultMessage('仅冻结账号'),
};

const SNSNAMEMAP = {
  '-2': '红人',
  '-1': '创作号',
  0: '通用',
  1: '新浪微博',
  10: 'QQ ',
  11: 'QQ',
  14: '腾讯微博',
  15: '人人网',
  6: '微信',
  2: '小影',
  3: '手机号码',
  4: '邮箱',
  7: '微信',
  12: '朋友网',
  13: '优酷',
  16: '百度',
  17: '百度贴吧',
  20: '豆瓣网',
  25: 'Google',
  26: 'YouTube',
  27: '美拍',
  28: 'Facebook',
  29: 'Twitter',
  30: '土豆',
  31: 'Instagram',
  32: 'whatsapp',
  33: 'facebook messager',
  34: 'google+',
  35: 'skype',
  36: 'linkedin',
  37: 'snapchat',
  38: 'Line',
  39: 'zalo',
  40: 'VK',
  41: 'odnoklassniki',
  42: 'kakaostory',
  43: 'kakaotalk',
  44: 'Vine',
  45: 'BBM',
  46: 'HuaWei',
  99: 'ROBOT',
  200: '活动爬虫账号',
  202: '马甲号',
  203: '热门爬虫账号',
};

const Officials = {
  1: { auiddigest: 'js2b', userName: '爱拍爱小影' },
  2: { auiddigest: 'o86eCUj', userName: 'vivavideo' },
  3: { auiddigest: 'zX6z0r1w', userName: 'Vivavideo' },
  4: { auiddigest: 'zX657hwj', userName: 'Vivavideo USA' },
  5: { auiddigest: 'Ia27s75', userName: 'vivaグルメ' },
  6: { auiddigest: 'zjqkvjo2', userName: 'VivaVideo' },
  7: { auiddigest: 'IakCzTs', userName: 'VivaVideo台灣' },
  8: { auiddigest: 'o86eCUj', userName: 'vivavideo' },
  9: { auiddigest: 'Ia267e5', userName: 'VivaVideo' },
};

// 本地化运营 语言
const LangArray = [
  { value: 'en', label: '英语-en' },
  { value: 'ar', label: '阿拉伯-ar' },
  { value: 'tr', label: '土耳其-tr' },
  { value: 'pt', label: '葡萄牙-pt' },
  { value: 'ru', label: '俄语-ru' },
  { value: 'ja', label: '日语-ja' },
  { value: 'ko', label: '韩语-ko' },
  { value: 'zh_CN', label: '简体中文-zh_CN' },
  { value: 'zh_TW', label: '繁体中文HK-zh_TW' },
  { value: 'zh_TW', label: '繁体中文TW-zh_TW' },
];

//  A/B test 相关
const DEFAULT_TAG_TYPE = 0; //  新增字段 tag_type,老的标签类型(工具，创作号等)一律用0

// 请求代理 path
const REQUEST_PATH = {
  TOOL_ISSUE: 'tool-issue',
  COMMON: 'common',
  TOOL_PYTHON: 'tool-python',
  VIVA_USER: 'viva-user',
  VIVA_VIDEO: 'viva-video',
  GETAWAY_PYTHON: 'gateway-python',
  VCM_GOOGLE: 'vcm-google',
};

export default {
  isMenuConst: false,
  Map: {
    GenderMap,
    UserInfoStateMap,
  },
  SNSNAMEMAP,
  Officials,
  LangArray,
};

export {
  SNSNAMEMAP, Officials, LangArray, DEFAULT_TAG_TYPE, REQUEST_PATH,
};
