import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import _ from 'lodash';
import cookie from 'js-cookie';
import fetchJsonp from 'fetch-jsonp';
import XLSX from 'xlsx';
import { Popover } from 'antd';

export const clearCookies = () => {
  const keys = document.cookie.match(/[^ =;]+(?==)/g);
  if (keys) {
    keys.forEach((key) => {
      document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
  }
};

export const getLang = () => cookie.get('lang') || localStorage.getItem('lang') || 'zh-Hans-CN';

export const getJsonp = url => new Promise((resolve, reject) => {
  fetchJsonp(url, {
    jsonpCallback: 'callback',
  })
    .then(response => response.json())
    .then((vdetail) => {
      resolve(vdetail);
    })
    .catch((error) => {
      reject(error);
    });
});

// 英文环境下渠道用英文文案
export const channel2en = (channelList) => {
  const lang = window.localStorage.getItem('lang') || 'zh-Hans-CN';
  if (lang !== 'zh-Hans-CN') {
    channelList = channelList.map((item) => {
      item.value = item.enValue;
      return item;
    });
  }
  return channelList;
};

// 英文环境下语言用英文文案
export const lang2en = (langList) => {
  const lang = window.localStorage.getItem('lang') || 'zh-Hans-CN';
  if (lang !== 'zh-Hans-CN') {
    langList = langList.map((item) => {
      item.langname = item.langenname;
      return item;
    });
  }
  return langList;
};

const getParameterByName = (name, url) => {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);

  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const JSONToCSVConvertor = (
  JSONData,
  ReportTitle = '',
  ShowLabel = true,
  LabelMap = false,
  TimeToDate = false,
) => {
  // If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  const arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;

  let CSV = '';
  // Set Report title in first row or line
  if (ReportTitle) {
    CSV += `${ReportTitle}\r\n\n`;
  }

  const arrLabel = [];

  // This condition will generate the Label/Header
  if (ShowLabel) {
    let row = '';
    for (const i in arrData) {
      if (Object.prototype.hasOwnProperty.call(arrData, i)) {
        for (const index in arrData[i]) {
          if (Object.prototype.hasOwnProperty.call(arrData[i], index)) {
            if (!arrLabel.includes(index)) {
              arrLabel.push(index);
            }
          }
        }
      }
    }
    // arrLabel = arrLabel.sort();

    // This loop will extract the label from 1st index of on array
    for (const index of arrLabel) {
      // Now convert each value to string and comma-seprated
      if (LabelMap && LabelMap[index]) {
        row += `${LabelMap[index]},`;
      } else {
        row += `${index},`;
      }
    }

    row = row.slice(0, -1);

    // append Label row with line break
    CSV += `${row}\r\n`;
  }

  // 1st loop is to extract each row
  for (const i in arrData) {
    if (Object.prototype.hasOwnProperty.call(arrData, i)) {
      let row = '';

      // 2nd loop will extract each column and convert it in string comma-seprated
      for (const index of arrLabel) {
        if (Object.prototype.hasOwnProperty.call(arrData[i], index)) {
          if (TimeToDate && index === TimeToDate) {
            if (arrData[i][index] > 148782922600) {
              row += `"${moment.unix(arrData[i][index] / 1000).format('YYYY-MM-DD hh:mm')}",`;
            } else {
              row += `"${moment.unix(arrData[i][index]).format('YYYY-MM-DD hh:mm')}",`;
            }
          } else {
            row += `"${arrData[i][index]}",`;
          }
        } else {
          row += '" ",';
        }
      }
      row.slice(0, row.length - 1);

      // add a line break after each row
      CSV += `${row}\r\n`;
    }
  }

  if (CSV === '') {
    alert('Invalid data');
    return;
  }

  // Generate a file name
  let fileName = 'Report_';
  // this will remove the blank-spaces from the title and replace it with an underscore
  fileName += ReportTitle.replace(/ /g, '_');

  // Initialize file format you want csv or xls
  const uri = `data:text/csv;charset=utf-8,${encodeURI(CSV)}`;

  // Now the little tricky part.
  // you can use either>> window.open(uri);
  // but this will not work in some browsers
  // or you will not get the correct file extension

  // this trick will generate a temp <a /> tag
  const link = document.createElement('a');
  link.href = uri;

  // set the visibility hidden so it will not effect on your web-layout
  link.style = 'visibility:hidden';
  link.download = `${fileName}.csv`;

  // this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
/* 生日转换为星座
/* @param mon 月份
/* @param day 日份（1-31）
/* @return string 对应日期生日的星座字符串
* */

function constellation(mon, day) {
  const s = '魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯';

  const d = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];

  const i = mon * 2 - (day < d[mon - 1] ? 2 : 0);

  return `${s.substring(i, i + 2)}座`;
}

const hexDigits = 'Xz75qh84fogl9abCdeIjk2nPr3s6T1Umv0wy';

export const digest2id = (digest) => {
  if (!digest) return 0;
  let id = 0;
  if (digest.length === 0) {
    return id;
  }
  const lowHexDigits = hexDigits.toLowerCase();
  digest = digest.toLowerCase();
  const dl = digest.length;

  let i = 0;
  while (i < dl) {
    const intIndexof = lowHexDigits.indexOf(digest[i]);
    const intBon = dl - 1 - i;
    id += Math.pow(lowHexDigits.length, intBon) * intIndexof;
    i += 1;
  }

  return id;
};

export const id2digest = (id) => {
  let strValue = '';
  const l = hexDigits.length;
  while (id !== 0) {
    const intRem = id % l;
    strValue = hexDigits[intRem] + strValue;
    id = parseInt(id / l, 10);
  }

  return strValue;
};

export const setHeader = (options) => {
  if (!options.headers) {
    options.headers = {};
  }
  if (localStorage.getItem('PRODUCT_ID')) {
    options.headers['x-gateway-product'] = localStorage.getItem('PRODUCT_ID');
  }
  if (localStorage.getItem('project_type')) {
    options.headers['x-gateway-project'] = localStorage.getItem('project_type');
  }
  if (localStorage.getItem('group_id')) {
    options.headers['x-gateway-group'] = localStorage.getItem('group_id');
  }
  if (localStorage.getItem('country_code')) {
    options.headers['x-gateway-country'] = localStorage.getItem('country_code');
  }
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const ObjectToArray = (obj, key = 'key', value = 'value') => {
  const array = [];
  _.forIn(obj, (index, item) => {
    if (isFinite(index)) {
      const ele = {};
      ele[key] = index;
      ele[value] = item;
      array.push(ele);
    }
  });
  return array;
};

export const ObjectMapToArray = (obj, key = 'key', value = 'value') => {
  const array = [];
  _.forIn(obj, (index, item) => {
    if (isFinite(index)) {
      const ele = {};
      ele[key] = index;
      ele[value] = item;
      array.push(ele);
    }
  });
  return array;
};

export const ArrayToObject = (arr, key = 'key', value = 'value') => {
  const map = {};
  arr.forEach((v) => {
    map[v[key]] = v[value];
  });
  return map;
};

export const objectGetValue = (obj, key) => {
  let res = key;
  for (const k in obj) {
    if (k === key) {
      res = obj[k];
      break;
    }
  }
  return res;
};
export const translate = (arr, key) => {
  let res = key;
  arr.forEach((item) => {
    if (item.key === key) {
      res = item.value;
    }
  });
  return res;
};
export const formatDateTime = (inputTime) => {
  const date = new Date(inputTime);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? `0${m}` : m;
  let d = date.getDate();
  d = d < 10 ? `0${d}` : d;
  let h = date.getHours();
  h = h < 10 ? `0${h}` : h;
  let minute = date.getMinutes();
  let second = date.getSeconds();
  minute = minute < 10 ? `0${minute}` : minute;
  second = second < 10 ? `0${second}` : second;
  return `${y}-${m}-${d} ${h}:${minute}:${second}`;
};

/**
 *
 * 去掉所有的html标记
 * @param {string} str
 * @returns {string}
 */
export const delHtmlTag = (str) => {
  str = str.replace(/&gt;/g, '>');
  str = str.replace(/&lt;/g, '<');
  return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '');
};

export const getProductId = () => getParameterByName('p');
export const getProjectType = () => getParameterByName('pt');
export const getGroupId = () => getParameterByName('g');
export const getCountryCode = () => window.localStorage.getItem('country_code') || cookie.get('country_code');
export const getToolsHeader = () => ({
  'x-gateway-country': getCountryCode(),
  'x-gateway-group': 1,
  'x-gateway-product': getProductId(),
  'x-gateway-project': 2,
});
export const getCommunityHeader = () => ({
  'x-gateway-country': getCountryCode(),
  'x-gateway-group': getGroupId(),
  'x-gateway-product': getProductId(),
  'x-gateway-project': 1,
});

export const deleteAllCookies = () => {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const scopeCookie = cookies[i];
    const eqPos = scopeCookie.indexOf('=');
    const name = eqPos > -1 ? scopeCookie.substr(0, eqPos) : scopeCookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

export const getTranLang = () => (window.localStorage.getItem('tran_country')
  ? window.localStorage.getItem('tran_country').split('-')[0]
  : 'en');

export const isArrayFn = o => Object.prototype.toString.call(o) === '[object Array]';
export const isObjectFn = o => Object.prototype.toString.call(o) === '[object Object]';

function has(browser) {
  const ua = navigator.userAgent;
  if (browser === 'ie') {
    const isIE = ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1;
    if (isIE) {
      const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
      reIE.test(ua);
      return parseFloat(RegExp.$1);
    }
    return false;
  }
  return ua.indexOf(browser) > -1;
}

const ExportCsv = {
  _isIE11() {
    let iev = 0;
    const ieold = /MSIE (\d+\.\d+);/.test(navigator.userAgent);
    const trident = !!navigator.userAgent.match(/Trident\/7.0/);
    const rv = navigator.userAgent.indexOf('rv:11.0');

    if (ieold) {
      iev = Number(RegExp.$1);
    }
    if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
      iev = 10;
    }
    if (trident && rv !== -1) {
      iev = 11;
    }

    return iev === 11;
  },

  _isEdge() {
    return /Edge/.test(navigator.userAgent);
  },

  _getDownloadUrl(text) {
    const BOM = '\uFEFF';
    // Add BOM to text for open in excel correctly
    if (window.Blob && window.URL && window.URL.createObjectURL) {
      const csvData = new Blob([BOM + text], { type: 'text/csv' });
      return URL.createObjectURL(csvData);
    }
    return `data:attachment/csv;charset=utf-8,${BOM}${encodeURIComponent(text)}`;
  },

  download(filename, text) {
    if (has('ie') && has('ie') < 10) {
      // has module unable identify ie11 and Edge
      const oWin = window.top.open('about:blank', '_blank');
      oWin.document.charset = 'utf-8';
      oWin.document.write(text);
      oWin.document.close();
      oWin.document.execCommand('SaveAs', filename);
      oWin.close();
    } else if (has('ie') === 10 || this._isIE11() || this._isEdge()) {
      const BOM = '\uFEFF';
      const csvData = new Blob([BOM + text], { type: 'text/csv' });
      navigator.msSaveBlob(csvData, filename);
    } else {
      const link = document.createElement('a');
      link.download = filename;
      link.href = this._getDownloadUrl(text);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
};

const newLine = '\r\n';
const appendLine = (content, row, { separator, quoted }) => {
  const line = row.map((data) => {
    if (!quoted) return data;
    // quote data
    data = typeof data === 'string' ? data.replace(/"/g, '"') : data;
    return `"${data}"`;
  });
  content.push(line.join(separator));
};

const defaults = {
  separator: ',',
  quoted: false,
};

function Csv(columns, datas, options, noHeader = false) {
  options = Object.assign({}, defaults, options);
  let columnOrder;
  const content = [];
  const column = [];

  if (columns) {
    columnOrder = columns.map((v) => {
      if (typeof v === 'string') return v;
      if (!noHeader) {
        column.push(typeof v.title !== 'undefined' ? v.title : v.key);
      }
      return v.key;
    });
    if (column.length > 0) appendLine(content, column, options);
  } else {
    columnOrder = [];
    datas.forEach((v) => {
      if (!Array.isArray(v)) {
        columnOrder = columnOrder.concat(Object.keys(v));
      }
    });
    if (columnOrder.length > 0) {
      columnOrder = columnOrder.filter((value, index, self) => self.indexOf(value) === index);
      if (!noHeader) appendLine(content, columnOrder, options);
    }
  }

  if (Array.isArray(datas)) {
    datas.forEach((row) => {
      if (!Array.isArray(row)) {
        row = columnOrder.map(k => (typeof row[k] !== 'undefined' ? row[k] : ''));
      }
      appendLine(content, row, options);
    });
  }
  return content.join(newLine);
}

/**
 * 解析lrc文件
 */
export const parseLrc = (lrc) => {
  const _regAr = /\[ar:(.+)\]/;

  const _regTi = /\[ti:(.+)\]/;

  const _regAl = /\[al:(.+)\]/;

  const _regBy = /\[by:(.+)\]/;
  const lrcHeadInfoArr = [];
  const lrcTextArr = [];
  if (lrc.match(_regAr)) {
    lrcHeadInfoArr.push(lrc.match(_regAr)[0]);
    lrc = lrc.replace(_regAr, '');
  }
  if (lrc.match(_regTi)) {
    lrcHeadInfoArr.push(lrc.match(_regTi)[0]);
    lrc = lrc.replace(_regTi, '');
  }
  if (lrc.match(_regAl)) {
    lrcHeadInfoArr.push(lrc.match(_regAl)[0]);
    lrc = lrc.replace(_regAl, '');
  }
  if (lrc.match(_regBy)) {
    lrcHeadInfoArr.push(lrc.match(_regBy)[0]);
    lrc = lrc.replace(_regBy, '');
  }
  const lyrics = lrc.split('\n');
  for (let i = 0; i < lyrics.length; i++) {
    const lyric = decodeURIComponent(lyrics[i]);
    const timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
    const timeRegExpArr = lyric.match(timeReg);
    if (!timeRegExpArr) continue;
    const clause = lyric.replace(timeReg, '');
    for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
      const t = timeRegExpArr[k];
      const min = Number(String(t.match(/\[\d*/i)).slice(1));

      const sec = Number(String(t.match(/\:\d*\.\d*/i)).slice(1));
      const time = min * 60 + sec;
      lrcTextArr.push({
        current_time: time ? Number(time.toFixed(3)) : time,
        formate_time: t.replace(/\[|\]/g, ''),
        text: clause,
      });
    }
  }
  lrcTextArr.sort((a, b) => a.current_time - b.current_time);
  return {
    lrcHeadInfoArr,
    lrcTextArr,
  };
};

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
}

// 当然可以自定义简单的下载文件实现方式
function saveAs(obj, fileName) {
  const tmpa = document.createElement('a');
  tmpa.download = fileName || '下载';
  // 绑定a标签
  tmpa.href = URL.createObjectURL(obj);
  // 模拟点击实现下载
  tmpa.click();
  // 延时释放
  // 用URL.revokeObjectURL()来释放这个object URL
  setTimeout(() => {
    URL.revokeObjectURL(obj);
  }, 100);
}

function exportExcelxlsx(json, downName, type = undefined, showavg) {
  const source = [].concat(JSON.parse(JSON.stringify(json)));
  if (showavg) {
    if (!(source.length > 0)) return;
    const keylist = Object.keys(source[0]);
    const obj = {};
    const objsum = {};
    for (let n = 0; n < keylist.length; n++) {
      const element = keylist[n];
      let elementSum = 0;
      for (let m = 0; m < source.length; m++) {
        elementSum += Number(source[m][element]);
      }
      obj[element] = Number((elementSum / source.length).toFixed(2))
        ? Number((elementSum / source.length).toFixed(2))
        : '';
      obj.day = '均值';
      //
      objsum[element] = typeof elementSum === 'number' ? elementSum : '';
      objsum.day = '总和';
    }
    source.push(obj);
    source.push(objsum);
  }
  const tmpWB = {
    // 保存的表标题
    SheetNames: [downName],
    Sheets: {},
  };
  tmpWB.Sheets[`${downName}`] = XLSX.utils.json_to_sheet(source);
  const tmpDown = new Blob(
    [
      s2ab(
        XLSX.write(
          tmpWB,
          // 这里的数据是用来定义导出的格式类型
          { bookType: type === undefined ? 'xlsx' : type, bookSST: false, type: 'binary' },
        ),
      ),
    ],
    {
      type: '',
    },
  );
  // 创建二进制对象写入转换好的字节流
  saveAs(tmpDown, `${downName}.xlsx`);
}

//  全屏
export const launchFullscreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
};
//  取消全屏
export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};

//  ab_test创建时对值进行校验
export const checkAbTestValue = (values, my_editor) => {
  let referencenum = 0;

  let eventList = [];

  const equationList = [];
  /* eslint-disable */
  for (const key in values) {
    if (key.indexOf('keys') !== -1) {
      values[key] = undefined;
    }
    if (key.indexOf('groupid') != -1) {
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
        for (const paramskey in values) {
          if (values.hasOwnProperty(paramskey)) {
            if (paramskey.includes(`abeventotherparamskey__${index}`)) {
              const piteminex = parseInt(paramskey.split('__')[1]);
              const pindex = paramskey.split('/')[1];
              const pobj = {};
              pobj[values[paramskey]] = values[`abeventotherparamsvalue__${piteminex}/${pindex}`];
              eventParams.push(pobj);
            }
          }
        }
        const operator_type = `operator_type_other__${index}`;
        eventList.push(`${values[key]}-${values[operator_type]}-${JSON.stringify(eventParams)}`);
      } else {
        const eventParams = [];
        for (const paramskey in values) {
          if (values.hasOwnProperty(paramskey)) {
            if (paramskey.includes(`abeventparamskey__${index}`)) {
              const piteminex = parseInt(paramskey.split('__')[1]);
              const pindex = paramskey.split('/')[1];
              const pobj = {};
              pobj[values[paramskey]] = values[`abeventparamsvalue__${piteminex}/${pindex}`];
              eventParams.push(pobj);
            }
          }
        }
        const operator_type = `operator_type__${index}`;
        eventList.push(`${values[key]}-${values[operator_type]}-${JSON.stringify(eventParams)}`);
      }
    }
    if (key.includes('denominator__')) {
      const index = key.split('__')[1];
      let compute_type = 0;
      if (
        values[`molecular__${index}`] === values[key] ||
        (values[key] === 'active_user' && values[`molecular_type__${index}`] === 'pv')
      ) {
        compute_type = 1;
      }
      const eventParams = [];
      const moleculareventParams = [];
      for (const paramskey in values) {
        if (values.hasOwnProperty(paramskey)) {
          if (paramskey.includes(`denominatorparamskey__${index}`)) {
            const piteminex = parseInt(paramskey.split('__')[1]);
            const pindex = paramskey.split('/')[1];
            const pobj = {};
            pobj[values[paramskey]] = values[`denominatorparamsvalue__${piteminex}/${pindex}`];
            eventParams.push(pobj);
          } else if (paramskey.includes(`molecularparamskey__${index}`)) {
            const piteminex = parseInt(paramskey.split('__')[1]);
            const pindex = paramskey.split('/')[1];
            const pobj = {};
            pobj[values[paramskey]] = values[`molecularparamsvalue__${piteminex}/${pindex}`];
            moleculareventParams.push(pobj);
          }
        }
      }
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
        element.denominator_event_params
      )}`
    );
    eventList.push(
      `${element.molecular}-${element.molecular_type}-${JSON.stringify(
        element.molecular_event_params
      )}`
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

export const publishExpir = (publish, expiration) => {
  const view = [];
  if (publish) {
    view.push(
      <p>
        {intl.get('common.tools.publishtime').defaultMessage('发布时间：')}
        {publish}
      </p>
    );
  }
  if (expiration) {
    view.push(
      <p>
        {intl.get('common.tools.expiration').defaultMessage('过期时间：')}
        {expiration}
      </p>
    );
  }
  return view;
};

export const funIdToName = (id, funList) => {
  let name = '';
  funList.map(item => {
    if (item.app_func_id === id) {
      name = item.app_func_name;
    }
  });
  return name;
};

export const multHandle = (selectedRows, childrenRes = 'childrenRes', keyname = 'id') => {
  let ids = [];
  selectedRows.map(item => {
    if (item[childrenRes]) {
      item[childrenRes].map(sub_item => {
        ids.push(sub_item[keyname]);
      });
    } else {
      ids.push(item[keyname]);
    }
  });
  return ids;
};
//  格式化时间转换成 秒
export const format_time_2_int = (formattime, floatNum = 3) => {
  let time = formattime.split(':');
  let min = Number(time[0]),
    s = Number(parseFloat(time[1]).toFixed(floatNum));
  let duration = Number((min * 60 + s).toFixed(floatNum));
  return duration;
};

export {
  getParameterByName,
  JSONToCSVConvertor,
  constellation,
  getRandomInt,
  ExportCsv,
  exportExcelxlsx,
  Csv,
};

export const platformView = (
  platform,
  channel,
  maxvercode,
  minvercode,
  channelList,
  appVerCodeList
) => {
  const content = (
    <div>
      <p>
        {intl.get('common.tools.channel').defaultMessage('渠道')}：
        {channel == null || channel == ''
          ? '不限渠道'
          : channelList.map(item => {
              if (item.key == channel) {
                return item.value;
              }
            })}
      </p>
      <p>
        {intl.get('common.tools.max').defaultMessage('最大版本号：')}
        {maxvercode == null || maxvercode == ''
          ? '无限大'
          : appVerCodeList.map(item => {
              if (item.key == maxvercode) {
                return item.value;
              }
            })}
      </p>
      <p>
        {intl.get('common.tools.min').defaultMessage('最小版本号：')}
        {minvercode == null || minvercode == ''
          ? '无限大'
          : appVerCodeList.map(item => {
              if (item.key == minvercode) {
                return item.value;
              }
            })}
      </p>
    </div>
  );
  return (
    <Popover
      content={content}
      title={intl.get('common.tools.detail').defaultMessage('版本/渠道详情')}
    >
      <span style={{ cursor: 'pointer' }}>{platform == '1' ? 'Android' : 'iOS'}</span>
    </Popover>
  );
};

export const eventView = (event, appEventList) => {
  if (event == null || event === '0') {
    return <span>{intl.get('tools.template.no_event').defaultMessage('无事件')}</span>;
  } else {
    return (
      <span>
        {appEventList.map(item => {
          if (item.key == event) {
            return item.value;
          }
        })}
      </span>
    );
  }
};

export const countryView = (country, allCountryList) => {
  return (
    <span>
      {allCountryList.map(items => {
        if (items.key == country) {
          return items.value;
        }
      })}
    </span>
  );
};

export const langView = (lang, allLangList) => {
  return (
    <span>
      {allLangList.map(item => {
        if (item.langcode == lang.split('_')[0]) {
          return item.lang;
        }
      })}
    </span>
  );
};

export const setKeysNone = values => {
  for (var key in values) {
    if (key.indexOf('keys') !== -1) {
      values[key] = undefined;
    }
  }
  return values;
};

//  检查输入的时间是否合法
export const valid_time = (time, format = ['mm:ss']) => {
  let patt = [],
    flag = false;
  format.map(item => {
    if (item == 'mm:ss') {
      patt.push(/^\d*\:\d{2}\.\d*$/);
    }
  });
  patt.map(item => {
    flag = item.test(time);
    if (flag) return flag;
  });

  return flag;
};

//  时间格式转换成 '00:00'
export const int_time_2_format = (duration, floatNum = 3) => {
  let min = Math.floor(duration / 60);
  let s = (duration % 60).toFixed(floatNum);
  if (min < 10) {
    min = '0' + min;
  }
  if (s < 10) {
    s = '0' + s;
  }
  return `${min}:${s}`;
};
export const getDomain = name => `http://vcm-${name}.gltxy.xyz`;

/**
 * 传给 app 的富文本信息加上默认样式
 * @param {string} htmlStr
 */
export const formatHTMLToApp = htmlStr => {
  if (typeof htmlStr !== 'string') return '';
  let container = document.createElement('div');
  container.innerHTML = htmlStr;

  container.childNodes.forEach(v => {
    if (v.tagName === 'P') {
      v.style.minHeight = '1em';
      v.style.margin = '0';
    }
  });
  return container.innerHTML;
};


/**
 * 从数组生成 excel 文件
 * @param {array} excelRows excel内容
 * @param {string} filename 文件名
 */
export const downloadExcel = (excelRows = [], filename = 'excel.xlsx') => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excelRows);
  XLSX.utils.book_append_sheet(wb, ws);
  XLSX.writeFile(wb, filename);
};

/**
 * 下载工单列表
 * @param {*} issueList
 * @param {*} dicts
 */
export const downloadIssueList = async (issueList, dicts = {}) => {
  const {
    ISSUE_SUPPORT_PRODUCT,
    VIP_STATUS,
    MESSAGE_STATUS,
    issueType,
    issueTag,
    users,
    ISSUE_STATUS,
  } = dicts;
  const excelRows = [
    [
      '产品',
      'ID',
      'VIP状态',
      '问题类型',
      '消息状态',
      '反馈时间',
      '人工工单生成时间',
      '客服领取时间',
      '客服首次回复时间',
      '人工工单解决时间',
      '服务总结标签',
      '服务总结标签备注',
      '领取人',
      '工单状态',
      '国家&语言',
      '手机系统',
      '设备机型',
      'app版本',
      'auid',
      'duiddigest',
      'appkey',
      '渠道',
    ]
  ]
  const rows = issueList.map(record => {
    const productId = record.productId || record.producrtId;
    // 问题类型
    const currentType = issueType.find(v => v.id === record.issueTypeId);
    // 服务总结标签
    const tag = issueTag.find(v => String(v.id) === String(record.evaluationTypeId));
    let tagVaule = ''
    if (tag) {
      const { levelOne, levelTwo, levelThree } = tag;
      tagVaule = `${levelOne}/${levelTwo}/${levelThree}`
    }
    // 领取人
    let userName = '';
    if (record.operateName) {
      const v = users.find(user => String(user.id) === String(record.operateName));
      if (v) {
        userName = `${v.first_name || ''}${v.last_name || ''}`;
      }
    }
    return [
      ISSUE_SUPPORT_PRODUCT[productId],
      record.issueId,
      VIP_STATUS[record.isVip],
      currentType ? currentType.title : '',
      MESSAGE_STATUS[record.isNew] || '',
      record.gmtCreate ? moment(record.gmtCreate).format('YYYY-MM-DD HH:mm:ss') : '',
      record.operateIssueCreateTime ? moment(record.operateIssueCreateTime).format('YYYY-MM-DD HH:mm:ss') : '',
      record.serviceCreateTime ? moment(record.serviceCreateTime).format('YYYY-MM-DD HH:mm:ss') : '',
      record.replyTime ? moment(record.replyTime).format('YYYY-MM-DD HH:mm:ss') : '',
      record.completeTime ? moment(record.completeTime).format('YYYY-MM-DD HH:mm:ss') : '',
      tagVaule,
      record.tagRemark || '',
      userName,
      ISSUE_STATUS[record.issueState],
      `${record.countryCode || ''}--${record.lang || ''}`,
      record.sysVer || '',
      record.deviceType || '',
      record.appVersion || '',
      record.auid || '',
      record.duiddigest,
      record.appKey || '',
      record.channel || '',
    ]
  });
  excelRows.push(...rows)

  const filename = 'issue-list.xlsx';
  downloadExcel(excelRows, filename);
};

/**
 * 下载实知识库列表
 */
export const downloadKnowlegeList = async (dataList = []) => {
  const excelRows = [
    ['ID', '一级标签', '二级标签', '三级标签', '关键词', '问题标题', '内容', '备注'],
  ]
  const rows = dataList.map(item => {
    const tagOne = item.tag[0] ? item.tag[0].name : '';
    const tagTwo = item.tag[1] ? item.tag[1].name : '';
    const tagThree = item.tag[2] ? item.tag[2].name : '';
    return [
      item.id,
      tagOne,
      tagTwo,
      tagThree,
      item.keywords,
      item.title,
      item.content,
      item.comment
    ]
  })
  excelRows.push(...rows)
  downloadExcel(excelRows, '知识库.xlsx');
}
