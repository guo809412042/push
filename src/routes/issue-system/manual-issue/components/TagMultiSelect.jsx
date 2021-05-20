import React, { Component } from 'react';
import { TreeSelect } from 'antd';

class TagMultiSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  handleChange = (value) => {
    console.log('=====', value);
    this.setState({
      value,
    });
    const { onChange } = this.props;
    onChange && onChange(value);
  };


  getOptions = (list = []) => {
    const options = [];
    list.forEach((v) => {
      const {
        levelOne, levelTwo, levelThree, id,
      } = v;
      const l1Item = options.find(v => v.title === levelOne);
      if (l1Item) {
        const l2Item = l1Item.children.find(v => v.title === levelTwo);
        if (l2Item) {
          const l3Item = l2Item.children.find(v => v.title === levelThree);
          if (!l3Item) {
            l2Item.children.push({
              title: levelThree,
              value: id,
            });
          }
        } else {
          l1Item.children.push({
            value: `${levelOne}-${levelTwo}-l2`,
            title: levelTwo,
            children: [
              {
                title: levelThree,
                value: id,
              },
              
            ],
          });
        }
      } else {
        options.push({
          value: `l${levelOne}-l1`,
          title: levelOne,
          children: [
            {
              value: `${levelOne}-${levelTwo}-l2`,
              title: levelTwo,
              children: [
                {
                  title: levelThree,
                  value: id,
                },
              ],
            },
          ],
        });
      }
    });
    return options;
  };

  render() {
    const {
      list, onChange, options, ...restProps
    } = this.props;
    const { value } = this.state;
    return (
      <TreeSelect
        {...restProps}
        style={{
          minWidth: 200,
          maxWidth: 500,
        }}
        treeCheckable
        treeData={this.getOptions(list)}
        allowClear
        value={value}
        onChange={this.handleChange}
        treeNodeFilterProp="title"
      />
    );
  }
}

export default TagMultiSelect;
