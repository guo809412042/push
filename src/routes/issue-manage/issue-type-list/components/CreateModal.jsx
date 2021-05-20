import React from 'react';
import {
  Modal, Form, Input, message,
} from 'antd';

import { createIssueType } from '../../../../services/issue';

import OneOrMuti from '../../../../components/form/OneOrMuti';


const FormItem = Form.Item;

const Comp = ({
  form: { getFieldDecorator }, k, formItemLayoutTXT,
}) => (
  <div>
    <FormItem label="Title" {...formItemLayoutTXT}>
      {
        getFieldDecorator(k !== undefined ? `title-${k}` : 'title', { initialValue: '' })(
          <Input />,
        )
      }
    </FormItem>
  </div>
);
const my_editor = {};


const OneOrMutiComp = OneOrMuti(Comp)({ isEvent: false });

class CreateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      addType: 'one',
    };
  }

  openModal = () => {
    this.setState({
      visible: true,
    });
  }

  cancelModal = () => {
    this.setState({
      visible: false,
    });
  }

  onSubmit = async (values) => {
    const { callback } = this.props;
    this.setState({
      confirmLoading: true,
    });
    try {
      await createIssueType(values);
      message.success('创建成功');
    } catch (error) {
      message.error(`操作失败，${error.message}`);
    } finally {
      this.setState({
        confirmLoading: false,
        visible: false,
      });
      callback && callback();
    }
  }

  changeAddType = (e) => {
    this.setState({
      addType: e,
    });
  }

  render() {
    const {
      children,
      form: {
        validateFields,
      },
    } = this.props;
    const {
      visible,
      confirmLoading,
      addType,
    } = this.state;
    const onSubmit = this.onSubmit;
    const ModalOpts = {
      visible,
      confirmLoading,
      title: '创建类型',
      onOk() {
        validateFields((err, values) => {
          if (err) {
            return;
          }
          for (const key in values) {
            if (key.indexOf('keys') !== -1) {
              values[key] = undefined;
            }
          }
          let params;
          if (addType === 'one') {
            params = {
              ...values,
              addOnebyOne: 1,
            };
          } else {
            params = {
              ...values,
              addOnebyOne: 0,
              countryLang: JSON.stringify(values.countryLang),
            };
          }
          console.log('my_editor', my_editor);
          console.log('Received values of form: ', params);
          onSubmit(params);
        });
      },
      onCancel: this.cancelModal,
      width: 800,
    };
    // const formItemLayout = {
    //   labelCol: { span: 8 },
    //   wrapperCol: { span: 14 },
    // };
    return (
      <span>
        <span onClick={this.openModal}>
          {children}
        </span>
        <Modal {...ModalOpts}>
          <Form>
            <OneOrMutiComp form={this.props.form} changeAddType={this.changeAddType} />
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(CreateModal);
