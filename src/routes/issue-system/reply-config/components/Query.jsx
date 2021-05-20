import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Collapse, Form, Button, Modal, message, Select,
} from 'antd';
import intl from 'react-intl-universal';
import styles from '../../../../styles/index.css';
import ReplyConfigForm from './ReplyConfigForm';

import {
  ISSUE_SUPPORT_PRODUCT,
} from '../../const';
import { formatHTMLToApp } from '../../../../utils/utils';

import { createIssueType } from '../../../../services/issue/issue-type';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
const Option = Select.Option;

class Query extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  handleAdd = async () => {
    const { dispatch } = this.props;
    this.replyConfigFormRef.validateFields(async (err, values) => {
      if (err) return;
      try {
        await createIssueType({
          ...values,
          langDefault: values.langDefault ? 1 : 0,
          issueReply: formatHTMLToApp(values.issueReply.toHTML()),
        });
        dispatch({
          type: 'issue_system__reply_config/listInit',
        });
        message.success('创建成功');
        this.replyConfigFormRef.resetFields();
      } catch (e) {
        message.error(e);
      }
      this.setState({
        showModal: false,
      });
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log(err);
        return false;
      }
      const { onSearch } = this.props;
      const params = {
        ...values,
        isDelete: 0,
      };
      console.log(params);
      onSearch && onSearch(params);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      titles = [], countryAndLang, langAndCountry, formFields,
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
            <FormItem label="国家" className={styles.marginPxForItem}>
              {getFieldDecorator('countryCode', {
                initialValue: '',
              })(
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  style={{ width: 150 }}
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
            <FormItem label="问题类型" className={styles.marginPxForItem}>
              {getFieldDecorator('title', {
                initialValue: '',
              })(
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  style={{ width: 150 }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    titles.map(t => <Option key={t} value={t}>
                      {t}
                    </Option>)
                  }
                </Select>,
              )}
            </FormItem>
            <FormItem className={styles.marginPxForItem}>
              <Button type="primary" htmlType="submit" icon="search">
                {intl.get('common.search').defaultMessage('查询')}
              </Button>
            </FormItem>
            <FormItem className={styles.marginPxForItem}>
              <Button onClick={this.handleReset}>{intl.get('common.reset').defaultMessage('重置')}</Button>
            </FormItem>
            <FormItem className={styles.marginPxForItem}>
              <Button onClick={() => this.setState({
                showModal: true,
              })}>创建</Button>
            </FormItem>
            <Modal
              visible={this.state.showModal}
              title="创建预设回复"
              onCancel={() => {
                this.setState({
                  showModal: false,
                })
                this.replyConfigFormRef.resetFields();
              }}
              onOk={this.handleAdd}
            >
              <ReplyConfigForm
                type="add"
                ref={(ref) => { this.replyConfigFormRef = ref; }}
                langAndCountry={langAndCountry}
                countryAndLang={countryAndLang}
              />
            </Modal>
          </Form>
        </Panel>
      </Collapse>
    );
  }
}

export default Form.create()(Query);
