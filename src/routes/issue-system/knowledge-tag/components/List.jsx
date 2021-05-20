import React from 'react';
import { Table } from 'antd';

import UpdateTag from './UpdateTag';
import Edit from './Edit';

import { getKnowledgeTags } from '../../../../services/issue/issue';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.listData,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ dataSource: nextProps.listData });
  }

  handleExpand = async (expanded, record) => {
    if (!expanded) return;
    const { data } = await getKnowledgeTags({ parentId: record.id });

    data.forEach((item) => {
      item.parent = record;
      if (!item.parent?.parent) {
        item.children = [];
      }
    });
    record.children = data;

    this.setState({ dataSource: [...this.state.dataSource] });
  }

  render() {
    const { loading, reFresh } = this.props;
    const { dataSource } = this.state;

    const columns = [
      {
        title: '标签',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        key: 'create_time',
        dataIndex: 'create_time',
      },
      {
        title: '修改时间',
        key: 'modify_time',
        dataIndex: 'modify_time',
      },
      {
        title: '修改标签关系',
        key: 'edit_tag',
        render: record => <Edit record={record} reFresh={reFresh} />,
      },
      {
        title: '操作',
        key: 'edit',
        render: record => <UpdateTag record={record} reFresh={reFresh} />,
      },
    ];
    const tableProps = {
      rowKey: 'id',
      columns,
      dataSource,
      loading,
      onExpand: this.handleExpand,
    };

    return <>
      <Table {...tableProps}/>
    </>;
  }
}

export default List;
