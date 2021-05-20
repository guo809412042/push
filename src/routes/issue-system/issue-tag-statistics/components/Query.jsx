import React, { Component } from 'react';
import {
  Form, DatePicker, Select, Button,
} from 'antd';

import styles from '../../../../styles/index.css';

import {
  VIP_STATUS,
  ISSUE_SUPPORT_PRODUCT,
  ISSUE_TAG_CHANNEL,
  IssueTagReportSourceTypeMap,
} from '../../const';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class Query extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableVipSelect: false,
      disableCountrySelect: false,
    };
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
        params.startTime = startTime.startOf('day');
        params.endTime = endTime.endOf('day');
      }
      onSearch && onSearch(params);
    });
  };

  handleSourceTypeChange = (sourceType) => {
    const { setFieldsValue } = this.props.form;
    const disableVipSelect = [
      IssueTagReportSourceTypeMap.EMAIL,
      IssueTagReportSourceTypeMap.APPSTORE,
      IssueTagReportSourceTypeMap.GP].includes(Number(sourceType));
    if (disableVipSelect) {
      setFieldsValue({
        isVip: undefined,
      });
    }
    const disableCountrySelect = [
      IssueTagReportSourceTypeMap.EMAIL,
    ].includes(Number(sourceType));

    if (disableCountrySelect) {
      setFieldsValue({
        countryList: undefined,
      });
    }

    this.setState({
      disableVipSelect,
      disableCountrySelect,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      langAndCountry = [],
      countryAndLang = [],
      formFields,
    } = this.props;
    const { disableCountrySelect, disableVipSelect } = this.state;
    return (
      <Form layout="inline">
        <FormItem label="日期" className={styles.marginPxForItem}>
          {getFieldDecorator('date', {
            initialValue: [formFields.startTime, formFields.endTime],
          })(<RangePicker />)}
        </FormItem>
        <FormItem label="国家" className={styles.marginPxForItem}>
          {getFieldDecorator('countryList')(
            <Select
              disabled={disableCountrySelect}
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
          {getFieldDecorator('lang')(
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
        <FormItem label="渠道" className={styles.marginPxForItem}>
          {getFieldDecorator('sourceType')(
            <Select onSelect={this.handleSourceTypeChange} allowClear style={{ width: 150 }}>
              {Object.keys(ISSUE_TAG_CHANNEL).map(k => <Option key={k} value={k}>{ISSUE_TAG_CHANNEL[k]}</Option>)}
            </Select>,
          )}
        </FormItem>
        <FormItem label="VIP状态" className={styles.marginPxForItem}>
          {getFieldDecorator('isVip')(
            <Select disabled={disableVipSelect} allowClear style={{ width: 80 }}>
              {Object.keys(VIP_STATUS).map(k => <Option key={k} value={k}>{VIP_STATUS[k]}</Option>)}
            </Select>,
          )}
        </FormItem>
        <FormItem label="产品" className={styles.marginPxForItem}>
          {getFieldDecorator('productId')(
            <Select allowClear style={{ width: 150 }}>
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
          <Button type="primary" onClick={this.handleSubmit} >查询</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(Query);
