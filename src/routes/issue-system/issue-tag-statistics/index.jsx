/* eslint-disable no-restricted-syntax */
import React from 'react';
import { connect } from 'dva';
import Query from './components/Query';
import List from './components/List';

const IssueTagStatistics = ({ issue_system__issue_tag_statistics, dispatch }) => {
  const {
    listData,
    issueTag,
    countryAndLang,
    langAndCountry,
    formFields,
  } = issue_system__issue_tag_statistics;
  const queryProps = {
    countryAndLang,
    langAndCountry,
    formFields,
    issueTag,
    onSearch: (data) => {
      dispatch({
        type: 'issue_system__issue_tag_statistics/saveFormFields',
        payload: { data },
      });
      dispatch({
        type: 'issue_system__issue_tag_statistics/listInit',
      });
      console.log(data);
    },
  };
  const listProps = {
    dataSource: listData,
  };
  return (
    <div>
      <Query {...queryProps} />
      <List {...listProps} />
    </div>
  );
};

export default connect(({ issue_system__issue_tag_statistics, app }) => ({
  issue_system__issue_tag_statistics,
  app,
}))(IssueTagStatistics);
