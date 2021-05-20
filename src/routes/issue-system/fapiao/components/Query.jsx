import {
  Collapse, Form, Select, Button, Upload, message,
} from 'antd';
import React from 'react';
import XLSX from 'xlsx';

import exportParams from '../../../../utils/exportExecl';
import { bulkCreate } from '../../../../services/fapiao';
import { ISSUE_SUPPORT_PRODUCT, PAY_COMMODITY, typeDict } from '../../const';

const FormItem = Form.Item;
const Option = Select.Option;

class Query extends React.Component {
  state = {
    uploadProgress: 0,
  };

  handleSubmit = () => {
    const {
      form: { validateFields },
      dispatch,
    } = this.props;
    validateFields(async (err, values) => {
      if (err) {
        return false;
      }
      console.log('values: ', values);
      dispatch({
        type: 'issue_system_fapiao/search',
        payload: values,
      });
      return true;
    });
  };

  /**
   * 下载模板
   */
  downloadTemplate = () => {
    const rows = [
      [
        '产品',
        '平台',
        '支付订单号',
        '会员类型',
        '支付金额',
        '抬头类型',
        '发票抬头',
        '税号',
        '联系邮箱',
        '支付平台',
        '注册地址',
        '注册电话',
        '开户银行',
        '银行账号',
        '备注',
        '订单截图',
      ],
      [
        '必填，请填写数字',
        '必填，请填写数字',
        '必填',
        '必填',
        '必填',
        '必填，请填写数字',
        '必填',
        '必填',
        '必填',
        '',
        '',
        '',
        '',
        '',
        '',
        'ios用户需提供，右击图片，选择“在新标签页打开”，复制页面链接即可',
      ],
      [
        '2(VivaVideo)/3(slideplus)/10(tempo)/15(VivaCut)/16(甜影)',
        '1(Android)/2(iOS)',
        '',
        '小影月度会员',
        '25',
        '1(企业)/2(个人)',
        '',
        '个人类型填写“无”',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'http://img4d.xiaoying.tv/2/20200922/79F33900-8231-4D79-B747-99A9D8A31C97_1091499457075539968.jpg',
      ],
    ];
    const filename = '发票上传模板.xlsx';
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, filename);
  };

  /**
   * 上传
   */
  customUploadRequest = async ({ file }) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const dataList = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

      const reqData = [];
      for (let i = 0; i < dataList.length; i++) {
        const item = dataList[i];
        const progress = Math.floor((i / dataList.length) * 100) || 1;
        this.setState({
          uploadProgress: progress,
        });
        // 必填项判断
        if (
          !item['产品']
          || !item['平台']
          || !item['支付订单号']
          || !item['会员类型']
          || !item['支付金额']
          || !item['抬头类型']
          || !item['发票抬头']
          || !item['税号']
          || !item['联系邮箱']
        ) {
          message.info('必填项(前9项)必填');
          this.setState({
            uploadProgress: 0,
          });
          return;
        }

        reqData.push({
          productId: item['产品'] && item['产品'].trim(),
          platform: item['平台'] && item['平台'].trim(),
          orderId: item['支付订单号'] && item['支付订单号'].trim(),
          orderType: item['会员类型'] && item['会员类型'].trim(),
          amount: item['支付金额'] && item['支付金额'].trim(),
          orderChannel: item['支付平台'] && item['支付平台'].trim(),
          type: item['抬头类型'] && item['抬头类型'].trim(),
          title: item['发票抬头'] && item['发票抬头'].trim(),
          taxNumber: item['税号'] && item['税号'].trim(),
          email: item['联系邮箱'] && item['联系邮箱'].trim(),
          address: item['注册地址'] && item['注册地址'].trim(),
          telphone: item['注册电话'] && item['注册电话'].trim(),
          bankName: item['开户银行'] && item['开户银行'].trim(),
          bankNumber: item['银行账号'] && item['银行账号'].trim(),
          remark: item['备注'] && item['备注'].trim(),
          orderImg: item['订单截图'] && item['订单截图'].trim(),
        });
      }

      const { code } = await bulkCreate({ dataList: reqData });
      if (code !== 20000) {
        message.error('上传失败');
        return;
      }
      message.success('上传成功');
      this.props.dispatch({
        type: 'issue_system_fapiao/initList',
      });

      this.setState({
        uploadProgress: 0,
      });
    };
    reader.readAsArrayBuffer(file);
  };

  render() {
    const {
      form: { getFieldDecorator },
      formFields,
      dataList = [],
    } = this.props;
    const { uploadProgress } = this.state;

    // 下载表格字段
    const columns = [
      { title: '发票抬头', key: 'title' },
      { title: '抬头类型', key: 'type' },
      { title: '税号', key: 'tax_number' },
      { title: '注册地址', key: 'address' },
      { title: '注册电话', key: 'telphone' },
      { title: '开户银行', key: 'bank_name' },
      { title: '银行账号', key: 'bank_number' },
      { title: '联系邮箱', key: 'email' },
      { title: '备注', key: 'remark' },
      { title: '会员支付项', key: 'order_type' },
      { title: '会员类型', key: 'order_vip' },
      { title: '支付金额（元）', key: 'amount' },
    ];

    // 下载列表需要添加会员类型
    const downloadDataList = dataList.map(item => ({
      ...item,
      type: typeDict[item.type] || item.type,
      order_vip: PAY_COMMODITY[item.order_type] || item.order_type,
      tax_number: item.tax_number ? "\t" + item.tax_number.toString() : '',
    }));

    return (
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Form layout="inline">
            <FormItem label="产品">
              {getFieldDecorator('productId', {
                initialValue: formFields.productId,
              })(
                <Select style={{ width: 150 }}>
                  <Option key="0" value="">全部</Option>
                  {Object.keys(ISSUE_SUPPORT_PRODUCT).map(k => <Option value={k} key={k}>{ISSUE_SUPPORT_PRODUCT[k]}</Option>)}
                </Select>,
              )}
            </FormItem>
            <FormItem label="平台">
              {getFieldDecorator('platform', {
                initialValue: '',
              })(
                <Select style={{ width: 150 }}>
                  <Option key="0" value="">
                    全部
                  </Option>
                  <Option key="1" value="1">
                    Android
                  </Option>
                  <Option key="2" value="2">
                    iOS
                  </Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="状态">
              {getFieldDecorator('status', {
                initialValue: '',
              })(
                <Select style={{ width: 150 }}>
                  <Option key="0" value="">
                    全部
                  </Option>
                  <Option key="1" value="1">
                    未处理
                  </Option>
                  <Option key="2" value="2">
                    已核对
                  </Option>
                  <Option key="3" value="3">
                    已处理
                  </Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="抬头类型">
              {getFieldDecorator('type', {
                initialValue: '',
              })(
                <Select style={{ width: 150 }}>
                  <Option key="0" value="">
                    全部
                  </Option>
                  <Option key="1" value="1">
                    企业
                  </Option>
                  <Option key="2" value="2">
                    个人
                  </Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="发票抬头">
              {getFieldDecorator('title', {
                initialValue: [],
              })(<Select style={{ width: 200 }} mode="tags" />)}
            </FormItem>
            <FormItem label="订单ID">
              {getFieldDecorator('orderId', {
                initialValue: [],
              })(<Select style={{ width: 200 }} mode="tags" />)}
            </FormItem>
            <FormItem label="税号">
              {getFieldDecorator('taxNumber', {
                initialValue: [],
              })(<Select style={{ width: 200 }} mode="tags" />)}
            </FormItem>
            <FormItem label="联系邮箱">
              {getFieldDecorator('email', {
                initialValue: [],
              })(<Select style={{ width: 200 }} mode="tags" />)}
            </FormItem>
            <FormItem label="用户ID">
              {getFieldDecorator('auid', {
                initialValue: [],
              })(<Select style={{ width: 200 }} mode="tags" />)}
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.handleSubmit} icon="search">
                查询
              </Button>
            </FormItem>
            <FormItem>
              <Button
                icon="download"
                onClick={() => exportParams({
                  filename: '发票',
                  columns,
                  data: downloadDataList,
                })
                }
              >
                下载
              </Button>
            </FormItem>
            <FormItem>
              <Upload
                showUploadList={false}
                accept=".csv,.xlsx,.xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                customRequest={this.customUploadRequest}
              >
                <Button disabled={uploadProgress !== 0}>
                  上传{uploadProgress !== 0 && <span>{uploadProgress}%</span>}
                </Button>
              </Upload>
            </FormItem>
            <FormItem>
              <Button icon="download" onClick={this.downloadTemplate}>
                下载模板
              </Button>
            </FormItem>
          </Form>
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default Form.create()(Query);
