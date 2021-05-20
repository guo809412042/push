import React from 'react';
import { Table, Tag, Collapse } from 'antd';
import intl from 'react-intl-universal';

import ExtendInfo from './ExtendInfo';

import CONST from '../../utils/const';

const MAP = CONST.Map;

const Panel = Collapse.Panel;

const UserGrade = {
  0: intl.get('vivaplus.user.user_detail.ordinary').defaultMessage('普通'),
  1: intl.get('vivaplus.user.user_detail.Creator').defaultMessage('创作号'),
  2: intl.get('vivaplus.user.user_detail.Influencer').defaultMessage('红人'),
};
const Color = {
  '#f50': 1,
  '#2db7f5': 2,
  '#87d068': 3,
};

const UserDetailTable = (props) => {
  const { loading, data, header } = props;
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
  const dataBaseSource = [
    {
      title: intl.get('common.user_id').defaultMessage('用户ID'),
      info: <span> {data.userInfo.auid}</span>,
      key: 'auid',
    },
    {
      title: intl.get('common.nickname').defaultMessage('用户昵称'),
      info: `${data.userInfo.nickname}(${data.userInfo.country_code})`,
      key: 'info_userInfo_nickname',
    },
    {
      title: intl.get('vivaplus.user.fans_count').defaultMessage('粉丝'),
      info: data.userInfo.fans_count,
      key: 'info_userInfo_fans_count',
    },
    {
      title: intl.get('vivaplus.user.follow_count').defaultMessage('关注数'),
      info: data.userInfo.follow_count,
      key: 'info_userInfo_follow_count',
    },
    {
      title: intl.get('vivaplus.user.user_detail.profile picture').defaultMessage('用户头像'),
      info: <img src={data.userInfo.profile_image_url} alt="" height="80" />,
      key: 'info.userinfo.avatar_url',
    },
    {
      title: intl.get('vivaplus.user.user_detail.gender').defaultMessage('性别'),
      info: Map.GenderMap[data.userInfo.gender],
      key: 'gender',
    },
    {
      title: intl.get('vivaplus.user.user_detail.degree').defaultMessage('用户等级'),
      info: UserGrade[data.userInfo.usergrade],
      key: 'info.grade',
    },
    {
      title: intl.get('vivaplus.user.user_detail.status').defaultMessage('状态'),
      info: MAP.UserInfoStateMap[data.userInfo.state],
      key: 'info.state',
    },
    {
      title: intl.get('vivaplus.user.user_detail.posts').defaultMessage('发布视频数'),
      info: (
        <div>
          {data.videocount}
          &nbsp;&nbsp;
        </div>
      ),
      key: 'info.userstat.video_count',
    },
    {
      title: intl.get('common.tags').defaultMessage('标签'),
      info: (
        <div>
          {data.tags.map(v => (
            <Tag key={v.id} color={Color[v.type]}>
              {v.displayName}
            </Tag>
          ))}
        </div>
      ),
      key: 'tags',
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

  const dataSource = [
    {
      title: intl.get('vivaplus.user.user_detail.base_info').defaultMessage('基本信息'),
      info: <Table {...tableBaseOpts} />,
      key: 'base_data',
    },
    {
      title: intl.get('vivaplus.user.user_detail.certification').defaultMessage('认证状态'),
      info: data.userInfo.extend_info ? (
        <ExtendInfo info={data.userInfo.extend_info} auid={data.userInfo.auid} />
      ) : (
        ''
      ),
      key: 'extend_info',
    },
  ];
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
    <Collapse defaultActiveKey={['1']}>
      <Panel
        header={header || intl.get('vivaplus.vest.detail').defaultMessage('马甲号详情')}
        key="1"
      >
        <Table {...tableOpts} />
      </Panel>
    </Collapse>
  );
};

export default UserDetailTable;
