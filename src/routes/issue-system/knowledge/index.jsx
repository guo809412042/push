/* eslint-disable no-restricted-syntax */
import React from 'react';
import { connect } from 'dva';
import Query from './components/Query';
import List from './components/List';

const IssueTagStatistics = ({ issue_system__knowledge, dispatch, app }) => {
  const {
    pagination, listData, listLoading, formFields,
  } = issue_system__knowledge;

  const { userMap } = app;
  const queryProps = {
    formFields,
    listData,
    onSearch: (data) => {
      dispatch({
        type: 'issue_system__knowledge/saveFormFields',
        payload: { data },
      });
      dispatch({
        type: 'issue_system__knowledge/savePagination',
        payload: { pagination: { current: 1 } },
      });
      dispatch({
        type: 'issue_system__knowledge/listInit',
      });
    },
  };
  const listProps = {
    dispatch,
    formFields,
    pagination,
    listData,
    listLoading,
    userMap,
    onChange: (current) => {
      dispatch({
        type: 'issue_system__knowledge/savePagination',
        payload: { pagination: { current } },
      });
      dispatch({ type: 'issue_system__knowledge/listInit' });
    },
  };
  return (
    <div>
      <Query {...queryProps} />
      <List {...listProps} />
    </div>
  );
};

export default connect(({ issue_system__knowledge, app }) => ({ issue_system__knowledge, app }))(
  IssueTagStatistics,
);
