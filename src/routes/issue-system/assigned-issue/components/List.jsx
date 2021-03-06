import React from 'react';
import {
  Table, Modal, Popover, message, Button, Tag, Form, Input,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import XLSX from 'xlsx';

import ReplyChat from '../../manual-issue/components/reply-chat/ReplyChat';
import Chat from '../../manual-issue/components/reply-chat/Chat';
import Reply from '../../manual-issue/components/reply-chat/Reply';
import MessageView from '../../manual-issue/components/reply-chat/MessageView';
import TagSelect from '../../manual-issue/components/TagSelect';

import { updateIssue, createIssueTagRecord } from '../../../../services/issue/issue';
import {
  ISSUE_SORT_ORDER_TYPE, ISSUE_STATUS, MESSAGE_STATUS, VIP_STATUS, IssueTagReportSourceTypeMap, ISSUE_SUPPORT_PRODUCT,
} from '../../const';

import { getIssueTagText, handleCopyText } from '../../utils';

const { Item } = Form;
const { TextArea } = Input;

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      replyData: null,
      toBeTaggedData: null,
      selectedTagData: [],
      selectedRowKeys: [],
      selectedRows: [],
      showMultipleReply: false,
      tagRemark: '',
    };
  }

  handleTableChange = (pagination, filter, sorter = {}) => {
    const { dispatch, formFields } = this.props;
    const {
      current,
      pageSize,
    } = pagination;
    dispatch({
      type: 'issue_system__assigned_issue/savePagination',
      payload: {
        pagination: {
          current,
          pageSize,
        },
      },
    });

    const { order, field } = sorter;
    let orderField;
    let orderType;
    if (order) {
      orderField = ISSUE_SORT_ORDER_TYPE[field];
      if (order === 'descend') {
        orderType = 2;
      }
      if (order === 'ascend') {
        orderType = 1;
      }
    }

    dispatch({
      type: 'issue_system__assigned_issue/saveFormFields',
      payload: {
        data: {
          ...formFields,
          orderType,
          orderField,
        },
      },
    });

    dispatch({ type: 'issue_system__assigned_issue/listInit' });
  };

  handleAddTag = async () => {
    const {
      toBeTaggedData,
      selectedTagData,
      tagRemark,
    } = this.state;
    const { dispatch } = this.props;
    if (toBeTaggedData && selectedTagData && selectedTagData.length) {
      const issueId = toBeTaggedData.issueId;
      const tagId = selectedTagData[2];
      if (!tagId) {
        message.error('???????????????');
        return false;
      }
      if (tagRemark && tagRemark.length > 200) {
        message.error('??????????????????????????????????????????');
        return false;
      }
      try {
        const respTag = await updateIssue({
          issueId,
          evaluationTypeId: tagId,
          tagRemark,
        });
        const { success } = respTag.data || {};
        if (!success) {
          message.error('????????????');
          return false;
        }
        dispatch({ type: 'issue_system__assigned_issue/listInit' });
        this.setState({
          toBeTaggedData: null,
          selectedTagData: [],
          tagRemark: '',
        });
        // ????????????, ????????????
        const resp = await createIssueTagRecord({
          source_id: toBeTaggedData.issueId,
          source_type: IssueTagReportSourceTypeMap.ISSUE,
          tag_id: tagId,
          country: toBeTaggedData.countryCode,
          lang: toBeTaggedData.lang.split('_')[0],
          is_vip: toBeTaggedData.isVip,
          // FIXME: ???????????????
          product_id: toBeTaggedData.productId || toBeTaggedData.producrtId,
          source_create_time: new Date(toBeTaggedData.gmtCreate),
          source_finish_time: toBeTaggedData.completeTime,
        });
      } catch (e) {
        message.error('???????????????');
      }
    }
  }

  handleSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  handleBatchDrawIssue = async () => {
    const { selectedRows } = this.state;
    const { dispatch, user } = this.props;
    const canDrawIssues = selectedRows.filter(item => !item.operateName);
    try {
      const userId = _.get(user, 'user.id', '');
      await Promise.all(canDrawIssues.map(v => updateIssue({
        issueId: v.issueId,
        operateName: userId,
        issueState: 1,
        serviceCreateTime: new Date(),
      })));
      dispatch({ type: 'issue_system__assigned_issue/listInit' });
      message.success('????????????');
    } catch (e) {
      message.error('????????????');
    }
  };

  handleBatchReplyIssue = () => {
    this.setState({
      showMultipleReply: true,
    });
  };

  handleBatchDownloadIssue = () => {
    const { selectedRows } = this.state;
    const {
      issueType,
    } = this.props;
    const rows = [
      ['ID',
        'VIP??????',
        '????????????',
        '????????????',
        '????????????',
        'APP ??????',
        'auid',
        'duiddigest',
        'appKey',
        '??????',
        '????????????',
        '????????????',
        '????????????',
        '??????',
        '??????',
      ]];
    selectedRows.forEach((v) => {
      const currentType = issueType.find(item => item.id === v.issueTypeId) || {};
      rows.push([
        v.issueId,
        VIP_STATUS[v.isVip],
        currentType.title,
        v.sysVer,
        v.deviceType,
        v.appVersion, // APP ??????
        v.auid,
        v.duiddigest,
        v.appKey,
        v.channel, // ??????
        MESSAGE_STATUS[v.isNew],
        ISSUE_STATUS[v.issueState],
        v.gmtCreate ? moment(v.gmtCreate).format('YYYY-MM-DD HH:mm:ss') : '',
        v.countryCode,
        v.lang,
      ]);
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, '???????????????.xlsx');
  };

  handleTagChange = (tagId, tagRemark) => {
    const {
      replyData,
    } = this.state;
    if (replyData) {
      const newReplyData = {
        ...replyData,
        evaluationTypeId: tagId,
        tagRemark,
      };
      this.setState({
        replyData: newReplyData,
      });
    }
  }

  canReply = (record) => {
    const {
      user,
    } = this.props;
    const userId = _.get(user, 'user.id', '');
    const canReplyStates = [1, 2];
    return userId && String(userId) === String(record.operateName) && canReplyStates.includes(record.issueState);
  }

  handleCopy = (record) => {
    const content = `????????????: ${record.sysVer}\n????????????: ${record.deviceType}\nAPP ??????: ${record.appVersion}\nauid: ${record.auid}\nduiddigest: ${record.duiddigest}\nappKey: ${record.appKey}\n??????: ${record.channel}\n??????: ${record.countryCode}\n??????: ${record.lang}`;

    handleCopyText(content);
  }

  onPageChange = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    });
  }

  render() {
    const {
      pagination, listData, listLoading, issueTag, issueType, users, reFresh, formFields, userMap,
    } = this.props;

    const { selectedRowKeys, showMultipleReply, selectedRows } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
    };

    const column = [
      {
        title: '??????',
        dataIndex: 'productId',
        key: 'productId',
        width: 100,
        fixed: 'left',
        render: (text, record) => {
          // FIXME: ???????????????????????????????????? ????
          const productId = record.productId || record.producrtId;
          return ISSUE_SUPPORT_PRODUCT[productId];
        },
      },
      {
        title: 'ID',
        dataIndex: 'issueId',
        key: 'issueId',
        width: 80,
      },
      {
        title: 'VIP??????',
        dataIndex: 'isVip',
        key: 'isVip',
        width: 60,
        render: text => VIP_STATUS[text] || null,
      },
      {
        title: '????????????',
        dataIndex: 'issueTypeId',
        key: 'issueTypeId',
        width: 200,
        render: (text) => {
          const currentType = issueType.find(v => v.id === text);
          if (currentType) {
            return currentType.title;
          }
          return null;
        },
      },
      {
        title: '????????????',
        dataIndex: 'issueReportChatLogList',
        key: 'issueReportChatLogList',
        width: 380,
        render: (record) => {
          if (record && record.length) {
            const info = record[0];
            return (
              <>
                <MessageView info={info} />
                {record.length > 1 && (
                  <Popover trigger="click" content={<Chat userMap={userMap} list={record} />}>
                    <a>??????????????????&gt;&gt;</a>
                  </Popover>
                )}
              </>
            );
          }
          return null;
        },
      },
      {
        title: '????????????',
        dataIndex: 'sysVer',
        key: 'sysVer',
        width: 200,
        render: (text, record) => {
          const {
            sysVer, // ????????????
            deviceType, // ????????????
            appVersion, // APP ??????
            auid,
            duiddigest,
            appKey,
            channel, // ??????
            countryCode,
            lang,
          } = record;
          return (
            <div>
              <div>????????????: {sysVer}</div>
              <div>????????????: {deviceType}</div>
              <div>APP ??????: {appVersion}</div>
              <div>auid: {auid}</div>
              <div>duiddigest: {duiddigest}</div>
              <div>appKey: {appKey}</div>
              <div>??????: {channel}</div>
              <div>??????: {countryCode}</div>
              <div>??????: {lang}</div>
              <a onClick={() => this.handleCopy(record)}>????????????</a>
            </div>
          );
        },
      },
      {
        title: '????????????',
        dataIndex: 'isNew',
        key: 'isNew',
        width: 100,
        render: text => MESSAGE_STATUS[text] || null,
      },
      {
        title: '????????????',
        sorter: true,
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        width: 120,
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
      },
      {
        title: '????????????',
        sorter: true,
        dataIndex: 'serviceCreateTime',
        key: 'serviceCreateTime',
        width: 120,
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
      },
      {
        title: '??????????????????',
        dataIndex: 'evaluationTypeId',
        key: 'evaluationTypeId',
        width: 260,
        render: (text) => {
          const tag = issueTag.find(v => String(v.id) === String(text));
          if (tag) {
            const {
              levelOne,
              levelTwo,
              levelThree,
            } = tag;
            return <Tag>{`${levelOne}/${levelTwo}/${levelThree}`}</Tag>;
          }
          return null;
        },
      },
      {
        title: '?????????',
        dataIndex: 'operateName',
        key: 'operateName',
        width: 80,
        render: (text) => {
          if (!text) return null;
          const v = users.find(user => String(user.id) === String(text));
          if (v) {
            return <div>{`${v.first_name || ''}${v.last_name || ''}`}</div>;
          }
          return null;
        },
      },
      {
        title: '????????????',
        dataIndex: 'issueState',
        key: 'issueState',
        width: 80,
        render: text => ISSUE_STATUS[text],
      },
      {
        title: '??????',
        width: 80,
        fixed: 'right',
        render: (text, record) => {
          let tagList = [];
          const { evaluationTypeId, tagRemark } = record;
          const tag = issueTag.find(v => String(v.id) === String(evaluationTypeId));
          if (tag) {
            const {
              levelOne,
              levelTwo,
            } = tag;
            tagList = [levelOne, levelTwo, evaluationTypeId];
          }
          return (
            <div>
              {this.canReply(record) && (
                <div>
                  <a
                    onClick={() => {
                      this.setState({
                        replyData: record,
                        tagRemark,
                      });
                    }}
                  >
                    ??????
                  </a>
                </div>
              )}
              <div>
                <a
                  onClick={() => {
                    this.setState({
                      toBeTaggedData: record,
                      selectedTagData: tagList,
                      tagRemark: tagRemark || '',
                    });
                  }}
                >
                  ?????????
                </a>
              </div>
              <div>
                <a href={`${window.location.pathname}${window.location.search}&fg=viva-tools-issue#/issue_system/manual_issue/?duiddigest=${record.duiddigest}&issueState=-1`} target="_blank">
                  ??????{record.reportCount ? `(${record.reportCount})` : ''}
                </a>
              </div>
            </div>
          );
        },
      },
    ];

    return (
      <>
        <Table
          onChange={this.handleTableChange}
          columns={column}
          dataSource={listData}
          loading={listLoading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '80', '100'],
            onChange: this.onPageChange,
          }}
          rowSelection={rowSelection}
          rowKey="issueId"
          scroll={{ x: 1700 }}
        />
        <div style={{
          position: 'fixed',
          bottom: '10px',
          left: '276px',
          zIndex: 1,
        }}>
          <Button disabled={selectedRowKeys.length === 0} style={{ marginRight: 10 }} onClick={this.handleBatchReplyIssue}>????????????</Button>
          <Button disabled={selectedRowKeys.length === 0} style={{ marginRight: 10 }} onClick={this.handleBatchDownloadIssue}>????????????</Button>
        </div>
        {
          !!this.state.replyData && (
            <Modal
              width={900}
              title={
                <div>
                  ?????? [
                  {getIssueTagText(_.get(this.state, 'replyData.evaluationTypeId'), issueTag) ? (
                    <Tag>{getIssueTagText(_.get(this.state, 'replyData.evaluationTypeId'), issueTag)}</Tag>
                  ) : (
                    '????????????'
                  )}
                  ]
                </div>
              }
              footer={null}
              visible={!!this.state.replyData}
              destroyOnClose
              onCancel={() => {
                this.setState({
                  replyData: null,
                });
                reFresh && reFresh();
              }}
            >
              <ReplyChat
                data={this.state.replyData || {}}
                tagList={issueTag}
                onTagChange={this.handleTagChange}
                productId={formFields.productId}
                onReplySuccessIndex={() => this.onPageChange()}
                curTagRemark={this.state.tagRemark}
              />
            </Modal>
          )
        }
        <Modal
          title="?????????"
          visible={!!this.state.toBeTaggedData}
          onCancel={() => this.setState({
            toBeTaggedData: null,
            selectedTagData: [],
            tagRemark: '',
          })}
          onOk={this.handleAddTag}
        >
          <Item label="??????" required>
            <TagSelect
              value={this.state.selectedTagData}
              onChange={(d) => {
                this.setState({ selectedTagData: d });
              }}
              list={issueTag}
              style={{ width: '100%' }}
            />
          </Item>
          <Item label="????????????">
            <TextArea
              onChange={(e) => {
                this.setState({ tagRemark: e.target.value });
              }}
              value={this.state.tagRemark}
              autoSize={{
                maxRows: 3,
                minRows: 2,
              }}
            />
          </Item>
        </Modal>
        {
          showMultipleReply && (
            <Modal
              title="????????????"
              visible={showMultipleReply}
              footer={null}
              onCancel={() => {
                this.setState({
                  showMultipleReply: false,
                });
                reFresh && reFresh();
              }}
            >
              <Reply
                multiple
                issueIds={selectedRowKeys}
                issueList={selectedRows}
                tagList={issueTag}
                onReplySuccess={() => {
                  this.setState({
                    showMultipleReply: false,
                  });
                  this.onPageChange();
                  reFresh && reFresh();
                }}
                productId={formFields.productId}
              />
            </Modal>
          )
        }
      </>
    );
  }
}

export default List;
