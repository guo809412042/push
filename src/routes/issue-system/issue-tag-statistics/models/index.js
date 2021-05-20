/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import moment from 'moment';

import { getConfigCountryServiceMore, getConfigLangServiceMore } from '../../../../services/common';
import { getIssueTagList } from '../../../../services/issue/issue-tag';
import { getTagStatistics } from '../../../../services/issue/issue-statistics';

const DELETED = 1;

const transTagStatisticsData = (statisticsData, tags = [], isDelete = '') => {
  const dataSource = [];

  const tagDict = {};
  for (const v of tags) {
    tagDict[v.id] = v;
  }

  for (const [k, v] of Object.entries(statisticsData)) {
    const tag = tagDict[k];

    if (!tag) continue;
    // 筛选是否已经删除的服务总结
    if (isDelete !== '' && tag.isDelete !== Number(isDelete)) continue;
    let d1 = dataSource.find(v => v.tagName === tag.levelOne);
    if (d1) {
      d1.rate += v.rate;
      d1.total += v.total;
      d1.totalSolvedTime += v.totalSolvedTime || 0;
      d1.totalSolvedCount += v.totalSolvedCount || 0;
    } else {
      d1 = {
        key: `l1-${tag.levelOne}-${tag.id}`,
        tagName: tag.isDelete === DELETED ? `(已删除)${tag.levelOne}` : tag.levelOne,
        isDelete: tag.isDelete,
        totalSolvedTime: v.totalSolvedTime || 0,
        totalSolvedCount: v.totalSolvedCount || 0,
        rate: v.rate,
        total: v.total,
        children: [],
      };
      dataSource.push(d1);
    }
    let d2 = d1.children.find(v => v.tagName === tag.levelTwo);
    if (d2) {
      d2.rate += v.rate;
      d2.total += v.total;
      d2.totalSolvedTime += v.totalSolvedTime || 0;
      d2.totalSolvedCount += v.totalSolvedCount || 0;
    } else {
      d2 = {
        parent: d1,
        key: `l2-${tag.levelTwo}-${tag.id}`,
        tagName: tag.isDelete === DELETED ? `(已删除)${tag.levelTwo}` : tag.levelTwo,
        isDelete: tag.isDelete,
        totalSolvedTime: v.totalSolvedTime || 0,
        totalSolvedCount: v.totalSolvedCount || 0,
        rate: v.rate,
        total: v.total,
        children: [],
      };
      d1.children.push(d2);
    }
    d2.children.push({
      parent: d2,
      key: `l3-${tag.levelThree}-${tag.id}`,
      tagName: tag.isDelete === DELETED ? `(已删除)${tag.levelThree}` : tag.levelThree,
      isDelete: tag.isDelete,
      totalSolvedTime: v.totalSolvedTime || 0,
      totalSolvedCount: v.totalSolvedCount || 0,
      rate: v.rate,
      total: v.total,
    });
  }

  return dataSource;
};

export default {
  namespace: 'issue_system__issue_tag_statistics',

  state: {
    formFields: {
      startTime: moment().subtract(1, 'month'),
      endTime: moment(),
    },
    listData: [],
    listLoading: false,
    issueTag: [],
    countryAndLang: [],
    langAndCountry: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/issue_system/issue_tag_statistics').exec(pathname);
        if (match) {
          dispatch({ type: 'listInit' });
          dispatch({ type: 'getCountryAndLang' });
        }
      });
    },
  },

  effects: {
    * listInit(actions, { put, call, select }) {
      yield put({ type: 'showListLoading' });
      const issueTagRes = yield call(getIssueTagList, { isProductTag: true });
      const issueTagList = issueTagRes.data.list || [];
      yield put({
        type: 'saveIssueTag',
        payload: {
          data: issueTagList,
        },
      });
      const Store = yield select(state => state.issue_system__issue_tag_statistics);
      const tagStatisticsRes = yield call(getTagStatistics, {
        ...Store.pagination,
        ...Store.formFields,
      });
      const tagStatisticsData = tagStatisticsRes.data || {};
      const tagStatisticsList = transTagStatisticsData(
        tagStatisticsData,
        issueTagList,
        Store.formFields.isDelete,
      );
      yield put({ type: 'saveDataList', payload: { data: tagStatisticsList } });
      // yield put({ type: 'savePagination', payload: { pagination: issueListRes.data.pagination } });
      yield put({ type: 'hideListLoading' });
    },

    * getCountryAndLang(action, { put, call, all }) {
      const [countryLangRes, langCountryRes] = yield all([
        call(getConfigCountryServiceMore),
        call(getConfigLangServiceMore),
      ]);
      yield put({
        type: 'setCountryAndLangConfig',
        payload: {
          countryAndLang: _.uniqBy(countryLangRes.data || [], v => v.value),
          langAndCountry: _.uniqBy(langCountryRes.data || [], v => v.value),
        },
      });
    },
  },

  reducers: {
    saveFormFields(state, action) {
      return { ...state, formFields: action.payload.data };
    },
    savePagination(state, action) {
      return { ...state, pagination: { ...state.pagination, ...action.payload.pagination } };
    },
    saveDataList(state, action) {
      return { ...state, listData: action.payload.data };
    },
    saveIssueTag(state, action) {
      return { ...state, issueTag: action.payload.data };
    },
    showListLoading(state) {
      return { ...state, listLoading: true };
    },
    hideListLoading(state) {
      return { ...state, listLoading: false };
    },
    setCountryAndLangConfig(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
