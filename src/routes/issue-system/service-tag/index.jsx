import React from 'react';
import { connect } from 'dva';

import List from './components/List';
import Query from './components/Query';

const ServiceTag = ({ issue_system__service_tag, dispatch }) => {
  const { listData, listLoading, formFields } = issue_system__service_tag;
  const queryProps = {
    dispatch,
    listData,
    formFields,
    onSearch(data) {
      dispatch({
        type: 'issue_system__service_tag/searchTag',
        payload: { data },
      });
    },
  };

  const listProps = {
    dispatch,
    listData,
    listLoading,
  };

  return (
    <div>
      <Query {...queryProps} />
      <List {...listProps} />
    </div>
  );
};

export default connect(({ issue_system__service_tag }) => ({ issue_system__service_tag }))(
  ServiceTag,
);
