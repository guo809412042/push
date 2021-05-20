import 'braft-editor/dist/index.css';

import React, { Component } from 'react';
import {
  Form, Select, Input, Row, message, Tooltip, Icon,
} from 'antd';
import BraftEditor from 'braft-editor';
import TagSelect from './TagSelect';

import { getAliOssSts } from '../../../../services/common/utils';

import styles from '../../../../styles/index.css';

const FormItem = Form.Item;

const editorControls = [
  'undo',
  'redo',
  'clear',
  'separator',
  'text-color',
  'bold',
  'italic',
  'underline',
  'remove-styles',
  'emoji',
];

class KnowledgeEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { data = {} } = this.props;
    const {
      title,
      keywords,
      content,
      comment,
    } = data;
    setTimeout(() => {
      this.props.form.setFieldsValue({
        title,
        keywords: keywords ? keywords.split(',') : [],
        content: BraftEditor.createEditorState(content),
        comment: BraftEditor.createEditorState(comment),
      });
    }, 10);
  }


  customRequest = async ({
    file,
    progress,
    error,
    success,
    // filename,
  }) => {
    try {
      const onProgress = async (p) => {
        const percent = p * 100;
        progress({
          percent,
        });
      };
      const url = await getAliOssSts(file, onProgress);
      success({
        url,
      });
    } catch (e) {
      message.error('上传失败！');
      error(e);
    }
    this.hideLoading();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data = {} } = this.props;
    const { tag = [] } = data;

    return (
      <Form>
        <Row >
          <FormItem label="标签" className={styles.marginPxForItem}>
            {getFieldDecorator('tag', {
              rules: [{
                required: true,
                message: '请选择标签',
              }],
              initialValue: tag.map(v => v.id),
            })(
              <TagSelect initValue={tag} />,
            )}
          </FormItem>
        </Row>
        <FormItem label="问题标题" className={styles.marginPxForItem}>
          {getFieldDecorator('title', {
            rules: [{
              required: true,
              message: '请输入标题',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem label={
          <span>
            关键词
            <Tooltip title="支持多个关键词，不同的关键词之间以英文逗号隔开">
              <Icon type="question-circle" />
            </Tooltip>
          </span>
        } className={styles.marginPxForItem}>
          {getFieldDecorator('keywords', {
            rules: [{
              required: true,
              message: '请输入关键词',
            }],
          })(<Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']} />)}
        </FormItem>
        <FormItem label="内容" className={styles.marginPxForItem}>
          {getFieldDecorator('content', {
            validateTrigger: 'onBlur',
            rules: [{
              required: true,
              validator: (_, value, callback) => {
                if (value.isEmpty()) {
                  callback('请输入正文内容');
                } else {
                  callback();
                }
              },
            }],
          })(<BraftEditor controls={editorControls} />)}
        </FormItem>
        <FormItem label="备注" className={styles.marginPxForItem}>
          {getFieldDecorator('comment')(<BraftEditor media={ { uploadFn: this.customRequest }} />)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(KnowledgeEdit);
