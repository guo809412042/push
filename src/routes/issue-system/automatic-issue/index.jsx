import React from 'react';
import { connect } from 'dva';

import List from './components/List';
import Query from './components/Query';

const AssignedIssue = ({ issue_system__automatic_issue, app, dispatch }) => {
  const {
    pagination,
    listData,
    listLoading,
    issueTag,
    issueType,
    formFields,
    androidAppVersions,
    iosAppVersions,
    countryAndLang,
    langAndCountry,
  } = issue_system__automatic_issue;
  const { users } = app;
  const queryProps = {
    dispatch,
    users,
    issueTag,
    issueType,
    formFields,
    androidAppVersions,
    iosAppVersions,
    countryAndLang,
    langAndCountry,
    onSearch(data) {
      dispatch({
        type: 'issue_system__automatic_issue/saveFormFields',
        payload: { data },
      });
      dispatch({
        type: 'issue_system__automatic_issue/savePagination',
        payload: { pagination: { current: 1 } },
      });
      dispatch({ type: 'issue_system__automatic_issue/listInit' });
    },
  };

  const listProps = {
    dispatch,
    users,
    issueTag,
    issueType,
    formFields,
    pagination,
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

export default connect(({ issue_system__automatic_issue, app }) => ({
  issue_system__automatic_issue,
  app,
}))(AssignedIssue);
