import React from 'react';
import { Table } from 'antd';

const listColumns = [
  {
    title: '服务总结',
    dataIndex: 'tagName',
    key: 'tagName',
  },
  {
    title: '全部',
    dataIndex: 'total',
    key: 'total',
    align: 'right',
  },
  {
    title: '占比',
    dataIndex: 'rate',
    key: 'rate',
    align: 'right',
    render: (text, record) => {
      if (!record.parent) {
        return `${Number(text).toFixed(2)}%`;
      }
      return (record.total / record.parent.total * 100).toFixed(2);
    },
  },
  {
    title: '平均解决时长',
    dataIndex: 'totalSolvedTime',
    key: 'totalSolvedTime',
    align: 'right',
    render: (text, record) => {
      if (text && record.totalSolvedCount) {
        const average = text / record.totalSolvedCount;
        return `${average.toFixed(2)}小时`;
      }
      return ' - ';
    },
  },
];

const List = ({ dataSource = [] }) => <Table dataSource={dataSource} columns={listColumns} rowKey="key" />;

export default List;
