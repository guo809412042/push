import React from 'react';
import {
  Table, Modal, Popover, message, Tag, Form, Input,
} from 'antd';
import cookie from 'js-cookie';
import _ from 'lodash';
import moment from 'moment';
import XLSX from 'xlsx';

import ReplyChat from '../../manual-issue/components/reply-chat/ReplyChat';
import Chat from '../../manual-issue/components/reply-chat/Chat';
import Reply from '../../manual-issue/components/reply-chat/Reply';
import MessageView from '../../manual-issue/components/reply-chat/MessageView';
import TagSelect from '../../manual-issue/components/TagSelect';
import IssueLog from './IssueLog';

import { updateIssue, createIssueTagRecord } from '../../../../services/issue/issue';
import {
  ISSUE_STATUS, MESSAGE_STATUS, VIP_STATUS, ISSUE_CLOSE_REASON, ISSUE_SORT_ORDER_TYPE,
  IssueTagReportSourceTypeMap,
  ISSUE_SUPPORT_PRODUCT,
} from '../../const';

import { handleCopyText } from '../../utils';

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
      type: 'issue_system__manual_closed_issue/savePagination',
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
      type: 'issue_system__manual_closed_issue/saveFormFields',
      payload: {
        data: {
          ...formFields,
          orderType,
          orderField,
        },
      },
    });

    dispatch({ type: 'issue_system__manual_closed_issue/listInit' });
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
        message.error('请选择标签');
        return false;
      }
      if (tagRemark && tagRemark.length > 200) {
        message.error('服务标签备注字数超出最大长度');
        return false;
      }
      try {
        await updateIssue({
          issueId,
          evaluationTypeId: tagId,
          tagRemark,
        });
        dispatch({ type: 'issue_system__manual_closed_issue/listInit' });
        this.setState({
          toBeTaggedData: null,
          selectedTagData: [],
          tagRemark: '',
        });
        // 打标签时, 上传统计
        await createIssueTagRecord({
          source_id: toBeTaggedData.issueId,
          source_type: IssueTagReportSourceTypeMap.ISSUE,
          tag_id: tagId,
          country: toBeTaggedData.countryCode,
          lang: toBeTaggedData.lang.split('_')[0],
          is_vip: toBeTaggedData.isVip,
          // FIXME: 接口字段名
          product_id: toBeTaggedData.productId || toBeTaggedData.producrtId,
          source_create_time: new Date(toBeTaggedData.gmtCreate),
          source_finish_time: toBeTaggedData.completeTime,
        });
      } catch (e) {
        message.error('打标签失败');
      }
    }
  }

  handleSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys, selectedRows });
  };

  handleBatchDrawIssue = async () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    const canDrawIssues = selectedRows.filter(item => !item.operateName);
    try {
      const user = JSON.parse(cookie.get('user'));
      const userId = _.get(user, 'user.id', '');
      await Promise.all(canDrawIssues.map(v => updateIssue({
        issueId: v.issueId,
        operateName: userId,
        issueState: 1,
        serviceCreateTime: new Date(),
      })));
      dispatch({ type: 'issue_system__manual_closed_issue/listInit' });
      message.success('领取成功');
    } catch (e) {
      message.error('领取失败');
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
        'VIP状态',
        '问题类型',
        '手机系统',
        '设备机型',
        'APP 版本',
        'auid',
        'duiddigest',
        'appKey',
        '渠道',
        '消息状态',
        '工单状态',
        '反馈时间',
        '国家',
        '语言',
      ]];
    selectedRows.forEach((v) => {
      const currentType = issueType.find(item => item.id === v.issueTypeId) || {};
      rows.push([
        v.issueId,
        VIP_STATUS[v.isVip],
        currentType.title,
        v.sysVer,
        v.deviceType,
        v.appVersion, // APP 版本
        v.auid,
        v.duiddigest,
        v.appKey,
        v.channel, // 渠道
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
    XLSX.writeFile(wb, 'excel.xlsx');
  };

  handleCopy = (record) => {
    const content = `手机系统: ${record.sysVer}\n设备机型: ${record.deviceType}\nAPP 版本: ${record.appVersion}\nauid: ${record.auid}\nduiddigest: ${record.duiddigest}\nappKey: ${record.appKey}\n渠道: ${record.channel}\n国家: ${record.countryCode}\n语言: ${record.lang}`;

    handleCopyText(content);
  }

  render() {
    const {
      pagination, listData, listLoading, issueTag, issueType, users, userMap,
    } = this.props;

    const { selectedRowKeys, showMultipleReply, selectedRows } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
    };

    const column = [
      {
        title: '产品',
        dataIndex: 'productId',
        key: 'productId',
        width: 100,
        fixed: 'left',
        render: (text, record) => {
          // FIXME: 接口返回值里有个拼写错误 🤣
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
        title: 'VIP状态',
        dataIndex: 'isVip',
        key: 'isVip',
        width: 60,
        render: text => VIP_STATUS[text] || null,
      },
      {
        title: '问题类型',
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
        title: '消息内容',
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
                    <a>点击展开更多&gt;&gt;</a>
                  </Popover>
                )}
              </>
            );
          }
          return null;
        },
      },
      {
        title: '系统信息',
        dataIndex: 'sysVer',
        key: 'sysVer',
        width: 200,
        render: (text, record) => {
          const {
            sysVer, // 手机系统
            deviceType, // 设备机型
            appVersion, // APP 版本
            auid,
            duiddigest,
            appKey,
            channel, // 渠道
            countryCode,
            lang,
          } = record;
          return (
            <div>
              <div>手机系统: {sysVer}</div>
              <div>设备机型: {deviceType}</div>
              <div>APP 版本: {appVersion}</div>
              <div>auid: {auid}</div>
              <div>duiddigest: {duiddigest}</div>
              <div>appKey: {appKey}</div>
              <div>渠道: {channel}</div>
              <div>国家: {countryCode}</div>
              <div>语言: {lang}</div>
              <a onClick={() => this.handleCopy(record)}>一键复制</a>
            </div>
          );
        },
      },
      {
        title: '消息状态',
        dataIndex: 'isNew',
        key: 'isNew',
        width: 100,
        render: text => MESSAGE_STATUS[text] || null,
      },
      {
        title: '反馈时间',
        sorter: true,
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        width: 120,
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
      },
      {
        title: '服务总结标签',
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
        title: '完结时间',
        sorter: true,
        dataIndex: 'completeTime',
        key: 'completeTime',
        width: 120,
        render: (text) => {
          // const t = Math.max(text, record.serviceModifyTime || '');
          // return (t ? moment(t).format('YYYY-MM-DD HH:mm:ss') : null);
          if (!text) return null;
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
          // return (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null);
        },
      },
      {
        title: '完结原因',
        dataIndex: 'completeReason',
        key: 'completeReason',
        width: 100,
        render: text => ISSUE_CLOSE_REASON[text] || null,
      },
      {
        title: '领取人',
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
        title: '工单状态',
        dataIndex: 'issueState',
        key: 'issueState',
        width: 80,
        render: text => ISSUE_STATUS[text],
      },
      {
        title: '操作',
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
              <IssueLog data={record} users={users} />
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
                  打标签
                </a>
              </div>
              <div>
                <a href={`${window.location.pathname}${window.location.search}&fg=viva-tools-issue#/issue_system/manual_issue/?duiddigest=${record.duiddigest}&issueState=-1`} target="_blank">
                  查看{record.reportCount ? `(${record.reportCount})` : ''}
                </a>
              </div>
            </div>
          )
        }
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
          }}
          rowSelection={rowSelection}
          rowKey="issueId"
          scroll={{ x: 1700 }}
        />
        <Modal
          width={900}
          title="回复"
          footer={null}
          visible={!!this.state.replyData}
          onCancel={() => this.setState({
            replyData: null,
          })
          }
        >
          <ReplyChat
            data={this.state.replyData || {}}
            tagList={issueTag}
          />
        </Modal>
        <Modal
          title="打标签"
          visible={!!this.state.toBeTaggedData}
          onCancel={() => this.setState({
            toBeTaggedData: null,
            selectedTagData: [],
            tagRemark: '',
          })}
          onOk={this.handleAddTag}
        >
          <Item label='标签' required>
            <TagSelect
              value={this.state.selectedTagData}
              onChange={(d) => {
                this.setState({ selectedTagData: d });
              }}
              list={issueTag}
              style={{ width: '100%' }}
            />
          </Item>
          <Item label='标签备注'>
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
        <Modal
          title="批量回复"
          visible={showMultipleReply}
          footer={null}
          onCancel={() => this.setState({
            showMultipleReply: false,
          })}
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
            }}
          />
        </Modal>
      </>
    );
  }
}

export default List;
