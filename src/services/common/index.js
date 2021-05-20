import qs from 'qs';
import request from '../../utils/request';

import { channel2en, lang2en } from '../../utils/utils';
import { REQUEST_PATH } from '../../utils/const';

const { COMMON, GETAWAY_PYTHON } = REQUEST_PATH;

//  获取配置语言
export async function getConfigLangService() {
  return request(`/${COMMON}/regioncountry/getlangselect/`);
}

//  获取配置国家
export async function getConfigCountryService() {
  const data = await request(`/${COMMON}/regioncountry/getcountrychoice/`);
  return channel2en(data);
}

//  国家改变获取语言
export async function getLangByCountryService(params) {
  const data = await request(
    `/${COMMON}/regioncountry/getlangsbyregionandcountrycodechoice/?${qs.stringify(params)}`,
  );
  return lang2en(data);
}
//  语言改变获取国家
export async function getCountryByLangService(params) {
  return request(
    `/${COMMON}/regioncountry/getcountrysbyregionandlangchoice/?${qs.stringify(params)}`,
  );
}

//  获取配置语言
export async function getConfigLangServiceMore() {
  return request(`/${COMMON}/regioncountry/get_lang_and_country/`);
}

//  获取配置国家
export async function getConfigCountryServiceMore() {
  return request(`/${COMMON}/regioncountry/get_country_and_lang/`);
}

// 获取App列表
export async function getAppVerServer(param) {
  return request(`/${COMMON}/support/getappinfobyplatform/?platform=${param}`);
}

//  获取事件数据源
export async function getEventSourceServer(params) {
  return request(`/${COMMON}/support/get_event_param_data/?${qs.stringify(params)}`);
}

//  获取表格数据
export async function getTableListServer(params) {
  return request(`/${COMMON}/vcmadmin/getusers/?${qs.stringify(params)}`);
}

export async function getEventChild(params) {
  const data = await request(`/${COMMON}/support/geteventchild/?${qs.stringify(params)}`);
  return channel2en(data);
}

export async function getevent() {
  const data = await request(`/${COMMON}/support/getevent/`);
  return channel2en(data);
}
