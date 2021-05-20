import React from 'react';
import {
  Popconfirm, Spin, Modal, Form, Select, message, Input,
} from 'antd';
import intl from 'react-intl-universal';
import { setUserNotTalk, setUserNotTalkOff } from '../../services/user';

const FormItem = Form.Item;
const Option = Select.Option;

class UserBanPopconfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
      visible: false,
      confirmLoading: false,
    };
  }

  openModal = () => {
    this.setState({ visible: true });
  };

  cancelModal = () => {
    this.setState({ visible: false });
  };

  handleUserBan = async (values) => {
    const { auid, callback } = this.props;
    try {
      this.setState({ confirmLoading: true });
      await setUserNotTalk({ ...values, auid });
      message.success('操作成功！');
    } catch (error) {
      message.error('操作失败！');
    } finally {
      this.setState({ confirmLoading: false, visible: false });
      callback && callback();
    }
  };

  handleUserBanOff = async () => {
    const { auid, callback } = this.props;
    try {
      this.setState({ confirmLoading: true });
      await setUserNotTalkOff({ auid });
      message.success('操作成功！');
    } catch (error) {
      message.error('操作失败！');
    } finally {
      this.setState({ confirmLoading: false, visible: false });
      callback && callback();
    }
  };

  render() {
    const {
      children,
      is_not_talk,
      form: { getFieldDecorator, validateFields },
    } = this.props;
    const { spinning, visible, confirmLoading } = this.state;
    const ModalOpts = {
      title: '禁言用户',
      visible,
      confirmLoading,
      onOk: () => {
        validateFields((err, values) => {
          if (err) {
            console.log('Received values of form: ', values);
            return;
          }
          this.handleUserBan(values);
        });
      },
      onCancel: this.cancelModal,
    };
    return is_not_talk === 0 ? (
      <span>
        <span onClick={this.openModal}>{children}</span>
        <Modal {...ModalOpts}>
          <Form>
            <FormItem
              label={intl
                .get('vivaplus.user.user_detail.prohibition days')
                .defaultMessage('禁言天数')}
            >
              {getFieldDecorator('expireday', {
                initialValue: '7',
              })(
                <Select>
                  <Option value="7">7天</Option>
                  <Option value="14">14天</Option>
                  <Option value="30">30天</Option>
                  <Option value="90">90天</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem
              label={intl.get('vivaplus.user.user_detail.Cause').defaultMessage('禁言原因')}
            >
              {getFieldDecorator('reason', {
                rules: [{ required: true, message: '请输入禁言原因！', whitespace: true }],
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    ) : (
      <Spin spinning={spinning}>
        <Popconfirm title="确认取消禁言用户？" onConfirm={this.handleUserBanOff}>
          {children}
        </Popconfirm>
      </Spin>
    );
  }
}

export default Form.create()(UserBanPopconfirm);
