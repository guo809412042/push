import 'braft-editor/dist/index.css';

import {
  Button, message, Modal, Switch, Input, Form,
} from 'antd';
import BraftEditor from 'braft-editor';
import _ from 'lodash';
import cookie from 'js-cookie';
import React, { Component } from 'react';

import TranslateButton from '../../../../../components/translate/TranslateButton';
import MediaUpload from '../../../../../components/upload/MediaUpload';
import {
  createIssueTagRecord, replyIssue, updateIssue, getKnowledgeTags, setExpired,
} from '../../../../../services/issue/issue';
import { formatHTMLToApp } from '../../../../../utils/utils';
import {
  ISSUE_CLOSE_REASON_CODE, ISSUE_STATUS_CODE, IssueTagReportSourceTypeMap, chatLogTypeDict, knowledgeProductDict,
} from '../../../const';
import TagSelect from '../TagSelect';
import KnowledgeSelect from './KnowledgeSelect';
import styles from './Reply.less';

const { TextArea } = Input;
const { Item } = Form;
const editorControls = [
  'undo',
  'redo',
  'clear',
  'separator',
  'text-color',
  'bold',
  'italic',
  'underline',
  'remove-styles',
  'emoji',
  'link',
];

class Reply extends Component {
  constructor(props) {
    super(props);
    const { tagList = [], data = {}, multiple, curTagRemark } = this.props;
    let selectedTagData = [];
    if (!multiple) {
      const tagItem = tagList.find(v => v.id === data.evaluationTypeId);
      if (tagItem) {
        selectedTagData = [tagItem.levelOne.trim(), tagItem.levelTwo.trim(), data.evaluationTypeId];
      }
    }
    this.state = {
      replyLoading: false,
      reply: '',
      editorState: BraftEditor.createEditorState(null),
      showModal: false,
      showTagModal: false,
      replyMedia: null,
      selectedTagData,
      issueState: data.issueState,
      initKnowledgeTag: [],
      commonTagId: '',
      replyFapiao: false, // 回复发票
      tagRemark: curTagRemark || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.multiple && !_.isEqual(nextProps.data, this.props.data)) {
      const { tagList = [], data = {} } = nextProps;
      const tagItem = tagList.find(v => v.id === data.evaluationTypeId);
      let selectedTagData = [];
      if (tagItem) {
        selectedTagData = [tagItem.levelOne, tagItem.levelTwo, data.evaluationTypeId];
      }
      console.log('====== will selectedTagData', selectedTagData);
      this.setState({
        selectedTagData,
        issueState: data.issueState,
      });
    }
  }

  componentDidMount() {
    this.getInitKnowledgeTag();
  }

  getInitKnowledgeTag = async () => {
    const { productId } = this.props;
    const initProduct = knowledgeProductDict[productId];
    const { code, data } = await getKnowledgeTags({ parentId: 0 });
    if (code !== 20000) {
      return;
    }
    const commonTagId = data.find(v => v.name === '公共类').id;
    const initKnowledgeTag = data.filter(tag => tag.name === initProduct);
    this.setState({ initKnowledgeTag, commonTagId });
  }

  handleEditorChange = (editorState) => {
    const htmlContent = this.state.editorState.toHTML();
    this.setState({ editorState, reply: htmlContent });
  };

  handleSelectPresetReply = (v) => {
    this.setEditorText(v);
  };

  handleReply = async () => {
    const { reply, editorState } = this.state;
    const text = editorState.toText();
    if (!text || !text.replace(/\s/g, '')) {
      message.warn('请不要回复无意义的内容！');
      return;
    }
    // eslint-disable-next-line no-unreachable
    const {
      data = {}, onReplySuccess, multiple, issueIds = [], issueList = [],
    } = this.props;
    this.setState({
      replyLoading: true,
    });
    try {
      if (multiple) {
        await Promise.all(
          issueIds.map(issueId => replyIssue({
            issueReportId: issueId,
            content: formatHTMLToApp(reply),
            chatLogType: 3,
          })),
        );
        await Promise.all(
          issueList.map(issue => updateIssue({
            issueId: issue.issueId,
            serviceModifyTime: new Date(),
            issueState: ISSUE_STATUS_CODE.PROCESSING,
            replyTime: issue.replyTime || new Date(),
          })),
        );
      } else {
        const { issueId } = data;
        await replyIssue({
          issueReportId: issueId,
          content: formatHTMLToApp(reply),
          chatLogType: 3,
        });
        updateIssue({
          issueId,
          serviceModifyTime: new Date(),
          issueState: ISSUE_STATUS_CODE.PROCESSING,
          replyTime: data.replyTime || new Date(),
        });
        // 设置发票链接过期时间
        setExpired({
          issueId,
        });
      }
      this.setState({
        replyMedia: null,
        showModal: false,
        reply: '',
        editorState: BraftEditor.createEditorState(null),
      });
      onReplySuccess && onReplySuccess();
    } catch (e) {
      message.error('回复失败');
    } finally {
      this.setState({
        replyLoading: false,
      });
    }
    this.props.onRefleshIndex();
  };

  handleReplyMedia = async () => {
    const { replyMedia } = this.state;
    const {
      data = {}, onReplySuccess, multiple, issueIds = [],
    } = this.props;
    if (!replyMedia || !replyMedia.url || !replyMedia.url.trim()) {
      message.warn('请先选择图片/视频');
      return;
    }
    const replyContent = replyMedia.type === 'image'
      ? replyMedia.url
      : JSON.stringify({
        videoUrl: replyMedia.url,
        imageUrl: `${replyMedia.url}?x-oss-process=video/snapshot,t_1000,f_jpg,w_800,h_600,m_fast`,
      });
    try {
      if (multiple) {
        await Promise.all(
          issueIds.map(issueId => replyIssue({
            issueReportId: issueId,
            content: replyContent,
            chatLogType: chatLogTypeDict[replyMedia.type],
          })),
        );
        await Promise.all(
          issueIds.map(issueId => updateIssue({
            issueId,
            serviceModifyTime: new Date(),
            issueState: ISSUE_STATUS_CODE.PROCESSING,
          })),
        );
      } else {
        const { issueId } = data;
        await replyIssue({
          issueReportId: issueId,
          content: replyContent,
          chatLogType: chatLogTypeDict[replyMedia.type],
        });
        await updateIssue({
          issueId,
          serviceModifyTime: new Date(),
          issueState: ISSUE_STATUS_CODE.PROCESSING,
          replyTime: data.replyTime || new Date(),
        });
      }
      this.setState({
        replyMedia: null,
        showModal: false,
      });
      onReplySuccess && onReplySuccess();
    } catch (e) {
      message.error('回复失败');
    }
  };

  handleTagChange = async (selectedTagData) => {
    if (!selectedTagData || !selectedTagData.length) {
      this.setState({
        selectedTagData: [],
      });
    } else {
      this.setState({
        selectedTagData,
      });
    }
  };

  handleComplete = async () => {
    const { selectedTagData } = this.state;
    if (!selectedTagData.length) {
      message.error('点击已解决必须先打服务总结标签');
      return;
    }

    const user = JSON.parse(cookie.get('user'));
    const userId = _.get(user, 'user.id', '');
    const updateData = {
      serviceModifyTime: new Date(),
      completeReason: ISSUE_CLOSE_REASON_CODE.SERVICE,
      issueState: ISSUE_STATUS_CODE.MANUAL_CLOSED,
      evaluationTypeId: selectedTagData[2],
      operateName: userId,
    };
    await this.updateIssue(updateData, () => {
      this.setState({
        issueState: ISSUE_STATUS_CODE.MANUAL_CLOSED,
      });
    });
  };

  handleProcessing = async () => {
    const updateData = {
      serviceModifyTime: new Date(),
      completeReason: ISSUE_CLOSE_REASON_CODE.UNCLOSED,
      issueState: ISSUE_STATUS_CODE.PROCESSING,
    };
    await this.updateIssue(updateData, () => {
      this.setState({
        issueState: ISSUE_STATUS_CODE.PROCESSING,
      });
    });
  }

  /**
   * 直接对工单打标签
   */
  handleTagIssue = async (selectedTagData) => {
    this.setState({
      selectedTagData,
    });
  }

  updateIssue = async (updateData, cb) => {
    const {
      data = {}, multiple, issueIds = [], issueList = [],
    } = this.props;
    try {
      if (multiple) {
        await Promise.all(
          issueIds.map(issueId => updateIssue({
            ...updateData,
            issueId,
          })),
        );
        // 如果更新了标签, 上传打标记录
        if (updateData.evaluationTypeId) {
          await Promise.all(
            issueList.map((data) => {
              const recordData = {
                source_id: data.issueId,
                source_type: IssueTagReportSourceTypeMap.ISSUE,
                tag_id: updateData.evaluationTypeId,
                country: data.countryCode,
                lang: data.lang.split('_')[0],
                is_vip: data.isVip,
                // FIXME: 接口字段名
                product_id: data.productId || data.producrtId,
                source_create_time: new Date(data.gmtCreate),
              };
              // 如果工单是人工完结,则工单完结时间为客服的操作时间
              if (updateData.issueState === ISSUE_STATUS_CODE.MANUAL_CLOSED) {
                recordData.source_finish_time = data.serviceModifyTime;
              } else {
                recordData.source_finish_time = data.completeTime;
              }
              return createIssueTagRecord(recordData);
            }),
          );
        }
      } else {
        const { issueId } = data;
        const { data: { code } } = await updateIssue({
          ...updateData,
          issueId,
        });
        console.log('code', code);
        // 标记为已解决
        if (updateData.issueState === ISSUE_STATUS_CODE.MANUAL_CLOSED) {
          if (code === 20) {
            message.error('还未回复，不能标记为已解决');
            return;
          }
        }

        if (updateData.evaluationTypeId) {
          const recordData = {
            source_id: data.issueId,
            source_type: IssueTagReportSourceTypeMap.ISSUE,
            tag_id: updateData.evaluationTypeId,
            country: data.countryCode,
            lang: data.lang.split('_')[0],
            is_vip: data.isVip,
            // FIXME: 接口字段名
            product_id: data.productId || data.producrtId,
            source_create_time: new Date(data.gmtCreate),
          };
            // 如果工单是人工完结,则工单完结时间为客服的操作时间
          if (updateData.issueState === ISSUE_STATUS_CODE.MANUAL_CLOSED) {
            recordData.source_finish_time = data.serviceModifyTime;
          } else {
            recordData.source_finish_time = data.completeTime;
          }
          await createIssueTagRecord(recordData);
        }
      }
      cb && cb();
    } catch (e) {
      message.error('修改失败');
    }
  }

  setEditorText = (text) => {
    this.setState({
      editorState: BraftEditor.createEditorState(text),
      reply: text,
    });
  };

  // 是否回复开发票的链接
  switchChange = (checked) => {
    this.setState({ replyFapiao: checked });
  }

  handleSelectTag = async () => {
    const { onTagChange } = this.props;
    const { tagRemark, selectedTagData } = this.state;

    if (!selectedTagData || !selectedTagData.length) {
      return message.error('请先选择服务标签');
    }
    const updateData = {
      serviceModifyTime: new Date(),
      evaluationTypeId: selectedTagData[2],
      tagRemark,
    };
    await this.updateIssue(updateData, () => {
      onTagChange && onTagChange(selectedTagData[2], tagRemark);
    });
    this.setState({
      showTagModal: false,
    })
  };

  render() {
    const {
      editorState,
      showModal,
      reply = '',
      selectedTagData,
      replyLoading,
      issueState,
      showTagModal,
      initKnowledgeTag,
      commonTagId,
      tagRemark,
    } = this.state;
    const { tagList, data = {}, showReplyFapiao = false } = this.props;

    const hooks = {
      'toggle-link': ({ href, target }) => {
        if (this.state.replyFapiao) {
          href = `${href}?issueid=${data.issueId}${data.auid ? `&auid=${data.auid}` : ''}`;
        }
        return { href, target };
      },
    };

    return (
      <div className={styles.root}>
        <div className={styles.header}>回复</div>
        <div className={styles.row}>
          <KnowledgeSelect onChange={this.handleSelectPresetReply} initKnowledgeTag={initKnowledgeTag} commonTagId={commonTagId} />
        </div>
        <div className={styles.row}>
          <BraftEditor hooks={hooks} controls={editorControls} value={editorState} onChange={this.handleEditorChange} />
          <div>
            <TranslateButton
              disabled={!reply.trim()}
              text={this.state.reply}
              okText="采用翻译"
              onOk={text => this.setEditorText(text)}
              data={data}
            >
              翻译回复内容
            </TranslateButton>
            {showReplyFapiao && (
              <>
                <span style={{ marginLeft: 20 }}>是否是发票回复链接：</span>
                <Switch checked={this.state.replyFapiao} onChange={this.switchChange} />
              </>
            )}
          </div>
        </div>
        <div>
          <Button
            disabled={issueState === ISSUE_STATUS_CODE.MANUAL_CLOSED}
            loading={replyLoading}
            block
            type="primary"
            onClick={this.handleReply}
          >
            发送
          </Button>
        </div>
        <div>
          <Button
            block
            disabled={issueState === ISSUE_STATUS_CODE.MANUAL_CLOSED}
            type="primary"
            style={{ marginTop: 6 }}
            onClick={() => {
              this.setState({
                showModal: true,
              });
            }}
          >
            发送图片/视频
          </Button>
        </div>
        <div>
          <Button
            block
            type="primary"
            style={{ marginTop: 6 }}
            onClick={() => {
              this.setState({
                showTagModal: true,
              });
            }}
          >
            打标签
          </Button>
        </div>
        <div>
          {
            issueState === ISSUE_STATUS_CODE.MANUAL_CLOSED ? (
              <Button
                block
                type="primary"
                style={{ marginTop: 6 }}
                onClick={this.handleProcessing}
              >标记为处理中</Button>
            ) : <Button
              block
              type="primary"
              style={{ marginTop: 6 }}
              onClick={() => {
                Modal.confirm({
                  title: '确认该工单已解决?',
                  content: (
                    <div>
                      <div className={styles.row}>
                        <p>服务总结标签(必选)</p>
                        <TagSelect
                          list={tagList}
                          size="small"
                          style={{ width: '100%' }}
                          value={selectedTagData}
                          onChange={this.handleTagChange}
                        />
                      </div>
                    </div>
                  ),
                  onOk: () => {
                    this.handleComplete();
                  },
                });
              }}
            >
            标记为已解决
            </Button>
          }
        </div>
        <Modal
          title="发送图片/视频"
          visible={showModal}
          onCancel={() => this.setState({
            showModal: false,
          })
          }
          onOk={this.handleReplyMedia}
        >
          <MediaUpload onChange={v => this.setState({ replyMedia: v })} />
        </Modal>
        <Modal
          title="打标签"
          visible={showTagModal}
          onCancel={() => {
            this.setState({
              showTagModal: false,
              tagRemark: '',
            });
          }}
          onOk={() => this.handleSelectTag()}
        >
          <Item label='服务标签'>
            <TagSelect
              list={tagList}
              size="small"
              style={{ width: '100%' }}
              value={selectedTagData}
              onChange={this.handleTagIssue}
            />
          </Item>
          <Item label='标签备注'>
            <TextArea
              onChange={(e) => {
                this.setState({ tagRemark: e.target.value });
              }}
              value={tagRemark}
              autoSize={{
                maxRows: 3,
                minRows: 2,
              }}
            />
          </Item>
        </Modal>
      </div>
    );
  }
}

export default Reply;
