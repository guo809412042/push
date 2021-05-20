import React from 'react';
import {
  Table, Modal, Popconfirm, message,
} from 'antd';
import BraftEditor from 'braft-editor';

import { updateIssueType, removeIssueType } from '../../../../services/issue/issue-type';
import { formatHTMLToApp } from '../../../../utils/utils';
import { ISSUE_SUPPORT_PRODUCT } from '../../const';

import ReplyConfigForm from './ReplyConfigForm';
import PopoverComp from './PopoverComp';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editId: null,
    };
  }

  handleEdit = (data) => {
    this.setState({
      editId: data.id,
    });

    // FIXME: 显示弹窗后，表单实例才会创建，这里延时 100 毫秒，来确保表单实例存在
    setTimeout(() => {
      const { lang = '', productId, langDefault } = data;
      const [langCode = '', countryCode = ''] = lang.split('_');
      console.log('=====', langCode, countryCode);
      this.replyConfigFormRef.setFieldsValue({
        ...data,
        productId: String(productId),
        lang: langCode,
        countryCode: countryCode ? [countryCode] : [],
        issueReply: BraftEditor.createEditorState(data.issueReply),
        langDefault: +langDefault === 1,
      });
    }, 100);
  }

  handleSave = () => {
    const { editId } = this.state;
    const { dispatch } = this.props;
    this.replyConfigFormRef.validateFields(async (err, values) => {
      // console.log(values);
      // console.log(this.replyConfigFormRef);
      // return;
      if (err) return;
      try {
        await updateIssueType({
          id: editId,
          ...values,
          langDefault: values.langDefault ? 1 : 0,
          issueReply: formatHTMLToApp(values.issueReply.toHTML()),
        });
        dispatch({
          type: 'issue_system__reply_config/listInit',
        });
        this.setState({
          editId: null,
        });
        this.replyConfigFormRef.resetFields();
        message.success('更新成功');
      } catch (e) {
        message.error(e);
      }
    });
  }

  handleDelete = async (data) => {
    try {
      const { id, productId } = data;
      await removeIssueType(id, { productId });
      const { dispatch } = this.props;
      dispatch({
        type: 'issue_system__reply_config/listInit',
      });
      message.success('删除成功');
    } catch (e) {
      message.error(e);
    }
  }

  changeOrder = async (value, record) => {
    const { id, productId } = record;
    if (!value) {
      message.error('输入不能为空!');
      return;
    }
    try {
      await updateIssueType({
        orderNo: value,
        id,
        productId,
      });
      this.props.dispatch({
        type: 'issue_system__reply_config/listInit',
      });
      message.success('修改成功');
    } catch (error) {
      message.error('修改失败');
    }
  }

  render() {
    const {
      listData,
      listLoading,
      langAndCountry,
      countryAndLang,
    } = this.props;

    const column = [
      {
        title: '顺序',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 80,
        render: (text, record) => (
          <PopoverComp
            type="number"
            onChange={value => this.changeOrder(value, record)}
            placement="right"
          >
            <a>{text}</a>
          </PopoverComp>
        ),
      },
      {
        title: '产品',
        dataIndex: 'productId',
        key: 'productId',
        width: 100,
        render: text => ISSUE_SUPPORT_PRODUCT[text],
      },
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: '是否是自动化',
        dataIndex: 'type',
        key: 'type',
        render: (text) => {
          if (String(text) === '1') {
            return <span>是</span>;
          }
          return <span>否</span>;
        },
        width: 120,
      },
      {
        title: '问题',
        dataIndex: 'title',
        key: 'title',
        width: 200,
      },
      {
        title: '预设回复',
        dataIndex: 'issueReply',
        key: 'issueReply',
        render: text => <div dangerouslySetInnerHTML={{ __html: text }} />,
      },
      {
        title: '国家&语言',
        dataIndex: 'countryCode',
        key: 'countryCode',
        width: 100,
        render: (text, record) => <div>{text}--{record.lang}</div>,
      },
      {
        title: '操作',
        width: 80,
        render: (text, record) => (
          <div>
            <div>
              <a onClick={() => this.handleEdit(record)}>修改</a>
            </div>
            <div>
              <Popconfirm
                title="确认要删除这个标签？"
                onConfirm={() => this.handleDelete(record)}
              >
                <a>删除</a>
              </Popconfirm>
            </div>
          </div>
        ),
      },
    ];

    return (
      <>
        <Table rowKey="id" columns={column} dataSource={listData} loading={listLoading} />
        <Modal
          title="修改标签"
          visible={this.state.editId !== null}
          onCancel={() => {
            this.setState({ editId: null });
            this.replyConfigFormRef.resetFields();
          }}
          onOk={this.handleSave}
          destroyOnClose
        >
          <ReplyConfigForm
            type="edit"
            ref={ (ref) => { this.replyConfigFormRef = ref; } }
            langAndCountry={langAndCountry}
            countryAndLang={countryAndLang}
          />
        </Modal>
      </>
    );
  }
}

export default List;
