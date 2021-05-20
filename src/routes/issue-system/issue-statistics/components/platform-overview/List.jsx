import React from 'react';
import { Table, Tooltip, Icon } from 'antd';

const List = ({
  dataSource = [], issueTypeDict, queryDate: { startTime = '', endTime = '' }, loading,
}) => {
  const listColumns = [
    {
      title: '问题类型',
      dataIndex: 'issueTypeId',
      key: 'issueTypeId',
      render: (text) => {
        if (!issueTypeDict[text]) return '-';
        return (
          <a
            href={`${window.location.pathname}${window.location.search}&fg=viva-tools-issue#/issue_system/manual_issue/?issueTypeId=${text}&startTime=${startTime}&endTime=${endTime}&issueState=-1`}
            target="_blank"
          >
            {issueTypeDict[text].name}
          </a>
        );
      },
    },
    {
      title: '全部',
      dataIndex: 'totalIssue',
      key: 'totalIssue',
      align: 'right',
    },
    {
      title: '未受理',
      dataIndex: 'pendingIssue',
      key: 'pendingIssue',
      align: 'right',
    },
    {
      title: '受理中',
      dataIndex: 'processingIssue',
      key: 'processingIssue',
      align: 'right',
    },
    {
      title: '已解决',
      dataIndex: 'solvedIssue',
      key: 'solvedIssue',
      align: 'right',
    },
    {
      title: '人工已解决',
      dataIndex: 'operateSolvedIssue',
      key: 'operateSolvedIssue',
      align: 'right',
    },
    {
      title: '自动已解决',
      dataIndex: 'autoSolvedIssue',
      key: 'autoSolvedIssue',
      align: 'right',
    },
    {
      title: '工单完结率',
      dataIndex: 'solvedPercent',
      key: 'solvedPercent',
      render: text => (text ? `${(Number(text) * 100).toFixed(2)}%` : 0),
      align: 'right',
    },
    {
      title: '自动完结率',
      dataIndex: 'autoSolvedPercent',
      key: 'autoSolvedPercent',
      render: text => (text ? `${(Number(text) * 100).toFixed(2)}%` : 0),
      align: 'right',
    },
    {
      title: '人工完结率',
      dataIndex: 'operateSolvedPercent',
      key: 'operateSolvedPercent',
      render: text => (text ? `${(Number(text) * 100).toFixed(2)}%` : 0),
      align: 'right',
    },
    {
      title: '待生成人工工单',
      dataIndex: 'automationIssue',
      key: 'automationIssue',
      align: 'right',
    },
    // {
    //   title: '平均受理时长(完结工单)',
    //   dataIndex: 'processingTime',
    //   key: 'processingTime',
    //   render: text => Number(text).toFixed(2),
    //   align: 'right',
    // },
    {
      title: '平均首响时长',
      dataIndex: 'responseTime',
      key: 'responseTime',
      filterDropdown: (<div />),
      filterIcon: <Tooltip title="平均首响时长=（客服首次回复时间-客服领取时间）/（未受理+受理中+已解决工单数）">
        <Icon style={{ fontSize: 15 }} type="question-circle" theme="twoTone" twoToneColor="#FF7F50" />
      </Tooltip>,
      render: text => (text === 'NaN' ? '-' : Number(text).toFixed(2)),
      align: 'right',
    },
    {
      title: '平均受理时长(所有工单)',
      dataIndex: 'allProcessingTime',
      key: 'allProcessingTime',
      filterDropdown: (<div />),
      filterIcon: <Tooltip title="平均受理时长（所有）=（客服首次回复时间-人工工单生成时间）/（待领取+已领取+处理中+人工完结工单数）">
        <Icon style={{ fontSize: 15 }} type="question-circle" theme="twoTone" twoToneColor="#FF7F50" />
      </Tooltip>,
      render: text => (text === 'NaN' ? '-' : Number(text).toFixed(2)),
      align: 'right',
    },
    {
      title: '平均解决时长',
      dataIndex: 'solvedTime',
      key: 'solvedTime',
      filterDropdown: (<div />),
      filterIcon: <Tooltip title="平均解决时长=（人工工单解决时间-人工工单生成时间）/（已完结的人工工单数）">
        <Icon style={{ fontSize: 15 }} type="question-circle" theme="twoTone" twoToneColor="#FF7F50" />
      </Tooltip>,
      render: text => (text === 'NaN' ? '-' : Number(text).toFixed(2)),
      align: 'right',
    },
  ];

  return <Table loading={loading} dataSource={dataSource} columns={listColumns} rowKey="issueTypeId"/>;
};

export default List;
