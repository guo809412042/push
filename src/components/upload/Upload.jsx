import React, { Component } from 'react';
import {
  Upload, Icon, Progress, Spin, message, Button,
} from 'antd';
import intl from 'react-intl-universal';
import styles from './upload.less';

import { getAliOssSts } from '../../services/common/utils';

class upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percent: '0',
      upload: '',
      spinning: false,
      maxSize: this.props.maxSize ? this.props.maxSize : 100,
    };
    this.changePercent = this.changePercent.bind(this);
    this.changeResult = this.changeResult.bind(this);
    this.triggerChange = this.triggerChange.bind(this);
    this.showLoading = this.showLoading.bind(this);
    this.hideLoading = this.hideLoading.bind(this);
  }

  componentWillMount() {
    if (this.props.value) {
      this.setState({
        upload: this.props.value,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        upload: nextProps.value,
      });
    }
    // if (!nextProps.value) {
    //   this.setState({ spinning: false, percent: '0' })
    // }
  }

  removeImg = (e) => {
    e.stopPropagation();
    this.setState(
      {
        upload: {
          url: '',
        },
        percent: 0,
        spinning: false,
      },
      this.triggerChange,
    );
  };

  showLoading() {
    this.setState({
      spinning: true,
    });
  }

  hideLoading() {
    this.setState({
      spinning: false,
    });
  }

  changePercent(percent) {
    this.setState({
      percent,
    });
  }

  triggerChange(file) {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state.upload));
    }

    //  自定义回调
    const callBack = this.props.callBack;
    if (callBack) {
      callBack(Object.assign({}, this.state.upload));
    }

    this.props.onFileChange && this.props.onFileChange(file, this.state.upload);
  }

  changeResult(result) {
    this.setState({
      upload: result,
    });
  }

  render() {
    const state = this.state;
    const changePercent = this.changePercent;
    const changeResult = this.changeResult;
    const triggerChange = this.triggerChange;
    const showLoading = this.showLoading;
    const hideLoading = this.hideLoading;

    // 支持任意文件类型上传
    const { isAnyFileType } = this.props;

    const props = {
      customRequest(file) {
        (async () => {
          if (file.file.type.indexOf('image') !== -1) {
            if (file.file.size >= 512000) {
              message.error('上传图片超过500K,请压缩后再上传');
              return false;
            }
            if (file.file.size >= state.maxSize * 1024) {
              const confirm = window.confirm(`上传图片超过${state.maxSize}K,是否继续上传？`);
              if (!confirm) return false;
            }
          }
          await showLoading();

          const progress = async (p) => {
            changePercent(p * 100);
          };
          const url = await getAliOssSts(file.file, progress);
          changeResult({ url });
          await hideLoading();
          triggerChange(file);
        })();
      },
      showUploadList: false,
    };
    return (
      <div>
        <Upload {...props} className={styles.avatarUploader} style={this.props.style}>
          {// eslint-disable-next-line
          this.state.upload.url ? (
              isAnyFileType ? (
                <div>
                  <span>{this.state.upload.url}</span>
                  <Button type="primary" onClick={this.removeImg} style={{ marginLeft: '20px' }}>
                    {intl.get('tools.appscreem.clear').defaultMessage('清除')}
                  </Button>
                </div>
              ) : (
                <div>
                  <img
                    src={this.state.upload.url}
                    alt=""
                    className={styles.avatar}
                    style={this.props.style}
                  />
                  <Button type="primary" onClick={this.removeImg} style={{ marginLeft: '20px' }}>
                    {intl.get('tools.appscreem.clear').defaultMessage('清除图片')}
                  </Button>
                </div>
              )
            ) : (
              <div>
                <Spin spinning={this.state.spinning} />
                <Icon type="plus" className={styles.avatarUploaderTrigger} style={this.props.style} />
                <Progress percent={parseInt(this.state.percent, 10)} />
              </div>
            )}
        </Upload>
      </div>
    );
  }
}

export default upload;
