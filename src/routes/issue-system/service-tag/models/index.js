import { getIssueTagList } from '../../../../services/issue/issue-tag';
import { getProductId } from '../../../../utils/utils';

export default {
  namespace: 'issue_system__service_tag',

  state: {
    formFields: {
      productId: getProductId(),
    },
    listData: [],
    listLoading: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/issue_system/service_tag') {
          dispatch({ type: 'listInit' });
        }
      });
    },
  },

  effects: {
    * listInit(actions, { put, call, select }) {
      const Store = yield select(state => state.issue_system__service_tag);
      const productId = Store.formFields.productId;
      yield put({ type: 'showListLoading' });
      const issueTagRes = yield call(getIssueTagList, { isDelete: 0, productId });
      yield put({ type: 'saveDataList', payload: { data: issueTagRes.data.list } });
      yield put({ type: 'hideListLoading' });
    },

    * searchTag(actions, { put, call }) {
      const { productId } = actions.payload.data;
      yield put({ type: 'showListLoading' });
      const issueTagRes = yield call(getIssueTagList, { isDelete: 0, productId });
      const { text } = actions.payload.data;
      const list = issueTagRes.data.list.filter(tags => Object.keys(tags)
        .map(k => String(tags[k]))
        .some(t => t.indexOf(text) !== -1));
      yield put({ type: 'saveDataList', payload: { data: list } });
      yield put({ type: 'hideListLoading' });
    },

    * changeProductId(actions, { put }) {
      const productId = actions.payload.productId;
      yield put({ type: 'saveProductId', payload: { productId } });
    },
  },

  reducers: {
    saveDataList(state, action) {
      return { ...state, listData: action.payload.data };
    },
    saveProductId(state, action) {
      return { ...state, formFields: { ...state.formFields, productId: action.payload.productId } };
    },
    showListLoading(state) {
      return { ...state, listLoading: true };
    },
    hideListLoading(state) {
      return { ...state, listLoading: false };
    },
  },
};
