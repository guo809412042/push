import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const { COMMON, GETAWAY_PYTHON } = REQUEST_PATH;

export async function getCountryAndLang() {
  // 根据国家获取语言
  return request(`/${GETAWAY_PYTHON}/regioncountry/get_country_and_lang/`);
}

export async function getCountryGroup() {
  // 获取目前 社区 对应 group 关系
  return request(`/${COMMON}/regioncountry/get_country_group/`);
}
