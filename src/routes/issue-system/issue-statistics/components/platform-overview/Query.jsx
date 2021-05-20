import React, { Component } from 'react';
import {
  Form, DatePicker, Select, Button,
} from 'antd';
import moment from 'moment';

import styles from '../../../../../styles/index.css';

import {
  VIP_STATUS,
  ISSUE_SUPPORT_PRODUCT,
} from '../../../const';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class Query extends Component {
  componentDidMount() {
    this.handleSubmit();
  }

  handleSubmit = () => {
    const { form, onSearch } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        console.log(err);
        return false;
      }
      const {
        date,
        ...restValues
      } = values;
      const params = {
        ...restValues,
      };
      if (date && date.length) {
        const [startTime, endTime] = date;
        params.startTime = startTime.startOf('day').toDate();
        params.endTime = endTime.endOf('day').toDate();
      }
      console.log(params);
      onSearch && onSearch(params);
    });
  };

  handleDateChange = (values) => {
    const [startTime, endTime] = values;
    this.props.dispatch({
      type: 'issue_system__issue_statistics/setQueryDate',
      payload: {
        startTime: startTime && startTime.startOf('day').toJSON(),
        endTime: endTime && startTime.endOf('day').toJSON(),
      },
    });
  }

  countryChange = (value) => {
    const { dispatch, form: { getFieldValue } } = this.props;
    dispatch({
      type: 'issue_system__issue_statistics/getIssueTypeList',
      payload: {
        productId: getFieldValue('productId'),
        lang: getFieldValue('lang'),
        countryList: value,
      },
    });
  }

  langChange = (value) => {
    const { dispatch, form: { getFieldValue } } = this.props;
    dispatch({
      type: 'issue_system__issue_statistics/getIssueTypeList',
      payload: {
        productId: getFieldValue('productId'),
        lang: value,
        countryList: getFieldValue('countryList'),
      },
    });
  }

  productChange = (value) => {
    const { dispatch, form: { getFieldValue } } = this.props;
    dispatch({
      type: 'issue_system__issue_statistics/getIssueTypeList',
      payload: {
        productId: value,
        lang: getFieldValue('lang'),
        countryList: getFieldValue('countryList'),
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      issueType = [],
      langAndCountry = [],
      countryAndLang = [],
      loading,
    } = this.props;
    return (
      <Form layout="inline">
        <FormItem label="日期" className={styles.marginPxForItem}>
          {getFieldDecorator('date', {
            initialValue: [moment().subtract(1, 'week'), moment()],
            onChange: this.handleDateChange,
          })(<RangePicker />)}
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
              onChange={this.countryChange}
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
          {getFieldDecorator('lang')(
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              style={{ width: 150 }}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={this.langChange}
            >
              {langAndCountry.map(v => (
                <Option key={v.value} value={v.value}>
                  {`${v.label}-${v.value}`}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem label="问题类型" className={styles.marginPxForItem}>
          {getFieldDecorator('issueTypeIdList')(
            <Select
              mode="multiple"
              allowClear
              style={{ width: 200 }}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {issueType.map(v => (
                <Option key={v.id} value={v.id}>
                  {v.title}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem label="VIP状态" className={styles.marginPxForItem}>
          {getFieldDecorator('isVip')(
            <Select allowClear style={{ width: 80 }}>
              {Object.keys(VIP_STATUS).map(k => <Option key={k} value={k}>{VIP_STATUS[k]}</Option>)}
            </Select>,
          )}
        </FormItem>
        <FormItem label="产品" className={styles.marginPxForItem}>
          {getFieldDecorator('productId')(
            <Select allowClear style={{ width: 150 }} onChange={this.productChange}>
              {Object.keys(ISSUE_SUPPORT_PRODUCT).map(k => <Option key={k} value={k}>{ISSUE_SUPPORT_PRODUCT[k]}</Option>)}
            </Select>,
          )}
        </FormItem>
        <FormItem label="是否删除" className={styles.marginPxForItem}>
          {getFieldDecorator('isDelete', {
            initialValue: '',
          })(
            <Select style={{ width: 150 }}>
              <Option key="" value="">全部</Option>
              <Option key="0" value="0">正常</Option>
              <Option key="1" value="1">已删除</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem className={styles.marginPxForItem}>
          <Button loading={loading} type="primary" onClick={this.handleSubmit} >查询</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(Query);
