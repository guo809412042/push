import qs from 'qs';
import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const { TOOL_ISSUE } = REQUEST_PATH;

/**
 * 获取发票列表
 * @param {Object} data
 */
export const getList = async data => request(`/${TOOL_ISSUE}/api/fapiao/list?${qs.stringify(data)}`, {});

/**
 * 修改状态
 * @param {*} data
 */
export const edit = async data => request(`/${TOOL_ISSUE}/api/fapiao/edit`, {
  method: 'post',
  data,
});

/**
 * 批量创建
 * @param {*} data
 */
export const bulkCreate = async data => request(`/${TOOL_ISSUE}/api/fapiao/bulk-create`, {
  method: 'post',
  data,
});
