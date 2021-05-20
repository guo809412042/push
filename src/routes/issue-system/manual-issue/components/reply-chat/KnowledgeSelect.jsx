import React, { Component } from 'react';
import {
  Select, Row, Col, Spin, Tooltip, Icon,
} from 'antd';
import _ from 'lodash';
import TagSelect from '../../../knowledge/components/TagSelect';

import { getKnowledgeList } from '../../../../../services/issue/issue';

const { Option } = Select;

class KnowledgeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: '',
      loading: false,
      tagValue: [],
    };
  }

  handleChange = (v) => {
    const { onChange } = this.props;
    this.setState({
      value: v,
    });
    if (v) {
      onChange && onChange(v);
    }
  }

  handleTagChange = (value) => {
    this.setState({ tagValue: value });
  }

  fetchList = (value) => {
    const { initKnowledgeTag, commonTagId } = this.props;
    const initTagValue = initKnowledgeTag.length ? initKnowledgeTag.map(v => v.id).toString() : '';

    const { tagValue } = this.state;
    let tag = tagValue.length ? tagValue.filter(v => v).toString() : initTagValue;
    console.log('tag: ', tag);
    if (commonTagId) {
      tag += `|${commonTagId}`;
    }

    this.setState({
      data: [],
      loading: true,
    });
    getKnowledgeList({
      tag,
      text: value,
      pageSize: 100,
    }).then((res) => {
      this.setState({
        loading: false,
        data: _.get(res, 'data.list', []),
      });
    });
  }

  render() {
    const {
      loading, data, value,
    } = this.state;
    const { initKnowledgeTag } = this.props;

    return (
      <div>
        <Row type="flex" gutter={12} justify="space-around" align="middle">
          <Col span={5}>
            标签：
          </Col>
          <Col span={19}>
            <TagSelect onChange={this.handleTagChange} initValue={initKnowledgeTag} />
          </Col>
        </Row>
        <Row type="flex" align="middle" justify="space-between" style={{ margin: '5px auto' }}>
          <Col span={5}>
            <span>搜索</span>
            <Tooltip title="支持在关键词、标题中进行搜索">
              <Icon type="question-circle" />
            </Tooltip>
          </Col>
          <Col span={19}>
            <Select
              size="small"
              showSearch
              value={value}
              notFoundContent={loading ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={this.fetchList}
              onFocus={this.fetchList}
              onChange={this.handleChange}
              style={{ width: '100%' }}
            >
              {data.map(d => (
                <Option key={d.id} value={d.content}>{d.title}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>
    );
  }
}

export default KnowledgeSelect;
