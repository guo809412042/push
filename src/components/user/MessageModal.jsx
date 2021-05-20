/* eslint-disable */
import React from 'react';
import { Modal, Input, notification, Timeline, Tag } from 'antd';
import moment from 'moment';
import cookie from 'react-cookie';
import 'emoji-mart/css/emoji-mart.css';
import intl from 'react-intl-universal';

import { Officials } from '../../utils/const';
import { getTokenRongyun } from '../../services/user';

class MessageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      messageList: [],
    };
  }

  openModal = async () => {
    const __this = this;
    const { messageList } = this.state;
    this.setState({ visible: true });
    const userInfo = Officials[sessionStorage.getItem('group_id') || cookie.load('group_id')];
    const res = await getTokenRongyun(userInfo.auiddigest, userInfo.userName);
    const token = res.rongToken;
    // var guestId = JSON.parse(res).guestId;
    RongIMClient.init('pvxdm17jpl0cr');
    RongIMClient.setConnectionStatusListener({
      onChanged(status) {
        switch (status) {
          // 链接成功
          case RongIMLib.ConnectionStatus.CONNECTED:
            notification.success({ message: '提示', description: '链接成功' });
            console.log('链接成功');
            break;
          // 正在链接
          case RongIMLib.ConnectionStatus.CONNECTING:
            notification.success({ message: '提示', description: '正在链接' });
            console.log('正在链接');
            break;
          // 重新链接
          case RongIMLib.ConnectionStatus.DISCONNECTED:
            notification.success('链接成功');
            console.log('断开连接');
            break;
          // 其他设备登录
          case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
            console.log('其他设备登录');
            break;
          // 网络不可用
          case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
            console.log('网络不可用');
            break;
        }
      },
    });
    RongIMClient.setOnReceiveMessageListener({
      // 接收到的消息
      onReceived(message) {
        // 判断消息类型
        switch (message.messageType) {
          case RongIMClient.MessageType.TextMessage:
            // 发送的消息内容将会被打印
            console.log(message);
            notification.success({
              message: `收到${message.targetId}发来的新消息`,
              description: message.content.content,
            });
            if (message.targetId == __this.props.auiddigest) {
              messageList.push(message);
              __this.setState({ messageList });
            }
            break;
          case RongIMClient.MessageType.VoiceMessage:
            // 对声音进行预加载
            // message.content.content 格式为 AMR 格式的 base64 码
            RongIMLib.RongIMVoice.preLoaded(message.content.content);
            break;
          case RongIMClient.MessageType.ImageMessage:
            // do something...
            break;
          case RongIMClient.MessageType.DiscussionNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.LocationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.RichContentMessage:
            // do something...
            break;
          case RongIMClient.MessageType.DiscussionNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.InformationNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.ContactNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.ProfileNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.CommandNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.CommandMessage:
            // do something...
            break;
          case RongIMClient.MessageType.UnknownMessage:
            // do something...
            break;
          default:
          // 自定义消息
          // do something...
        }
      },
    });
    RongIMClient.connect(token, {
      onSuccess(userId) {
        console.log(`Login successfully.${userId}`);
      },
      onTokenIncorrect() {
        console.log('token无效');
      },
      onError(errorCode) {
        let info = '';
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
            info = '超时';
            break;
          case RongIMLib.ErrorCode.UNKNOWN_ERROR:
            info = '未知错误';
            break;
          case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
            info = '不可接受的协议版本';
            break;
          case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
            info = 'appkey不正确';
            break;
          case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
            info = '服务器不可用';
            break;
        }
        console.log(errorCode);
      },
    });
  };

  onCancel = () => {
    this.setState({ visible: false });
  };

  onSubmit = () => {
    const __this = this;
    const { messageList } = __this.state;
    const message = __this.refs.inputmes.refs.input.value;
    const testobj = {
      msgType: '002',
      msgContent: {
        content: message,
      },
    };
    const pushContent = message;
    // 定义消息类型,文字消息使用 RongIMLib.TextMessage
    const msg = new RongIMLib.TextMessage({ content: testobj, extra: '测试' });
    // 或者使用RongIMLib.TextMessage.obtain 方法.具体使用请参见文档
    //                var msg = RongIMLib.TextMessage.obtain("hello");
    const conversationtype = RongIMLib.ConversationType.PRIVATE; // 私聊
    // var targetId = "e1nv"; // 目标 Id
    let targetId = 'bswqy'; // 目标 Id
    targetId = this.props.auiddigest;
    //                var targetId = "9CmIz"; // 目标 Id
    RongIMClient.getInstance().sendMessage(
      conversationtype,
      targetId,
      msg,
      {
        // 发送消息成功
        onSuccess(message) {
          // message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
          console.log('Send successfully');
          console.log(message);
          __this.refs.inputmes.refs.input.value = '';
          messageList.push(message);
          __this.setState({ messageList });
        },
        onError(errorCode, message) {
          let info = '';
          switch (errorCode) {
            case RongIMLib.ErrorCode.TIMEOUT:
              info = '超时';
              break;
            case RongIMLib.ErrorCode.UNKNOWN_ERROR:
              info = '未知错误';
              break;
            case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
              info = '在黑名单中，无法向对方发送消息';
              break;
            case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
              info = '不在讨论组中';
              break;
            case RongIMLib.ErrorCode.NOT_IN_GROUP:
              info = '不在群组中';
              break;
            case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
              info = '不在聊天室中';
              break;
            default:
              info = x;
              break;
          }
          console.log(`发送失败:${info}`);
        },
      },
      {},
      pushContent
    );
  };

  addContentEmoji = emoji => {
    let text = this.refs.inputmes.refs.input.value;
    text = `${!text ? '' : text}${emoji.native}`;
    this.refs.inputmes.refs.input.value = text;
  };

  render() {
    const { children, tag, auiddigest, userInfo } = this.props;
    const { visible, confirmLoading, messageList } = this.state;
    const ModalOpts = {
      title: intl.get('vivaplus.user.message.title').defaultMessage('私信'),
      visible,
      confirmLoading,
      onCancel: this.onCancel,
      onOk: this.onSubmit,
      okText: intl.get('vivaplus.user.message.send').defaultMessage('发送'),
    };
    return (
      <span>
        <span onClick={this.openModal}>{children}</span>
        <Modal {...ModalOpts}>
          <div style={{ height: 400, overflow: 'scroll' }}>
            <Timeline>
              {messageList.map(v => {
                if (v.sentStatus) {
                  return (
                    <Timeline.Item key={v.messageId}>
                      <Tag color="blue">
                        {intl.get('common.me').defaultMessage('我')}
                        ：(
                        {moment.unix(v.sentTime / 1000).fromNow()})
                      </Tag>
                      <p>{v.content.content.msgContent.content}</p>
                    </Timeline.Item>
                  );
                }
                return (
                  <Timeline.Item key={v.messageId}>
                    <Tag color="red">
                      {userInfo.nickname}
                      ：(
                      {moment.unix(v.sentTime / 1000).fromNow()})
                    </Tag>
                    <p>{JSON.parse(v.content.content).msgContent.content}</p>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </div>
          <span>{intl.get('common.content').defaultMessage('内容')}</span>
          <Input ref="inputmes" type="textarea" />
        </Modal>
      </span>
    );
  }
}

export default MessageModal;
