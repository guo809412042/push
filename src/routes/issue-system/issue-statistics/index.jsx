import React from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';

import PlatformOverview from './components/platform-overview';
import StaffOverview from './components/staff-overview';

const { TabPane } = Tabs;

const IssueStatistics = ({ issue_system__issue_statistics, app, dispatch }) => (
  <Tabs defaultActiveKey="1">
    <TabPane tab="平台概况" key="1">
      <PlatformOverview {...issue_system__issue_statistics} dispatch={dispatch} />
    </TabPane>
    <TabPane tab="人员概况" key="2">
      <StaffOverview {...issue_system__issue_statistics} userMap={app.userMap} users={app.users} />
    </TabPane>
  </Tabs>
);

export default connect(({ issue_system__issue_statistics, app }) => ({
  issue_system__issue_statistics,
  app,
}))(IssueStatistics);
