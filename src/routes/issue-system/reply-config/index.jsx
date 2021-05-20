import React from 'react';
import { connect } from 'dva';

import List from './components/List';
import Query from './components/Query';

const ReplyConfig = ({ issue_system__reply_config, dispatch }) => {
  const {
    listData,
    listLoading,
    titles,
    countryAndLang,
    langAndCountry,
    formFields,
  } = issue_system__reply_config;
  const queryProps = {
    dispatch,
    titles,
    formFields,
    countryAndLang,
    langAndCountry,
    onSearch(data) {
      dispatch({
        type: 'issue_system__reply_config/search',
        payload: { data },
      });
    },
  };

  const listProps = {
    dispatch,
    countryAndLang,
    langAndCountry,
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

export default connect(({ issue_system__reply_config }) => ({ issue_system__reply_config }))(
  ReplyConfig,
);
