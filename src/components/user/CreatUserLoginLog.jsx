import React, { Component } from 'react';
import {
  Modal, Button, Form, Input, message,
} from 'antd';
import intl from 'react-intl-universal';
import { getUserLogin } from '../../services/quality-user';

const FormItem = Form.Item;

class CreatUserLoginLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      only_button_disabled: false,
    };
  }

  componentDidMount() {}

  handleOk = (e) => {
    e.preventDefault();
    this.setState({ only_button_disabled: true });
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const sendData = {
          ...values,
          auid: this.props.data_id,
        };
        try {
          await getUserLogin(sendData);
          message.success('成功');
          this.setState({ visible: false });
        } catch (error) {
          message.success('失败');
        }
      }
      this.setState({ only_button_disabled: false });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <div style={{ display: 'inline-block' }}>
        <Button
          onClick={() => {
            this.setState({ visible: true });
          }}
        >
          {intl.get('vivaplus.user.user_login_record').defaultMessage('获取用户登录日志')}
        </Button>
        <Modal
          title={intl.get('vivaplus.user.user_login_record').defaultMessage('获取用户登录日志')}
          visible={this.state.visible}
          onOk={() => {
            this.handleOk();
          }}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          footer={[
            <Button
              key="back"
              type="primary"
              onClick={this.handleOk}
              disabled={this.state.only_button_disabled}
            >
              {intl.get('common.tools.ok').defaultMessage('确定')}
            </Button>,
            <Button key="ok" type="ghost" onClick={this.handleCancel}>
              {intl.get('common.tools.close').defaultMessage('关闭')}
            </Button>,
          ]}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label={intl.get('vivaplus.user.EMAIL').defaultMessage('接收邮箱')}
            >
              {getFieldDecorator('receive_email', {
                initialValue: '',
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(CreatUserLoginLog);
