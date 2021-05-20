import React from 'react';
import {
  Modal, Button, Form, message, DatePicker,
} from 'antd';

import { addToUserFollowRecommend } from '../../services/user';

const { RangePicker } = DatePicker;
class AddToFollowRecommend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  submit = async () => {
    const { auiddigest } = this.props;
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return false;
      }
      const params = {
        auiddigest,
        start_time:
          values.time && values.time.length > 0 ? values.time[0].format('YYYY-MM-DD HH:mm:ss') : '',
        end_time:
          values.time && values.time.length > 0 ? values.time[1].format('YYYY-MM-DD HH:mm:ss') : '',
      };
      const res = await addToUserFollowRecommend(params);
      if (res.status) {
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
      this.hideModal();
    });
  };

  render() {
    const { visible } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const modalProps = {
      title: '添加到关注页推荐达人列表',
      visible,
      onOk: this.submit,
      onCancel: this.hideModal,
    };
    return (
      <span>
        <Button onClick={this.showModal}>添加到关注页推荐达人</Button>
        <Modal {...modalProps}>
          <Form>
            <Form.Item>
              {getFieldDecorator('time', {
                initialValue: '',
                rules: [{ required: true, message: '必填' }],
              })(
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '过期时间']}
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(AddToFollowRecommend);
