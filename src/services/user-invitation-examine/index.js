import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const { TOOL_PYTHON } = REQUEST_PATH;

//  创作用户
export async function addUserPowerServer(params) {
  return request(`/${TOOL_PYTHON}/user/user_power/`, {
    method: 'post',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

//  删除用户
export async function delCustomerCreatorUser(auid) {
  return request(`/${TOOL_PYTHON}/user/user_power/${auid}/`, {
    method: 'delete',
    body: { auid },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

//  删除设备
export async function delDevice(duid) {
  return request(`/${TOOL_PYTHON}/vivavideo/device/delete_device_power/?duid=${duid}`);
}
