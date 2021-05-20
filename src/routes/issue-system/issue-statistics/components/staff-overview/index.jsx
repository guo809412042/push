import React, { Component } from 'react';
import { message } from 'antd';
import { getStaffOverview } from '../../../../../services/issue/issue-statistics';

import Query from './Query';
import List from './List';

class StaffOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      loading: false,
      isDoneDate: true, // 完结日期和领取日期, 完结日期只显示[已解决]和[平均解决时长]
    };
  }

  componentDidMount() {
    this.handleFetch();
  }


  handleFetch = async (data = { searchInfoType: '0' }) => {
    this.setState({ loading: true });
    const { userMap } = this.props;
    let operateNameList = data.operateNameList;
    if (!operateNameList || !operateNameList.length) {
      operateNameList = Object.keys(userMap);
    }
    const res = await getStaffOverview({ ...data, operateNameList });
    if (res.code !== 20000) {
      message.error('查询出错');
      this.setState({
        listData: [],
        loading: false,
      });
      return;
    }
    const { detailInfo } = res.data;
    this.setState({
      listData: detailInfo,
      loading: false,
      isDoneDate: data.searchInfoType === '0',
    });
  }

  handleSearch = (params) => {
    this.handleFetch(params);
  }

  render() {
    const { listData, loading, isDoneDate } = this.state;
    const {
      userMap, users, countryAndLang,
    } = this.props;
    return (
      <div>
        <Query onSearch={this.handleSearch} users={users} loading={loading} countryAndLang={countryAndLang} />
        <List dataSource={listData} userMap={userMap} users={users} loading={loading} isDoneDate={isDoneDate} />
      </div>
    );
  }
}

export default StaffOverview;
