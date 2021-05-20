import React from 'react';
import {
  Row, Col, Spin, message, Modal,
} from 'antd';
import Dropzone from 'react-dropzone';

import Chat from './Chat';
import Reply from './Reply';

import {
  getIssueChatLog, replyIssue, updateIssue,
} from '../../../../../services/issue/issue';
import { getAliOssSts } from '../../../../../services/common/utils';
import { chatLogTypeDict, ISSUE_STATUS_CODE } from '../../../const';

class ReplyChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatLog: [],
      uploading: false,
      uploadProgress: 0,
    };
  }

  componentDidMount() {
    this.refreshChatLog();
  }

  componentWillReceiveProps(nextProps) {
    const { issueId } = this.props.data;
    const { issueId: nextIssueId } = nextProps.data;
    if (issueId !== nextIssueId) {
      this.refreshChatLog(nextIssueId);
    }
  }

  refreshChatLog = async (issueId) => {
    if (!issueId) {
      issueId = this.props.data.issueId;
    }
    const res = await getIssueChatLog({ issueId });
    this.setState({
      chatLog: res.data.data || [],
    });
  }

  handleConfirm = (files) => {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (e) => {
      const style = {
        display: 'block',
        margin: '0 auto',
        width: '100%',
        marginLeft: '-20px',
      };
      const content = <img style={style} src={e.target.result} alt=""/>;
      Modal.confirm({
        title: '是否确认发送？',
        content,
        okText: '确认',
        cancelText: '取消',
        bodyStyle: { marginLeft: 0 },
        onOk: () => {
          this.handleUploadFiles(files);
        },
      });
    };
  }

  handleUploadFiles = async (files = []) => {
    if (!files || !files.length) return;
    if (files.length > 1) {
      message.error('一次只能上传一个文件');
      return;
    }
    this.setState({
      uploading: true,
    });
    const file = files[0];

    const fileType = file.type.split('/')[0];

    const progress = async (p) => {
      const percent = p * 100;
      this.setState({
        uploadProgress: percent,
      });
    };

    const fileUrl = await getAliOssSts(file, progress);

    const replyContent = fileType === 'image'
      ? fileUrl
      : JSON.stringify({
        videoUrl: fileUrl,
        imageUrl: `${fileUrl}?x-oss-process=video/snapshot,t_1000,f_jpg,w_800,h_600,m_fast`,
      });

    const issueData = this.props.data;
    await replyIssue({
      issueReportId: issueData.issueId,
      content: replyContent,
      chatLogType: chatLogTypeDict[fileType],
    });

    await updateIssue({
      issueId: issueData.issueId,
      serviceModifyTime: new Date(),
      issueState: ISSUE_STATUS_CODE.PROCESSING,
      replyTime: issueData.replyTime || new Date(),
    });

    await this.refreshChatLog();

    this.setState({
      uploading: false,
      uploadProgress: 0,
    });
  }

  render() {
    const {
      data = {},
      tagList = [],
      onTagChange,
      productId,
      userMap,
      onReplySuccessIndex,
      curTagRemark,
    } = this.props;
    const {
      chatLog,
      uploading,
      uploadProgress,
    } = this.state;

    return (
      <Spin spinning={uploading} tip={<div>
        {
          uploadProgress === 100 ? <span>发送中..</span> : <span>上传中: {uploadProgress} %</span>
        }
      </div>} >
        <Dropzone
          onDrop={this.handleConfirm}
          noClick
          accept={['image/*', 'video/*']}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Row type="flex" align="middle" justify="center">
                <Col span={12}>
                  <Chat userMap={userMap} list={chatLog} />
                </Col>
                <Col span={12}>
                  <Reply
                    onTagChange={onTagChange}
                    onReplySuccess={this.refreshChatLog}
                    data={data}
                    tagList={tagList}
                    productId={productId}
                    showReplyFapiao
                    onRefleshIndex={onReplySuccessIndex}
                    curTagRemark={curTagRemark}
                  />
                </Col>

              </Row>
            </div>
          )}
        </Dropzone>
      </Spin>
    );
  }
}

export default ReplyChat;
