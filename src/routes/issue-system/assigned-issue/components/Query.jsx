import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Collapse, Form, Select, Input, Button, DatePicker, Cascader,
} from 'antd';
import intl from 'react-intl-universal';
import _ from 'lodash';
import { withRouter } from 'dva/router';
import styles from '../../../../styles/index.css';

import TagSelect from '../../manual-issue/components/TagMultiSelect';

import {
  VIP_STATUS,
  MESSAGE_STATUS,
  ISSUE_STATUS,
  ISSUE_SUPPORT_PRODUCT,
} from '../../const';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
const Option = Select.Option;

class Query extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log(err);
        return false;
      }
      const {
        startTime,
        endTime,
        appVersion,
      } = values;
      console.log(values);
      const requresPrams = {
        ...values,
        evaluationTypeId: values.evaluationTypeId ? values.evaluationTypeId[2] : '',
        startTime: startTime ? startTime.startOf('day').toDate() : '',
        endTime: endTime ? endTime.endOf('day').toDate() : '',
        appKey: appVersion && appVersion.length ? appVersion[1] : '',
      };
      delete requresPrams.appVersion;
      const { onSearch } = this.props;
      onSearch && onSearch(requresPrams);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      users = [],
      issueTag = [],
      issueType = [],
      formFields = {},
      langAndCountry = [],
      countryAndLang = [],
      androidAppVersions = [],
      iosAppVersions = [],
      match,
    } = this.props;
    return (
      <Collapse defaultActiveKey={['1']}>
        <Panel header={<FormattedMessage id="common.search" defaultMessage="查询" />} key="1">
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <FormItem label="产品" className={styles.marginPxForItem}>
              {getFieldDecorator('productId', {
                initialValue: formFields.productId,
              })(
                <Select
                  style={{ width: 150 }}
                >
                  {Object.keys(ISSUE_SUPPORT_PRODUCT).map(k => <Option value={k} key={k}>{ISSUE_SUPPORT_PRODUCT[k]}</Option>)}
                </Select>,
              )}
            </FormItem>
            <FormItem label="工单id" className={styles.marginPxForItem}>
              {getFieldDecorator('issueId', {
                initialValue: null,
              })(<Input />)}
            </FormItem>
            <FormItem label="内容" className={styles.marginPxForItem}>
              {getFieldDecorator('content', {
                initialValue: null,
              })(<Input />)}
            </FormItem>
            <FormItem label="国家" className={styles.marginPxForItem}>
              {getFieldDecorator('countryList')(
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  style={{ minWidth: 200 }}
                  mode="multiple"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {countryAndLang.map(v => (
                    <Option key={v.value} value={v.value}>
                      {`${v.label}-${v.value}`}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="语言" className={styles.marginPxForItem}>
              {getFieldDecorator('lang', {
                initialValue: '',
              })(
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  style={{ width: 150 }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {langAndCountry.map(v => (
                    <Option key={v.value} value={v.value}>
                      {`${v.label}-${v.value}`}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="APP版本" className={styles.marginPxForItem}>
              {getFieldDecorator('appVersion', {
                initialValue: null,
              })(
                <Cascader
                  expandTrigger="hover"
                  options={[
                    {
                      value: 'Android',
                      key: 'Android',
                      children: androidAppVersions,
                    },
                    {
                      value: 'IOS',
                      key: 'IOS',
                      children: iosAppVersions,
                    },
                  ]}
                  fieldNames={{
                    label: 'value',
                    value: 'key',
                    children: 'children',
                  }}
                />,
              )}
            </FormItem>
            <FormItem label="手机系统" className={styles.marginPxForItem}>
              {getFieldDecorator('sysVer', {
                initialValue: null,
              })(<Input />)}
            </FormItem>
            <FormItem label="设备机型" className={styles.marginPxForItem}>
              {getFieldDecorator('deviceType', {
                initialValue: null,
              })(<Input />)}
            </FormItem>
            <FormItem label="问题类型" className={styles.marginPxForItem}>
              {getFieldDecorator('issueTypeId', {
                initialValue: '',
              })(
                <Select allowClear style={{ width: 200 }}>
                  {issueType.map(v => (
                    <Option key={v.id} value={v.id}>
                      {v.title}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="auid" className={styles.marginPxForItem}>
              {getFieldDecorator('auid', {
                initialValue: null,
              })(<Input />)}
            </FormItem>
            <FormItem label="设备编码" className={styles.marginPxForItem}>
              {getFieldDecorator('duiddigest', {
                initialValue: _.get(match, 'params.duiddigest'),
              })(<Input />)}
            </FormItem>
            <FormItem label="服务总结标签" className={styles.marginPxForItem}>
              {getFieldDecorator('evaluationTypeIdList', {
                initialValue: [],
              })(<TagSelect list={issueTag} />)}
            </FormItem>
            <FormItem label="工单状态" className={styles.marginPxForItem}>
              {getFieldDecorator('issueState', {
                initialValue: formFields.issueState,
              })(
                <Select disabled allowClear style={{ width: 120 }}>
                  {Object.keys(ISSUE_STATUS).map(k => <Option key={k} value={k}>{ISSUE_STATUS[k]}</Option>)}
                </Select>,
              )}
            </FormItem>
            <FormItem label="消息状态" className={styles.marginPxForItem}>
              {getFieldDecorator('isNew', {
                initialValue: '',
              })(
                <Select allowClear style={{ width: 150 }}>
                  {Object.keys(MESSAGE_STATUS).map(k => <Option key={k} value={k}>{MESSAGE_STATUS[k]}</Option>)}
                </Select>,
              )}
            </FormItem>
            <FormItem label="VIP状态" className={styles.marginPxForItem}>
              {getFieldDecorator('isVip', {
                initialValue: '',
              })(
                <Select allowClear style={{ width: 80 }}>
                  {Object.keys(VIP_STATUS).map(k => <Option key={k} value={k}>{VIP_STATUS[k]}</Option>)}
                </Select>,
              )}
            </FormItem>
            <FormItem label="工单领取人" className={styles.marginPxForItem}>
              {getFieldDecorator('operateName', {
                initialValue: formFields.operateName ? formFields.operateName : null,
              })(
                <Select
                  allowClear
                  style={{ width: 160 }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {users.map(v => (
                    <Option key={v.id} value={v.id}>{`${v.first_name || ''}${v.last_name || ''}[${v.email}]`}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="开始时间" className={styles.marginPxForItem}>
              {getFieldDecorator('startTime', {
                initialValue: null,
              })(<DatePicker />)}
            </FormItem>
            <FormItem label="结束时间" className={styles.marginPxForItem}>
              {getFieldDecorator('endTime', {
                initialValue: null,
              })(<DatePicker />)}
            </FormItem>
            <FormItem className={styles.marginPxForItem}>
              <Button type="primary" htmlType="submit" icon="search">
                {intl.get('common.search').defaultMessage('查询')}
              </Button>
            </FormItem>
            <FormItem className={styles.marginPxForItem}>
              <Button onClick={this.handleReset}>{intl.get('common.reset').defaultMessage('重置')}</Button>
            </FormItem>
          </Form>
        </Panel>
      </Collapse>
    );
  }
}

export default withRouter(Form.create()(Query));
