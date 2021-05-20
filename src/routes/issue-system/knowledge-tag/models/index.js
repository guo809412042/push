/* eslint-disable no-restricted-syntax */
import pathToRegexp from 'path-to-regexp';

import {
  getKnowledgeTags,
} from '../../../../services/issue/issue';


export default {
  namespace: 'issueKnowledgeTag',

  state: {
    listData: [],
    loading: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/issue_system/knowledge-tag').exec(pathname);
        if (match) {
          dispatch({ type: 'initList' });
        }
      });
    },
  },

  effects: {
    * initList({ payload }, { put, call }) {
      yield put({ type: 'showListLoading' });
      const res = yield call(getKnowledgeTags, { parentId: 0, ...payload });
      const list = res.data;
      list.map((item) => { item.children = []; });
      yield put({ type: 'saveDataList', payload: { data: list } });
      yield put({ type: 'hideListLoading' });
    },
  },

  reducers: {
    saveDataList(state, action) {
      return { ...state, listData: action.payload.data };
    },
    showListLoading(state) {
      return { ...state, loading: true };
    },
    hideListLoading(state) {
      return { ...state, loading: false };
    },
  },
};
