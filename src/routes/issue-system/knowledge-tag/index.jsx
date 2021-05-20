import React from 'react';
import { connect } from 'dva';

import Query from './components/Query';
import List from './components/List';

const KnowledgeTag = ({ issueKnowledgeTag, dispatch }) => {
  const { listData, loading } = issueKnowledgeTag;

  const queryProps = {
    onSearch: (values) => {
      dispatch({
        type: 'issueKnowledgeTag/initList',
        payload: values,
      });
    },
  };
  const listProps = {
    listData,
    loading,
    reFresh: () => {
      dispatch({
        type: 'issueKnowledgeTag/initList',
      });
    },
  };

  return (<>
    <Query {...queryProps} />
    <List {...listProps} />
  </>);
};

export default connect(({ issueKnowledgeTag }) => ({ issueKnowledgeTag }))(
  KnowledgeTag,
);
