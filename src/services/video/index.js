import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const { VIVA_USER } = REQUEST_PATH;

export async function alterVideo(params, puid, ver) {
  return request(`/${VIVA_USER}/api/video/video_publish/${puid}/${ver}/`, {
    method: 'put',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}
