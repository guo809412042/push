import qs from 'qs';
import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const { TOOL_ISSUE } = REQUEST_PATH;

/**
 * 获取标签列表
 * @param params
 * @returns {Promise<*>}
 */
export async function getIssueTagList(params) {
  // FIXME: 标签所有产品公用一套,但设计时有区分产品, 所以为了让所有产品用通一套标签, 默认把 productId 设置为 2
  return request(`/${TOOL_ISSUE}/api/issue-tag/list/?${qs.stringify(params)}`);
}

/**
 * 创建标签
 * @param data
 * @returns {Promise<*>}
 */
export async function createIssueTag(data) {
  // FIXME: 标签所有产品公用一套,但设计时有区分产品, 所以为了让所有产品用通一套标签, 默认把 productId 设置为 2
  const bodyData = { productId: 2, ...data };
  return request(`/${TOOL_ISSUE}/api/issue-tag`, {
    method: 'post',
    body: bodyData,
  });
}

/**
 * 更新标签
 * @param data
 * @returns {Promise<*>}
 */
export async function updateIssueTag(data) {
  // FIXME: 标签所有产品公用一套,但设计时有区分产品, 所以为了让所有产品用通一套标签, 默认把 productId 设置为 2
  const bodyData = { productId: 2, ...data };
  return request(`/${TOOL_ISSUE}/api/issue-tag`, {
    method: 'put',
    body: bodyData,
  });
}

/**
 * 删除标签
 * @param id
 * @param params
 * @returns {Promise<*>}
 */
export async function removeIssueTag(id, params = { productId: 2 }) {
  // FIXME: 标签所有产品公用一套,但设计时有区分产品, 所以为了让所有产品用通一套标签, 默认把 productId 设置为 2
  return request(`/${TOOL_ISSUE}/api/issue-tag/${id}?${qs.stringify(params)}`, {
    method: 'delete',
  });
}
