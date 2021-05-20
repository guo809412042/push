import qs from 'qs';
import cookie from 'js-cookie';
import _ from 'lodash';
import moment from 'moment';

import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const user = JSON.parse(cookie.get('user'));
const userId = _.get(user, 'user.id', '');

const { TOOL_ISSUE } = REQUEST_PATH;

/**
 * 获取工单列表
 * @param data
 * @returns {Promise<*>}
 */
export async function getIssueList(data) {
  return request(`/${TOOL_ISSUE}/api/issue/list`, {
    method: 'post',
    data,
  });
}

/**
 * 更新工单信息
 * @param data
 * @returns {Promise<*>}
 */
export async function updateIssue(data) {
  const reqData = Object.assign({
    operateName: userId,
  }, data);
  return request(`/${TOOL_ISSUE}/api/issue/update`, {
    method: 'post',
    data: reqData,
  });
}

/**
 * 客服回复
 * @param data
 * @returns {Promise<*>}
 */
export async function replyIssue(data) {
  const requestData = {
    ...data,
    operatorName: userId,
    serviceModifyTime: new Date(moment().format('YYYY-MM-DD HH:mm:ss')).toISOString(),
  };
  return request(`/${TOOL_ISSUE}/api/issue/reply`, {
    method: 'post',
    body: requestData,
  });
}

/**
 * 获取客服与用户聊天记录
 * @param params
 * @returns {Promise<*>}
 */
export async function getIssueChatLog(params) {
  return request(`/${TOOL_ISSUE}/api/issue/chat-list?${qs.stringify(params)}`, {});
}

export async function createIssueTagRecord(data) {
  try {
    const res = await request(`/${TOOL_ISSUE}/api/issue-tag-record`, {
      method: 'post',
      data,
    });
    return res;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export async function getKnowledgeTags(params) {
  return request(`/${TOOL_ISSUE}/api/issue-knowledge/tags?${qs.stringify(params)}`, {});
}

export async function createKnowledgeTag(data) {
  return request(`/${TOOL_ISSUE}/api/issue-knowledge/create-tag`, {
    method: 'post',
    data,
  });
}

export async function createKnowledge(data) {
  return request(`/${TOOL_ISSUE}/api/issue-knowledge/create`, {
    method: 'post',
    data,
  });
}

export async function updateKnowledge(data) {
  return request(`/${TOOL_ISSUE}/api/issue-knowledge/update`, {
    method: 'post',
    data,
  });
}

export async function deleteKnowledge(id) {
  return request(`/${TOOL_ISSUE}/api/issue-knowledge/delete`, {
    method: 'post',
    body: { id },
  });
}

export async function getKnowledgeList(params) {
  return request(`/${TOOL_ISSUE}/api/issue-knowledge/list?${qs.stringify(params)}`, {});
}

export async function getKnowledgeLogs(knowledgeId) {
  return request(`/${TOOL_ISSUE}/api/issue-knowledge/logs?${qs.stringify({ knowledgeId })}`, {});
}

export async function getIssueLogs(params) {
  return request(`/${TOOL_ISSUE}/api/issue/logs?${qs.stringify(params)}`, {});
}

export async function updateKnowledgeTag(params) {
  return request(`/${TOOL_ISSUE}/api/issue-knowledge/update-tag`, {
    method: 'post',
    body: params,
  });
}

// 获取用户常用搜索列表
export async function getSearhList(params) {
  return request(`/${TOOL_ISSUE}/api/issue-search/list?${qs.stringify(params)}`);
}

// 创建用户常用搜索
export async function createSearch(data) {
  return request(`/${TOOL_ISSUE}/api/issue-search/create`, {
    method: 'post',
    data,
  });
}

// 修改用户常用搜索
export async function editSearch(data) {
  return request(`/${TOOL_ISSUE}/api/issue-search/edit`, {
    method: 'post',
    data,
  });
}

// 删除用户常用搜索
export async function deleteSearch(data) {
  return request(`/${TOOL_ISSUE}/api/issue-search/delete`, {
    method: 'post',
    data,
  });
}

// 设置发票的过期时间
export async function setExpired(data) {
  return request(`/${TOOL_ISSUE}/api/fapiao/expired`, {
    method: 'post',
    data,
  });
}

// 添加到质检
export async function sendIssueToQualityApi(data) {
  return request(`/${TOOL_ISSUE}/api/issue/sendIssueToQuality`, {
    method: 'post',
    data,
  });
}

// 批量添加到质检
export async function batchSendIssueToQualityApi(data) {
  return request(`/${TOOL_ISSUE}/api/issue/sendto-quality/batch`, {
    method: 'post',
    data,
  });
}
