import React from 'react';

import { Modal, Table } from 'antd';
import { connect } from 'dva';
import intl from 'react-intl-universal';
import { getUserOpeationLog } from '../../services/history';
import Const from '../../utils/const';

const {
  Map: { UserInfoStateMap },
} = Const;

const Source = {
  未记录: 0,
  工具: 1,
  社区: 2,
  '接口(关联冻结)': 3,
  审核: 4,
};

const OperateType = {
  updateGrade: intl.get('vivaplus.user.operate.update_grade').defaultMessage('修改等级'),
  updateUserState: intl
    .get('vivaplus.user.operate.update_user_state')
    .defaultMessage('修改用户基础信息'),
  userNoTalkOff: intl.get('vivaplus.user.operate.user_no_talk_off').defaultMessage('解除禁言'),
  userNoTalk: intl.get('vivaplus.user.operate.user_no_talk').defaultMessage('禁言用户'),
};

class UserHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: [],
      loading: false,
    };
  }

  openModal = async () => {
    this.setState({
      visible: true,
      loading: true,
    });
    await this.getData();
    this.setState({
      loading: false,
    });
  };

  closeModal = () => {
    this.setState({
      visible: false,
    });
  };

  getData = async () => {
    const { data_id } = this.props;
    const { data } = await getUserOpeationLog.call(this, {
      pageSize: 100,
      data_id,
      modelname: 'User',
    });
    this.setState({
      data,
    });
  };

  render() {
    const {
      children,
      app: { allUser },
    } = this.props;
    const { visible, data, loading } = this.state;
    const columns = [
      {
        title: intl.get('vivaplus.user.operate.operate_type').defaultMessage('操作内容'),
        dataIndex: 'opeation',
        key: 'opeation',
        render: (v) => {
          if (v && v.includes('--')) {
            v = v.split('--');
            return (
              <div>
                {intl.get('vivaplus.user.operate.change_user_state').defaultMessage('修改用户状态')}{' '}
                {UserInfoStateMap[Number(v[1])]}
              </div>
            );
          }
          return <div>{OperateType[v]}</div>;
        },
      },
      {
        title: intl.get('vivaplus.user.operate.operator').defaultMessage('操作人员'),
        dataIndex: 'operator_id',
        key: 'operator_id',
        render: v => allUser[v],
      },
      {
        title: intl.get('vivaplus.user.operate.params').defaultMessage('参数'),
        dataIndex: 'params',
        key: 'params',
        width: '30%',
      },
      {
        title: intl.get('vivaplus.user.operate.ip').defaultMessage('Ip 地址'),
        dataIndex: 'ip_address',
        key: 'ip_address',
      },
      {
        title: intl.get('vivaplus.user.operate.time').defaultMessage('操作时间'),
        dataIndex: 'create_time',
        key: 'create_time',
      },
      {
        title: intl.get('vivaplus.user.operate.source').defaultMessage('来源'),
        dataIndex: 'source_type',
        key: 'source',
        render: v => Source[Number(v)],
      },
      {
        title: intl.get('vivaplus.user.operate.source_data_id').defaultMessage('源数据'),
        dataIndex: 'source_data_id',
        key: 'source_data_id',
      },
    ];
    return (
      <div>
        <span onClick={this.openModal}>{children}</span>
        <Modal
          visible={visible}
          onCancel={this.closeModal}
          title={intl
            .get('vivaplus.user.operate.user_operate_history')
            .defaultMessage('用户操作轨迹')}
          width="700"
          footer={false}
        >
          <Table size="small" dataSource={data} columns={columns} loading={loading} />
        </Modal>
      </div>
    );
  }
}

export default connect(({ app }) => ({ app }))(UserHistory);
