import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Collapse, Form, Select, Input, Button, DatePicker,
  Cascader, Switch, message, Icon, Popconfirm, Modal,
} from 'antd';
import intl from 'react-intl-universal';
import moment from 'moment';
// import _ from 'lodash';
import { withRouter } from 'dva/router';
import styles from '../../../../styles/index.css';

import TagSelect from './TagMultiSelect';
import {
  getIssueList, getSearhList, createSearch, editSearch, deleteSearch,
} from '../../../../services/issue/issue';
import { downloadIssueList, getProductId } from '../../../../utils/utils';
import PopoverComp from '../../reply-config/components/PopoverComp';

import {
  VIP_STATUS,
  MESSAGE_STATUS,
  ISSUE_STATUS,
  ISSUE_SUPPORT_PRODUCT,
  ISSUE_STATUS_CODE,
} from '../../const';


const FormItem = Form.Item;
const Panel = Collapse.Panel;
const Option = Select.Option;

class Query extends Component {
  state = {
    downloading: false,
    visible: false,
    id: 1,
    searchName: '',
    searchList: [],
    searchValue: '',
  }

  componentDidMount() {
    this.getSearchList();
  }

  // 表单提交
  handleSubmit = (e, down = 0) => {
    e && e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        console.log(err);
        return false;
      }
      const { startTime, endTime } = values;

      const requresPrams = {
        ...values,
        startTime: startTime ? startTime.startOf('day').toDate() : '',
        endTime: endTime ? endTime.endOf('day').toDate() : '',
        // appKey: appKey && appKey.length ? appKey[1] : '',
      };

      // 下载
      if (down === 1) {
        if (!startTime || !endTime) {
          message.error('请选择开始结束，并不能大于30天');
          return;
        }
        if (endTime.diff(startTime, 'days') > 30) {
          message.error('开始结束时间不能超过30天');
          return;
        }
        this.setState({ downloading: true });
        const res = await getIssueList({
          current: 1,
          pageSize: 100000,
          ...requresPrams,
          appKey: requresPrams.appKey && requresPrams.appKey.length ? requresPrams.appKey[1] : '',
        });
        if (res.code !== 20000) {
          message.error('查询出错');
          this.setState({ downloading: false });
          return;
        }
        const issueList = res.data.list;
        const { issueType, issueTag, users } = this.props;
        await downloadIssueList(issueList, {
          ISSUE_SUPPORT_PRODUCT,
          VIP_STATUS,
          MESSAGE_STATUS,
          issueType,
          issueTag,
          users,
          ISSUE_STATUS,
        });
        this.setState({ downloading: false });
      } else {
        const { onSearch } = this.props;
        console.log(requresPrams);
        onSearch && onSearch(requresPrams);
        this.setState({ searchValue: '' });
      }
    });
  };

  // 重置
  handleReset = () => {
    this.setState({ searchValue: '' });
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'issue_system__manual_issue/saveFormFields',
      payload: {
        data: {
          productId: getProductId(),
          issueState: String(ISSUE_STATUS_CODE.PENDING_ASSIGN),
          startTime: '',
          endTime: '',
        },
      },
    });
  };

  // 获取常用搜索列表
  getSearchList = async () => {
    const { code, data } = await getSearhList({ sourceType: 0 });
    if (code !== 20000) {
      return;
    }
    this.setState({ searchList: data });
  }

  // 常用搜索框 value改变事件
  changeSearch = (value) => {
    console.log('value: ', value);
    if (!value) return;
    this.setState({ searchValue: value });
    const { dispatch } = this.props;
    const queryData = JSON.parse(value);
    const { startTime, endTime } = queryData;
    const data = {
      ...queryData,
      startTime: startTime ? moment(startTime).startOf('day').toDate() : '',
      endTime: endTime ? moment(endTime).endOf('day').toDate() : '',
    };
    this.props.form.setFieldsValue({
      ...data,
      startTime: startTime ? moment(startTime) : '',
      endTime: endTime ? moment(endTime) : '',
    });
    dispatch({
      type: 'issue_system__manual_issue/saveFormFields',
      payload: { data },
    });
    dispatch({
      type: 'issue_system__manual_issue/savePagination',
      payload: { pagination: { current: 1 } },
    });
    dispatch({ type: 'issue_system__manual_issue/listInit' });
  }

  // 创建常用搜索
  createSearch = async (value) => {
    if (!value) {
      message.error('输入不能为空!');
      return;
    }
    const queryData = this.props.form.getFieldsValue();
    // eslint-disable-next-line no-restricted-syntax
    // FIXED 解决对象中值为 undefined 时，会被过滤导致选择常用搜索时无法替换上次的内容
    for (const key in queryData) {
      if (queryData[key] === undefined) queryData[key] = '';
    }

    const { code, data } = await createSearch({
      title: value,
      content: JSON.stringify(queryData),
      sourceType: 0,
    });
    if (code !== 20000) {
      message.error('创建失败');
      return;
    }
    if (!data[1]) {
      message.info('您创建的常用搜索已存在');
      return;
    }
    message.success('创建成功');
    this.getSearchList();
  }

  // 修改标签名
  editSearch = async () => {
    const { searchName, id } = this.state;
    if (!searchName) {
      message.error('输入不能为空!');
      return;
    }
    const { code } = await editSearch({
      title: searchName,
      id,
    });
    if (code !== 20000) {
      message.error('修改失败');
      return;
    }
    message.success('修改成功');
    this.setState({ searchName: '', id: '', visible: false });
    this.getSearchList();
  }

  // 删除搜索
  deleteSearch = async (id) => {
    const { code } = await deleteSearch({ id });
    if (code === 20000) {
      message.success('删除成功');
      this.getSearchList();
    } else {
      message.error('删除失败');
    }
  }

  // 自定义方法 更新搜索的关键字
  changeSearchName = (e) => {
    this.setState({ searchName: e.target.value });
  }

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
      // match,
    } = this.props;
    const {
      searchList, visible, searchName, searchValue,
    } = this.state;
    return (
      <Collapse defaultActiveKey={['1']}>
        <Panel header={<FormattedMessage id="common.search" defaultMessage="查询" />} key="1">
          <Form layout="inline">
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
                initialValue: formFields.issueId || null,
              })(<Input />)}
            </FormItem>
            <FormItem label="内容" className={styles.marginPxForItem}>
              {getFieldDecorator('content', {
                initialValue: formFields.content || null,
              })(<Input />)}
            </FormItem>
            <FormItem label="国家" className={styles.marginPxForItem}>
              {getFieldDecorator('countryList', {
                initialValue: [],
              })(
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
                initialValue: formFields.lang || '',
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
              {getFieldDecorator('appKey', {
                initialValue: formFields.appKey || null,
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
                initialValue: formFields.sysVer || null,
              })(<Input />)}
            </FormItem>
            <FormItem label="设备机型" className={styles.marginPxForItem}>
              {getFieldDecorator('deviceType', {
                initialValue: formFields.deviceType || null,
              })(<Input />)}
            </FormItem>
            <FormItem label="问题类型" className={styles.marginPxForItem}>
              {getFieldDecorator('issueTypeId', {
                initialValue: formFields.issueTypeId && Number(formFields.issueTypeId),
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
                initialValue: formFields.auid || null,
              })(<Input />)}
            </FormItem>
            <FormItem label="设备编码" className={styles.marginPxForItem}>
              {getFieldDecorator('duiddigest', {
                initialValue: formFields.duiddigest || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="服务总结标签" className={styles.marginPxForItem}>
              {getFieldDecorator('evaluationTypeIdList', {
                initialValue: [],
              })(<TagSelect list={issueTag} />)}
            </FormItem>
            <FormItem label="剔除无效问题" className={styles.marginPxForItem}>
              {getFieldDecorator('isInvalidProblem', {
                initialValue: formFields.isInvalidProblem || false,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
            <FormItem label="工单状态" className={styles.marginPxForItem}>
              {getFieldDecorator('issueState', {
                initialValue: formFields.issueState || '',
              })(
                <Select allowClear style={{ width: 120 }}>
                  {Object.keys(ISSUE_STATUS).map(k => <Option key={k} value={k}>{ISSUE_STATUS[k]}</Option>)}
                </Select>,
              )}
            </FormItem>
            <FormItem label="消息状态" className={styles.marginPxForItem}>
              {getFieldDecorator('isNew', {
                initialValue: formFields.isNew || '',
              })(
                <Select allowClear style={{ width: 150 }}>
                  {Object.keys(MESSAGE_STATUS).map(k => <Option key={k} value={k}>{MESSAGE_STATUS[k]}</Option>)}
                </Select>,
              )}
            </FormItem>
            <FormItem label="VIP状态" className={styles.marginPxForItem}>
              {getFieldDecorator('isVip', {
                initialValue: formFields.isVip || '',
              })(
                <Select allowClear style={{ width: 80 }}>
                  {Object.keys(VIP_STATUS).map(k => <Option key={k} value={k}>{VIP_STATUS[k]}</Option>)}
                </Select>,
              )}
            </FormItem>
            <FormItem label="工单领取人" className={styles.marginPxForItem}>
              {getFieldDecorator('operateName', {
                initialValue: formFields.operateName || '',
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
            <FormItem label="手机号码" className={styles.marginPxForItem}>
              {getFieldDecorator('phone', {
                initialValue: formFields.phone || '',
              })(<Input allowClear />)}
            </FormItem>
            <FormItem label="开始时间" className={styles.marginPxForItem}>
              {getFieldDecorator('startTime', {
                initialValue: formFields.startTime ? moment(formFields.startTime) : '',
              })(<DatePicker />)}
            </FormItem>
            <FormItem label="结束时间" className={styles.marginPxForItem}>
              {getFieldDecorator('endTime', {
                initialValue: formFields.endTime ? moment(formFields.endTime) : '',
              })(<DatePicker />)}
            </FormItem>
            <FormItem label="常用搜索" className={styles.marginPxForItem}>
              <Select
                placeholder="常用搜索"
                style={{ width: 200 }}
                showSearch
                onChange={this.changeSearch}
                optionLabelProp="label"
                value={searchValue}
              >
                {searchList.map(item => (
                  <Option
                    key={item.id}
                    value={item.content}
                    label={item.title}
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    {item.title}
                    <span aria-label={item.title} onClick={e => e.stopPropagation()}>
                      <Icon
                        type="edit"
                        onClick={() => {
                          this.setState({ visible: true, id: item.id, searchName: item.title });
                        }}
                      />
                      <Popconfirm
                        title="是否确认删除?"
                        onConfirm={() => this.deleteSearch(item.id)}
                        okText="确认"
                        cancelText="取消"
                        overlayStyle={{ zIndex: 9999 }}
                      >
                        <Icon type="delete" style={{ marginLeft: 10 }} />
                      </Popconfirm>
                    </span>
                  </Option>
                ))}
              </Select>
            </FormItem>
            <FormItem className={styles.marginPxForItem}>
              <PopoverComp onChange={this.createSearch} placeholder="请输入常用搜索名">
                <Button type="primary">保存常用搜索</Button>
              </PopoverComp>
            </FormItem>
            <FormItem className={styles.marginPxForItem}>
              <Button type="primary" onClick={this.handleSubmit} icon="search">
                {intl.get('common.search').defaultMessage('查询')}
              </Button>
            </FormItem>
            <FormItem className={styles.marginPxForItem}>
              <Button onClick={this.handleReset}>{intl.get('common.reset').defaultMessage('重置')}</Button>
            </FormItem>
            <FormItem className={styles.marginPxForItem}>
              <Button
                onClick={e => this.handleSubmit(e, 1)}
                icon="download"
                loading={this.state.downloading}
              >
                下载
              </Button>
            </FormItem>
          </Form>
          <Modal
            title="修改常用搜索名"
            visible={visible}
            onOk={this.editSearch}
            onCancel={() => { this.setState({ visible: false }); }}
          >
            <Input value={searchName} onChange={this.changeSearchName} />
          </Modal>
        </Panel>
      </Collapse>
    );
  }
}

export default withRouter(Form.create()(Query));
