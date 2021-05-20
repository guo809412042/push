import React from 'react';
import {
  Modal, Button, Timeline, Icon, Tag,
} from 'antd';

import { getUserStateLogServer } from '../../services/user';
import { getTableListServer } from '../../services/common';
import CONST from '../../utils/const';

const { Map } = CONST;

class UserStateLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      res_list: [],
      user_list: {},
    };
  }

  showModal = async () => {
    this.getTableListServer();
    this.getUserStateLog();
    this.setState({ visible: true });
  };

  hideModal = async () => {
    this.setState({ visible: false });
  };

  //  获取用户状态日志
  getUserStateLog = async () => {
    const { auid } = this.props;
    const res = await getUserStateLogServer({ auid, modelname: 'User' });
    const res_list = res.data.map((item) => {
      try {
        item.params = JSON.parse(item.params) || {};
      } catch (err) {
        console.log(err);
        item.params = {};
      }
      item.state = item.params.state || '2';
      return item;
    });
    this.setState({ res_list });
  };

  //  获取用户
  getTableListServer = async () => {
    const user_list = {};
    const queryData = {
      //  查询参数
      department_id: '',
      department_ids: '',
    };
    const res = await getTableListServer(queryData);
    console.log('sldjladsjlkdfs', res);
    res.data.map((item) => {
      user_list[item.id] = item.first_name + item.last_name;
    });
    this.setState({ user_list });
  };

  render() {
    const modalProps = {
      title: '用户状态轨迹',
      visible: this.state.visible,
      onOk: () => this.setState({ visible: false }),
      onCancel: () => this.setState({ visible: false }),
      footer: [
        <Button type="ghost" onClick={() => this.setState({ visible: false })}>
          关闭
        </Button>,
      ],
    };
    return (
      <div style={{ display: 'inline-block', marginLeft: '7px' }}>
        <Button onClick={this.showModal}>查看详情</Button>
        <Modal {...modalProps}>
          {this.state.res_list.length > 0 ? (
            <Timeline>
              {this.state.res_list.map(item => (
                <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}>
                  <h3>{item.create_time}</h3>
                  <div style={{ lineHeight: '30px' }}>
                    {this.state.user_list[parseInt(item.operator_id, 10)]} &nbsp;&nbsp;
                    {item.state ? (
                      <Tag color="#0f0">{Map.UserInfoStateMap[parseInt(item.state, 10)]}</Tag>
                    ) : null}{' '}
                    &nbsp;&nbsp;
                    {item.params ? item.params.reason : null}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : null}
        </Modal>
      </div>
    );
  }
}

export default UserStateLog;
