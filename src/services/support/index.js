import qs from 'qs';
import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const { COMMON } = REQUEST_PATH;

export async function getappinfobyplatformNew(params) {
  // 根据平台获取版本信息
  return request(`/${COMMON}/support/getappinfobyplatform/?${qs.stringify(params)}`);
}
