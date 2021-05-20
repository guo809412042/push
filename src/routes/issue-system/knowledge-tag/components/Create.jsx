import React, { Component } from 'react';
import {
  Form, Modal, Button, Input, Select, Popover, Row, Col, message,
} from 'antd';

import {
  getKnowledgeTags,
  createKnowledgeTag,
} from '../../../../services/issue/issue';

const FormItem = Form.Item;
const Option = Select.Option;

class Create extends Component {
  state ={
    visible: false,
    inputTagValue: '',
    tags1: [],
    tags2: [],
    tags3: [],
    visible1: false,
    visible2: false,
    visible3: false,
  };

  hide = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  }

  show = async () => {
    this.setState({ visible: true });
    this.getTags1();
  }

  handleTagChange = (value, type) => {
    switch (type) {
      case 1: this.getTags2(value); break;
      case 2: this.getTags3(value); break;
      default: break;
    }
  }

  handleAddTagInputChange = (e) => {
    this.setState({ inputTagValue: e.target.value });
  }

  handleAddTag = async (type) => {
    const { form: { getFieldValue, setFieldsValue }, onSearch } = this.props;
    const { inputTagValue } = this.state;
    if (!inputTagValue || !inputTagValue.trim()) {
      message.warn('请不要输入空值');
      return;
    }
    const tags = getFieldValue('tag');

    // 一级标签创建
    if (type === 1) {
      const { code, data, message: msg } = await createKnowledgeTag({ name: inputTagValue });
      if (code === 20003) {
        message.error(msg);
        return;
      }
      // 创建后成功
      this.getTags1();
      setFieldsValue({
        'tag[0]': data.id,
      });
      this.setState({ inputTagValue: '', visible1: false });
      onSearch && onSearch();
    }
    // 二级标签创建
    if (type === 2) {
      const parentId = tags[0];
      const { code, data, message: msg } = await createKnowledgeTag({ name: inputTagValue, parentId });
      if (code === 20003) {
        message.error(msg);
        return;
      }
      this.getTags2(parentId);
      setFieldsValue({
        'tag[1]': data.id,
      });
      this.setState({ inputTagValue: '', visible2: false });
      onSearch && onSearch();
    }
    // 三级标签创建
    if (type === 3) {
      const parentId = tags[1];
      const { code, data, message: msg } = await createKnowledgeTag({ name: inputTagValue, parentId });
      if (code === 20003) {
        message.error(msg);
        return;
      }
      this.getTags3(parentId);
      setFieldsValue({
        'tag[2]': data.id,
      });
      this.setState({ inputTagValue: '', visible3: false });
      onSearch && onSearch();
    }
  }

  getTags1 = async () => {
    const res = await getKnowledgeTags({ parentId: 0 });
    this.setState({
      tags1: res.data || [],
    });
  }

  getTags2 = async (parentId) => {
    if (!parentId) return;
    const res = await getKnowledgeTags({
      parentId,
    });
    this.setState({
      tags2: res.data || [],
    });
  }

  getTags3 = async (parentId) => {
    if (!parentId) return;
    const res = await getKnowledgeTags({
      parentId,
    });
    this.setState({
      tags3: res.data || [],
    });
  }


  render() {
    const {
      visible, inputTagValue, tags1, tags2, tags3, visible1, visible2, visible3,
    } = this.state;
    const { form: { getFieldDecorator, getFieldValue } } = this.props;

    const tags = getFieldValue('tag') || [];

    const modalProps = {
      title: '创建标签',
      visible,
      footer: false,
      onCancel: this.hide,
    };

    const Add = (type, title = '添加一级标签', isDisabled) => {
      let visibleKey = 'visible1';
      let visible = visible1;
      switch (type) {
        case 2:
          visibleKey = 'visible2';
          visible = visible2;
          break;
        case 3:
          visibleKey = 'visible3';
          visible = visible3;
          break;
        default: break;
      }

      return (
        <Popover
          title={title}
          trigger="click"
          visible={visible}
          onVisibleChange={(visible) => {
            if (isDisabled) return;
            this.setState({
              [visibleKey]: visible,
            });
          }}
          content={
            <Row type="flex" align="middle" gutter={6}>
              <Col span={18}>
                <Input value={inputTagValue} onChange={this.handleAddTagInputChange} />
              </Col>
              <Col span={6}>
                <Button size="small" onClick={() => this.handleAddTag(type)}>确认</Button>
              </Col>
            </Row>
          }
        >
          <Button disabled={isDisabled} style={{ marginLeft: 10 }} shape="circle" icon="plus" size="small" />
        </Popover>
      );
    };


    return <>
      <Button onClick={this.show} type="primary" icon="plus">创建</Button>
      <Modal {...modalProps} >
        <Form>
          <FormItem label="一级标签">
            {getFieldDecorator('tag[0]', {})(
              <Select style={{ width: 180 }} onChange={value => this.handleTagChange(value, 1)}>
                {
                  tags1.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)
                }
              </Select>,
            )}
            {Add(1, '添加一级标签')}
          </FormItem>
          <FormItem label="二级标签">
            {getFieldDecorator('tag[1]', {})(
              <Select disabled={!tags[0]} style={{ width: 180 }} onChange={value => this.handleTagChange(value, 2)}>
                {
                  tags2.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)
                }
              </Select>,
            )}
            {Add(2, '添加二级标签', !tags[0])}
          </FormItem>
          <FormItem label="三级标签">
            {getFieldDecorator('tag[2]', {})(
              <Select disabled={!tags[1]} style={{ width: 180 }} onChange={value => this.handleTagChange(value, 3)}>
                {
                  tags3.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)
                }
              </Select>,
            )}
            {Add(3, '添加三级标签', !tags[1])}
          </FormItem>
        </Form>
      </Modal>
    </>;
  }
}

export default Form.create()(Create);
