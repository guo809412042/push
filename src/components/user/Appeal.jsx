import React, { Component } from 'react';
import {
  Modal, Button, Form, Input, message,
} from 'antd';
import intl from 'react-intl-universal';
import Cookie from 'js-cookie';
import request from '../../utils/request';
import { REQUEST_PATH } from '../../utils/const';

const FormItem = Form.Item;
const { TextArea } = Input;
const { VIVA_USER } = REQUEST_PATH;

class Appeal extends Component {
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
    const { data } = this.props;
    this.setState({ only_button_disabled: true });
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const sendData = {
          auid: data.auid,
          auiddigest: data.auiddigest,
          nickname: data.nickname,
          profile_image_url: data.profile_image_url,
          backgroud_img: data.backgroud_img,
          gender: data.gender,
          description: data.description,
          fans_count: data.fans_count,
          follow_count: data.follow_count,
          is_no_talk: data.is_no_talk,
          state: data.state,
          create_time: data.create_time,
          modify_time: data.modify_time,
          country_code: data.country_code,
          extend_info: data.extend_info,
          remark: values.remark,
          group_id: Number(Cookie.get('group_id')),
          product_id: Number(Cookie.get('PRODUCT_ID')),
        };
        const res = await request(`/${VIVA_USER}/inser_user_appeal`, {
          method: 'post',
          body: sendData,
        });
        if (res.status) {
          this.setState({ visible: false });
          message.success('申诉成功');
        } else {
          message.warning('申诉失败');
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
      <div style={{ display: 'inline-block', marginLeft: 8 }}>
        <Button
          onClick={() => {
            this.setState({ visible: true });
          }}
        >
          申诉
        </Button>
        <Modal
          title="申诉"
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
              确定
            </Button>,
            <Button key="ok" type="ghost" onClick={this.handleCancel}>
              {intl.get('common.tools.close').defaultMessage('关闭')}
            </Button>,
          ]}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label={intl.get('common.tools.description').defaultMessage('描述')}
            >
              {getFieldDecorator('remark', {
                initialValue: '',
              })(<TextArea />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(Appeal);
