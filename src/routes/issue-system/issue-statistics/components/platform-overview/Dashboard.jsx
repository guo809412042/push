import React from 'react';
import {
  Statistic,
  List,
} from 'antd';


const Dashboard = ({ dataSource = [] }) => (
  <List
    style={{
      backgroundColor: '#fff',
      padding: '1em',
      margin: '1em auto',
    }}
    grid={{
      gutter: 16,
      xs: 3,
      sm: 3,
      md: 6,
      lg: 6,
      xl: 8,
      xxl: 8,
    }}
    dataSource={dataSource}
    renderItem={item => (
      <List.Item>
        <Statistic title={item.title} value={item.value} {...item.props} />
      </List.Item>
    )}
  />
);

export default Dashboard;
