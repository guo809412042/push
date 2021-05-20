import { getIssuetype, downIssuetype } from '../../../../services/issue';

export default {
  namespace: 'issue_manage__issue_type_list',

  state: {
    formFields: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },
    listData: [],
    listLoading: false,
    issueType: [],
    map: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        dispatch({ type: 'app/loginListren' });
        if (pathname === '/issue_manage/issue_type_list') {
          dispatch({ type: 'listInit' });
        }
      });
    },
  },

  effects: {
    * listInit(actions, { put, call, select }) {
      yield put({ type: 'showListLoading' });
      const Store = yield select(state => state.issue_manage__issue_type_list);
      const { data, pagination } = yield call(getIssuetype, {
        ...Store.pagination,
        ...Store.formFields,
      });
      yield put({ type: 'saveDataList', payload: { data } });
      yield put({ type: 'savePagination', payload: { pagination } });
      yield put({ type: 'hideListLoading' });
    },
    * download(actions, { select }) {
      const Store = yield select(state => state.user_manage__user_studio_apply_list);
      downIssuetype({ ...Store.formFields, down: '1' });
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
    saveIssueType(state, action) {
      return { ...state, issueType: action.payload.data };
    },
    showListLoading(state) {
      return { ...state, listLoading: true };
    },
    hideListLoading(state) {
      return { ...state, listLoading: false };
    },
  },
};
