import React from 'react';
import {
  Popover, Row, Col, Button, Icon, Input, message,
} from 'antd';

import { updateKnowledgeTag } from '../../../../services/issue/issue';

class UpdateTag extends React.Component {
  state = {
    tabName: this.props.record.name,
    visible: false,
  }

  tagChange = (e) => {
    this.setState({ tabName: e.target.value });
  }

  updateTag = async () => {
    const { record, reFresh } = this.props;
    const { tabName } = this.state;
    const { code, message: msg } = await updateKnowledgeTag({
      name: tabName,
      id: record.id,
      parentId: record.parent_id,
    });
    if (code !== 20000) {
      message.error(msg);
      return false;
    }
    message.success('修改成功');
    this.setState({ visible: false });
    reFresh && reFresh();
  }

  render() {
    const { tabName, visible } = this.state;

    const content = (
      <Row type="flex" align="middle" gutter={6}>
        <Col span={18}>
          <Input value={tabName} onChange={this.tagChange} />
        </Col>
        <Col span={6}>
          <Button size="small" onClick={this.updateTag}>确认</Button>
        </Col>
      </Row>
    );

    return (
      <Popover
        title="修改标签名"
        trigger="click"
        content={content}
        visible={visible}
        onVisibleChange={(visible) => {
          this.setState({ visible });
        }}
      >
        <Icon onClick={() => { this.setState({ visible: true }); }} style={{ cursor: 'pointer' }} type="edit" />
      </Popover>
    );
  }
}

export default UpdateTag;
