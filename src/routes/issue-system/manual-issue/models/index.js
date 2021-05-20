import pathToRegexp from 'path-to-regexp';
import _, { isArray } from 'lodash';
import qs from 'qs';
import moment from 'moment';

import { getIssueList } from '../../../../services/issue/issue';
import { getIssueTagList } from '../../../../services/issue/issue-tag';
import { getIssueTypeList } from '../../../../services/issue/issue-type';
import {
  getAppVerServer,
  getConfigCountryServiceMore,
  getConfigLangServiceMore,
} from '../../../../services/common';

import { ISSUE_STATUS_CODE } from '../../const';

import { getProductId } from '../../../../utils/utils';

export default {
  namespace: 'issue_system__manual_issue',

  state: {
    formFields: {
      productId: getProductId(),
      issueState: String(ISSUE_STATUS_CODE.PENDING_ASSIGN),
      startTime: '',
      endTime: '',
    },
    pagination: {
      current: 1,
      pageSize: 10,
    },
    listData: [],
    listLoading: false,
    issueTag: [],
    issueType: [],
    androidAppVersions: [],
    iosAppVersions: [],
    countryAndLang: [],
    langAndCountry: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const match = pathToRegexp('/issue_system/manual_issue').exec(pathname);
        if (match) {
          if (search) {
            const {
              duiddigest = '',
              issueTypeId = '',
              startTime = '',
              endTime = '',
              productId = getProductId(),
              issueId = '',
              issueState = '1',
            } = qs.parse(search.substr(1));
            dispatch({
              type: 'saveFormFields',
              payload: {
                data: {
                  duiddigest,
                  issueTypeId,
                  startTime: startTime && moment(startTime),
                  endTime: endTime && moment(endTime),
                  productId,
                  issueId,
                  ...( +issueState === -1 ? { } : { issueState } )
                },
              },
            });
          }
          dispatch({ type: 'listInit' });
          dispatch({ type: 'getAppVersions' });
          dispatch({ type: 'getCountryAndLang' });
        }
      });
    },
  },

  effects: {
    // 初始化表单
    * listInit(actions, { put, call, select }) {
      yield put({ type: 'showListLoading' });
      // select 可以获取到 state 中定义的所有属性
      const Store = yield select(state => state.issue_system__manual_issue);
      // 处理搜索内容回填问题
      const appKey = Store.formFields.appKey;

      const queryData = {
        ...Store.pagination,
        ...Store.formFields,
        appKey: appKey && isArray(appKey) ? appKey[1] : '',
      };
      const issueListRes = yield call(getIssueList, queryData);
      yield put({ type: 'saveDataList', payload: { data: issueListRes.data.list } });
      yield put({ type: 'savePagination', payload: { pagination: issueListRes.data.pagination } });
      yield put({ type: 'hideListLoading' });
      const issueTypeRes = yield call(getIssueTypeList, {
        productId: Store.formFields.productId,
        isDelete: 0,
      });
      yield put({
        type: 'saveIssueType',
        payload: {
          data: issueTypeRes.data.list || [],
        },
      });
      const productId = Store.formFields.productId;
      const issueTagRes = yield call(getIssueTagList, { isDelete: 0, productId });
      yield put({
        type: 'saveIssueTag',
        payload: {
          data: issueTagRes.data.list || [],
        },
      });
    },

    //获取 app的版本号
    * getAppVersions(action, { put, call, all }) {
      // all 里面可以多个 call去请求异步任务
      const [androidAppVersions, iosAppVersions] = yield all([
        call(getAppVerServer, 1),
        call(getAppVerServer, 2),
      ]);
      yield put({
        type: 'setAndroidAppVersions',
        payload: androidAppVersions,
      });
      yield put({
        type: 'setIosAppVersions',
        payload: iosAppVersions,
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
    saveIssueTag(state, action) {
      return { ...state, issueTag: action.payload.data };
    },
    showListLoading(state) {
      return { ...state, listLoading: true };
    },
    hideListLoading(state) {
      return { ...state, listLoading: false };
    },
    setAndroidAppVersions(state, action) {
      return { ...state, androidAppVersions: action.payload };
    },
    setIosAppVersions(state, action) {
      return { ...state, iosAppVersions: action.payload };
    },
    setCountryAndLangConfig(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
