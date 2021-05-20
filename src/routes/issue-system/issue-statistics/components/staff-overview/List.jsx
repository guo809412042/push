import React from 'react';
import { Table, Tooltip, Icon } from 'antd';


const List = ({
  dataSource = [], userMap, loading, isDoneDate,
}) => {
  const listColumns = [
    {
      title: '姓名',
      dataIndex: 'operateName',
      key: 'operateName',
      render: (text) => {
        const v = userMap[text];
        return `${v.first_name || ''}${v.last_name || ''}[${v.email}]`;
      },
    },
    {
      title: '全部',
      dataIndex: 'totalIssue',
      key: 'totalIssue',
      align: 'right',
      render: text => (isDoneDate ? '-' : text),
    },
    {
      title: '未受理',
      dataIndex: 'pendingIssue',
      key: 'pendingIssue',
      align: 'right',
      render: text => (isDoneDate ? '-' : text),
    },
    {
      title: '受理中',
      dataIndex: 'processingIssue',
      key: 'processingIssue',
      align: 'right',
      render: text => (isDoneDate ? '-' : text),
    },
    {
      title: '已解决',
      dataIndex: 'solvedIssue',
      key: 'solvedIssue',
      align: 'right',
    },
    {
      title: '工单完结率',
      dataIndex: 'solvedPercent',
      key: 'solvedPercent',
      align: 'right',
      render: text => (isDoneDate ? '-' : text ? `${(Number(text) * 100).toFixed(2)}%` : 0),
    },
    {
      title: '平均首响时长',
      dataIndex: 'responseTime',
      key: 'responseTime',
      align: 'right',
      filterDropdown: (<div />),
      filterIcon: <Tooltip title="平均首响时长=（客服首次回复时间-客服领取时间）/（未受理+受理中+已解决工单数）">
        <Icon style={{ fontSize: 16 }} type="question-circle" theme="twoTone" twoToneColor="#FF7F50" />
      </Tooltip>,
      render: text => (isDoneDate ? '-' : text === 'NaN' ? '-' : Number(text).toFixed(2)),
    },
    {
      title: '平均受理时长(所有工单)',
      dataIndex: 'allProcessingTime',
      key: 'allProcessingTime',
      filterDropdown: (<div />),
      filterIcon: <Tooltip title="平均受理时长(所有工单)= （当下-客服领取时间）/（未受理+受理中工单）">
        <Icon style={{ fontSize: 15 }} type="question-circle" theme="twoTone" twoToneColor="#FF7F50" />
      </Tooltip>,
      render: text => (isDoneDate ? '-' : text === 'NaN' ? '-' : Number(text).toFixed(2)),
      align: 'right',
    },
    {
      title: '平均解决时长',
      dataIndex: 'solvedTime',
      key: 'solvedTime',
      filterDropdown: (<div />),
      filterIcon: <Tooltip title="平均解决时长=（人工工单解决时间-客服领取时间）/已解决工单数">
        <Icon style={{ fontSize: 15 }} type="question-circle" theme="twoTone" twoToneColor="#FF7F50" />
      </Tooltip>,
      render: text => (text === 'NaN' ? '-' : Number(text).toFixed(2)),
      align: 'right',
    },
    {
      title: '平均交互次数',
      dataIndex: 'operateCount',
      key: 'operateCount',
      align: 'right',
      render: text => (isDoneDate ? '-' : text),
    },

  ];
  return (
    <Table
      dataSource={dataSource}
      columns={listColumns}
      rowKey="operateName"
      loading={loading}
    />
  );
};

export default List;
