import React from 'react';
import {
  Table, Modal, Popconfirm, message,
} from 'antd';
import TagForm from './TagForm';

import { updateIssueTag, removeIssueTag } from '../../../../services/issue/issue-tag';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editId: null,
      productId: 2,
    };
  }

  handleEdit = (data) => {
    this.setState({
      editId: data.id,
      productId: data.productId,
    });
    // FIXME: 显示弹窗后，表单实例才会创建，这里延时 100 毫秒，来确保表单实例存在
    setTimeout(() => {
      this.tagFormRef.setFieldsValue(data);
    }, 100);
  }

  handleSave = () => {
    const { editId, productId } = this.state;
    const { dispatch } = this.props;
    this.tagFormRef.validateFields(async (err, values) => {
      if (err) return;
      try {
        await updateIssueTag({
          id: editId,
          productId,
          ...values,
        });
        dispatch({
          type: 'issue_system__service_tag/listInit',
        });
        this.setState({
          editId: null,
        });
        message.success('更新成功');
      } catch (e) {
        message.error(e);
      }
    });
  }

  handleDelete = async (data) => {
    try {
      const { id, productId } = data;
      await removeIssueTag(id, { productId });
      const { dispatch } = this.props;
      dispatch({
        type: 'issue_system__service_tag/listInit',
      });
      message.success('删除成功');
    } catch (e) {
      message.error(e);
    }
  }

  render() {
    const {
      listData,
      listLoading,
    } = this.props;
    const column = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '一级标签',
        dataIndex: 'levelOne',
        key: 'levelOne',
      },
      {
        title: '二级标签',
        dataIndex: 'levelTwo',
        key: 'levelTwo',
      },
      {
        title: '三级标签',
        dataIndex: 'levelThree',
        key: 'levelThree',
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
        <Table columns={column} dataSource={listData} loading={listLoading} />
        <Modal
          title="修改标签"
          visible={this.state.editId !== null}
          onCancel={() => this.setState({ editId: null })}
          onOk={this.handleSave}
        >
          <TagForm ref={ (ref) => { this.tagFormRef = ref; } } />
        </Modal>
      </>
    );
  }
}

export default List;
