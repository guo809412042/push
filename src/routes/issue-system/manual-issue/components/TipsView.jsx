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
    vivavideo: 0,
    tempoCountry: 0,
    tempo: 0,
    vivamini: 0,
    sp: 0,
    vivacut: 0,
    noIssue: 0,
    noRead: 0,
  });
  const getNumber = async () => {
    setLoading(true);
    const row = {
      current: 1,
      isInvalidProblem: false,
      issueState: '0',
      pageSize: 1,
    };
    const [
      {
        data: {
          pagination: { total: vivavideo },
        },
      },
      {
        data: {
          pagination: { total: tempoCountry },
        },
      },
      {
        data: {
          pagination: { total: tempo },
        },
      },
      {
        data: {
          pagination: { total: vivamini },
        },
      },
      {
        data: {
          pagination: { total: sp },
        },
      },
      {
        data: {
          pagination: { total: vivacut },
        },
      },
    ] = await Promise.all([
      getIssueList({ ...row, productId: 2 }),
      getIssueList({
        ...row,
        productId: 10,
        countryList: [ 'CN', 'US', 'GB', 'TW', 'RU', 'BR', 'ID', ]
      }),
      getIssueList({ ...row, productId: 10 }),
      getIssueList({ ...row, productId: 16 }),
      getIssueList({ ...row, productId: 3 }),
      getIssueList({ ...row, productId: 15 }),
    ]);
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
      total: vivavideo + tempoCountry + vivamini + sp + vivacut,
      vivavideo,
      tempo,
      tempoCountry,
      vivamini,
      sp,
      vivacut,
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
                待领取总量：<label>{numbers.total}</label>
              </span>
              <span>
                Vivavideo：<label>{numbers.vivavideo}</label>
              </span>
              <span>
                Tempo(重点国家)：<label>{numbers.tempoCountry}</label>
              </span>
              <span>
                Tempo(总)：<label>{numbers.tempo}</label>
              </span>
              <span>
                甜影：<label>{numbers.vivamini}</label>
              </span>
              <span>
                简拍：<label>{numbers.sp}</label>
              </span>
              <span>
                Vivacut：<label>{numbers.vivacut}</label>
              </span>
            </div>
            <div style={{ marginTop: 5 }}>
              <span >
                已领取未处理量：<label style={{ color: 'red' }}>{numbers.noIssue}</label>
              </span>
              <span >
                运营未读消息：<label style={{ color: 'red' }}>{numbers.noRead}</label>
              </span>
            </div>
          </div>
        }
        type="warning"
      />
    </Spin>
  );
};
