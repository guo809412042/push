import React, { Component } from 'react';
import { Modal, Table } from 'antd';
import moment from 'moment';

import { getIssueLogs } from '../../../../services/issue/issue';

const issueLogTypeDict = {
  0: '用户反馈',
  1: '运营领取',
  2: '运营回复',
  3: '完结',
};

class IssueLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      loading: false,
      dataSource: [],
    };
  }

  handleClick = async () => {
    this.setState({
      loading: true,
      show: true,
    });
    const { data } = this.props;
    const res = await getIssueLogs({ issueId: data.issueId });
    console.log(res);
    this.setState({
      loading: false,
      dataSource: res.data || [],
    });
  }

  render() {
    const { show, loading, dataSource } = this.state;
    const { users } = this.props;
    const columns = [
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: text => issueLogTypeDict[text],
      },
      {
        title: '时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作人',
        dataIndex: 'operateName',
        key: 'operateName',
        render: (text) => {
          if (!text) return null;
          const v = users.find(user => String(user.id) === String(text));
          if (v) {
            return <div>{`${v.first_name || ''}${v.last_name || ''}`}</div>;
          }
          return null;
        },
      },
    ];
    return (
      <div>
        <Modal
          title="日志"
          onOk={() => {
            this.setState({
              show: false,
            });
          }}
          visible={show}
          onCancel={() => {
            this.setState({
              show: false,
            });
          }}>
          <Table footer={null} dataSource={dataSource} size="small" loading={loading} columns={columns} />
        </Modal>
        <a onClick={this.handleClick}>日志</a>
      </div>
    );
  }
}

export default IssueLog;
