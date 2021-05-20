import React from 'react';
import { connect } from 'dva';

import List from './components/List';
import Query from './components/Query';
import TipsView from './components/TipsView';

const AssignedIssue = ({ issue_system__assigned_issue, app, dispatch }) => {
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
  } = issue_system__assigned_issue;
  const { users, user, userMap } = app;
  const queryProps = {
    dispatch,
    users,
    user,
    issueTag,
    issueType,
    formFields,
    androidAppVersions,
    iosAppVersions,
    countryAndLang,
    langAndCountry,
    onSearch(data) {
      dispatch({
        type: 'issue_system__assigned_issue/saveFormFields',
        payload: { data },
      });
      dispatch({
        type: 'issue_system__assigned_issue/savePagination',
        payload: { pagination: { current: 1 } },
      });
      dispatch({ type: 'issue_system__assigned_issue/listInit' });
    },
  };

  const listProps = {
    dispatch,
    users,
    user,
    issueTag,
    issueType,
    formFields,
    pagination,
    listData,
    listLoading,
    userMap,
    reFresh() {
      dispatch({ type: 'issue_system__assigned_issue/listInit' });
    },
  };

  return (
    <div>
      <Query {...queryProps} />
      <TipsView/>
      <List {...listProps} />
    </div>
  );
};

export default connect(({ issue_system__assigned_issue, app }) => ({
  issue_system__assigned_issue,
  app,
}))(AssignedIssue);
