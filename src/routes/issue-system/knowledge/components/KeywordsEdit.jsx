import React, { Component } from 'react';
import {
  Row, Col, Button, Popover, Select, Icon, message,
} from 'antd';

import { updateKnowledge } from '../../../../services/issue/issue';

class KeywordsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.keywords.split(','),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { keywords } = nextProps;
    if (keywords !== this.props.keywords) {
      this.setState({
        value: keywords.split(','),
      });
    }
  }


  handleChangeKeywords = async () => {
    const { value } = this.state;
    const { id } = this.props;
    const reqData = {
      id,
      keywords: value.toString(),
    };
    const res = await updateKnowledge(reqData);
    if (res.code === 20000) {
      this.props.onSuccess && this.props.onSuccess();
      message.success('更新成功');
    } else {
      message.error('更新失败');
    }
  };

  render() {
    const { value } = this.state;
    return (
      <Popover
        trigger="click"
        content={
          <Row type="flex" align="middle" gutter={6}>
            <Col span={18}>
              <Select
                mode="tags"
                style={{
                  minWidth: 150,
                }}
                tokenSeparators={[',']}
                value={value}
                onChange={(v) => {
                  this.setState({
                    value: v,
                  });
                }}
              />
            </Col>
            <Col span={6}>
              <Button size="small" onClick={this.handleChangeKeywords}>
                确认
              </Button>
            </Col>
          </Row>
        }
      >
        <Icon type="edit" />
      </Popover>
    );
  }
}

export default KeywordsEdit;
