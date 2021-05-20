import qs from 'qs';
import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const { VIVA_USER, TOOL_PYTHON } = REQUEST_PATH;

export async function getQualityUserGrade(params) {
  return request(`/${TOOL_PYTHON}/quality_user/quality_user_grade/?${qs.stringify(params)}`);
}

export async function setUserBadge(auidObj, params) {
  const obj = Object.assign({}, auidObj, params);
  return request(`/${VIVA_USER}/api/vivavideo/user/set_user_badge/`, {
    method: 'post',
    body: obj,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

export async function deleteUserBadge(auidObj, params) {
  const obj = Object.assign({}, auidObj, params);
  return request(`/${VIVA_USER}/api/vivavideo/user/delete_user_badge/?${qs.stringify(obj)}`);
}

export async function getUserLogin(data) {
  return request(`/${VIVA_USER}/api/get_user_login/get_user_login/`, {
    method: 'POST',
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

export async function creatorHotBlacklist(data) {
  return request('/hot_blacklist/creator_hot_blacklist/', {
    method: 'POST',
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}
