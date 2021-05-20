import React from 'react';
import {
  Table, Modal, Popover, message, Button, Tag, Popconfirm, Form, Input,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import XLSX from 'xlsx';
// import Clipboard from 'clipboard';
import ReplyChat from './reply-chat/ReplyChat';
import Chat from './reply-chat/Chat';
import Reply from './reply-chat/Reply';
import MessageView from './reply-chat/MessageView';
import TagSelect from './TagSelect';

import { updateIssue, createIssueTagRecord, sendIssueToQualityApi, batchSendIssueToQualityApi } from '../../../../services/issue/issue';
import {
  ISSUE_STATUS,
  MESSAGE_STATUS,
  VIP_STATUS,
  ISSUE_SORT_ORDER_TYPE,
  ISSUE_STATUS_CODE,
  IssueTagReportSourceTypeMap,
  ISSUE_SUPPORT_PRODUCT,
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
      switchToQualityStatus: false,
    };
  }
  // 表格 页码发送改变的时候
  handleTableChange = (pagination, filter, sorter = {}) => {
    const { dispatch, formFields } = this.props;
    const { current, pageSize } = pagination;
    dispatch({
      type: 'issue_system__manual_issue/savePagination',
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
      type: 'issue_system__manual_issue/saveFormFields',
      payload: {
        data: {
          ...formFields,
          orderType,
          orderField,
        },
      },
    });

    dispatch({ type: 'issue_system__manual_issue/listInit' });
  };

  handleAddTag = async () => {
    const { toBeTaggedData, selectedTagData, tagRemark, } = this.state;
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
        const respTag = await updateIssue({
          issueId,
          evaluationTypeId: tagId,
          tagRemark,
        });
        const { success } = respTag.data || {};
        if (!success) {
          message.error('保存失败');
          return false;
        }
        dispatch({ type: 'issue_system__manual_issue/listInit' });
        this.setState({
          toBeTaggedData: null,
          selectedTagData: [],
          tagRemark: '',
        });
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
    } else {
      message.error('请选择标签');
    }
  };

  handleSwitchToQuality = () => {
    const { switchToQualityStatus } = this.state;
    const curState = {
      switchToQualityStatus: !switchToQualityStatus,
    }

    if (switchToQualityStatus) {
      Object.assign(curState, {
        selectedRowKeys: [],
      });
    }
    this.setState(curState)
  };

  handleBatchSendIssueToQuality = async () => {
    const { selectedRows, selectedRowKeys, } = this.state;
    const canDrawStates = [1, 2, 3];
    const canDrawIssues = selectedRows.filter(item => canDrawStates.includes(+item.issueState));
    // 批量录入
    if (!canDrawIssues.length) {
      message.warn('此工单状态下，不能录入质检!');
      return;
    }
    const ids = canDrawIssues.map(item => item.issueId);
    const resp = await batchSendIssueToQualityApi({
      sourceIdList: ids,
      type: 1
    })
    const { code } = resp;
    if (+code === 20000) {
      message.success('添加质检成功');
    } else {
      message.error(resp.message || '添加质检失败');
    }
    this.onPageChange();
  };

  // 选着批量勾选事件
  handleSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys, selectedRows });
  };

  // 一键领取按钮
  handleBatchDrawIssue = async () => {
    const { selectedRows } = this.state;
    const { dispatch, user } = this.props;
    const canDrawStates = [0, 1, 2];
    const canDrawIssues = selectedRows.filter(item => canDrawStates.includes(item.issueState));
    if (canDrawIssues.length === 0) {
      message.warn('没有可以供您领取的工单!');
      return;
    }

    try {
      const userId = _.get(user, 'user.id', '');
      await Promise.all(
        canDrawIssues.map(v => updateIssue({
          issueId: v.issueId,
          operateName: userId,
          issueState: v.issueState === 0 ? 1 : v.issueState, // 只更新 【未领取】 的状态为 已领取
          serviceCreateTime: v.serviceCreateTime || new Date(),
        })),
      );
      dispatch({ type: 'issue_system__manual_issue/listInit' });
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

  sendIssueToQuality = async (sourceId, issueState) => {
    if ([0, 4, 5].includes(+issueState)) {
      message.error('未处理的工单不能录入质检');
      return false;
    }
    const resp = await sendIssueToQualityApi({
      sourceId,
      type: 1,
    })
    const { code } = resp;
    if (+code === 20000) {
      message.success('添加质检成功');
    } else {
      message.error(resp.message || '添加质检失败');
    }
  };
  // 批量下载
  handleBatchDownloadIssue = () => {
    const { selectedRows } = this.state;
    const { issueType } = this.props;
    const rows = [
      [
        'ID',
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
      ],
    ];
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

  handleTagChange = (tagId) => {
    const {
      replyData,
    } = this.state;
    if (replyData) {
      const newReplyData = {
        ...replyData,
        evaluationTypeId: tagId,
      };
      this.setState({
        replyData: newReplyData,
      });
    }
  }
  // 显示回复
  canReply = (record) => {
    const { user } = this.props;
    const userId = _.get(user, 'user.id', '');
    const canReplyStates = [ISSUE_STATUS_CODE.ASSIGNED, ISSUE_STATUS_CODE.PROCESSING];
    return userId && String(userId) === String(record.operateName) && canReplyStates.includes(record.issueState);
  };

  canSendQuality = () => {
    const menus = window._VCM_ ? window._VCM_.menu : [];
    
    // 质检操作按钮
    const child = (menus.find(v => v.name === '权限管理') || {}).child || [];
    const status = child.find(v => v.value === '_right/send_issueto_quality');
    return status;
  };

  // 点击复制功能
  handleCopy = (record) => {
    const content = `手机系统: ${record.sysVer}\n设备机型: ${record.deviceType}\nAPP 版本: ${record.appVersion}\nauid: ${record.auid}\nduiddigest: ${record.duiddigest}\nappKey: ${record.appKey}\n渠道: ${record.channel}\n国家: ${record.countryCode}\n语言: ${record.lang}`;

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
      pagination, listData, listLoading, issueTag, issueType, users, dispatch, userMap, formFields,
    } = this.props;
    const {
      selectedRowKeys, selectedRows, showMultipleReply, switchToQualityStatus,
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
      getCheckboxProps: record => {
        // 处理中 2 待领取 0 已领取 1 这3个状态都要可勾选
        const { issueState } = record;
        const status = [0, 1, 2].includes(+issueState);

        return {
          disabled: !status && !switchToQualityStatus,
        }
      }
    };

    const column = [
      {
        title: '产品',
        dataIndex: 'productId',
        key: 'productId',
        width: 100,
        fixed: 'left',
        // 这里面可以根据显示服务端返回来的值,来判断显示什么样的数据
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
        title: '人工工单生成时间',
        sorter: true,
        dataIndex: 'operateIssueCreateTime',
        key: 'operateIssueCreateTime',
        width: 120,
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
      },
      {
        title: '客服领取时间',
        sorter: true,
        dataIndex: 'serviceCreateTime',
        key: 'serviceCreateTime',
        width: 120,
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
      },
      {
        title: '客服首次回复时间',
        sorter: true,
        dataIndex: 'replyTime',
        key: 'replyTime',
        width: 120,
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
      },
      {
        title: '人工工单解决时间',
        sorter: true,
        dataIndex: 'completeTime',
        key: 'completeTime',
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
            const { levelOne, levelTwo, levelThree } = tag;
            return <Tag>{`${levelOne}/${levelTwo}/${levelThree}`}</Tag>;
          }
          return null;
        },
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
        width: 120,
        fixed: 'right',
        render: (text, record) => {
          let tagList = [];
          const { evaluationTypeId, tagRemark, issueId, issueState } = record;
          const tag = issueTag.find(v => String(v.id) === String(evaluationTypeId));
          if (tag) {
            const {
              levelOne,
              levelTwo,
            } = tag;
            tagList = [levelOne.trim(), levelTwo.trim(), evaluationTypeId];
          }
          const canSendQualityStatus = this.canSendQuality();

          return (
            <div>
              {this.canReply(record) && (
                <div>
                  <a
                    onClick={() => {
                      this.setState({
                        replyData: record,
                      });
                    }}
                  >
                    回复
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
                  打标签
                </a>
              </div>
              <div>
                <a
                  href={`${window.location.pathname}${window.location.search}&fg=viva-tools-issue#/issue_system/manual_issue/?duiddigest=${record.duiddigest}&productId=${formFields.productId}&issueState=-1`}
                  target="_blank"
                >
                  查看{record.reportCount ? `(${record.reportCount})` : ''}
                </a>
              </div>
              {
                canSendQualityStatus && (
                  <div>
                    <Popconfirm
                      placement="rightBottom"
                      title="确定要将此工单加入质检抽样吗？"
                      onConfirm={() => this.sendIssueToQuality(issueId, issueState)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <a>
                        录入质检
                      </a>
                    </Popconfirm>
                  </div>
                )
              }
            </div>
          )
        }
      },
    ];
    let buttonDisableStatus = false;
    if (selectedRowKeys.length === 0) {
      buttonDisableStatus = true;
    } else {
      if (switchToQualityStatus) {
        buttonDisableStatus = true
      }
    }
    const canSendQualityStatus = this.canSendQuality();
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
          scroll={{ x: 2180 }}
        />
        <div
          style={{
            position: 'fixed',
            bottom: '10px',
            left: '276px',
            zIndex: 1,
          }}
        >
          <Button
            disabled={buttonDisableStatus}
            style={{ marginRight: 10 }}
            onClick={this.handleBatchDrawIssue}
          >
            一键领取
          </Button>
          {/* <Button
            disabled={selectedRowKeys.length === 0}
            style={{ marginRight: 10 }}
            onClick={this.handleBatchReplyIssue}
          >
            批量回复
          </Button> */}
          <Button
            disabled={buttonDisableStatus}
            style={{ marginRight: 10 }}
            onClick={this.handleBatchDownloadIssue}
          >
            批量下载
          </Button>
          {
            canSendQualityStatus && (
              <>
              {
                +formFields.issueState === 3 && (
                  <Button
                    style={{ marginRight: 10 }}
                    onClick={this.handleSwitchToQuality}
                  >
                    { switchToQualityStatus ? '取消录入' : '录入选择'  }
                  </Button>
                )
              }
                <Button
                  disabled={selectedRowKeys.length === 0}
                  style={{ marginRight: 10 }}
                  onClick={this.handleBatchSendIssueToQuality}
                >
                  批量录入
                </Button>
              </>
            )
          }
        </div>
        <Modal
          width={900}
          title={
            <div>
              回复 [
              {getIssueTagText(_.get(this.state, 'replyData.evaluationTypeId'), issueTag) ? (
                <Tag>{getIssueTagText(_.get(this.state, 'replyData.evaluationTypeId'), issueTag)}</Tag>
              ) : (
                '未打标签'
              )}
              ]
            </div>
          }
          footer={null}
          visible={!!this.state.replyData}
          onCancel={() => {
            dispatch({ type: 'issue_system__manual_issue/listInit' });
            this.setState({
              replyData: null,
            });
          }}
        >
          <ReplyChat userMap={userMap} data={this.state.replyData || {}} tagList={issueTag} onTagChange={this.handleTagChange} />
        </Modal>
        <Modal
          title="打标签"
          visible={!!this.state.toBeTaggedData}
          onCancel={() => this.setState({
            toBeTaggedData: null,
            selectedTagData: [],
          })
          }
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
          })
          }
        >
          <Reply
            multiple
            issueIds={selectedRowKeys}
            issueList={selectedRows}
            tagList={issueTag}
            onReplySuccess={() => {
              dispatch({ type: 'issue_system__manual_issue/listInit' });
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
