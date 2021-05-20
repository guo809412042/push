import React from 'react';
import {
  Modal, Button, Table, message, Icon,
} from 'antd';
import intl from 'react-intl-universal';

import { getDevicesByAuid, updateDeviceState } from '../../services/user';

import { RadioCom } from '../user/UserDetailMid';

const STATE = {
  0: intl.get('vivaplus.user.state.not_enable').defaultMessage('未启用'),
  1: intl.get('vivaplus.user.state.normal').defaultMessage('正常'),
  2: intl.get('common.tools.deactivated').defaultMessage('停用'),
  3: intl.get('vivaplus.user.state.disabled').defaultMessage('禁用'),
  4: intl.get('vivaplus.user.state.delete').defaultMessage('删除'),
};

class DeviceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      data: [],
    };
  }

  openModal = async () => {
    await this.setState({ visible: true, loading: true });
    await this.refresh();
  };

  refresh = async () => {
    try {
      const { data } = await getDevicesByAuid({ auid: this.props.user_id });
      await this.setState({ loading: false, data });
    } catch (e) {
      message.error('用户设备信息获取出错');
      this.setState({ visible: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  onCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, loading, data } = this.state;
    const ModalOpts = {
      title: intl
        .get('vivaplus.user.user_detail.User device details')
        .defaultMessage('用户设备详情'),
      visible,
      footer: [
        <Button onClick={this.onCancel} key={this.props.user_id}>
          取消
        </Button>,
      ],
      onCancel: this.onCancel,
      width: 700,
    };
    const columns = [
      {
        title: intl.get('vivaplus.user.user_detail.device code').defaultMessage('设备编码'),
        key: 'duiddigest',
        dataIndex: 'duiddigest',
      },
      {
        title: intl.get('vivaplus.user.user_detail.device').defaultMessage('设备'),
        key: 'device',
        dataIndex: 'device',
      },
      {
        title: intl.get('common.tools.status').defaultMessage('状态'),
        key: 'state',
        dataIndex: 'state',
        render: value => STATE[value],
      },
      {
        title: intl
          .get('vivaplus.user.user_detail.applications(sigh up)')
          .defaultMessage('注册申请次数'),
        key: 'count',
        dataIndex: 'count',
      },
      {
        title: intl.get('common.tools.apply').defaultMessage('操作'),
        key: 'do',
        dataIndex: 'device',
        render: (value, record) => (
          <div>
            <RadioCom
              name="state"
              initialValue={record.state.toString()}
              label="类型"
              pk={record.duiddigest}
              handleSubmit={updateDeviceState}
              selectList={[
                {
                  label: intl.get('vivaplus.user.state.normal').defaultMessage('正常'),
                  value: '1',
                },
                {
                  label: intl.get('vivaplus.user.state.disabled').defaultMessage('禁用'),
                  value: '3',
                },
              ]}
              callback={this.refresh}
            >
              <Icon type="edit" />
            </RadioCom>
          </div>
        ),
      },
    ];

    const tableOpts = {
      columns,
      dataSource: data,
      pagination: false,
      bordered: true,
      loading,
      size: 'small',
    };
    return (
      <span>
        <span onClick={this.openModal}>{this.props.children}</span>
        <Modal {...ModalOpts}>
          <Table {...tableOpts} />
        </Modal>
      </span>
    );
  }
}

export default DeviceModal;
