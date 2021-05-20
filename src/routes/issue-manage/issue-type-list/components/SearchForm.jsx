import React from 'react';
import {
  Form, Collapse, Button, Select, Col,
} from 'antd';
import intl from 'react-intl-universal';

import { FormattedMessage } from 'react-intl';
import CountrySelect from '../../../../components/select/CountrySelect';
import { parseCountryAndLang } from '../../../../utils/utils-common';

import styles from '../../../../styles/index.css';
import { IsDeleteArr } from './enum';
import CreateModal from './CreateModal';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
const Option = Select.Option;

const SearchForm = ({
  onSearch, form: { getFieldDecorator, validateFields, resetFields }, form, reFresh,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return false;
      }
      const params_ = Object.assign({}, values, parseCountryAndLang(values.country));
      console.log('Received values of form: ', params_);
      onSearch(params_);
    });
  };
  const handleReset = () => {
    resetFields();
  };
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header={<FormattedMessage id="common.search" defaultMessage="查询" />} key="1">
        <Form layout="inline" onSubmit={handleSubmit}>
          <Col>
            <CountrySelect form={form} className={styles.marginPxForItem} />
            <FormItem label="状态" className={styles.marginPxForItem}>
              {getFieldDecorator('is_delete', {
                initialValue: null,
              })(
                <Select style={{ width: 150 }}>
                  <Option value={null}>{intl.get('common.all').defaultMessage('全部')}</Option>
                  {IsDeleteArr.map(v => (
                    <Option key={v.key} value={v.key.toString()}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem className={styles.marginPxForItem}>
              <Button type="primary" htmlType="submit" icon="search">
                {intl.get('common.search').defaultMessage('查询')}
              </Button>
            </FormItem>
            <FormItem className={styles.marginPxForItem}>
              <Button onClick={handleReset}>{intl.get('common.reset').defaultMessage('重置')}</Button>
            </FormItem>
            <FormItem className={styles.marginPxForItem}>
              <CreateModal callback={reFresh}>
                <Button type="primary">{intl.get('common.create').defaultMessage('创建')}</Button>
              </CreateModal>
            </FormItem>
          </Col>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default Form.create()(SearchForm);
