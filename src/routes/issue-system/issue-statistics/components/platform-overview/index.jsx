import React, { Component } from 'react';
import { Tooltip, Icon } from 'antd';
import Dashboard from './Dashboard';
import Query from './Query';
import List from './List';
import { getPlatformOverview } from '../../../../../services/issue/issue-statistics';

const dashboardSchema = [
  {
    title: '全部',
    key: 'totalIssue',
  },
  {
    title: '未受理',
    key: 'pendingIssue',
  },
  {
    title: '受理中',
    key: 'processingIssue',
  },
  {
    title: '已解决',
    key: 'solvedIssue',
  },
  {
    title: '自动化工单已解决',
    key: 'autoSolvedIssue',
  },
  {
    title: '人工工单已解决',
    key: 'operateSolvedIssue',
  },
  {
    title: '工单完结率',
    key: 'solvedPercent',
    formatter: v => (v ? v * 100 : 0),
    props: {
      precision: 2,
      suffix: '%',
    },
  },
  {
    title: '自动完结率',
    key: 'autoSolvedPercent',
    formatter: v => (v ? v * 100 : 0),
    props: {
      precision: 2,
      suffix: '%',
    },
  },
  {
    title: '人工完结率',
    key: 'operateSolvedPercent',
    formatter: v => (v ? v * 100 : 0),
    props: {
      precision: 2,
      suffix: '%',
    },
  },
  {
    title: '待生成人工工单',
    key: 'automationIssue',
  },
  // {
  //   title: '平均受理时长(完结工单)/小时',
  //   key: 'processingTime',
  //   props: {
  //     precision: 2,
  //   },
  // },
  {
    title: <Tooltip title="平均首响时长=（客服首次回复时间-客服领取时间）/（未受理+受理中+已解决工单数）">
      <span>平均首响时长/小时</span><Icon style={{ marginLeft: 2 }} type="question-circle" theme="twoTone" twoToneColor="#FF7F50" />
    </Tooltip>,
    key: 'responseTime',
    props: {
      precision: 2,
    },
  },
  {
    title: <Tooltip title="平均受理时长（所有）=（客服首次回复时间-人工工单生成时间）/（待领取+已领取+处理中+人工完结工单数）">
      <span>平均受理时长(全部工单)/小时</span><Icon style={{ marginLeft: 2 }} type="question-circle" theme="twoTone" twoToneColor="#FF7F50" />
    </Tooltip>,
    key: 'allProcessingTime',
    props: {
      precision: 2,
    },
  },
  {
    title: <Tooltip title="平均解决时长=（人工工单解决时间-人工工单生成时间）/（已完结的人工工单数）">
      <span>平均解决时长/小时</span><Icon style={{ marginLeft: 2 }} type="question-circle" theme="twoTone" twoToneColor="#FF7F50" />
    </Tooltip>,
    key: 'solvedTime',
    props: {
      precision: 2,
    },
  },
];


class PlatformOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardData: [],
      listData: [],
      loading: false,
    };
  }

  handleFetch = async (data) => {
    this.setState({ loading: true });
    const { issueTypeDict } = this.props;
    const isDelete = data.isDelete;
    delete data.isDelete;
    const res = await getPlatformOverview(data);
    const { totalInfo, detailInfo } = res.data;
    const dashboardData = dashboardSchema.map(v => ({
      title: v.title,
      value: v.formatter ? v.formatter(totalInfo[v.key]) : totalInfo[v.key],
      props: v.props || {},
    }));
    let listData = detailInfo;
    // 过滤是问题是否已删除
    if (isDelete !== '') {
      listData = detailInfo.filter(
        item => issueTypeDict[item.issueTypeId]?.isDelete === Number(isDelete),
      );
    }
    // const filterListData = [];
    this.setState({
      dashboardData,
      listData,
      loading: false,
    });
  }

  handleSearch = async (params) => {
    this.handleFetch(params);
  }

  render() {
    const { dashboardData, listData, loading } = this.state;
    const {
      issueType,
      issueTypeDict,
      countryAndLang,
      langAndCountry,
      queryDate,
      dispatch,
    } = this.props;
    return (
      <div>
        <Query onSearch={this.handleSearch} issueType={issueType} countryAndLang={countryAndLang} langAndCountry={langAndCountry} dispatch={dispatch} loading={loading} />
        <Dashboard dataSource={dashboardData} />
        <List dataSource={listData} issueTypeDict={issueTypeDict} queryDate={queryDate}
          loading={loading} />
      </div>
    );
  }
}

export default PlatformOverview;
