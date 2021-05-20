import intl from 'react-intl-universal';
import { ObjectMapToArray } from '../utils/utils';

export const ROOT_TAG_ID = 0; //  标签根节点
export const HOT_TAG_TYPE = 2; //  热门标签
export const COMMON_TAG_TYPE = 1; //  常用标签
export const REMAIN_TAG_TYPE = 0; //  不常用

export const State = {
  1: intl.get('vivaplus.video_hot_manage.activited').defaultMessage('启用'),
  2: intl.get('vivaplus.video_hot_manage.deletd').defaultMessage('禁用'),
  3: intl.get('vivaplus.video_hot_manage.unactivated').defaultMessage('待启用'),
  4: intl.get('vivaplus.video_hot_manage.deactivated').defaultMessage('停用'),
};
export const GradeType = {
  1: intl.get('vivaplus.video_hot_manage.daily_trending').defaultMessage('日优'),
  2: intl.get('vivaplus.video_hot_manage.daily_well').defaultMessage('日次'),
  3: intl.get('vivaplus.video_hot_manage.hourly_trending').defaultMessage('小时优'),
  4: intl.get('vivaplus.video_hot_manage.hourly_well').defaultMessage('小时次优'),
};

export const PermitType = {
  0: intl.get('vivaplus.user.user_detail.Default Public').defaultMessage('默认公开放映'),
  5: intl.get('common.tools.public').defaultMessage('公开'),
  7: intl.get('common.tools.friends_point_of_view').defaultMessage('好友点映'),
  9: intl.get('common.tools.group_view').defaultMessage('群组点映'),
  10: intl.get('common.tools.private').defaultMessage('私密'),
  16: intl.get('vivaplus.user.user_detail.Private Account').defaultMessage('隐私用户视频'),
};
export const PermitTypeArray = ObjectMapToArray(PermitType);

export const ReviewFlag = {
  0: intl.get('common.tools.not_audited').defaultMessage('未审核'),
  1: intl.get('common.tools.manual_examination_passed').defaultMessage('人工审核通过'),
  2: intl.get('common.tools.manual_examination_failed').defaultMessage('人工审核未通过'),
  3: intl.get('common.tools.machine_examination_passed').defaultMessage('机器审核通过'),
  4: intl.get('common.tools.machine_examination_failed').defaultMessage('机器审核未通过'),
};

export const Status = {
  0: intl.get('common.tools.unpublished').defaultMessage('未发布'),
  1: intl.get('common.tools.uploading').defaultMessage('发布中'),
  2: intl.get('common.tools.publish_successful').defaultMessage('发布完成'),
  3: intl.get('common.tools.publish_failed').defaultMessage('发布失败'),
  4: intl.get('common.tools.cancle_publish').defaultMessage('取消发布'),
  5: intl.get('common.tools.disabled').defaultMessage('禁用'),
  6: intl.get('common.tools.delete').defaultMessage('删除'),
  7: '视频状态由取消发布修改为禁用',
  8: '视频状态由发布成功修改为禁用',
};

export const IsShow = {
  1: '显示',
  2: '隐藏',
};

export const StatusArray = ObjectMapToArray(Status);

export const UserGrade = {
  0: intl.get('vivaplus.video_manage.regular').defaultMessage('普通'),
  1: intl.get('vivaplus.video_manage.Creator').defaultMessage('创作号'),
  2: intl.get('vivaplus.video_manage.Influencer').defaultMessage('红人'),
};

export const TagUseRate = {
  0: '一般',
  1: '常用',
  2: '最热',
};
export const TagUseRateArr = ObjectMapToArray(TagUseRate);
