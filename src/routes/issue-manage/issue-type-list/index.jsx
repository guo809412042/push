import React from 'react';
import { Breadcrumb, Affix } from 'antd';
import { connect } from 'dva';
import styles from '../../../styles/index.css';

import List from './components/List';
import SearchForm from './components/SearchForm';

const IssueTypeList = ({ issue_manage__issue_type_list, dispatch }) => {
  const {
    pagination,
    listData,
    listLoading,
    formFields,
    issueType,
  } = issue_manage__issue_type_list;
  const SearchFormProps = {
    formFields,
    issueType,
    onSearch(data) {
      dispatch({
        type: 'issue_manage__issue_type_list/saveFormFields',
        payload: { data },
      });
      dispatch({
        type: 'issue_manage__issue_type_list/savePagination',
        payload: { pagination: { current: 1 } },
      });
      dispatch({ type: 'issue_manage__issue_type_list/listInit' });
    },
    reFresh() {
      dispatch({ type: 'issue_manage__issue_type_list/listInit' });
    },
  };
  const paginationOpts = {
    ...pagination,
    onChange: (current) => {
      dispatch({
        type: 'issue_manage__issue_type_list/savePagination',
        payload: { pagination: { current } },
      });
      dispatch({ type: 'issue_manage__issue_type_list/listInit' });
    },
    onShowSizeChange: (current, pageSize) => {
      dispatch({
        type: 'issue_manage__issue_type_list/savePagination',
        payload: { pagination: { current, pageSize } },
      });
      dispatch({ type: 'issue_manage__issue_type_list/listInit' });
    },
    showSizeChanger: true,
  };
  const listProps = {
    paginationOpts,
    listData,
    listLoading,
    issueType,
    reFresh() {
      dispatch({ type: 'issue_manage__issue_type_list/listInit' });
    },
  };
  return (
    <div style={{ height: window.innerHeight * 1.1 }}>
      <div className={styles.marginPx}>
        <Breadcrumb>
          <Breadcrumb.Item>工单系统</Breadcrumb.Item>
          <Breadcrumb.Item>类型管理</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Affix>
        <div className={styles.marginPx}>
          <SearchForm {...SearchFormProps} />
        </div>
      </Affix>
      <div className={styles.marginPx}>
        <List {...listProps} />
      </div>
    </div>
  );
};

export default connect(({ issue_manage__issue_type_list }) => ({ issue_manage__issue_type_list }))(
  IssueTypeList,
);
