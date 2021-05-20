import React from 'react';
import { connect } from 'dva';

// import ReplyChat from './components/reply-chat/ReplyChat';
import List from './components/List';
import Query from './components/Query';
import TipsView from './components/TipsView';

const ManualTicket = ({ issue_system__manual_issue, app, dispatch }) => {
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
  } = issue_system__manual_issue;
  const { users, user, userMap } = app;
  // console.log('user_dict: ', user_dict);
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
        type: 'issue_system__manual_issue/saveFormFields',
        payload: { data },
      });
      dispatch({
        type: 'issue_system__manual_issue/savePagination',
        payload: { pagination: { current: 1 } },
      });
      dispatch({ type: 'issue_system__manual_issue/listInit' });
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
    formFields,
    reFresh() {
      dispatch({ type: 'issue_system__manual_issue/listInit' });
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

export default connect(({ issue_system__manual_issue, app }) => ({
  issue_system__manual_issue,
  app,
}))(ManualTicket);
