import React, { Component } from 'react';
import {
  Button, Input, Radio, Upload, Row, Col, Progress, message,
} from 'antd';

import styles from './MediaUpload.less';

import { getAliOssSts } from '../../services/common/utils';

class MediaUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
      type: 'image',
      url: '',
      percent: 0,
      status: '',
    };
  }

  showLoading = () => {
    this.setState({
      spinning: true,
    });
  };

  hideLoading = () => {
    this.setState({
      spinning: false,
    });
  };

  triggerChange = () => {
    const { onChange } = this.props;
    const { type, url } = this.state;
    onChange && onChange({ type, url });
  };

  customRequest = async ({
    file,
    onProgress,
    onError,
    onSuccess,
    // filename,
  }) => {
    this.showLoading();
    this.setState({
      status: 'active',
    });
    try {
      const progress = async (p) => {
        const percent = p * 100;
        onProgress({
          percent,
        });
        this.setState({
          percent,
        });
      };
      const url = await getAliOssSts(file, progress);
      onSuccess(url);
      this.setState(
        {
          url,
          status: '',
        },
        () => {
          this.triggerChange();
        },
      );
    } catch (e) {
      this.setState({
        status: 'exception',
      });
      message.error('上传失败！');
      onError(e);
    }
    this.hideLoading();
  };

  render() {
    const {
      type, url, spinning, percent, status,
    } = this.state;
    return (
      <div className={styles.root}>
        <Radio.Group
          buttonStyle="solid"
          value={type}
          onChange={e => this.setState(
            {
              type: e.target.value,
            },
            () => {
              this.triggerChange();
            },
          )
          }
        >
          <Radio.Button value="image">图片</Radio.Button>
          <Radio.Button value="video">视频</Radio.Button>
        </Radio.Group>
        <Row type="flex" justify="middle" style={{ margin: '10px 0' }}>
          <Col span={4}>URL:</Col>
          <Col span={20}>
            <Input
              disabled={type === 'video'}
              value={this.state.url}
              onChange={e => this.setState(
                {
                  url: e.target.value,
                },
                () => {
                  this.triggerChange();
                },
              )
              }
            />
          </Col>
        </Row>
        <Upload
          style={{ width: '100%', display: 'block' }}
          disabled={spinning}
          customRequest={this.customRequest}
          showUploadList={false}
        >
          <Button block type="primary" icon="upload" loading={spinning}>
            上传
          </Button>
        </Upload>
        {(spinning || status === 'exception') && <Progress percent={percent} status={status} />}
        <div className={styles.preview}>
          {type === 'image' && url && url.trim() && <img src={url} alt="" />}
          {type === 'video' && url && url.trim() && <video controls src={url} />}
        </div>
      </div>
    );
  }
}

export default MediaUpload;
