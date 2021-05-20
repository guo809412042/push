/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import XLSX from 'xlsx';
import {
  Collapse, Form, Input, Button, Modal, message, Upload, Select,
} from 'antd';
import intl from 'react-intl-universal';
import styles from '../../../../styles/index.css';
import TagForm from './TagForm';

import { createIssueTag } from '../../../../services/issue/issue-tag';
import exportParams from '../../../../utils/exportExecl';
import { ISSUE_SUPPORT_PRODUCT } from '../../const';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
const Option = Select.Option;

class Query extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      uploadProgress: 0,
    };
  }

  handleAdd = async () => {
    const { dispatch, formFields: { productId } } = this.props;
    this.tagFormRef.validateFields(async (err, values) => {
      if (err) return;
      try {
        await createIssueTag({
          productId,
          ...values,
        });
        dispatch({
          type: 'issue_system__service_tag/listInit',
        });
        message.success('创建成功');
      } catch (e) {
        message.error(e);
      }
      this.setState({
        showModal: false,
      });
    });
  }

  customUploadRequest = async (args) => {
    const {
      file,
    } = args;
    const { dispatch, formFields: { productId } } = this.props;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const tagsArr = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      if (!tagsArr.length || tagsArr.some(v => !v['一级标签'] || !v['二级标签'] || !v['三级标签'])) {
        message.error('文件格式有误，请检查上传的文件！');
      }
      for (let i = 0; i < tagsArr.length; i++) {
        const progress = Math.floor(i / tagsArr.length * 100) || 1;
        this.setState({
          uploadProgress: progress,
        });
        const levelOne = tagsArr[i]['一级标签'];
        const levelTwo = tagsArr[i]['二级标签'];
        const levelThree = tagsArr[i]['三级标签'];
        // eslint-disable-next-line no-await-in-loop
        await createIssueTag({
          levelOne,
          levelTwo,
          levelThree,
          productId,
        });
      }
      message.success('创建完成');
      dispatch({
        type: 'issue_system__service_tag/listInit',
      });
      this.setState({
        uploadProgress: 0,
      });
    };
    reader.readAsArrayBuffer(file);
  }

  handleDownloadTemplate = () => {
    const rows = [
      ['一级标签', '二级标签', '三级标签'],
      ['标签A', '标签B', '标签C'],
    ];
    const filename = '标签上传模板.xlsx';
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, filename);
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

  productChange = (value) => {
    this.props.dispatch({
      type: 'issue_system__service_tag/changeProductId',
      payload: {
        productId: value,
      },
    });
  }

  render() {
    const { uploadProgress } = this.state;
    const { listData, formFields, form: { getFieldDecorator } } = this.props;
    const columns = [
      {
        title: 'ID',
        key: 'id',
      },
      {
        title: '一级标签',
        key: 'levelOne',
      },
      {
        title: '二级标签',
        key: 'levelTwo',
      },
      {
        title: '三级标签',
        key: 'levelThree',
      },
    ];
    return (
      <Collapse defaultActiveKey={['1']}>
        <Panel header={<FormattedMessage id="common.search" defaultMessage="查询" />} key="1">
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <FormItem label="产品" className={styles.marginPxForItem}>
              {getFieldDecorator('productId', {
                initialValue: formFields.productId,
                onChange: this.productChange,
              })(
                <Select
                  style={{ width: 150 }}
                >
                  {Object.keys(ISSUE_SUPPORT_PRODUCT).map(k => <Option value={k} key={k}>{ISSUE_SUPPORT_PRODUCT[k]}</Option>)}
                  {/* <Option key={35} value={35}>Facee</Option> */}
                  <Option key={101} value={101}>应用商城</Option>
                  {/* <Option key={35} value={35}>Facee</Option> */}
                  <Option key={42} value={42}>Mast</Option>
                  <Option key={6} value={6}>VidStatus</Option>
                  <Option key={43} value={43}>gocut</Option>
                  {/* <Option key={18} value={18}>vimix</Option> */}
                </Select>,
              )}
            </FormItem>
            <FormItem label="标签搜索" className={styles.marginPxForItem}>
              {getFieldDecorator('text', {
                initialValue: '',
              })(
                <Input />,
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
            <FormItem className={styles.marginPxForItem}>
              <Upload
                showUploadList={false}
                accept=".csv,.xlsx,.xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                customRequest={this.customUploadRequest}
              >
                <Button disabled={uploadProgress !== 0}>上传{uploadProgress !== 0 && <span>{uploadProgress}%</span>}</Button>
              </Upload>
            </FormItem>
            <FormItem className={styles.marginPxForItem}>
              <Button onClick={this.handleDownloadTemplate} >下载上传模板</Button>
            </FormItem>
            <FormItem className={styles.marginPxForItem}>
              <Button
                style={{ marginRight: 10 }}
                icon="cloud-download"
                type="primary"
                onClick={() => exportParams({
                  filename: '服务总结标签',
                  columns,
                  data: listData,
                })
                }
              >
                导出
              </Button>
            </FormItem>
            <Modal
              visible={this.state.showModal}
              title="添加标签"
              onCancel={() => this.setState({
                showModal: false,
              })}
              onOk={this.handleAdd}
            >
              <TagForm ref={(ref) => { this.tagFormRef = ref; }} />
            </Modal>
          </Form>
        </Panel>
      </Collapse>
    );
  }
}

export default Form.create()(Query);
