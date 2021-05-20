import { DEFAULT_TAG_TYPE } from './const';

export const parseCountryAndLang = (params) => {
  if (!params) {
    return {};
  }
  let dataArray = [];
  if (params[0].includes('|')) {
    dataArray = params.map(v => v.split('|')[1]);
    return { lang: JSON.stringify(dataArray) };
  }
  return { country_code: JSON.stringify(params) };
};

/**
 *    查看是否有当前渠道的操作权限
 *    @param   current_channel   当前渠道
 *
 */
export const checkPowerOfChannel = (currentChannel) => {
  const channelPower = localStorage.getItem('app_channel');
  return !channelPower || channelPower.split(',').includes(currentChannel);
};

//  ab_test创建时对值进行校验
export const check_ab_test_value = (values, my_editor) => {
  console.log('values', values);
  let referencenum = 0;

  let eventList = [];

  const equationList = [];
  // eslint-disable-next-line
  for (const key in values) {
    if (key.indexOf('keys') !== -1) {
      values[key] = undefined;
    }
    if (key.indexOf('groupid') !== -1) {
      values[key] = values[key] ? values[key].Trim() : '';
    }
    if (key.indexOf('920_snsTypeList') !== -1) {
      values[key] = JSON.stringify(values[key]);
    }
    //  活动列表中用的
    if (key.indexOf('detail') !== -1 && my_editor) {
      values[key] = my_editor[key.split('-')[1]].getData();
    }
    if (key.indexOf('keyword') !== -1) {
      values[key] = values[key].Trim();
    }
    if (key.indexOf('joinFlag') !== -1) {
      values[`extend-${key.split('-')[1]}`] = JSON.stringify({
        joinFlag: values[key],
        forwardFlag: values[`forwardFlag-${key.split('-')[1]}`],
        videoList: values[`videoList-${key.split('-')[1]}`],
        webviewurl: values[`webviewurl-${key.split('-')[1]}`]
          ? values[`webviewurl-${key.split('-')[1]}`].Trim()
          : '',
      });
    }
    if (key.indexOf('bgStartColor') !== -1) {
      values[`extend-${key.split('-')[1]}`] = JSON.stringify({
        textColor: values[`textColor-${key.split('-')[1]}`],
        bgEndColor: values[`bgEndColor-${key.split('-')[1]}`],
        bgStartColor: values[`bgStartColor-${key.split('-')[1]}`],
      });
    }
    if (key.includes('abevent__') || key.includes('abeventother__')) {
      const index = key.split('__')[1];
      if (key.indexOf('abeventother__') !== -1) {
        const eventParams = [];
        Object.keys(values).forEach((paramskey) => {
          if (paramskey.includes(`abeventotherparamskey__${index}`)) {
            const piteminex = parseInt(paramskey.split('__')[1], 10);
            const pindex = paramskey.split('/')[1];
            const pobj = {};
            pobj[values[paramskey]] = values[`abeventotherparamsvalue__${piteminex}/${pindex}`];
            eventParams.push(pobj);
          }
        });
        const operator_type = `operator_type_other__${index}`;
        eventList.push(`${values[key]}-${values[operator_type]}-${JSON.stringify(eventParams)}`);
      } else {
        const eventParams = [];
        Object.keys(values).forEach((paramskey) => {
          if (paramskey.includes(`abeventparamskey__${index}`)) {
            const piteminex = parseInt(paramskey.split('__')[1], 10);
            const pindex = paramskey.split('/')[1];
            const pobj = {};
            pobj[values[paramskey]] = values[`abeventparamsvalue__${piteminex}/${pindex}`];
            eventParams.push(pobj);
          }
        });
        const operator_type = `operator_type__${index}`;
        eventList.push(`${values[key]}-${values[operator_type]}-${JSON.stringify(eventParams)}`);
      }
    }
    if (key.includes('denominator__')) {
      const index = key.split('__')[1];
      let compute_type = 0;
      if (
        (values[`molecular__${index}`] === values[key] || values[key] === 'active_user')
        && values[`molecular_type__${index}`] === 'pv'
      ) {
        compute_type = 1;
      }
      const eventParams = [];
      const moleculareventParams = [];
      Object.keys(values).forEach((paramskey) => {
        if (paramskey.includes(`denominatorparamskey__${index}`)) {
          const piteminex = parseInt(paramskey.split('__')[1], 10);
          const pindex = paramskey.split('/')[1];
          const pobj = {};
          pobj[values[paramskey]] = values[`denominatorparamsvalue__${piteminex}/${pindex}`];
          eventParams.push(pobj);
        } else if (paramskey.includes(`molecularparamskey__${index}`)) {
          const piteminex = parseInt(paramskey.split('__')[1], 10);
          const pindex = paramskey.split('/')[1];
          const pobj = {};
          pobj[values[paramskey]] = values[`molecularparamsvalue__${piteminex}/${pindex}`];
          moleculareventParams.push(pobj);
        }
      });
      equationList.push({
        operator: 'divide',
        denominator: values[key],
        denominator_type: values[`denominator_type__${index}`],
        molecular_type: values[`molecular_type__${index}`],
        molecular: values[`molecular__${index}`],
        denominator_event_params: eventParams,
        molecular_event_params: moleculareventParams,
        compute_type,
      });
    }
    if (key.indexOf('bgStartColor') !== -1) {
      values[`extend-${key.split('-')[1]}`] = JSON.stringify({
        textColor: values[`textColor-${key.split('-')[1]}`],
        bgEndColor: values[`bgEndColor-${key.split('-')[1]}`],
        bgStartColor: values[`bgStartColor-${key.split('-')[1]}`],
      });
    }
    //  对标设置
    if (key.indexOf('reference-') !== -1 && values[key] === '1') {
      referencenum += 1;
    }
  }
  for (let index = 0; index < equationList.length; index++) {
    const element = equationList[index];
    eventList.push(
      `${element.denominator}-${element.denominator_type}-${JSON.stringify(
        element.denominator_event_params,
      )}`,
    );
    eventList.push(
      `${element.molecular}-${element.molecular_type}-${JSON.stringify(
        element.molecular_event_params,
      )}`,
    );
  }
  const set = new Set(eventList);
  eventList = Array.from(set);
  const eventListExtend = [];
  for (let index = 0; index < eventList.length; index++) {
    const element = eventList[index];
    if (element.indexOf('active_user-') === -1) {
      eventListExtend.push(element);
    }
  }
  const extend = { eventList: eventListExtend, equationList };
  if (referencenum > 1) {
    //  ab 标杆只能唯一
    return {
      data: values,
      status: false,
      msg: '请选择唯一标杆',
    };
  }
  if (values.condition) {
    if (values.condition.type) {
      //  新的tag，需要验证：区间不能有交集
      values.tag_type = values.condition.value;
    } else {
      values.tag_type = DEFAULT_TAG_TYPE;
    }
  }
  values.extend = extend;
  return {
    data: values,
    status: true,
  };
};
