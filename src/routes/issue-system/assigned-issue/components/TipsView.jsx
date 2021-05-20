import React, { useState, useEffect } from 'react';
import { Alert, Spin } from 'antd';
import cookie from 'js-cookie';
import * as styles from './index.less';
import { getIssueList } from '../../../../services/issue/issue';

export default () => {
  const operateName = Number(cookie.get('userid')) || '';
  const [loading, setLoading] = useState(false);
  const [numbers, setNumbers] = useState({
    total: 0,
    noIssue: 0,
    noRead: 0,
  });
  const getNumber = async () => {
    setLoading(true);
    let total = 0;
    for (const i of [2, 10, 16, 3, 15]) {
      const {
        data: {
          pagination: { total: num },
        },
      } = await getIssueList({
        current: 1,
        isInvalidProblem: false,
        issueState: '0',
        pageSize: 1,
        productId: i,
        countryList: i * 1 === 10 ? ['CN', 'US', 'CA', 'GB', 'TW', 'AU', 'PH'] : [],

      });
      total += num;
    }
    let noIssue = 0;
    for (const i of [2, 10, 16, 3, 15]) {
      const {
        data: {
          pagination: { total },
        },
      } = await getIssueList({
        current: 1,
        issueState: '1',
        orderField: '4',
        orderType: '1',
        pageSize: 1,
        productId: i,
        operateName,
      });
      noIssue += total;
    }
    let noRead = 0;
    for (const i of [2, 10, 16, 3, 15]) {
      const {
        data: {
          pagination: { total },
        },
      } = await getIssueList({
        current: 1,
        isNew: '0',
        issueState: '2',
        orderField: '4',
        orderType: '1',
        pageSize: 1,
        productId: i,
        operateName,
      });
      noRead += total;
    }
    setNumbers({
      total,
      noIssue,
      noRead,
    });
    setLoading(false);
  };
  useEffect(() => {
    getNumber();
    let intervalId = setInterval(getNumber, 1000 * 60 * 15);
    return () => {
      clearInterval(intervalId);
      intervalId = null;
    };
  }, []);
  return (
    <Spin spinning={loading}>
      <Alert
        style={{ margin: '20px 0' }}
        message={
          <div className={styles.tips}>
            <div>
              <span>
                已领取未处理量：<label style={{ color: 'red' }}>{numbers.noIssue}</label>
              </span>
              <span>
                运营未读消息：<label style={{ color: 'red' }}>{numbers.noRead}</label>
              </span>
              <span>
                待领取总量：<label>{numbers.total}</label>
              </span>
            </div>
          </div>
        }
        type="warning"
      />
    </Spin>
  );
};
