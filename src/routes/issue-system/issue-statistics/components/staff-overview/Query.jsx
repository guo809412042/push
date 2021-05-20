import React, { Component } from 'react';
import {
  Form, DatePicker, Select, Button,
} from 'antd';

import {
  VIP_STATUS,
  ISSUE_SUPPORT_PRODUCT,
} from '../../../const';

import styles from '../../../../../styles/index.css';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class Query extends Component {
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
      onSearch && onSearch(params);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      users, loading, countryAndLang,
    } = this.props;
    return (
      <Form layout="inline">
        <FormItem label="产品" className={styles.marginPxForItem}>
          {getFieldDecorator('productId')(
            <Select allowClear style={{ width: 150 }}>
              {Object.keys(ISSUE_SUPPORT_PRODUCT).map(k => <Option key={k} value={k}>{ISSUE_SUPPORT_PRODUCT[k]}</Option>)}
            </Select>,
          )}
        </FormItem>
        <FormItem label="国家" className={styles.marginPxForItem}>
          {getFieldDecorator('countryCode')(
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              style={{ minWidth: 180 }}
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
        <FormItem label="人员" className={styles.marginPxForItem}>
          {getFieldDecorator('operateNameList')(<Select
            allowClear
            style={{ minWidth: 160, maxWidth: 600 }}
            showSearch
            mode="multiple"
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {users.map(v => (
              <Option key={v.id} value={v.id}>{`${v.first_name || ''}${v.last_name || ''}[${v.email}]`}</Option>
            ))}
          </Select>)}
        </FormItem>
        <FormItem className={styles.marginPxForItem}>
          {getFieldDecorator('searchInfoType', {
            initialValue: '0',
          })(
            <Select style={{ width: 100, background: '#eee' }}>
              <Option key="0" value="0">完结日期</Option>
              <Option key="1" value="1">领取日期</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem className={styles.marginPxForItem}>
          {getFieldDecorator('date')(<RangePicker />)}
        </FormItem>
        <FormItem label="VIP状态" className={styles.marginPxForItem}>
          {getFieldDecorator('isVip')(
            <Select allowClear style={{ width: 80 }}>
              {Object.keys(VIP_STATUS).map(k => <Option key={k} value={k}>{VIP_STATUS[k]}</Option>)}
            </Select>,
          )}
        </FormItem>
        <FormItem className={styles.marginPxForItem}>
          <Button type="primary" loading={loading} onClick={this.handleSubmit}>查询</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(Query);
