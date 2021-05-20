import React from 'react';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

const TagForm = (props) => {
  const { getFieldDecorator } = props.form;
  return (
    <div>
      <FormItem label="一级标签">
        {getFieldDecorator('levelOne', {
          rules: [{
            required: true,
            message: '必填',
          }],
        })(
          <Input />,
        )}
      </FormItem>
      <FormItem label="二级标签">
        {getFieldDecorator('levelTwo', {
          rules: [{
            required: true,
            message: '必填',
          }],
        })(
          <Input />,
        )}
      </FormItem>
      <FormItem label="三级标签">
        {getFieldDecorator('levelThree', {
          rules: [{
            required: true,
            message: '必填',
          }],
        })(
          <Input />,
        )}
      </FormItem>
    </div>
  );
};

export default Form.create()(TagForm);
