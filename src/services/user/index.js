import qs from 'qs';
import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const { VIVA_USER } = REQUEST_PATH;

export async function queryOnlyUserInfo(params) {
  return request(`/${VIVA_USER}/api/vivavideo/user/query_only_user_info/?${qs.stringify(params)}`);
}
//  获取用户状态日志
export async function getUserStateLogServer(params) {
  return request(`/${VIVA_USER}/api/vivavideo/user/get_user_state_log/?${qs.stringify(params)}`);
}

export async function setUserNotTalk(params) {
  return request(`/${VIVA_USER}/api/vivavideo/user/set_user_not_talk/?${qs.stringify(params)}`);
}

export async function setUserNotTalkOff(params) {
  return request(`/${VIVA_USER}/api/vivavideo/user/set_user_not_talk_off/?${qs.stringify(params)}`);
}

export async function changeUserClass(userclass, pk) {
  const params = {
    auid: pk,
    ...userclass,
  };
  return request(`/${VIVA_USER}/api/vivavideo/user/change_user_class/?${qs.stringify(params)}`);
}

export async function alterUserInfo(params) {
  return request(`/${VIVA_USER}/api/vivavideo/user/alter_user_info/?${qs.stringify(params)}`);
}

export async function userWhiteCreate(params) {
  return request(`/${VIVA_USER}/api/vivavideo/user/user_white_create/?${qs.stringify(params)}`);
}

export async function recommendCreate(params) {
  return request(`/${VIVA_USER}/api/vivavideo/user/recommend_create/?${qs.stringify(params)}`);
}

export async function createExpert(data) {
  return request(`/${VIVA_USER}/api/vivavideo/user/expert/`, {
    method: 'post',
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

export async function getTokenRongyun(auiddigest, userName) {
  const params = {
    user_id: auiddigest,
    userName,
  };
  return request(`/vcmtools/get_rong_token/?${qs.stringify(params)}`);
}

export async function setUserState(state, pk) {
  const { auiddigest, inputValue, ...initParams } = state;
  const reason = inputValue;
  const userState = {
    auiddigest,
    reason,
    ...initParams,
  };
  const params = {
    auid: pk,
    ...userState,
  };
  return request(`/${VIVA_USER}/api/vivavideo/user/set_user_state/?${qs.stringify(params)}`);
}

export async function getDevicesByAuid(params) {
  return request(`/${VIVA_USER}/api/vivavideo/device/getdevicesbyauid/?${qs.stringify(params)}`);
}

export async function updateDeviceState(state, pk) {
  const params = {
    duiddigest: pk,
    ...state,
  };
  return request(`/${VIVA_USER}/api/vivavideo/device/update_device_state/?${qs.stringify(params)}`);
}

export async function setWebUserInfo(data, pk) {
  return request(`/${VIVA_USER}/api/user/web_user_info/${pk}/`, {
    method: 'put',
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

export async function alterUserStudio(data, pk) {
  return request(`/${VIVA_USER}/api/user/user_studio/${pk}/`, {
    method: 'put',
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

// 注销用户
export async function deleteUser(auid) {
  return request(`/user/user_cancel/${auid}/`);
}

export async function getLiveroomIdentifications(userid) {
  return request(`/liveroom/liveroom_identifications/${userid}/`);
}

export async function getLiveroomPhoneVerify(userid) {
  return request(`/liveroom/liveroom_phone_verify/${userid}/`);
}

//  添加到关注页推荐达人列表
export async function addToUserFollowRecommend(data) {
  return request(`/${VIVA_USER}/api/follow_recommend_users/follow_recommend_users/`, {
    method: 'POST',
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

//  一键删除用户所有评论
export async function delUserAllComment(params) {
  return request(`/vcmapi/delete_all_videocomment/?${qs.stringify(params)}`);
}
