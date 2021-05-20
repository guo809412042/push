import React from 'react';
import intl from 'react-intl-universal';
import {
  Modal, Button, Table, message, Card, Tag, Row, Col, Icon, Select,
} from 'antd';
import { Text, Image as PopverImg, Hoc } from '@xy/design';
import {
  TextEditCom,
  ImgEditCom,
  CreateUserCom,
  CustomerUserCom,
  RadioCom,
  BanCom,
  TagCom,
  SetWebUserCom,
  LiveEditCom,
  StudioGradeRadioCom,
  UserDeleteCom,
  UserIdentificationsCom,
  BadgeUserCom,
  MessageModalCom,
  AddToFollowRecommendCom,
  DelUserComment,
} from './UserDetailMid';

import ExtendInfo from './ExtendInfo';
import AddUserWhite from './AddUserWhite';
import RecommendModal from './RecommendModal';
import UserStateLog from './UserStateLog';
import ExpertModal from './ExpertModal';

import Appeal from './Appeal';
import UserDetail from './User';
import CreatUserLoginLog from './CreatUserLoginLog';
import AddBlackList from './AddBlackList';
import CreateVestUser from '../vest/CreateVestUser';
import VideoByUser from '../link/VideoByUser';
import DeviceModal from '../device/DeviceModal';

import { BadgeState } from '../enum';
import CONST, { SNSNAMEMAP } from '../../utils/const';
import { cipherTextDecode } from '../../services/app';
import {
  queryOnlyUserInfo,
  changeUserClass,
  alterUserInfo,
  setUserState,
  alterUserStudio,
  deleteUser,
  delUserAllComment,
} from '../../services/user';
import { getQualityUserGrade, setUserBadge, deleteUserBadge } from '../../services/quality-user';
import { ObjectMapToArray } from '../../utils/utils';

const { Map: MAP } = CONST;
const Option = Select.Option;
const { TextExplain } = Text;
const { AreaHOC: AreaComp } = Hoc;
const UserGrade = {
  0: intl.get('vivaplus.user.user_detail.ordinary').defaultMessage('普通'),
  1: intl.get('vivaplus.user.user_detail.Creator').defaultMessage('创作号'),
  2: intl.get('vivaplus.user.user_detail.Influencer').defaultMessage('红人'),
};

const UserGradeArray = ObjectMapToArray(UserGrade, 'value', 'label');

const Color = {
  '#f50': 1,
  '#2db7f5': 2,
  '#87d068': 3,
};

const SelectListState = [];
const UserInfoStateMap = MAP.UserInfoStateMap;
// eslint-disable-next-line
for (const props in UserInfoStateMap) {
  SelectListState.push({ value: props, label: UserInfoStateMap[props] });
}

class UserModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      data: {
        snsInfo: [],
        userInfo: {
          userclass: 0,
          state: 0,
          usergrade: 0,
        },
        tags: [],
        badge_info: [],
        userAccount: {
          account_name: '',
        },
      },
      badgeData: [],
      query: this.props.get_user_detail ? this.props.get_user_detail : queryOnlyUserInfo,
      show_extend_table: this.props.show_extend_table === undefined,
      profile_image_url: null,
    };
  }

  openModal = async () => {
    this.props.set_cookie && this.props.set_cookie();
    await this.setState({ visible: true, loading: true });
    await this.refresh();
  };

  refresh = async () => {
    try {
      try {
        const { data: badgeData } = await getQualityUserGrade({ pageSize: 1000, get_useful: 1 });
        await this.setState({ badgeData });
      } catch (error) {
        await this.setState({ badgeData: [] });
      }
      const { data } = await this.state.query({ user_id: this.props.user_id });
      if (Object.keys(data).length !== 0) {
        this.get_head(data.userInfo.profile_image_url);
        await this.setState({ loading: false, data });
      } else {
        message.warn(
          intl.get('vivaplus.user.msg.get_part_error').defaultMessage('用户部分信息读取失败'),
        );
      }
    } catch (e) {
      message.error(intl.get('vivaplus.user.msg.get_error_msg').defaultMessage('用户信息获取出错'));
      this.setState({ visible: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  //  头像解密
  get_head = async (value) => {
    const { status, data: profile_image_url } = await cipherTextDecode({ cipherText: value });
    if (status) this.setState({ profile_image_url });
  };

  onCancel = () => {
    this.setState({ visible: false });
    this.props.set_cookie_back && this.props.set_cookie_back();
  };

  handleChangeUserGrade = async () => {
    await this.setState({ loading: true });
    // await changeUserGrade({ user_level, user_id });
    message.success(
      intl.get('vivaplus.user.msg.change_user_grade_success').defaultMessage('修改用户等级成功'),
    );
    const { data } = await this.state.query({ user_id: this.props.user_id });
    this.setState({ loading: false, data });
  };

  render() {
    const {
      visible, loading, data, badgeData, show_extend_table, profile_image_url,
    } = this.state;
    const ModalOpts = {
      title: intl.get('vivaplus.user.user_detail.user_detail').defaultMessage('用户详情'),
      visible,
      footer: [
        <Button onClick={this.onCancel} key={this.props.user_id}>
          {intl.get('common.cancel').defaultMessage('取消')}
        </Button>,
      ],
      onCancel: this.onCancel,
      width: 700,
    };
    const columns = [
      {
        title: 'title',
        dataIndex: 'title',
        key: 'title',
        width: '30%',
      },
      {
        title: 'info',
        dataIndex: 'info',
        key: 'info',
        width: '70%',
      },
    ];
    const EditOpts = {
      handleSubmit: alterUserInfo,
      auiddigest: data.userInfo.auiddigest,
      callback: this.refresh,
    };
    const dataBaseSource = [
      {
        title: intl.get('common.user_id').defaultMessage('用户ID'),
        info: (
          <span>
            {data.userInfo.auiddigest} ({data.userInfo.auid}){' '}
          </span>
        ),
        key: 'auid',
      },
      {
        title: intl.get('common.nickname').defaultMessage('用户昵称'),
        info: (
          <div>
            <span
              style={{ float: 'left' }}
            >{`${data.userInfo.nickname}(${data.userInfo.country_code})`}</span>
            <span style={{ float: 'right', marginLeft: '10' }}>
              <TextEditCom
                name="nickname"
                initialValue={data.userInfo.nickname}
                label={intl.get('common.nickname').defaultMessage('昵称')}
                {...EditOpts}
              >
                <Icon type="edit" />
              </TextEditCom>
            </span>
          </div>
        ),
        key: 'info_userInfo_nickname',
      },
      {
        title: intl.get('vivaplus.user.fans_count').defaultMessage('粉丝'),
        info: (
          <div>
            <span style={{ float: 'left' }}>{data.userInfo.fans_count}</span>
            <span style={{ float: 'right', marginLeft: '10' }}>
              <TextEditCom
                name="fansCount"
                initialValue={data.userInfo.fans_count}
                label={intl.get('vivaplus.user.fans_count').defaultMessage('粉丝')}
                {...EditOpts}
              >
                <Icon type="edit" />
              </TextEditCom>
            </span>
          </div>
        ),
        key: 'info_userInfo_fans_count',
      },
      {
        title: intl.get('vivaplus.user.follow_count').defaultMessage('关注数'),
        info: (
          <div>
            <span style={{ float: 'left' }}>{data.userInfo.follow_count}</span>
            <span style={{ float: 'right', marginLeft: '10' }}>
              <TextEditCom
                name="followCount"
                initialValue={data.userInfo.follow_count}
                label={intl.get('vivaplus.user.follow_count').defaultMessage('关注数')}
                {...EditOpts}
              >
                <Icon type="edit" />
              </TextEditCom>
            </span>
          </div>
        ),
        key: 'info_userInfo_follow_count',
      },
      {
        title: intl.get('vivaplus.user.user_detail.description').defaultMessage('描述'),
        info: (
          <div>
            <span style={{ float: 'left' }}>{data.userInfo.description}</span>
            <span style={{ float: 'right', marginLeft: '10' }}>
              <TextEditCom
                name="description"
                initialValue={data.userInfo.description}
                label={intl.get('vivaplus.user.user_detail.description').defaultMessage('描述')}
                {...EditOpts}
              >
                {data.userInfo.description ? <Icon type="edit" /> : <Icon type="plus" />}
              </TextEditCom>
            </span>
          </div>
        ),
        key: 'info_userInfo_description',
      },
      {
        title: intl.get('vivaplus.user.user_detail.profile picture').defaultMessage('用户头像'),
        info: (
          <div>
            <PopverImg src={profile_image_url} width={120} trigger="hover" />
            <span style={{ float: 'right', marginLeft: '10' }}>
              <ImgEditCom
                name="profileImageUrl"
                label={intl
                  .get('vivaplus.user.user_detail.profile picture')
                  .defaultMessage('用户头像')}
                {...EditOpts}
              >
                <Icon type="edit" />
              </ImgEditCom>
            </span>
          </div>
        ),
        key: 'info.userinfo.avatar_url',
      },
      {
        title: intl
          .get('vivaplus.user.user_detail.User background image')
          .defaultMessage('用户背景图'),
        info: (
          <div>
            <PopverImg src={data.userInfo.backgroud_img} width={120} trigger="hover" />
            <span style={{ float: 'right', marginLeft: '10' }}>
              <ImgEditCom
                name="backgroudImg"
                label={intl
                  .get('vivaplus.user.user_detail.User background image')
                  .defaultMessage('用户背景图')}
                {...EditOpts}
              >
                <Icon type="edit" />
              </ImgEditCom>
            </span>
          </div>
        ),
        key: 'info.userinfo.backgroud_img',
      },
      {
        title: intl.get('vivaplus.user.user_detail.gender').defaultMessage('性别'),
        info: MAP.GenderMap[data.userInfo.gender],
        key: 'gender',
      },
      {
        title: intl.get('common.account_type').defaultMessage('账号类型'),
        info: (
          <div>
            <span style={{ float: 'left' }}>
              {data.userInfo.userclass.toString() === '0'
                ? intl.get('common.general_user').defaultMessage('普通用户')
                : intl.get('common.admin_user').defaultMessage('超级管理员')}
            </span>
            <span style={{ float: 'right', marginLeft: '10' }}>
              <RadioCom
                name="userclass"
                initialValue={data.userInfo.userclass.toString()}
                label={intl.get('common.account_type').defaultMessage('账号类型')}
                {...EditOpts}
                handleSubmit={changeUserClass}
                pk={data.userInfo.auid}
                selectList={[
                  { label: intl.get('common.general_user').defaultMessage('普通用户'), value: '0' },
                  { label: intl.get('common.admin_user').defaultMessage('超级管理员'), value: '1' },
                ]}
              >
                <Icon type="edit" />
              </RadioCom>
            </span>
          </div>
        ),
        key: 'info.userinfo.userclass',
      },
      {
        title: intl.get('vivaplus.user.user_detail.degree').defaultMessage('用户等级'),
        info: UserGrade[data.userInfo.usergrade],
        key: 'info.grade',
      },
      {
        title: (
          <span>
            {intl.get('vivaplus.user..user_detailstatus').defaultMessage('状态')}
            <TextExplain
              trigger="hover"
              title={
                <div>
                  <p>
                    <span style={{ marginRight: '10px', color: 'red' }}>
                      {intl.get('vivaplus.user.state.normal').defaultMessage('正常')}:
                    </span>
                    {intl
                      .get('vivaplus.user.moremsg.user_account_normal')
                      .defaultMessage('帐号正常')}
                  </p>
                  <p>
                    <span style={{ marginRight: '10px', color: 'red' }}>
                      {intl.get('vivaplus.user.state.not_enable').defaultMessage('未启用')}:
                    </span>
                    {intl
                      .get('vivaplus.user.moremsg.user_account_not_enable')
                      .defaultMessage('帐号正常，未对该帐号进行过操作')}
                  </p>
                  <p>
                    <span style={{ marginRight: '10px', color: 'red' }}>
                      {intl.get('vivaplus.user.state.freeze').defaultMessage('冻结')}:
                    </span>
                    {intl
                      .get('vivaplus.user.moremsg.user_account_freeze')
                      .defaultMessage('冻结帐号，不能再使用')}
                  </p>
                </div>
              }
            />
          </span>
        ),
        info: (
          <div>
            <span style={{ float: 'left' }}>
              {data.userInfo.state === 2
                ? intl.get('vivaplus.user.state.freeze').defaultMessage('冻结')
                : MAP.UserInfoStateMap[data.userInfo.state]}
              <UserStateLog auid={data.userInfo.auid} />
              {data.userInfo.state === 2 && <Appeal data={data.userInfo} />}
            </span>
            <span style={{ float: 'right', marginLeft: '10' }}>
              <RadioCom
                name="state"
                initialValue={data.userInfo.state.toString()}
                label={intl.get('vivaplus.user..user_detailstatus').defaultMessage('状态')}
                {...EditOpts}
                handleSubmit={setUserState}
                pk={data.userInfo.auid}
                selectList={SelectListState}
                inputVisible={['2', '5', '99']}
              >
                <Icon type="edit" />
              </RadioCom>
            </span>
          </div>
        ),
        key: 'info.state',
      },
      {
        title: intl.get('vivaplus.user.user_detail.Prohibited words').defaultMessage('禁言'),
        info: (
          <div>
            {data.userInfo.is_no_talk === 0 ? (
              <span>{intl.get('vivaplus.user.state.normal').defaultMessage('正常')}</span>
            ) : (
              <span>
                {intl.get('vivaplus.user.user_detail.Prohibited words').defaultMessage('禁言中')}
              </span>
            )}
            &nbsp;&nbsp;
            <BanCom
              callback={this.refresh}
              is_not_talk={data.userInfo.is_no_talk}
              auid={data.userInfo.auid}
            />
          </div>
        ),
        key: 'info.notTalk',
      },
      {
        title: (
          <span>
            {intl.get('vivaplus.user.user_detail.posts').defaultMessage('发布视频数')}
            <TextExplain
              trigger="hover"
              title={intl
                .get('vivaplus.user.user_detail.posts_text')
                .defaultMessage('状态为发布完成的视频数，与用户在app上看到的一致。')}
            />
          </span>
        ),
        info: (
          <div>
            {data.videocount}
            &nbsp;&nbsp;{' '}
            <VideoByUser auiddigest={data.userInfo.auiddigest}>
              <a>
                {intl.get('vivaplus.user.user_detail.Check posts').defaultMessage('查看用户视频')}
              </a>{' '}
            </VideoByUser>
          </div>
        ),
        key: 'info.userstat.video_count',
      },
      {
        title: intl.get('vivaplus.user.user_detail.posts(weekly)').defaultMessage('近一周发布视频'),
        info: data.nearWeekVideoCount,
        key: 'info.userstat.nearWeekVideoCount',
      },
      {
        title: (
          <span>
            {intl.get('vivaplus.user.user_detail.privacy or not').defaultMessage('是否为隐私账号')}
            <TextExplain
              trigger="hover"
              title={intl
                .get('vivaplus.user.user_detail.privacy or not_text')
                .defaultMessage(
                  '公开发布的内容仅对粉丝可见，私密内容仅自己可见，陌生人申请关注需要用户通过。',
                )}
            />
          </span>
        ),
        info: data.isPrivacy
          ? intl.get('vivaplus.user.user_detail.privacy').defaultMessage('是')
          : intl.get('vivaplus.user.user_detail.privacy_not').defaultMessage('否'),
        key: 'info.userstat.isPrivacy',
      },
      {
        title: intl
          .get('vivaplus.user.user_detail.Points level system')
          .defaultMessage('积分系统等级'),
        info: data.user_score_grade,
        key: 'info.userstat.user_score_grade',
      },
      {
        title: intl.get('vivaplus.user.user_detail.live permission').defaultMessage('直播等级'),
        info: (
          <div>
            <span style={{ float: 'left' }}>{data.userInfo.live_grade}</span>
            <span style={{ float: 'right', marginLeft: '10' }}>
              <LiveEditCom
                name="live_grade"
                initialValue={data.userInfo.live_grade}
                label={intl
                  .get('vivaplus.user.user_detail.live permission')
                  .defaultMessage('直播等级')}
                {...EditOpts}
                handleSubmit={alterUserStudio}
                pk={data.userInfo.auid}
              >
                <Icon type="edit" />
              </LiveEditCom>
            </span>
          </div>
        ),
        key: 'data.userInfo.live_grade',
      },
      {
        title: intl.get('vivaplus.user.user_detail.Talent user level').defaultMessage('达人等级'),
        info: (
          <div>
            <span style={{ float: 'left' }}>{UserGrade[data.userInfo.usergrade]}</span>
            <span style={{ float: 'right', marginLeft: '10' }}>
              <StudioGradeRadioCom
                name="studio_grade"
                initialValue={data.userInfo.usergrade.toString()}
                label={intl
                  .get('vivaplus.user.user_detail.Talent user level')
                  .defaultMessage('达人等级')}
                {...EditOpts}
                handleSubmit={alterUserStudio}
                pk={data.userInfo.auid}
                selectList={UserGradeArray}
              >
                <Icon type="edit" />
              </StudioGradeRadioCom>
            </span>
          </div>
        ),
        key: 'data.userInfo.usergrade',
      },
      {
        title: intl.get('common.create_time').defaultMessage('注册时间'),
        info: data.userInfo.create_time,
        key: 'info.userinfo.create_time',
      },
      {
        title: (
          <span>
            {intl.get('common.tags').defaultMessage('标签')}
            <TextExplain
              trigger="hover"
              title={intl
                .get('common.tags_text')
                .defaultMessage(
                  '一个词语，用来代表一类视频或用户，词语必须是唯一的，是标签系统中最基本的概念。标签分为两级：一级标签与二级标签',
                )}
            />
          </span>
        ),
        info: (
          <div>
            {data.tags.map(v => (
              <Tag key={v.id} color={Color[v.type]}>
                {v.displayName}
              </Tag>
            ))}
            <TagCom auid={data.userInfo.auid} callback={this.refresh} />
          </div>
        ),
        key: 'tags',
      },
      {
        title: (
          <span>
            {intl.get('vivaplus.user.user_detail.device').defaultMessage('平台')}
            <TextExplain
              trigger="hover"
              title={intl
                .get('vivaplus.user.user_detail.device_text')
                .defaultMessage('账号历史登录设备；冻结（禁用）该设备，该设备之后不能登录小影')}
            />
          </span>
        ),
        info: (
          <div>
            <DeviceModal user_id={data.userInfo.auid}>
              <a>
                {intl.get('vivaplus.user.user_detail.User device details').defaultMessage('详情')}
              </a>
            </DeviceModal>
          </div>
        ),
        key: 'device',
      },
      {
        title: intl.get('common.badge').defaultMessage('勋章'),
        info: (
          <div>
            <span style={{ float: 'left' }}>
              {!data.badge_info
                ? null
                : data.badge_info.map(v => (
                  <Tag
                    key={v.id}
                    closable
                    afterClose={this.refresh}
                    onClose={() => deleteUserBadge({ auid: data.userInfo.auid }, { badge_id: v.id })
                    }
                  >
                    {v.content.length > 15 ? `${v.content.slice(0, 15)}...` : v.content}
                    {BadgeState[v.badge_state]}
                  </Tag>
                ))}
            </span>
            <span style={{ float: 'right', marginLeft: '10' }}>
              <BadgeUserCom
                title="添加勋章"
                callback={this.refresh}
                handleFun={setUserBadge}
                args={[{ auid: data.userInfo.auid }]}
                extraComp={[
                  {
                    label: intl.get('common.badge').defaultMessage('勋章'),
                    name: 'badge_id',
                    initialValue: [],
                    Comp: (
                      <Select mode="multiple" key="badge_id">
                        {badgeData.map(v => (
                          <Option key={v.id}>{v.content}</Option>
                        ))}
                      </Select>
                    ),
                  },
                ]}
              >
                <Icon type="edit" />
              </BadgeUserCom>
            </span>
          </div>
        ),
        key: 'data.badge_info',
      },
    ];
    const tableBaseOpts = {
      columns,
      dataSource: dataBaseSource,
      showHeader: false,
      pagination: false,
      bordered: true,
      loading,
      size: 'small',
    };

    let dataSource = [
      {
        title: intl.get('vivaplus.user.user_detail.base_info').defaultMessage('基本信息'),
        info: <Table {...tableBaseOpts} />,
        key: 'base_data',
      },
    ];
    const dataSource_extend = [
      {
        title: intl.get('vivaplus.user.user_detail.sns information').defaultMessage('sns信息'),
        info: data.snsInfo.map(v => (
          <Card key={v.id}>
            <p>
              {intl.get('vivaplus.user.user_detail.account').defaultMessage('账号')}：
              {v.sns_account_name}
            </p>
            <p>
              {intl.get('vivaplus.user.user_detail.sns id').defaultMessage('登录名')}：
              {v.sns_nickname}
            </p>
            <p>
              {intl.get('vivaplus.user.user_detail.link').defaultMessage('用户主页')}：
              {v.sns_user_page}
            </p>
            <p>
              {intl.get('vivaplus.user.user_detail.sns').defaultMessage('登录类型')}：
              {SNSNAMEMAP[v.sns_account_type]}
            </p>
          </Card>
        )),
        key: 'info.useraccount',
      },
      {
        title: intl.get('vivaplus.user.user_detail.account login').defaultMessage('登陆信息'),
        info: (
          <div>
            <p>
              {intl.get('vivaplus.user.user_detail.account').defaultMessage('账号')}：
              {data.userAccount.account_name}
            </p>
            <p>
              {intl.get('vivaplus.user.user_detail.name').defaultMessage('登录名')}：
              {data.userAccount.nickname}
            </p>
            <p>
              {intl.get('vivaplus.user.user_detail.sns').defaultMessage('登录类型')}：
              {SNSNAMEMAP[data.userAccount.account_type]}
            </p>
            <p>
              第三方用户主页：
              {data.userAccount.user_sns_page ? (
                <a href={data.userAccount.user_sns_page} target="_blank">
                  {data.userAccount.user_sns_page}
                </a>
              ) : (
                '无信息'
              )}
            </p>
          </div>
        ),
        key: 'info.userloginaccount',
      },
      {
        title: intl.get('vivaplus.user.user_detail.certification').defaultMessage('认证状态'),
        info: (
          <div>
            <ExtendInfo info={data.userInfo.extend_info || '{}'} auid={data.userInfo.auiddigest} />
            <UserIdentificationsCom userdigest={data.userInfo.auiddigest} />
          </div>
        ),
        key: 'extend_info',
      },
      {
        title: intl.get('vivaplus.user.user_detail.other informations').defaultMessage('其他信息'),
        info: (
          <div>
            <AreaComp>
              <div style={{ overflow: 'hidden' }}>
                <span style={{ float: 'left' }}>
                  {' '}
                  qq:
                  {data.userInfo.qq}
                </span>{' '}
                <span style={{ float: 'right', marginLeft: '10' }}>
                  <TextEditCom name="qq" label="qq" initialValue={data.userInfo.qq} {...EditOpts}>
                    {' '}
                    <Icon type="edit" />{' '}
                  </TextEditCom>
                </span>
              </div>
            </AreaComp>
            <AreaComp>
              <div style={{ overflow: 'hidden' }}>
                <span style={{ float: 'left' }}>
                  {' '}
                  微博:
                  {data.userInfo.sinaweiboid}
                </span>{' '}
                <span style={{ float: 'right', marginLeft: '10' }}>
                  <TextEditCom
                    name="sinaweiboid"
                    label="微博"
                    initialValue={data.userInfo.sinaweiboid}
                    {...EditOpts}
                  >
                    {' '}
                    <Icon type="edit" />{' '}
                  </TextEditCom>
                </span>
              </div>
            </AreaComp>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ float: 'left' }}>
                {' '}
                {intl.get('vivaplus.user.user_detail.phone number').defaultMessage('电话')}:
                {data.userInfo.phonenumber}
              </span>{' '}
              <span style={{ float: 'right', marginLeft: '10' }}>
                <TextEditCom
                  name="phonenumber"
                  label="电话"
                  initialValue={data.userInfo.phonenumber}
                  {...EditOpts}
                >
                  {' '}
                  <Icon type="edit" />{' '}
                </TextEditCom>
              </span>
            </div>
          </div>
        ),
        key: 'other_info',
      },
      {
        title: intl.get('vivaplus.user.user_detail.Other operations').defaultMessage('其他操作'),
        info: (
          <Row>
            <Col span={8}>
              <AddUserWhite auiddigest={data.userInfo.auiddigest}>
                <Button>
                  {intl.get('vivaplus.user.user_detail.Whitelist').defaultMessage('加入白名单')}
                  <TextExplain
                    trigger="hover"
                    title={intl
                      .get('vivaplus.user.user_detail.Whitelist_text')
                      .defaultMessage('白名单用户的视频发布后直接进入热门')}
                  />
                </Button>
              </AddUserWhite>
            </Col>
            <Col span={8}>
              <RecommendModal auiddigest={data.userInfo.auiddigest}>
                <Button>
                  {intl
                    .get('vivaplus.user.user_detail.Recommend the user')
                    .defaultMessage('推荐该达人用户')}
                  <TextExplain
                    trigger="hover"
                    title={intl
                      .get('vivaplus.user.user_detail.Recommend the user_text')
                      .defaultMessage('将该用户加入推荐达人列表，可以在新用户注册时出现')}
                  />
                </Button>
              </RecommendModal>
            </Col>
            <Col span={8}>
              <ExpertModal auiddigest={data.userInfo.auiddigest} userInfo={data.userInfo} type={1}>
                <Button>
                  {intl
                    .get('vivaplus.user.user_detail.sns Influencers database')
                    .defaultMessage('加入社交红人信息库')}
                  <TextExplain
                    trigger="hover"
                    title={intl
                      .get('vivaplus.user.user_detail.sns Influencers database_text')
                      .defaultMessage(
                        '社交网络上粉丝达到一定值的小影注册用户，该值由各社区分别设定，社交平台支持微博、twitter、instagram',
                      )}
                  />
                </Button>
              </ExpertModal>
            </Col>
            <Col span={8}>
              <ExpertModal auiddigest={data.userInfo.auiddigest} userInfo={data.userInfo} type={2}>
                {' '}
                <Button>
                  {intl
                    .get('vivaplus.user.user_detail.Quality user database')
                    .defaultMessage('加入站内达人信息库')}
                </Button>{' '}
              </ExpertModal>
            </Col>
            <Col span={8}>
              <MessageModalCom
                auiddigest={data.userInfo.auiddigest}
                userInfo={data.userInfo}
                key={data.userInfo.auiddigest}
              >
                <Button>
                  {intl.get('vivaplus.user.user_detail.message').defaultMessage('发私信')}
                  <TextExplain
                    trigger="hover"
                    title={intl
                      .get('vivaplus.user.user_detail.message_text')
                      .defaultMessage('直接使用官方帐号给用户发私信，私信为第三方服务商。')}
                  />
                </Button>
              </MessageModalCom>
            </Col>
            <Col span={8}>
              <CreateVestUser
                aArgs={[
                  {
                    auid: data.userInfo.auid,
                    auiddigest: data.userInfo.auiddigest,
                    country_code: data.userInfo.country_code,
                  },
                ]}
                title="确认设置为马甲号？"
              >
                <Button>
                  {intl
                    .get('vivaplus.user.user_detail.multiple accounts')
                    .defaultMessage('设置马甲号')}
                  <TextExplain
                    trigger="hover"
                    title={intl
                      .get('vivaplus.user.user_detail.multiple accounts_text')
                      .defaultMessage(
                        '马甲号是运营选择的用来发布视频或描述的帐号，其功能包括点对点评论、多对点评论、站内视频搬运。马甲号包括官方马甲号和普通马甲号，官方马甲号不出现在多对点评论中。',
                      )}
                  />
                </Button>
              </CreateVestUser>
            </Col>
            <Col span={8}>
              <SetWebUserCom auid={data.userInfo.auid} callback={this.refresh}>
                <Button>
                  {intl
                    .get('vivaplus.user.user_detail.Reset the web user')
                    .defaultMessage('设置网页上传权限')}
                  <TextExplain
                    trigger="hover"
                    title={
                      <div>
                        <p>
                          {intl
                            .get('vivaplus.user.user_detail.Reset the web user_text1')
                            .defaultMessage('给用户开放web页面上传的功能')}
                        </p>
                        <p>
                          {intl
                            .get('vivaplus.user.user_detail.Reset the web user_text2')
                            .defaultMessage('创作者后台地址')}
                          :{' '}
                          <a
                            style={{ color: '#fff' }}
                            href="https://creator.xiaoying.tv"
                            target="_blank"
                          >
                            creator.xiaoying.tv
                          </a>
                        </p>
                      </div>
                    }
                  />
                </Button>
              </SetWebUserCom>
            </Col>
            <Col span={8}>
              <CreateUserCom
                auid={data.userInfo.auid}
                country={data.userInfo.country_code}
                callback={this.refresh}
              />
            </Col>
            <Col span={8}>
              <CustomerUserCom
                auid={data.userInfo.auid}
                duid="6670"
                country={data.userInfo.country_code}
                callback={this.refresh}
              />
            </Col>
            <Col span={8}>
              <UserDeleteCom
                aArgs={[data.userInfo.auid]}
                handleFun={deleteUser}
                title={intl
                  .get('vivaplus.user.user_detail.write_off_text')
                  .defaultMessage('确认注销该用户？')}
                callback={this.refresh}
              >
                <Button>{intl.get('vivaplus.user.state.write_off').defaultMessage('注销')}</Button>
              </UserDeleteCom>
            </Col>
            <Col span={8}>
              <UserDetail data_id={data.userInfo.auid}>
                <Button>
                  {intl
                    .get('vivaplus.user.operate.user_operate_history')
                    .defaultMessage('用户操作轨迹')}
                </Button>
              </UserDetail>
            </Col>
            <Col span={8}>
              <CreatUserLoginLog data_id={data.userInfo.auid} />
            </Col>
            <Col span={8}>
              <AddBlackList auiddigest={data.userInfo.auiddigest} callback={this.refresh}>
                <Button>加入热门用户黑名单</Button>
              </AddBlackList>
            </Col>
            <Col span={8}>
              <AddToFollowRecommendCom auiddigest={data.userInfo.auiddigest} />
            </Col>
            <Col span={8}>
              <DelUserComment
                aArgs={[{ auiddigest: data.userInfo.auiddigest }]}
                handleFun={delUserAllComment}
                needConfirmStatus
              >
                <Button type="danger">删除用户所有评论</Button>
              </DelUserComment>
            </Col>
          </Row>
        ),
        key: 'other_do',
      },
    ];
    if (show_extend_table) {
      dataSource = dataSource.concat(dataSource_extend);
    }
    const tableOpts = {
      columns,
      dataSource,
      showHeader: false,
      pagination: false,
      bordered: true,
      loading,
      size: 'small',
    };
    return (
      <span style={{ marginRight: '8px' }}>
        <span onClick={this.openModal}>{this.props.children}</span>
        <Modal {...ModalOpts}>
          <Table {...tableOpts} />
        </Modal>
      </span>
    );
  }
}

export default UserModal;
