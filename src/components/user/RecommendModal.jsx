import React from 'react';
import {
  Modal, Form, message, Input, Select, DatePicker, InputNumber,
} from 'antd';
import intl from 'react-intl-universal';

import { recommendCreate } from '../../services/user';

const FormItem = Form.Item;
const Option = Select.Option;

class RecommendModal extends React.Component {
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
      await recommendCreate(values);
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
      tag,
      auiddigest,
    } = this.props;
    const { visible, confirmLoading } = this.state;
    const ModalOpts = {
      title: intl
        .get('vivaplus.user.user_detail.Recommend the user')
        .defaultMessage('推荐达人用户'),
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
            expire_time: values.expire_time
              ? values.expire_time
                .valueOf()
                .toString()
                .slice(0, -3)
              : undefined,
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
              label={intl.get('vivaplus.user.recommend.remark').defaultMessage('标签（运营）')}
              {...formItemLayout}
            >
              {getFieldDecorator('tag', {
                initialValue: tag,
              })(<Input />)}
            </FormItem>
            <FormItem
              label={intl.get('vivaplus.user.user_detail.description').defaultMessage('描述')}
              {...formItemLayout}
            >
              {getFieldDecorator('user_desc', {})(<Input />)}
            </FormItem>
            <FormItem label={intl.get('common.order').defaultMessage('排序')} {...formItemLayout}>
              {getFieldDecorator('order', {})(<InputNumber min={0} />)}
            </FormItem>
            <FormItem
              label={intl.get('vivaplus.user.tag_list.user_quality').defaultMessage('质量')}
              {...formItemLayout}
            >
              {getFieldDecorator('weight', {
                initialValue: '0',
              })(
                <Select>
                  <Option value="0">
                    {intl.get('vivaplus.user.recommend.weight_value_0').defaultMessage('一般')}
                  </Option>
                  <Option value="20">
                    {intl.get('vivaplus.user.recommend.weight_value_20').defaultMessage('优质')}
                  </Option>
                  <Option value="30">
                    {intl.get('vivaplus.user.recommend.weight_value_30').defaultMessage('精品')}
                  </Option>
                </Select>,
              )}
            </FormItem>
            <FormItem
              label={intl
                .get('vivaplus.user.recommend. whole group is visible or not')
                .defaultMessage('是否全局')}
              {...formItemLayout}
            >
              {getFieldDecorator('is_global', {
                initialValue: '0',
              })(
                <Select>
                  <Option value="0">{intl.get('common.no').defaultMessage('不是')}</Option>
                  <Option value="1">{intl.get('common.yes').defaultMessage('是')}</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem
              label={intl.get('vivaplus.user.recommend.expire_time').defaultMessage('过期时间')}
              {...formItemLayout}
            >
              {getFieldDecorator('expire_time')(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Select Time" />,
              )}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(RecommendModal);
