import React from 'react';
import {
  Modal, Form, message, Input,
} from 'antd';
import intl from 'react-intl-universal';

import { setWebUserInfo } from '../../services/user';

const FormItem = Form.Item;

class SetWebUserModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
    };
  }

  openModal = () => {
    this.setState({ visible: true });
  };

  onCancel = () => {
    this.setState({ visible: false });
  };

  handleSubmit = async (values) => {
    try {
      await this.setState({ confirmLoading: true });
      const { msg } = await setWebUserInfo(values, this.props.auid);
      message.success(msg);
    } catch (error) {
      console.log(error);
      message.error(
        `${intl.get('common.operate_fail').defaultMessage('操作失败')},${error.message}`,
      );
    } finally {
      await this.setState({ confirmLoading: false, visible: false });
    }
  };

  render() {
    const {
      children,
      form: { getFieldDecorator, validateFields },
    } = this.props;
    const { visible, confirmLoading } = this.state;
    const ModalOpts = {
      title: intl
        .get('vivaplus.user.user_detail.Reset the web user')
        .defaultMessage('设置网页上传权限'),
      visible,
      confirmLoading,
      onOk: () => {
        validateFields((err, values) => {
          if (err) {
            return;
          }
          this.handleSubmit(values);
        });
      },
      onCancel: this.onCancel,
    };
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    return (
      <span>
        <span onClick={this.openModal}>{children}</span>
        <Modal {...ModalOpts}>
          <Form>
            <FormItem
              label={intl.get('common.user_account').defaultMessage('用户名')}
              {...formItemLayout}
            >
              {getFieldDecorator('tel', {
                rules: [{ required: true }],
              })(<Input />)}
            </FormItem>
            <FormItem
              label={intl.get('common.password').defaultMessage('密码')}
              {...formItemLayout}
            >
              {getFieldDecorator('psw', {
                rules: [{ required: true }],
              })(<Input type="password" />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(SetWebUserModal);
