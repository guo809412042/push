import React from 'react';
import {
  Modal, Spin, message, Select, Form,
} from 'antd';

import { creatorHotBlacklist } from '../../services/quality-user';

const Option = Select.Option;
const FormItem = Form.Item;

class AddBlackList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
    };
  }

  onConfirm = async () => {
    const { auiddigest, callback } = this.props;
    this.setState({
      loading: true,
    });
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const send = {
          auiddigest,
          level: values.level,
        };
        try {
          const res = await creatorHotBlacklist(send);
          if (res.status) {
            message.success('操作成功');
            this.setState({ visible: false });
            callback && callback();
          } else {
            message.error(`加入热门视频黑名单失败${res.msg}`);
          }
        } catch (e) {
          message.error(`加入热门视频黑名单失败${e.message}`);
        } finally {
          this.setState({
            loading: false,
          });
        }
      }
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  render() {
    const { children } = this.props;
    const { loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <Spin spinning={loading}>
        <a onClick={this.showModal}>{children}</a>
        <Modal
          title="确认加入热门视频黑名单？"
          visible={this.state.visible}
          onOk={this.onConfirm}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem {...formItemLayout} label="级别">
              {getFieldDecorator('level', { initialValue: '1' })(
                <Select style={{ width: '140px' }}>
                  <Option value="1">不上浮</Option>
                  <Option value="2">不上热门</Option>
                  <Option value="3">不推荐</Option>
                </Select>,
              )}
            </FormItem>
          </Form>
        </Modal>
      </Spin>
    );
  }
}

export default Form.create()(AddBlackList);
