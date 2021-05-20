import React, { Component } from 'react';
import { Cascader } from 'antd';

class TagSelect extends Component {
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
    this.setState({
      value,
    });
    const { onChange } = this.props;
    onChange && onChange(value);
  };

  getOptions = (list = []) => {
    const options = [];
    list.forEach((item) => {
      item.levelOne = item.levelOne.trim();
      item.levelTwo = item.levelTwo.trim();
      item.levelThree = item.levelThree.trim();
    });
    list.forEach((v) => {
      const {
        levelOne, levelTwo, levelThree, id,
      } = v;
      const l1Item = options.find(v => v.label === levelOne);
      if (l1Item) {
        const l2Item = l1Item.children.find(v => v.label === levelTwo);
        if (l2Item) {
          const l3Item = l2Item.children.find(v => v.label === levelThree);
          if (!l3Item) {
            l2Item.children.push({
              label: levelThree,
              value: id,
            });
          }
        } else {
          l1Item.children.push({
            value: levelTwo,
            label: levelTwo,
            children: [
              {
                label: levelThree,
                value: id,
              },
            ],
          });
        }
      } else {
        options.push({
          value: levelOne,
          label: levelOne,
          children: [
            {
              value: levelTwo,
              label: levelTwo,
              children: [
                {
                  label: levelThree,
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
    return <Cascader {...restProps} expandTrigger="hover" options={this.getOptions(list)} value={value} onChange={this.handleChange} showSearch />;
  }
}

export default TagSelect;
