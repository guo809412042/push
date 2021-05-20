import React from 'react';
import { connect } from 'dva';

import Query from './components/Query';
import List from './components/List';

const Fapiao = ({ issue_system_fapiao, dispatch }) => {
  const {
    formFields, pagination, dataList, loading, selectedRowKeys,
  } = issue_system_fapiao;

  const queryProps = {
    formFields,
    dispatch,
    dataList,
  };
  const listProps = {
    dispatch,
    dataList,
    pagination,
    loading,
    selectedRowKeys,
  };

  return <div>
    <Query {...queryProps} />
    <List {...listProps} />
  </div>;
};

export default connect(({ issue_system_fapiao }) => ({ issue_system_fapiao }))(Fapiao);
