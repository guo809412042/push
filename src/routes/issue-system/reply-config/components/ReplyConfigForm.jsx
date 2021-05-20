import React from 'react';
import {
  Form, Input, Select, Button, Switch,
} from 'antd';
import _ from 'lodash';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

import {
  ISSUE_SUPPORT_PRODUCT,
} from '../../const';

const FormItem = Form.Item;
const Option = Select.Option;

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
  'link',
];

class ReplyConfigForm extends React.Component {
  getCountryArr = (v) => {
    const { langAndCountry = [] } = this.props;
    const selectedItem = langAndCountry.find(lang => lang.value === v);
    let countryArr = [];
    if (selectedItem && selectedItem.children) {
      countryArr = _.uniqBy(selectedItem.children, v => v.value).map(v => ({
        ...v,
        value: `${v.code}_${v.country_code}`,
      }));
    }
    return countryArr;
  }

  handleLanguageChange = () => {
    this.props.form.resetFields(['countryCode']);
  }

  handleSelectAllCountry = () => {
    const { countryAndLang, form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({
      countryCode: countryAndLang.map(v => v.country_code),
    });
  }

  render() {
    const { type = 'add' } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      langAndCountry = [],
      countryAndLang = [],
    } = this.props;
    console.log('countryAndLang', countryAndLang);
    console.log(this.props.form.getFieldsValue());
    return (
      <Form>
        <FormItem label="产品">
          {getFieldDecorator('productId', {
            rules: [
              {
                required: true,
                message: '必填',
              },
            ],
          })(
            <Select
              style={{ width: 150 }}
            >
              {Object.keys(ISSUE_SUPPORT_PRODUCT).map(k => <Option value={k} key={k}>{ISSUE_SUPPORT_PRODUCT[k]}</Option>)}
            </Select>,
          )}
        </FormItem>
        <FormItem label="语言">
          {getFieldDecorator('lang', {
            rules: [
              {
                required: true,
                message: '必填',
              },
            ],
          })(
            <Select
              disabled={type === 'edit'}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              // onChange={this.handleLanguageChange}
            >
              {langAndCountry.map(v => (
                <Option key={v.value} value={v.value}>
                  {`${v.label}-${v.value}`}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem label="国家">
          {getFieldDecorator('countryCode', {
            rules: [
              {
                required: true,
                message: '必填',
              },
            ],
          })(
            <Select
              showSearch
              optionFilterProp="children"
              mode="multiple"
              disabled={type === 'edit'}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {countryAndLang.map(v => (
                <Option key={v.country_code} value={v.country_code}>
                  {v.label}
                </Option>
              ))}
            </Select>,
          )}
          {
            type !== 'edit' && <Button size="small" onClick={this.handleSelectAllCountry}>全选</Button>
          }
        </FormItem>
        <FormItem label="是否作为默认语言">
          {getFieldDecorator('langDefault', {
            initialValue: false,
            valuePropName: 'checked',
          })(
            <Switch />,
          )}
        </FormItem>
        <FormItem label="问题">
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '必填',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="是否是自动化问题">
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '必填',
              },
            ],
          })(
            <Select>
              <Option key="1" value={1}>
                是
              </Option>
              <Option key="0" value={0}>
                否
              </Option>
            </Select>,
          )}
        </FormItem>
        <FormItem label="预设回复">
          {getFieldDecorator('issueReply', {
            validateTrigger: 'onBlur',
            rules: [{
              required: true,
              validator: (__, value, callback) => {
                if (value.isEmpty()) {
                  callback('请输入回复内容');
                } else {
                  callback();
                }
              },
            }],
          })(<BraftEditor
            controls={editorControls}
            placeholder="请输入回复内容"
          />)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(ReplyConfigForm);
