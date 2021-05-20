import { message } from 'antd';
import * as clipboard from 'clipboard-polyfill';

export const getIssueTagText = (tagId, tagList = []) => {
  let tagText;
  const currentTag = tagList.find(v => v.id === tagId);
  if (currentTag) {
    const { levelOne, levelTwo, levelThree } = currentTag;
    tagText = `${levelOne}/${levelTwo}/${levelThree}`;
  }
  return tagText;
};

// 获取翻译的默认语言
export const getTransDefaultLang = (lang) => {
  const idx = lang.indexOf('_');
  if (idx === -1) return lang;
  return lang.substring(0, idx);
};


// 复制
export const handleCopyText = (content) => {
  // const input = document.createElement('textarea');
  // input.value = content;
  // document.body.appendChild(input);
  // input.select();
  // if (document.execCommand('copy')) {
  //   document.execCommand('copy');
  //   message.success('已复制');
  // }
  // document.body.removeChild(input);
  clipboard.writeText(content).then(() => {
    message.success('已复制');
  }, (err) => {
    console.log('err: ', err);
    message.error('复制失败');
  });
};

// 富文本复制
export const cpoyRichText = (text) => {
  const div = document.createElement('div');
  div.innerHTML = text;

  const blob = new Blob([new XMLSerializer().serializeToString(div)], { type: 'text/html' });
  const items = [new clipboard.ClipboardItem({
    'text/html': blob,
  })];
  clipboard.write(items).then(() => {
    message.success('已复制');
  }, (err) => {
    console.log('err: ', err);
    message.error('复制失败');
  });
};
