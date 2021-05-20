import React, { Component } from 'react';
import { Button, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { translate } from '../../services/app';
import { handleCopyText, cpoyRichText } from '../../routes/issue-system/utils';

class TranslateText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translatedText: '',
      loading: false,
    };
    this.splitFlag = '$$';
  }

  handleTranslate = async () => {
    this.setState({
      loading: true,
    });
    try {
      const { text } = this.props;
      // const textParams = this.getTextParams(text);
      const { data } = await translate({
        text: text,
        target: 'zh',
      });
      // const dataText = this.rollBackTextNodes(text, data);
      this.setState({
        translatedText: data,
      });
    } catch (error) {
      message.error('翻译失败');
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  getTextParams = (text) => {
    if (!/<[^>]+>/g.test(text)) {
      return text;
    }
    const divEle = document.createElement('div');
    const list = [];
    let innerText = ''

    divEle.innerHTML = text;
    this.getDeepMapNodes(divEle, list);
    innerText = list.join('');
    innerText = innerText.slice(0, innerText.length - 4);
    return innerText;
  };

  getDeepMapNodes = (nodes, list) => {
    nodes.childNodes.forEach(ele => {
      if (ele.childNodes.length) {
        this.getDeepMapNodes(ele, list);
      } else {
        let innerText = ele.textContent;
        if (innerText && innerText.trim()) {
          innerText += ` ${this.splitFlag} `;
          list.push(innerText);
        }
      }
    })
  };

  setDeepMapNodes = (nodes, list) => {
    nodes.childNodes.forEach(ele => {
      if (ele.childNodes.length) {
        this.setDeepMapNodes(ele, list);
      } else if (ele.textContent && ele.textContent.trim()) {
        ele.textContent = list[0];
        list.shift();
      }
    })
  };

  rollBackTextNodes = (text, data) => {
    if (!/<[^>]+>/g.test(text)) {
      return data;
    }
    const formatData = data.split(this.splitFlag);
    const divEle = document.createElement('div');

    divEle.innerHTML = text;
    this.setDeepMapNodes(divEle, formatData);
    return divEle.innerHTML;
  };

  copyToClip = () => {
    const { text, richText } = this.props;
    const { translatedText } = this.state;
    if (richText) {
      cpoyRichText(text + '\r\n' + translatedText);
    } else {
      handleCopyText(text + '\r\n' + translatedText);
    }
  };

  render() {
    const { text } = this.props;
    const { translatedText, loading } = this.state;
    return (
      <>
        <span
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />
        {!translatedText && (
          <Button
            size="small"
            loading={loading}
            shape="circle"
            onClick={this.handleTranslate}
            icon="global"
          />
        )}
        <CopyToClipboard text={(text + '\r\n' + translatedText).replace(/<[^>]+>/g,"")}>
          <Button
            size="small"
            loading={loading}
            shape="circle"
            // onClick={this.copyToClip}
            icon="copy"
          />
        </CopyToClipboard>
        {translatedText && (
          <>
            <div>
              <b
                dangerouslySetInnerHTML={{
                  __html: translatedText,
                }}
              />
            </div>
          </>
        )}
      </>
    );
  }
}

export default TranslateText;
