import qs from 'qs';
import request from '../utils/request';
import { REQUEST_PATH } from '../utils/const';

const { COMMON, TOOL_ISSUE } = REQUEST_PATH;

// 获取所有用户id => email
export async function getAllUser() {
  return request(`/${COMMON}/vcmadmin/get-all-user/`);
}

//  获取用户
export async function getUserListServer() {
  return request(`/${COMMON}/vcmadmin/getusers`);
}

export async function cipherTextDecode(params) {
  return request(`/${COMMON}/vcmtools/decode/?${qs.stringify(params)}`);
}

export async function translate(data) {
  return request(`/${TOOL_ISSUE}/api/common/translate2/`, {
    method: 'post',
    data: {
      key: 'AIzaSyDwGYad9CYqz3ivG1ISG4G1YaqDZEh69Zw',
      ...data,
    },
  });
}
