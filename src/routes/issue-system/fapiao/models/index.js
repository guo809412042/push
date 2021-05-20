import pathToRegexp from 'path-to-regexp';
import { getList } from '../../../../services/fapiao';

export default {
  namespace: 'issue_system_fapiao',

  state: {
    formFields: {
      productId: '',
      platform: '',
      status: '',
      type: '',
      title: [],
      orderId: [],
      taxNumber: [],
      email: [],
    },
    pagination: {
      current: 1,
      pageSize: 10,
    },

    dataList: [],
    loading: false,
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/issue_system/fapiao').exec(pathname);
        if (match) {
          dispatch({ type: 'initList' });
        }
      });
    },
  },

  effects: {
    * initList(actions, { put, call, select }) {
      yield put({ type: 'showLoading' });
      const { formFields } = yield select(state => state.issue_system_fapiao);
      const { code, data } = yield call(getList, { ...formFields });
      if (code !== 20000) {
        yield put({ type: 'hideLoading' });
        return;
      }
      yield put({ type: 'saveDataList', payload: data.rows });
      yield put({ type: 'hideLoading' });
      yield put({ type: 'clearRowKeys' });
    },
    * search({ payload }, { put }) {
      yield put({ type: 'saveFormFields', payload });
      yield put({ type: 'initList' });
    },
  },

  reducers: {
    saveFormFields(state, action) {
      return { ...state, formFields: action.payload };
    },
    saveDataList(state, action) {
      return { ...state, dataList: action.payload };
    },
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    saveRowKeys(state, action) {
      return { ...state, selectedRowKeys: action.payload };
    },
    clearRowKeys(state) {
      return { ...state, selectedRowKeys: [] };
    },
  },
};
