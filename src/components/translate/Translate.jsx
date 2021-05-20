import React, { Component } from 'react';
import {
  Popover, Button, message, Spin,
} from 'antd';
import ReactDOM from 'react-dom';
import Title from './Title';
import Content from './Content';
import { translate } from '../../services/app';

class Translate extends Component {
  static defaultProps = {
    tagName: 'div',
    trigger: 'click',
    showButton: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      sourceContent: '',
      targetContent: '',
      translating: false,
    };
  }

  elementRef = null;

  componentDidMount() {
    const { showButton } = this.props;
    let sourceContent = '';
    if (showButton) {
      sourceContent = this.elementRef ? this.elementRef.innerHTML : '';
    } else {
      // eslint-disable-next-line react/no-find-dom-node
      const element = ReactDOM.findDOMNode(this);
      if (element instanceof Text) {
        sourceContent = element.wholeText;
      } else if (element instanceof Element) {
        sourceContent = element.innerHTML;
      }
    }
    this.setState({
      sourceContent,
    });
  }

  componentWillUnmount() {
    this.elementRef = null;
  }

  handlePopupVisible = (visible) => {
    this.setState({
      show: visible,
    });
  };

  handleOk = () => {
    const { onOk } = this.props;
    const { targetContent, sourceContent } = this.state;
    this.setState({
      show: false,
    });
    onOk && onOk(targetContent, sourceContent);
  };

  handleTranslate = async (sourceLang, targetLang) => {
    this.setState({
      translating: true,
    });
    try {
      const { sourceContent } = this.state;
      const { data } = await translate({
        text: sourceContent,
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
    const { children, showButton, trigger } = this.props;
    const { sourceContent, targetContent, show } = this.state;
    if (showButton) {
      return (
        <>
          <div style={{ height: 0, position: 'relative' }}>
            <Popover
              placement="left"
              title={<Title onSubmit={this.handleTranslate} />}
              content={
                <Spin spinning={this.state.translating} tip="翻译中...">
                  <Content source={sourceContent} target={targetContent} onOk={this.handleOk} />
                </Spin>
              }
              trigger={trigger}
              onVisibleChange={this.handlePopupVisible}
              visible={show}
            >
              <Button
                size="small"
                type="primary"
                ghost
                style={{ position: 'absolute', top: 0, right: 0 }}
              >
                翻译
              </Button>
            </Popover>
          </div>
          <div
            ref={(ref) => {
              this.elementRef = ref;
            }}
          >
            {children}
          </div>
        </>
      );
    }
    return (
      <Popover
        title={<Title onSubmit={this.handleTranslate} />}
        content={
          <Spin spinning={this.state.translating} tip="翻译中...">
            <Content source={sourceContent} target={targetContent} onOk={this.handleOk} />
          </Spin>
        }
        trigger={trigger}
        onVisibleChange={this.handlePopupVisible}
        visible={show}
      >
        {children}
      </Popover>
    );
  }
}

export default Translate;
