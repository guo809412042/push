import qs from 'qs';
import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const { TOOL_ISSUE } = REQUEST_PATH;

/**
 * 获取问题类型列表
 * @param params
 * @returns {Promise<*>}
 */
export async function getIssueTypeList(params) {
  return request(`/${TOOL_ISSUE}/api/issue-type/list/?${qs.stringify(params)}`, {
    cleanEmptyData: false,
  });
}

/**
 * 创建问题类型
 * @param data
 * @returns {Promise<*>}
 */
export async function createIssueType(data) {
  return request(`/${TOOL_ISSUE}/api/issue-type`, {
    method: 'post',
    data,
  });
}

/**
 * 更新问题类型
 * @param data
 * @returns {Promise<*>}
 */
export async function updateIssueType(data) {
  return request(`/${TOOL_ISSUE}/api/issue-type`, {
    method: 'put',
    data,
  });
}

/**
 * 删除问题类型
 * @param id
 * @param params
 * @returns {Promise<*>}
 */
export async function removeIssueType(id, params = {}) {
  return request(`/${TOOL_ISSUE}/api/issue-type/${id}?${qs.stringify(params)}`, {
    method: 'delete',
  });
}
