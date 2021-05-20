import _ from 'lodash';

import { getIssueTypeList } from '../../../../services/issue/issue-type';
import { getConfigLangServiceMore, getConfigCountryServiceMore } from '../../../../services/common';

import { getProductId } from '../../../../utils/utils';

export default {
  namespace: 'issue_system__reply_config',

  state: {
    formFields: {
      productId: getProductId(),
      isDelete: 0, // 正常
    },
    listData: [],
    listLoading: false,
    titles: [],
    countryAndLang: [],
    langAndCountry: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/issue_system/reply_config') {
          dispatch({ type: 'listInit' });
          dispatch({ type: 'getCountryAndLang' });
        }
      });
    },
  },

  effects: {
    * listInit(actions, { put, call, select }) {
      yield put({ type: 'showListLoading' });
      const Store = yield select(state => state.issue_system__reply_config);
      const issueTypeRes = yield call(getIssueTypeList, { ...Store.formFields, isDelete: 0 });
      const list = issueTypeRes.data.list;
      const titles = [...new Set(list.map(v => v.title))];
      yield put({
        type: 'setTitles',
        payload: titles,
      });
      yield put({ type: 'saveDataList', payload: { data: list } });
      yield put({ type: 'hideListLoading' });
    },
    * search(actions, { put, call, select }) {
      yield put({ type: 'showListLoading' });
      yield put({
        type: 'saveFormFields',
        payload: actions.payload,
      });
      const Store = yield select(state => state.issue_system__reply_config);
      // title 字段有前端过滤实现
      const { title } = Store.formFields;
      const issueTypeRes = yield call(getIssueTypeList, { ...Store.formFields, isDelete: 0 });
      let list = issueTypeRes.data.list;
      const titles = [...new Set(list.map(v => v.title))];
      yield put({
        type: 'setTitles',
        payload: titles,
      });
      if (title) {
        list = list.filter(v => v.title === title);
      }
      yield put({ type: 'saveDataList', payload: { data: list } });
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
    saveDataList(state, action) {
      return { ...state, listData: action.payload.data };
    },
    setTitles(state, action) {
      return { ...state, titles: action.payload };
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
