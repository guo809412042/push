import React from 'react';
import intl from 'react-intl-universal';
import {
  Form, Checkbox, Button, Col, Row, Input, Spin, message,
} from 'antd';
import { Hoc } from '@xy/design';

import { ExtendCom } from './UserDetailMid';

import { alterUserInfo } from '../../services/user';

const FormItem = Form.Item;
const { AreaHoc: AreaComp } = Hoc;

class ExtendInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      weiboDisabled: 'sinaAuthenticationWeb' in JSON.parse(this.props.info),
      spinning: false,
    };
  }

  changeDisabled = () => {
    this.setState(preState => ({ disabled: !preState.disabled }));
  };

  changeWeiboDisabled = (e) => {
    this.setState({ weiboDisabled: e.target.checked });
  };

  handleUserChange = async (value) => {
    try {
      this.setState({ spinning: true });
      await alterUserInfo(value);
      message.success(intl.get('common.operate_success').defaultMessage('操作成功！'));
    } catch (error) {
      console.error(error);
      message.error(intl.get('common.operate_fail').defaultMessage('操作失败！，请重试。'));
    } finally {
      this.setState({ spinning: false, disabled: true });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('Received values of form: ', values);
        return;
      }
      const Params = {};
      values.excellentCreator ? (Params.excellentCreator = '1') : '';
      values.authentication ? (Params.authentication = '1') : '';
      values.weibo
        ? (Params.sinaAuthenticationApp = `sinaweibo://userinfo?luicode=1000360&lfid=OP_2163612915&uid=${values.weibo_id}`)
        : '';
      values.weibo ? (Params.sinaAuthenticationWeb = `http://weibo.com/u/${values.weibo_id}`) : '';
      this.handleUserChange({
        extendInfo: JSON.stringify(Params),
        auiddigest: this.props.auid,
      });
    });
  };

  Info;

  render() {
    const { disabled, weiboDisabled, spinning } = this.state;
    const {
      form: { getFieldDecorator },
      info,
    } = this.props;
    let Info;
    if (info) {
      try {
        Info = JSON.parse(info);
      } catch (error) {
        Info = {};
      }
    }
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Spin spinning={spinning}>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={10}>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('authentication', {
                  valuePropName: 'checked',
                  initialValue: 'authentication' in Info,
                })(
                  <Checkbox disabled={disabled}>
                    {intl
                      .get('vivaplus.user.user_detail.Personal channel')
                      .defaultMessage('个人机构')}
                  </Checkbox>,
                )}
              </FormItem>
            </Col>
            <AreaComp>
              <Col span={6}>
                <FormItem>
                  {getFieldDecorator('excellentCreator', {
                    valuePropName: 'checked',
                    initialValue: 'excellentCreator' in Info,
                  })(<Checkbox disabled={disabled}>优秀创作者</Checkbox>)}
                </FormItem>
              </Col>
            </AreaComp>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('weibo', {
                  valuePropName: 'checked',
                  initialValue: 'sinaAuthenticationWeb' in Info,
                })(
                  <Checkbox onChange={this.changeWeiboDisabled} disabled={disabled}>
                    新浪微博
                  </Checkbox>,
                )}
              </FormItem>
            </Col>
            <AreaComp>
              {weiboDisabled ? (
                <Col span={10}>
                  <FormItem label="新浪账号" {...formItemLayout}>
                    {getFieldDecorator('weibo_id', {
                      initialValue:
                        'sinaAuthenticationWeb' in Info
                          ? Info.sinaAuthenticationApp.split('uid=')[1]
                          : '',
                      rules: [{ required: true }],
                    })(<Input disabled={disabled} />)}
                  </FormItem>
                </Col>
              ) : null}
            </AreaComp>
            <Col span={6}>
              <FormItem>
                {disabled ? (
                  <ExtendCom onClick={this.changeDisabled} />
                ) : (
                  <div>
                    <Button type="primary" htmlType="submit" size="small">
                      {intl.get('common.submit').defaultMessage('确认')}
                    </Button>
                    <Button onClick={this.changeDisabled} size="small">
                      {intl.get('common.cancel').defaultMessage('取消')}
                    </Button>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
  }
}

export default Form.create()(ExtendInfo);
