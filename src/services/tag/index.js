import qs from 'qs';
import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const { VIVA_USER, VIVA_VIDEO } = REQUEST_PATH;

export async function getAllTags(node = 0, recommend = '') {
  return request(
    `/${VIVA_USER}/api/vivavideo/tag/get_all_node/?node=${node}&recommend=${recommend}`,
  );
}

export async function getUserExistTags(params) {
  return request(`/${VIVA_USER}/api/vivavideo/tag/get_tag_info_by_user/?${qs.stringify(params)}`);
}

export async function getVideoExistTags(params) {
  return request(`/${VIVA_USER}/api/vivavideo/tag/get_tag_info_by_video/?${qs.stringify(params)}`);
}

export async function getVideoExistEffectTags(params) {
  return request(`/${VIVA_VIDEO}/api/video/video_tag_predict?${qs.stringify(params)}`);
}

export async function setTagToUser(params) {
  return request(`/${VIVA_USER}/api/vivavideo/tag/set_tag_to_user/?${qs.stringify(params)}`);
}

export async function setTagToVideo(params) {
  return request(`/${VIVA_USER}/api/vivavideo/tag/set_tag_to_video/?${qs.stringify(params)}`);
}

//  记录打标签操作
export async function saveLogServer(params) {
  return request(`/${VIVA_USER}/api/vivavideo/tag/add_video_tag_log/?${qs.stringify(params)}`);
}
