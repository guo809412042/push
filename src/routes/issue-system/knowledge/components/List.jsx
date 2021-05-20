import {
  Col, Row, Table, Modal, message, Popconfirm, Tag,
} from 'antd';
import React, { Component } from 'react';

import _ from 'lodash';
import KeywordsEdit from './KeywordsEdit';
import KnowledgeEdit from './KnowledgeEdit';
import LogList from './LogList';
import CommentView from './CommentView';

import { updateKnowledge, deleteKnowledge } from '../../../../services/issue/issue';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditModalData: {},
      showLogModalData: {},
    };
  }

  handleDelete = async (data) => {
    const res = await deleteKnowledge(data.id);
    if (res.code === 20000) {
      message.success('删除成功');
      this.refreshList();
    } else {
      message.error('删除失败');
    }
  }

  handleEdit = () => {
    const { showEditModalData } = this.state;
    this.knowledgeRef.validateFields(async (error, data) => {
      console.log('data: ', data);
      if (error) {
        return;
      }
      const {
        comment, content, tag, keywords,
      } = data;
      const reqData = {
        ...data,
        id: _.get(showEditModalData, 'id'),
        tag: tag.toString(),
        keywords: keywords.toString(),
        comment: comment ? comment.toHTML() : '',
        content: content ? content.toHTML() : '',
      };
      console.log(reqData);
      const res = await updateKnowledge(reqData);
      if (res.code === 20000) {
        message.success('更新成功');
        this.setState({
          showEditModalData: {},
        });
        this.refreshList();
      } else {
        message.error('更新失败');
      }
    });
  }

  refreshList = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'issue_system__knowledge/listInit' });
  }

  render() {
    const {
      pagination,
      listData,
      listLoading,
      onChange,
      userMap,
    } = this.props;
    const { showLogModalData, showEditModalData } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '一级标签',
        width: 180,
        dataIndex: 'tag[0].name',
      },
      {
        title: '二级标签',
        width: 180,
        dataIndex: 'tag[1].name',
      },
      {
        title: '三级标签',
        width: 180,
        dataIndex: 'tag[2].name',
      },
      {
        title: '关键词',
        dataIndex: 'keywords',
        render: (text, record) => <div>
          <Row type="flex" align="middle">
            <Col span={16}>
              {text.split(',').map(v => <Tag>{v}</Tag>)}
            </Col>
            <Col span={8}>
              <KeywordsEdit id={record.id} keywords={text} onSuccess={this.refreshList} />
            </Col>
          </Row>
        </div>,
      },
      {
        title: '问题标题',
        key: 'title',
        dataIndex: 'title',
      },
      {
        title: '内容',
        width: 300,
        key: ' content',
        dataIndex: 'content',
        render: text => <div dangerouslySetInnerHTML={{
          __html: text,
        }} />,
      },
      {
        title: '备注',
        width: 300,
        key: 'comment',
        dataIndex: 'comment',
        render: text => <CommentView html={text} />,
      },
      {
        title: '操作',
        width: 120,
        render: data => <div>
          <div><a onClick={() => {
            this.setState({
              showEditModalData: data,
            });
          }}>编辑</a></div>
          <div>
            <Popconfirm
              title="确定要删除?"
              onConfirm={() => this.handleDelete(data)}
              okText="Yes"
              cancelText="No"
            >
              <a>删除</a>
            </Popconfirm>
          </div>
          <div><a onClick={() => {
            this.setState({
              showLogModalData: data,
            });
          }}>查看编辑记录</a></div>
        </div>,
      },
    ];
    return (
      <div>
        <Table columns={columns} rowKey="id" loading={listLoading} dataSource={listData} pagination={{
          ...pagination,
          onChange,
        }} />
        <Modal title="编辑"
          visible={!!_.get(showEditModalData, 'id')}
          onCancel={() => {
            this.setState({
              showEditModalData: {},
            });
          }}
          onOk={this.handleEdit}
          destroyOnClose
        >
          <KnowledgeEdit data={showEditModalData} ref={(ref) => { this.knowledgeRef = ref; }} />
        </Modal>
        <Modal
          title="操作记录"
          destroyOnClose visible={!!_.get(showLogModalData, 'id')}
          onOk={() => {
            this.setState({
              showLogModalData: {},
            });
          }}
          onCancel={() => {
            this.setState({
              showLogModalData: {},
            });
          }}
        >
          <LogList knowledgeId={_.get(showLogModalData, 'id')} userMap={userMap} />
        </Modal>
      </div>
    );
  }
}

export default List;
