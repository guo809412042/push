import React from 'react';
import {
  Table, Icon,
} from 'antd';
import intl from 'react-intl-universal';
import { Text } from '@xy/design';
import { alterIssueType } from '../../../../services/issue';
import { IsDelete, IsDeleteList } from './enum';

const { TextEdit, RadioEdit } = Text;
const List = ({
  listData,
  listLoading,
  paginationOpts,
  reFresh,
}) => {
  const columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    }, {
      title: 'title',
      key: 'title',
      dataIndex: 'title',
      render: (value, record) => <div>
        <TextEdit
          name="title"
          initialValue={value.toString()}
          label="Title"
          callback={reFresh}
          handleSubmit={alterIssueType}
          pk={record.id}
        >
          {value}
        </TextEdit>
      </div>,
    }, {
      title: intl.get('common.status').defaultMessage('状态'),
      key: 'is_delete',
      dataIndex: 'is_delete',
      render: (value, record) => <RadioEdit
        name="is_delete"
        initialValue={value.toString()}
        label="状态"
        callback={reFresh}
        handleSubmit={alterIssueType}
        pk={record.id}
        selectList={IsDeleteList}
      >
        {IsDelete[value]}
        <Icon type="edit" />
      </RadioEdit>,
    }, {
      title: 'country&lang',
      key: 'lang',
      dataIndex: 'lang',
      render: (value, record) => `${record.country_code} -- ${record.lang}`,
    },
  ];
  const TableProps = {
    columns,
    loading: listLoading,
    pagination: paginationOpts,
    dataSource: listData,
    rowKey: 'id',
  };
  return (
    <div>
      <Table {...TableProps} />
    </div>
  );
};

export default List;
