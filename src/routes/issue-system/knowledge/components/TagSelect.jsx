import React, { Component } from 'react';
import { Cascader, Form } from 'antd';
// import _ from 'lodash';
import { getKnowledgeTags } from '../../../../services/issue/issue';

class TagSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagList: [],
    };
  }

  async componentDidMount() {
    const res = await getKnowledgeTags({ parentId: 0 });
    const tags1 = res.data;
    const tagList = tags1.map(tag => ({
      value: tag.id,
      label: tag.name,
      isLeaf: false,
    }));
    const { initValue = [] } = this.props;
    if (initValue && initValue.length > 1) {
      if (initValue.length >= 2) {
        const item = tagList.find(v => v.value === initValue[0].id);
        const { data } = await getKnowledgeTags({ parentId: initValue[0].id });
        item.children = data.map(v => ({
          value: v.id,
          label: v.name,
          isLeaf: false,
        }));
        if (initValue.length === 3) {
          item.children[0].children = [{
            value: initValue[2].id,
            label: initValue[2].name,
            isLeaf: true,
          }];
        }
      }
    }
    this.setState({
      tagList,
    });
  }

  handleChange = (value) => {
    const { onChange } = this.props;
    onChange && onChange(value);
  };

  loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    targetOption.loading = true;
    const { data } = await getKnowledgeTags({ parentId: targetOption.value });
    data.forEach((item) => {
      item.parent = targetOption;
      item.isLeaf = false;

      if (item.parent?.parent) {
        item.isLeaf = true;
      }
    });

    targetOption.children = data.map(tag => ({
      value: tag.id,
      label: tag.name,
      parent: tag.parent,
      isLeaf: tag.isLeaf,
    }));

    targetOption.loading = false;
    this.setState({
      tagList: [...this.state.tagList],
    });
  };

  render() {
    const {
      tagList,
    } = this.state;
    const { initValue = [], form: { getFieldDecorator } } = this.props;
    const defaultValue = initValue.map(v => v.id);

    return (
      <Form>
        <Form.Item style={{ marginBottom: 0 }}>
          {getFieldDecorator('cascader', {
            initialValue: defaultValue,
          })(
            <Cascader
              options={tagList}
              onChange={this.handleChange}
              loadData={this.loadData}
              changeOnSelect
              placeholder="选择标签"
              expandTrigger="hover"
            />,
          )}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(TagSelect);
