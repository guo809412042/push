import Viewer from 'react-viewer';
import React from 'react';

import TranslateText from '../../../../../components/translate/TranslateText';
import AutoTranslateText from '../../../../../components/translate/AutoTranslateText';

import styles from './MessageView.less';

const MessageView = ({ info = {}, autoTrans }) => {
  const [imgVisible, setImgVisible] = React.useState(false);
  // const [translatedText, setTranslatedText] = React.useState('');
  let config = {};
  if (info.chatLogType === 2 || info.chatLogType === 4) {
    try {
      config = JSON.parse(info.content);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className={styles.root}>
      {// 文字
        info.chatLogType === 0 && (
          <div className={styles.text}>
            {autoTrans
              ? <AutoTranslateText
                text={info.content}
              />
              : <TranslateText
                text={info.content}
              />
            }
          </div>
        )}
      {// 图片
        info.chatLogType === 1 && (
          <>
            <img src={info.content} alt="" onClick={() => setImgVisible(true)} />
            <Viewer
              zIndex={10000}
              visible={imgVisible}
              onClose={() => setImgVisible(false)}
              images={[{ src: info.content, alt: '' }]}
            />
          </>
        )}
      {// 视频
        info.chatLogType === 2 && <video src={config.videoUrl} poster={config.imageUrl} controls />}
      {// 富文本
        info.chatLogType === 3 && (
          <div className={styles.text}>
            {autoTrans
              ? <AutoTranslateText
                text={info.content}
                richText
              />
              : <TranslateText
                text={info.content}
                richText
              />
            }
          </div>
        )}
      {// 文件
        info.chatLogType === 4 && (<a href={config.fileUrl} download>点击下载文件</a>)}
    </div>
  );
};

export default MessageView;
