/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';

import { getKnowledgeList } from '../../../../services/issue/issue';

export default {
  namespace: 'issue_system__knowledge',

  state: {
    formFields: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },
    listData: [],
    listLoading: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/issue_system/knowledge').exec(pathname);
        if (match) {
          dispatch({ type: 'listInit' });
        }
      });
    },
  },

  effects: {
    * listInit(actions, { put, call, select }) {
      yield put({ type: 'showListLoading' });
      const Store = yield select(state => state.issue_system__knowledge);
      const knowledgeListRes = yield call(getKnowledgeList, {
        ...Store.pagination,
        ...Store.formFields,
      });
      yield put({ type: 'saveDataList', payload: { data: knowledgeListRes.data.list } });
      yield put({
        type: 'savePagination',
        payload: { pagination: knowledgeListRes.data.pagination },
      });
      yield put({ type: 'hideListLoading' });
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
    showListLoading(state) {
      return { ...state, listLoading: true };
    },
    hideListLoading(state) {
      return { ...state, listLoading: false };
    },
  },
};
