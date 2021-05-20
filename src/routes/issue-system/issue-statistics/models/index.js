import pathToRegexp from 'path-to-regexp';
import _ from 'lodash';
import moment from 'moment';

import { getIssueTypeList } from '../../../../services/issue/issue-type';
import { getConfigCountryServiceMore, getConfigLangServiceMore } from '../../../../services/common';
import { ISSUE_SUPPORT_PRODUCT } from '../../const';

export default {
  namespace: 'issue_system__issue_statistics',

  state: {
    issueType: [],
    issueTypeDict: {},
    countryAndLang: [],
    langAndCountry: [],
    queryDate: {
      startTime: moment().subtract(1, 'week').startOf('day').toJSON(),
      endTime: moment().endOf('day').toJSON(),
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/issue_system/issue_statistics').exec(pathname);
        if (match) {
          dispatch({ type: 'listInit' });
          dispatch({ type: 'getCountryAndLang' });
        }
      });
    },
  },

  effects: {
    * listInit(actions, { put, call }) {
      const issueTypeRes = yield call(getIssueTypeList, { productId: '' });
      const issueTypeList = issueTypeRes.data.list || [];
      const issueTypeDict = {};

      issueTypeList.forEach((v) => {
        issueTypeDict[v.id] = {
          name: `${
            v.isDelete === 1 ? '(已删除)' : ''
          } (${ISSUE_SUPPORT_PRODUCT[v.productId] || ''}) ${v.title} `,
          isDelete: v.isDelete,
        };
      });
      yield put({
        type: 'saveIssueType',
        payload: {
          data: issueTypeList,
        },
      });

      yield put({
        type: 'saveIssueTypeDict',
        payload: {
          data: issueTypeDict,
        },
      });
    },
    * getIssueTypeList({ payload }, { put, call }) {
      const issueTypeRes = yield call(getIssueTypeList, { ...payload });
      const issueTypeList = issueTypeRes.data.list || [];
      yield put({
        type: 'saveIssueType',
        payload: {
          data: issueTypeList,
        },
      });
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
    * setQueryDate({ payload }, { put }) {
      yield put({
        type: 'saveQueryDate',
        payload,
      });
    },
  },

  reducers: {
    saveIssueType(state, action) {
      return { ...state, issueType: action.payload.data };
    },
    saveIssueTypeDict(state, action) {
      return { ...state, issueTypeDict: action.payload.data };
    },
    setCountryAndLangConfig(state, action) {
      return { ...state, ...action.payload };
    },
    saveQueryDate(state, action) {
      return { ...state, queryDate: { ...action.payload } };
    },
  },
};
