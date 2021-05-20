import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const { VIVA_USER } = REQUEST_PATH;

export async function createVestUser(data) {
  return request(`/${VIVA_USER}/api/vest/vest_user/`, {
    method: 'post',
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}
