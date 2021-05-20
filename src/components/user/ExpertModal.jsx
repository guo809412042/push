import React from 'react';
import {
  Modal, Form, message, Input,
} from 'antd';
import cookie from 'react-cookie';
import intl from 'react-intl-universal';

import { createExpert } from '../../services/user';

const FormItem = Form.Item;

class ExpertModal extends React.Component {
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
      await createExpert(values);
      message.success(intl.get('common.operate_success').defaultMessage('操作成功'));
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
      auiddigest,
      userInfo,
      type,
    } = this.props;
    const { visible, confirmLoading } = this.state;
    const ModalOpts = {
      title:
        type === 1
          ? intl.get('vivaplus.user.expert.add_type_1').defaultMessage('加入社交红人库')
          : intl.get('vivaplus.user.expert.add_type_2').defaultMessage('加入站内达人库'),
      visible,
      confirmLoading,
      onOk: () => {
        validateFields((err, values) => {
          if (err) {
            return;
          }
          const params = {
            ...values,
            auiddigest,
            auid: userInfo.auid,
            user_create_time: userInfo.create_time,
            type,
            operator_id: cookie.load('userid'),
          };
          this.handleSubmit(params);
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
              label={intl.get('vivaplus.user.expert.auth_type').defaultMessage('分类')}
              {...formItemLayout}
            >
              {getFieldDecorator('auth_type', {
                rules: [{ required: true }],
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(ExpertModal);
