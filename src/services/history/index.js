import qs from 'qs';
import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const { TOOL_PYTHON } = REQUEST_PATH;

export async function getUserOpeationLog(params) {
  return request(`/${TOOL_PYTHON}/vcmlog/user_opeation_log/?${qs.stringify(params)}`);
}
