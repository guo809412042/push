import cookie from 'js-cookie';
import { getAllUser, getUserListServer } from '../services/app';

import { getProductId } from '../utils/utils';

const Log = console;
export default {
  namespace: 'app',
  state: {
    loading: false,
    user: JSON.parse(cookie.get('user') || localStorage.getItem('user')),
    config: '',
    menuArr: [],
    centerDataMenu: [],
    users: [],
    allUser: {},
    product: getProductId(),
    user_dict: {},
    message: '维护中...请等待..',
  },
  subscriptions: {
    setup({ dispatch }) {
      window.localStorage.setItem('app_channel', cookie.get('app_channel') || '');
      dispatch({ type: 'initApp' });
    },
  },
  effects: {
    * initApp(action, { call, put }) {
      try {
        const { data: users = [] } = yield call(getUserListServer);
        const { data: allUsers = [] } = yield call(getAllUser);

        const allUserMap = {};
        const userMap = {};

        // alluser save
        allUsers.forEach((user) => {
          allUserMap[user.id] = user.username;
        });
        yield put({ type: 'save', payload: { user_dict: allUserMap, allUser: allUserMap } });

        // users save
        users.forEach((v) => {
          userMap[v.id] = v;
        });
        yield put({ type: 'save', payload: { users, userMap } });
      } catch (error) {
        Log.error(error);
      }

      yield put({ type: 'getProductDomain' });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
