import React, { Component } from 'react';
import {
  Popover, Button, Spin, message,
} from 'antd';
import Title from './Title';
import Content from './Content';
import { translate } from '../../services/app';

class Translate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      targetContent: '',
      translating: false,
    };
  }

  handlePopupVisible = (visible) => {
    this.setState({
      show: visible,
    });
  };

  handleOk = () => {
    const { onOk, text } = this.props;
    const { targetContent } = this.state;
    this.setState({
      show: false,
    });
    onOk && onOk(targetContent, text);
  };

  handleTranslate = async (sourceLang, targetLang) => {
    this.setState({
      translating: true,
    });
    try {
      const { text } = this.props;
      const { data } = await translate({
        text,
        target: targetLang,
        source: sourceLang,
      });
      this.setState({
        targetContent: data,
      });
    } catch (error) {
      message.error('翻译失败');
    }
    this.setState({
      translating: false,
    });
  };

  render() {
    const {
      text, onOk, okText, data, ...restProps
    } = this.props;
    const { targetContent, show } = this.state;
    return (
      <Popover
        title={<Title data={data} onSubmit={this.handleTranslate} />}
        content={
          <Spin spinning={this.state.translating} tip="翻译中...">
            <Content okText={okText} source={text} target={targetContent} onOk={this.handleOk} />
          </Spin>
        }
        trigger="click"
        onVisibleChange={this.handlePopupVisible}
        visible={show}
      >
        <Button size="small" type="primary" ghost {...restProps} />
      </Popover>
    );
  }
}

export default Translate;
