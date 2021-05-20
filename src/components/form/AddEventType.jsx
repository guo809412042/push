import React from 'react';
import {
  Form, Input, Row, Col, Select, DatePicker, Popover,
} from 'antd';
import intl from 'react-intl-universal';

import { getevent, getEventChild } from '../../services/common';

import UploadSef from '../upload/Upload';

import EventSource from './EventSource';

const FormItem = Form.Item;
const Option = Select.Option;

export default class EventType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      MAP: {
        eventMap: [],
      },
    };
  }

  componentDidMount = async () => {
    const eventMap = await getevent();
    const MAP = {
      eventMap,
    };
    this.setState({ MAP });
    if (this.props.eventtype) {
      this.handleEventStateChange(this.props.eventtype);
    }
  };

  handleEventStateChange = async (value) => {
    const data = await getEventChild({ event_no: value });
    const { form, beforeKey } = this.props;
    const obj = {};
    const objkey = beforeKey
      ? `${beforeKey}keys-${this.props.keynum}`
      : `keys-${this.props.keynum}`;
    obj[objkey] = data;
    if (data) {
      await form.setFieldsValue(obj);
    }
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
      eventcontent,
      eventtype,
      keynum,
      label,
      titlekey,
      beforeKey,
    } = this.props;
    const { MAP } = this.state;
    const formItemLayoutMin = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    getFieldDecorator(beforeKey ? `${beforeKey}keys-${keynum}` : `keys-${keynum}`, {
      initialValue: [],
    });
    const keys = getFieldValue(beforeKey ? `${beforeKey}keys-${keynum}` : `keys-${keynum}`);
    const formItems = keys.map((v) => {
      const rules = v.is_blank ? [{ required: true, message: '必填' }] : [];
      const eventSourceComp = v.event_source !== -1 ? (
        <EventSource
          key={`${v.type}-${v.key}-${keynum}`}
          countrys={this.props.countrys}
          platform={this.props.platform}
          channel={this.props.channel}
          event_source={v.event_source}
          cb={cb_data => setFieldsValue({
            [`${v.key}-${keynum}`]: cb_data,
          })
          }
        />
      ) : null;
      if (v.type === 'url') {
        return (
          <Col span={12} key={beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`}>
            <Row>
              <Col span={18}>
                <FormItem
                  label={v.value}
                  {...formItemLayoutMin}
                  key={beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`}
                >
                  {getFieldDecorator(
                    beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`,
                    {
                      rules,
                      initialValue: eventcontent
                        ? JSON.parse(eventcontent)[v.eventCode]
                        : v.defaultValue,
                    },
                  )(<Input placeholder="请以Http://开头" />)}
                </FormItem>
              </Col>
              <Col span={6}>{eventSourceComp}</Col>
            </Row>
          </Col>
        );
      }
      if (v.type === 'select') {
        return (
          <Col span={12} key={beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`}>
            <Row>
              <Col span={18}>
                <FormItem
                  label={v.value}
                  {...formItemLayoutMin}
                  key={beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`}
                >
                  {getFieldDecorator(
                    beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`,
                    {
                      rules,
                      initialValue: eventcontent
                        ? JSON.parse(eventcontent)[v.eventCode]
                        : v.defaultValue,
                    },
                  )(
                    <Select
                      showSearch
                      filterOption={(inputValue, option) => {
                        try {
                          if (option.props.children.props.content.includes(inputValue)) {
                            return true;
                          }
                        } catch (err) {
                          console.log(err);
                        }
                      }}
                    >
                      {v.option.map((v, k) => (
                        <Option key={k} value={v.key.toString()}>
                          <Popover placement="left" content={v.value}>
                            {v.value}
                          </Popover>
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>{eventSourceComp}</Col>
            </Row>
          </Col>
        );
      }
      if (v.type === 'datetime') {
        return (
          <Col span={12} key={beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`}>
            <Row>
              <Col span={18}>
                <FormItem
                  label={v.value}
                  {...formItemLayoutMin}
                  key={beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`}
                >
                  {getFieldDecorator(
                    beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`,
                    {
                      rules,
                      initialValue: eventcontent
                        ? JSON.parse(eventcontent)[v.eventCode]
                        : v.defaultValue,
                    },
                  )(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Select Time" />)}
                </FormItem>
              </Col>
              <Col span={6}>{eventSourceComp}</Col>
            </Row>
          </Col>
        );
      }
      if (v.type === 'select_mult') {
        // console.log(eventcontent?JSON.parse(eventcontent)[v.eventCode]:[])
        return (
          <Col span={12} key={beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`}>
            <Row>
              <Col span={18}>
                <FormItem
                  label={v.value}
                  {...formItemLayoutMin}
                  key={beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`}
                >
                  {getFieldDecorator(
                    beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`,
                    {
                      rules,
                      initialValue: eventcontent ? JSON.parse(eventcontent)[v.eventCode] : [],
                    },
                  )(
                    <Select multiple>
                      {v.option.map((v, k) => (
                        <Option key={k} value={v.key.toString()}>
                          <Popover placement="left" content={v.value}>
                            {v.value}
                          </Popover>
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>{eventSourceComp}</Col>
            </Row>
          </Col>
        );
      }
      if (v.type === 'file') {
        // console.log(eventcontent?JSON.parse(eventcontent)[v.eventCode]:'')
        return (
          <Col span={12} key={beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`}>
            <Row>
              <Col span={18}>
                <FormItem
                  label={v.value}
                  {...formItemLayoutMin}
                  key={beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`}
                >
                  {getFieldDecorator(
                    beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`,
                    {
                      rules,
                      initialValue: eventcontent ? JSON.parse(eventcontent)[v.eventCode] : '',
                    },
                  )(<UploadSef style={{ height: 70 }} key={v.key} />)}
                </FormItem>
              </Col>
              <Col span={6}>{eventSourceComp}</Col>
            </Row>
          </Col>
        );
      }
      return (
        <Col span={12} key={beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`}>
          <Row>
            <Col span={18}>
              <FormItem
                label={v.value}
                {...formItemLayoutMin}
                key={beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`}
              >
                {getFieldDecorator(
                  beforeKey ? `${beforeKey}${v.key}-${keynum}` : `${v.key}-${keynum}`,
                  {
                    rules,
                    initialValue: eventcontent
                      ? JSON.parse(eventcontent)[v.eventCode]
                      : v.defaultValue,
                  },
                )(<Input />)}
              </FormItem>
            </Col>
            <Col span={6}>{eventSourceComp}</Col>
          </Row>
        </Col>
      );
    });
    return (
      <Row gutter={1}>
        <Col span={12}>
          <FormItem
            label={
              label || titlekey || intl.get('tools.appscreem.event').defaultMessage('事件类型')
            }
            {...formItemLayoutMin}
          >
            {getFieldDecorator(
              beforeKey ? `${beforeKey}eventtype-${keynum}` : `eventtype-${keynum}`,
              {
                onChange: this.handleEventStateChange,
                initialValue: eventtype ? eventtype.toString() : '0',
              },
            )(
              <Select
                showSearch
                filterOption={(inputValue, option) => {
                  try {
                    if (option.props.children.props.content.includes(inputValue)) {
                      return true;
                    }
                  } catch (err) {
                    console.log(err);
                  }
                }}
                style={{ width: 140 }}
              >
                <Option value="0">{intl.get('tools.template.no_event').d('无事件')}</Option>
                {MAP.eventMap.map(v => (
                  <Option key={v.key} value={v.key.toString()}>
                    <Popover placement="left" content={v.value}>
                      {v.value}
                    </Popover>
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
        </Col>
        {formItems}
      </Row>
    );
  }
}
