import React from 'react';

import ChatMessage from './ChatMessage';

import styles from './Chat.less';

const Chat = ({ list = [], userMap }) => (
  <div className={styles.root}>
    <div className={styles.header}>
        历史回复
    </div>
    <div className={styles.content}>
      {
        list.map(v => <ChatMessage userMap={userMap} info={v} key={v.id} autoTrans />)
      }
    </div>
  </div>
);

export default Chat;
