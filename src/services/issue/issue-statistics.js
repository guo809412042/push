// import qs from 'qs';
import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const { TOOL_ISSUE } = REQUEST_PATH;

/**
 * 获取平台概况
 * @param data
 * @returns {Promise<*>}
 */
export async function getPlatformOverview(data) {
  return request(`/${TOOL_ISSUE}/api/statistics/platform-overview`, {
    method: 'post',
    data,
  });
}

/**
 * 获取人员概况
 * @param data
 * @returns {Promise<*>}
 */
export async function getStaffOverview(data) {
  return request(`/${TOOL_ISSUE}/api/statistics/staff-overview`, {
    method: 'post',
    data,
  });
}

/**
 * 获取标签统计
 * @param data
 * @returns {Promise<*>}
 */
export async function getTagStatistics(data) {
  return request(`/${TOOL_ISSUE}/api/statistics/tag`, {
    method: 'post',
    data,
  });
}
