import React from 'react';
import { Button } from 'antd';
import intl from 'react-intl-universal';
import { connect } from 'dva';
import {
  Text, ModalComp, Remove, Hoc,
} from '@xy/design';

import UserBanPopconfirm from './UserBanPopconfirm';
import SetWebUserModel from './SetWebUser';
import AddToFollowRecommend from './AddToFollowRecommend';
import CreateUser from './CreateUser';
import CustomerUser from './CustomerUser';
import CustomerAndCreatorUserDel from './CustomerAndCreatorUserDel';
import DeviceDel from './DeviceDel';
import IdentificationsComp from './IdentificationsComp';
import MessageModal from './MessageModal';
import TagModal from '../tag/TagModal';
// import UserInfoByDuid from '../../IssueManage/IssueReportList/UserList';
const { RightHOC } = Hoc;
const { TextEdit, ImgEdit, RadioEdit } = Text;

export const TextEditCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '/user_manage/user_list' })(TextEdit),
);
// 直播等级修改
export const LiveEditCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '_right/live_grade' })(TextEdit),
);
// 达人等级修改
export const StudioGradeRadioCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '_right/studio_grade' })(RadioEdit),
);
export const ImgEditCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '/user_manage/user_list' })(ImgEdit),
);
export const RadioCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '/user_manage/user_list' })(RadioEdit),
);

const Ban = props => (
  <UserBanPopconfirm {...props}>
    {props.is_not_talk === 0 ? (
      <Button>
        {intl.get('vivaplus.user.user_detail.Prohibited words').defaultMessage('禁言')}
      </Button>
    ) : (
      <Button>{intl.get('vivaplus.user.user_detail.free_words').defaultMessage('解除')}</Button>
    )}
  </UserBanPopconfirm>
);

export const BanCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '/user_manage/user_list' })(Ban),
);

const TagHoc = props => (
  <TagModal {...props}>
    <a>{intl.get('common.edit').defaultMessage('编辑')}</a>
  </TagModal>
);

export const TagCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '/user_manage/user_list' })(TagHoc),
);

const ExtendHoc = props => <a {...props}>{intl.get('common.edit').defaultMessage('编辑')}</a>;

export const ExtendCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '/user_manage/user_list' })(ExtendHoc),
);

export const SetWebUserCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '_right/set_web_user_info' })(SetWebUserModel),
);
export const CreateUserCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '_right/user_creator' })(CreateUser),
);
export const CustomerUserCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '_right/user_customer' })(CustomerUser),
);
export const CustomerAndCreatorUserDelCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '_right/user_customer_delete' })(CustomerAndCreatorUserDel),
);
export const DeviceDelCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '_right/device_delete' })(DeviceDel),
);
export const UserDeleteCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '_right/user_delete' })(Remove),
);
export const UserIdentificationsCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '_right/user_identifications' })(IdentificationsComp),
);
export const BadgeUserCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '_right/set_user_badge' })(ModalComp),
);
export const MessageModalCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '_right/send_message' })(MessageModal),
);
// export const UserInfoByDuidCom = connect(({ app }) => ({ app }))(RightHOC({ menu: '_right/userinfo_by_device' })(UserInfoByDuid));
export const AddToFollowRecommendCom = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '_right/add_to_user_follow_recommend' })(AddToFollowRecommend),
);
export const DelUserComment = connect(({ app }) => ({ app }))(
  RightHOC({ menu: '_right/delete_user_comment' })(Remove),
);
