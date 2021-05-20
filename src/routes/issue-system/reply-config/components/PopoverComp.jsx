import React from 'react';
import { Popover, Input } from 'antd';

class PopoverComp extends React.Component {
  state = {
    visible: false,
    value: '',
  }

  handleOk = () => {
    const { onChange } = this.props;
    const { value } = this.state;

    onChange && onChange(value);
    this.setState({ visible: false, value: '' });
  }

  onChange = (e) => {
    const { type } = this.props;
    const { value } = e.target;
    if (type === 'number') {
      const reg = /^-?[0-9]*(\.[0-9]*)?$/;
      if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        this.setState({ value });
      }
    } else {
      this.setState({ value });
    }
  }

  render() {
    const {
      children, placement, type = '', placeholder,
    } = this.props;
    const { visible, value } = this.state;

    const content = (
      <div style={{ width: 200 }}>
        <Input
          onChange={this.onChange}
          style={{ width: 160 }}
          value={value}
          placeholder={placeholder || ''}
        />
        <a onClick={this.handleOk} style={{ marginLeft: 10 }}>
          确定
        </a>
      </div>
    );

    return (
      <Popover
        placement={placement || 'top'}
        content={content}
        trigger="click"
        visible={visible}
        onVisibleChange={(visible) => {
          this.setState({ visible });
        }}
        type={type}
      >
        {children}
      </Popover>
    );
  }
}

export default PopoverComp;
