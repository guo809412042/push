import React, { Component } from 'react';

import { List } from 'antd';
import _ from 'lodash';

import { getKnowledgeLogs } from '../../../../services/issue/issue';

const operateTypeDict = {
  0: '创建',
  1: '编辑',
  2: '删除',
};

class LogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      logs: [],
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const { knowledgeId } = this.props;
    const res = await getKnowledgeLogs(knowledgeId);
    if (res.data) {
      this.setState({
        logs: res.data,
      });
    }
    this.setState({
      loading: false,
    });
  }

  render() {
    const { userMap } = this.props;
    const { logs, loading } = this.state;
    return (
      <List
        loading={loading}
        bordered
        size="small"
        dataSource={logs}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.create_time}
              description={item.email}
            />
            <div>
              <b>
                {_.get(userMap, `${item.operator_id}.first_name`, '') + _.get(userMap, `${item.operator_id}.last_name`, '') || '已离职用户'}
              </b>
              <span>
                {operateTypeDict[item.type]}
              </span>
              了该问题
            </div>
          </List.Item>
        )}
      />
    );
  }
}

export default LogList;
