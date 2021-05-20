import qs from 'qs';
import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const { TOOL_PYTHON } = REQUEST_PATH;

export async function createIssueType(data) {
  return request(`/${TOOL_PYTHON}/issue_support/issue_type/`, {
    method: 'post',
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

export async function getIssuetype(params) {
  return request(`/${TOOL_PYTHON}/issue_support/issue_type/?${qs.stringify(params)}`);
}

export async function downIssuetype(params) {
  window.location = `/${TOOL_PYTHON}/issue_support/issue_type/?${qs.stringify(params)}`;
}

export async function alterIssueType(data, pk) {
  return request(`/${TOOL_PYTHON}/issue_support/issue_type/${pk}/`, {
    method: 'put',
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}
